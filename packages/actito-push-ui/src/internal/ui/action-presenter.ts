import {
  callNotificationWebhook,
  createNotificationReply,
  type ActitoNotification,
  type ActitoNotificationAction,
  type NotificationReplyData,
} from '@actito/web-core';
import { createCameraCallbackModal } from './actions/callback-camera';
import { createKeyboardCallbackModal } from './actions/callback-keyboard';
import { ensureCleanState } from './root';
import {
  notifyActionExecuted,
  notifyActionFailedToExecute,
  notifyActionWillExecute,
  notifyCustomActionReceived,
} from '~/internal/consumer-events';
import { getEmailUrl, getSmsUrl, getTelephoneUrl } from '~/internal/utils';
import { logger } from '~/logger';

export function presentAction(notification: ActitoNotification, action: ActitoNotificationAction) {
  ensureCleanState();

  presentActionAsync(notification, action).catch((e) =>
    logger.error('Failed to present action.', e),
  );
}

async function presentActionAsync(
  notification: ActitoNotification,
  action: ActitoNotificationAction,
) {
  logger.debug(`Presenting action '${action.type}' for notification '${notification.id}'.`);
  notifyActionWillExecute(notification, action);

  if (shouldTrackReplyBeforePresenting(action)) {
    await createNotificationReply(notification, action);
  }

  try {
    switch (action.type) {
      case 're.notifica.action.App':
        await presentApp(action);
        break;
      case 're.notifica.action.Browser':
        await presentBrowser(action);
        break;
      case 're.notifica.action.Callback':
        await presentCallback(notification, action);
        break;
      case 're.notifica.action.Custom':
        await presentCustom(notification, action);
        break;
      case 're.notifica.action.InAppBrowser':
        await presentInAppBrowser(action);
        break;
      case 're.notifica.action.Mail':
        await presentMail(action);
        break;
      case 're.notifica.action.SMS':
        await presentSms(action);
        break;
      case 're.notifica.action.Telephone':
        await presentTelephone(action);
        break;
      default:
        // noinspection ExceptionCaughtLocallyJS
        throw new Error(`Unsupported action type '${action.type}'.`);
    }

    if (requiresUserInteraction(action)) return;

    if (!shouldTrackReplyBeforePresenting(action)) {
      await createNotificationReply(notification, action);
    }

    notifyActionExecuted(notification, action);
  } catch (e) {
    logger.error('Failed to present action.', e);
    notifyActionFailedToExecute(notification, action);
  }
}

function shouldTrackReplyBeforePresenting(action: ActitoNotificationAction): boolean {
  switch (action.type) {
    case 're.notifica.action.App':
    case 're.notifica.action.Browser':
    case 're.notifica.action.InAppBrowser':
      return true;
    default:
      return false;
  }
}

function requiresUserInteraction(action: ActitoNotificationAction): boolean {
  return action.type === 're.notifica.action.Callback' && (action.camera || action.keyboard);
}

async function presentApp(action: ActitoNotificationAction): Promise<void> {
  window.location.href = action.target?.trim() ? action.target.trim() : '/';
}

async function presentBrowser(action: ActitoNotificationAction): Promise<void> {
  window.location.href = action.target?.trim() ? action.target.trim() : '/';
}

async function presentCallback(
  notification: ActitoNotification,
  action: ActitoNotificationAction,
): Promise<void> {
  if (action.camera && action.keyboard) {
    // Show the camera UI.
    document.body.appendChild(
      createCameraCallbackModal({
        hasMoreSteps: true,
        onMediaCaptured: (media, mimeType) => {
          ensureCleanState();

          // Show the keyboard UI.
          document.body.appendChild(
            createKeyboardCallbackModal({
              dismiss: () => ensureCleanState(),
              onTextCaptured: (text) => {
                processCallbackResult(notification, action, {
                  message: text,
                  media,
                  mimeType,
                }).catch((e) => logger.error('Failed to process the notification reply.', e));
              },
            }),
          );
        },
        dismiss: () => ensureCleanState(),
      }),
    );
  } else if (action.camera) {
    // Show the camera UI.
    document.body.appendChild(
      createCameraCallbackModal({
        hasMoreSteps: false,
        onMediaCaptured: (media, mimeType) => {
          processCallbackResult(notification, action, {
            media,
            mimeType,
          }).catch((e) => logger.error('Failed to process the notification reply.', e));
        },
        dismiss: () => ensureCleanState(),
      }),
    );
  } else if (action.keyboard) {
    // Show the keyboard UI.
    document.body.appendChild(
      createKeyboardCallbackModal({
        dismiss: () => ensureCleanState(),
        onTextCaptured: (text) => {
          processCallbackResult(notification, action, {
            message: text,
          }).catch((e) => logger.error('Failed to process the notification reply.', e));
        },
      }),
    );
  } else {
    processCallbackResult(notification, action).catch((e) =>
      logger.error('Failed to process the notification reply.', e),
    );
  }
}

async function processCallbackResult(
  notification: ActitoNotification,
  action: ActitoNotificationAction,
  data?: NotificationReplyData,
): Promise<void> {
  try {
    if (action.target) {
      await callNotificationWebhook(notification, action);
    }

    if (requiresUserInteraction(action)) {
      await createNotificationReply(notification, action, data);
    }

    notifyActionExecuted(notification, action);
  } catch {
    notifyActionFailedToExecute(notification, action);
  }

  ensureCleanState();
}

async function presentCustom(
  notification: ActitoNotification,
  action: ActitoNotificationAction,
): Promise<void> {
  if (!action.target) throw new Error('Invalid action target.');

  notifyCustomActionReceived(notification, action, action.target);
}

async function presentInAppBrowser(action: ActitoNotificationAction): Promise<void> {
  window.location.href = action.target?.trim() ? action.target.trim() : '/';
}

async function presentMail(action: ActitoNotificationAction): Promise<void> {
  if (!action.target) throw new Error('Invalid action target.');

  window.location.href = getEmailUrl(action.target);
}

async function presentSms(action: ActitoNotificationAction): Promise<void> {
  if (!action.target) throw new Error('Invalid action target.');

  window.location.href = getSmsUrl(action.target);
}

async function presentTelephone(action: ActitoNotificationAction): Promise<void> {
  if (!action.target) throw new Error('Invalid action target.');

  window.location.href = getTelephoneUrl(action.target);
}
