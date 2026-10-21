import { createCloudEvent } from '@actito/web-cloud-api';
import { getCloudApiEnvironment } from './cloud-api/environment';
import { getSession } from './internal-api-session-shared';
import { isConfigured } from './launch-state';
import { logger } from './logger';
import { getStoredDevice } from './storage/local-storage';
import { ActitoContentTooLargeError } from '~/errors/actito-content-too-large-error';
import { ActitoInvalidArgumentError } from '~/errors/actito-invalid-argument-error';
import { ActitoNotReadyError } from '~/errors/actito-not-ready-error';
import { getApplication, isReady } from '~/public-api';

const MAX_DATA_SIZE_BYTES = 2 * 1024;
const MIN_EVENT_NAME_SIZE_CHAR = 3;
const MAX_EVENT_NAME_SIZE_CHAR = 64;
const EVENT_NAME_REGEX = /^[a-zA-Z0-9]([a-zA-Z0-9_-]+[a-zA-Z0-9])?$/;

export async function logApplicationInstall() {
  await logInternal({ type: 're.notifica.event.application.Install' });
}

export async function logApplicationRegistration() {
  await logInternal({ type: 're.notifica.event.application.Registration' });
}

export async function logApplicationUpgrade() {
  await logInternal({ type: 're.notifica.event.application.Upgrade' });
}

export async function logApplicationOpen(sessionId: string) {
  await logInternal({
    type: 're.notifica.event.application.Open',
    sessionId,
  });
}

export async function logApplicationClose(
  sessionId: string,
  sessionLength: number,
  sessionCloseTimestamp: number,
) {
  await logInternal({
    type: 're.notifica.event.application.Close',
    timestamp: sessionCloseTimestamp,
    sessionId,
    data: {
      length: sessionLength.toString(),
    },
  });
}

export async function logNotificationOpen(notificationId: string) {
  await logInternal({
    type: 're.notifica.event.notification.Open',
    notificationId,
  });
}

/**
 * Logs a custom event.
 *
 * This function allows logging, in Actito, of custom events, optionally associating structured
 * data for more detailed event tracking and analysis.
 *
 * @param {string} event - The name of the custom event to log.
 * @param {Record<string, unknown>} data - Optional Record object containing event data for further
 * details.
 */
export async function logCustom(event: string, data?: Record<string, unknown>) {
  if (!isReady()) {
    logger.warning('Actito is not ready yet.');
    throw new ActitoNotReadyError();
  }

  const application = getApplication();

  if (application?.enforceEventNameRestrictions) {
    if (
      event.length < MIN_EVENT_NAME_SIZE_CHAR ||
      event.length > MAX_EVENT_NAME_SIZE_CHAR ||
      !EVENT_NAME_REGEX.test(event)
    ) {
      throw new ActitoInvalidArgumentError(
        `Invalid event name '${event}'. Event name must have between ${MIN_EVENT_NAME_SIZE_CHAR}-${MAX_EVENT_NAME_SIZE_CHAR} characters and match this pattern: ${EVENT_NAME_REGEX.source}`,
      );
    }
  }

  if (application?.enforceSizeLimit && data) {
    const textEncoder = new TextEncoder();
    const serializedData = JSON.stringify(data);
    const size = textEncoder.encode(serializedData).byteLength;

    if (size > MAX_DATA_SIZE_BYTES) {
      throw new ActitoContentTooLargeError(
        `Data for event '${event}' of size ${size}B exceeds max size of ${MAX_DATA_SIZE_BYTES}B`,
      );
    }
  }

  await logInternal({
    type: `re.notifica.event.custom.${event}`,
    data,
  });
}

export async function logInternal(options: InternalLogEventOptions) {
  if (!isConfigured()) {
    logger.debug('Actito is not configured. Skipping event log...');
    return;
  }

  const currentDevice = getStoredDevice();

  await createCloudEvent({
    environment: getCloudApiEnvironment(),
    payload: {
      type: options.type,
      timestamp: options.timestamp ?? Date.now(),
      deviceID: currentDevice?.id,
      userID: currentDevice?.userId,
      sessionID: options.sessionId ?? getSession()?.id,
      notification: options.notificationId,
      data: options.data,
    },
  });
}

interface InternalLogEventOptions {
  readonly type: string;
  readonly timestamp?: number;
  readonly data?: Record<string, unknown>;
  readonly sessionId?: string;
  readonly notificationId?: string;
}
