import {
  callCloudNotificationWebhook,
  type CloudNotificationWebhookPayload,
  createCloudNotificationReply,
  fetchCloudApplication,
  fetchCloudDynamicLink,
  fetchCloudNotification,
  ActitoNetworkRequestError,
  request,
  uploadCloudNotificationReplyMedia,
} from '@actito/web-cloud-api';
import {
  LogLevel,
  type LogLevelString,
  setLogLevel as setLogLevelInternal,
} from '@actito/web-logger';
import { ActitoDeviceUnavailableError } from './errors/actito-device-unavailable-error';
import { ActitoNotConfiguredError } from './errors/actito-not-configured-error';
import { ActitoNotReadyError } from './errors/actito-not-ready-error';
import { convertCloudApplicationToPublic } from './internal/cloud-api/converters/application-converter';
import { convertCloudDynamicLinkToPublic } from './internal/cloud-api/converters/dynamic-link-converter';
import { convertCloudNotificationToPublic } from './internal/cloud-api/converters/notification-converter';
import { getCloudApiEnvironment } from './internal/cloud-api/environment';
import { components } from './internal/component-cache';
import { notifyOnReady, notifyUnlaunched } from './internal/consumer-events';
import { deleteDevice } from './internal/internal-api-device';
import {
  getLaunchState,
  isConfigured as isConfiguredInternal,
  isReady as isReadyInternal,
  LaunchState,
  setLaunchState,
} from './internal/launch-state';
import { logger } from './internal/logger';
import { isLatestStorageStructure, migrate } from './internal/migration-flow';
import {
  DEFAULT_CLOUD_API_HOST,
  DEFAULT_REST_API_HOST,
  getOptions,
  isDefaultHosts,
  type ActitoInternalOptionsHosts,
  setOptions,
  validate,
} from './internal/options';
import {
  clearStorage,
  getStoredApplication,
  getStoredDevice,
  setStoredApplication,
} from './internal/storage/local-storage';
import { ensureHostHttpPrefix, hasWebPushSupport } from './internal/utils';
import { SDK_VERSION as SDK_VERSION_INTERNAL } from './internal/version';
import type { ActitoApplication } from './models/actito-application';
import type { ActitoDynamicLink } from './models/actito-dynamic-link';
import type { ActitoNotification, ActitoNotificationAction } from './models/actito-notification';
import type { ActitoOptions } from './options';

export const SDK_VERSION: string = SDK_VERSION_INTERNAL;

export {
  onReady,
  onUnlaunched,
  onDeviceRegistered,
  type OnDeviceRegisteredCallback,
  type OnReadyCallback,
  type OnUnlaunchedCallback,
} from './internal/consumer-events';

/**
 * Sets the logging level for the SDK.
 *
 * @param {LogLevel | LogLevelString} logLevel - The desired logging level, which can be specified
 * as either:
 *  - A {@link LogLevel} enum value.
 *  - A {@link LogLevelString} string representation of the log level.
 */
export function setLogLevel(logLevel: LogLevel | LogLevelString) {
  setLogLevelInternal(logLevel);
}

/**
 * Indicates whether Actito has been configured.
 *
 * @returns {boolean} - `true` if Actito is successfully configured, and `false` otherwise.
 */
export function isConfigured(): boolean {
  return isConfiguredInternal();
}

/**
 * Indicates whether Actito is ready.
 *
 * @returns {boolean} - `true` once the SDK has completed the initialization process and is ready
 * for use.
 */
export function isReady(): boolean {
  return isReadyInternal();
}

/**
 * Configures Actito using the services info in a provided {@link ActitoOptions} object.
 *
 * This method configures the SDK using the {@link ActitoOptions} object, preparing it for use.
 *
 * @param {ActitoOptions} options - The {@link ActitoOptions} object to use for configuration.
 */
export function configure(options: ActitoOptions) {
  const state = getLaunchState();

  if (state > LaunchState.CONFIGURED) {
    logger.warning('Unable to reconfigure Actito once launched.');
    return;
  }

  if (state === LaunchState.CONFIGURED) {
    logger.info('Reconfiguring Actito with another set of application keys.');
  }

  logger.debug('Configuring Actito.');

  if (!options?.applicationKey || !options?.applicationSecret) {
    throw new Error('Unable to configure Actito without a valid set of application keys.');
  }

  if (!isLatestStorageStructure()) {
    migrate();
  }

  const { cloudApi, restApi } = options.hosts || {};

  const hosts: ActitoInternalOptionsHosts = {
    cloudApi: cloudApi ? ensureHostHttpPrefix(cloudApi) : DEFAULT_CLOUD_API_HOST,
    restApi: restApi ? ensureHostHttpPrefix(restApi) : DEFAULT_REST_API_HOST,
  };

  const internalOptions = {
    hosts,
    applicationKey: options.applicationKey,
    applicationSecret: options.applicationSecret,
    applicationVersion: options.applicationVersion ?? '1.0.0',
    applicationHost: `${window.location.protocol}//${window.location.host}`,
    language: options.language,
    serviceWorker: options.serviceWorker,
    serviceWorkerScope: options.serviceWorkerScope,
    geolocation: options.geolocation,
  };

  validate(internalOptions);

  setOptions(internalOptions);

  for (const component of components.values()) {
    logger.debug(`Configuring '${component.name}' component.`);
    component.configure();
  }

  setLaunchState(LaunchState.CONFIGURED);

  if (!isDefaultHosts(hosts)) {
    logger.info('Actito configured with customized hosts.');
    logger.debug(`Cloud API host: ${hosts.cloudApi}`);
    logger.debug(`REST API host: ${hosts.restApi}`);
  }
}

/**
 * Launches the Actito SDK, and all the additional available modules, preparing them for use.
 *
 * @returns {Promise<void>} - A promise that resolves when the Actito SDK
 * and its modules have been successfully launched and are ready for use.
 */
export async function launch(): Promise<void> {
  if (getLaunchState() === LaunchState.LAUNCHING) {
    logger.warning('Cannot launch again while Actito is launching.');
    throw new Error('Cannot launch again while Actito is launching.');
  }

  if (getLaunchState() === LaunchState.LAUNCHED) {
    logger.warning('Actito has already launched. Skipping...');
    return;
  }

  if (getLaunchState() < LaunchState.CONFIGURED) {
    logger.debug('Fetching remote configuration.');

    const response = await request({ url: '/actito-services.json' });
    const options = await response.json();
    configure(options);

    logger.info('Successfully configured Actito with actito-services.json.');
  }

  const options = getOptions();
  if (options == null) throw new Error('Unable to load options from /actito-services.json.');

  try {
    setLaunchState(LaunchState.LAUNCHING);

    const application = await fetchApplicationInternal({ saveToLocalStorage: false });
    const storedApplication = getStoredApplication();

    if (storedApplication && storedApplication.id !== application.id) {
      logger.warning('Incorrect application keys detected. Resetting Actito to a clean state.');

      for (const component of components.values()) {
        logger.debug(`Resetting '${component.name}' component.`);
        await component.clearStorage();
      }

      clearStorage();
    }

    setStoredApplication(application);

    if (application.websitePushConfig?.ignoreUnsupportedWebPushDevices) {
      await ensureWebPushSupport();
    }

    for (const component of components.values()) {
      logger.debug(`Launching '${component.name}' component.`);
      await component.launch();
    }

    setLaunchState(LaunchState.LAUNCHED);
    printLaunchSummary(application);

    notifyOnReady(application);
  } catch (e) {
    logger.error('Failed to launch Actito.', e);

    if (e instanceof ActitoNetworkRequestError && e.response.status === 403) {
      logger.error(
        `The origin ${window.location.origin} is not configured. See https://docs.notifica.re/guides/v3/settings/services/website-push/#allowed-domains for more information.`,
      );
    }

    setLaunchState(LaunchState.CONFIGURED);
    throw e;
  }

  // We don't want the launch() promise to be held for the postLaunch().
  postLaunch().catch((e) => logger.error('Failed to execute the post-launch step.', e));
}

/**
 * Unlaunches the Actito SDK.
 *
 * This method shuts down the SDK, removing all data, both locally and remotely in
 * the servers. It destroys all the device's data permanently.
 *
 * @returns {Promise<void>} - A promise that resolves when the SDK has been
 * successfully unlaunched and all data has been removed.
 */
export async function unlaunch(): Promise<void> {
  if (!isReady()) {
    logger.warning('Cannot un-launch Actito before it has been launched.');
    throw new ActitoNotReadyError();
  }

  logger.info('Un-launching Actito.');

  try {
    for (const component of Array.from(components.values()).reverse()) {
      logger.debug(`Un-launching the '${component.name}' component.`);

      try {
        await component.unlaunch();
      } catch (e) {
        logger.debug(`Failed to un-launch the '${component.name}' component.`, e);

        // noinspection ExceptionCaughtLocallyJS
        throw e;
      }
    }

    if (getStoredDevice()) {
      logger.debug('Removing device.');
      await deleteDevice();
    }

    setStoredApplication(undefined);
    localStorage.removeItem('re.notifica.migrated');

    logger.info('Un-launched Actito.');
    setLaunchState(LaunchState.CONFIGURED);

    notifyUnlaunched();
  } catch (e) {
    logger.error('Failed to un-launch Actito.', e);
    throw e;
  }
}

/**
 * Provides the current application metadata, if available.
 *
 * @returns {ActitoApplication | undefined} - The {@link ActitoApplication} object
 * representing the configured application, or `undefined` if the application is not yet available.
 *
 * @see {@link ActitoApplication}
 */
export function getApplication(): ActitoApplication | undefined {
  return getStoredApplication();
}

/**
 * Fetches the application metadata.
 *
 * @returns {Promise<ActitoApplication>} - A promise that resolves to a
 * {@link ActitoApplication} object containing the application metadata.
 */
export async function fetchApplication(): Promise<ActitoApplication> {
  return fetchApplicationInternal({ saveToLocalStorage: true });
}

/**
 * Fetches a {@link ActitoNotification} by its ID.
 *
 * @param {string} id - The ID of the notification to fetch.
 * @returns {Promise<ActitoNotification>} - A promise that resolves to a
 * {@link ActitoNotification} object associated with the provided ID.
 */
export async function fetchNotification(id: string): Promise<ActitoNotification> {
  if (!isConfigured()) throw new ActitoNotConfiguredError();

  const { notification } = await fetchCloudNotification({
    environment: getCloudApiEnvironment(),
    id,
  });

  return convertCloudNotificationToPublic(notification);
}

/**
 * Fetches a {@link ActitoDynamicLink} from an url.
 *
 * @param {string} url - The url to fetch the dynamic link from.
 * @returns {Promise<ActitoDynamicLink>} - A promise that resolves to a
 * {@link ActitoDynamicLink} object.
 */
export async function fetchDynamicLink(url: string): Promise<ActitoDynamicLink> {
  if (!isConfigured()) throw new ActitoNotConfiguredError();

  const device = getStoredDevice();

  const { link } = await fetchCloudDynamicLink({
    environment: getCloudApiEnvironment(),
    deviceId: device?.id,
    url,
  });

  return convertCloudDynamicLinkToPublic(link);
}

/**
 * Sends a reply to a notification action.
 *
 * This method sends a reply to the specified {@link ActitoNotification} and
 * {@link ActitoNotificationAction}, optionally including a message and media.
 *
 * @param {ActitoNotification} notification - The notification to reply to.
 * @param {ActitoNotificationAction} action - The action associated with the reply.
 * @param {NotificationReplyData} data - An {@link NotificationReplyData} object containing the reply.
 * @returns {Promise<void>} - A promise that resolves once the reply has been sent.
 */
export async function createNotificationReply(
  notification: ActitoNotification,
  action: ActitoNotificationAction,
  data?: NotificationReplyData,
): Promise<void> {
  if (!isConfigured()) throw new ActitoNotConfiguredError();

  const options = getOptions();
  if (!options) throw new ActitoNotConfiguredError();

  const device = getStoredDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  let mediaUrl: string | undefined;

  if (data?.media && data?.mimeType) {
    const { filename } = await uploadCloudNotificationReplyMedia({
      environment: getCloudApiEnvironment(),
      media: data.media,
    });

    mediaUrl = `${options.hosts.restApi}/upload${filename}`;
  }

  await createCloudNotificationReply({
    environment: getCloudApiEnvironment(),
    payload: {
      notification: notification.id,
      label: action.label,
      deviceID: device.id,
      userID: device.userId,
      data: {
        target: action.target,
        message: data?.message,
        media: mediaUrl,
        mimeType: data?.mimeType,
      },
    },
  });
}

export interface NotificationReplyData {
  message?: string;
  media?: Blob;
  mimeType?: string;
}

/**
 * Calls a webhook associated with a notification action.
 *
 * This method sends a payload to the specified webhook target URL defined in the notification action.
 *
 * @param {ActitoNotification} notification - The {@link ActitoNotification} containing
 * details about the notification.
 * @param {ActitoNotificationAction} action - The {@link ActitoNotificationAction} that
 * triggers the webhook.
 * @returns {Promise<void>} - A promise that resolves when the webhook has been successfully called.
 */
export async function callNotificationWebhook(
  notification: ActitoNotification,
  action: ActitoNotificationAction,
): Promise<void> {
  if (!action.target) throw new Error('Unable to execute webhook without a target for the action.');

  const url = new URL(action.target);
  const device = getStoredDevice();

  const data: CloudNotificationWebhookPayload = {
    target: url.origin,
    label: action.label,
    notificationID: notification.id,
    deviceID: device?.id,
    userID: device?.userId,
  };

  // Populate the data with the target's query parameters.
  url.searchParams.forEach((key) => {
    const value = url.searchParams.get(key);
    if (value !== null) data[key] = value;
  });

  await callCloudNotificationWebhook({
    environment: getCloudApiEnvironment(),
    payload: data,
  });
}

function printLaunchSummary(application: ActitoApplication) {
  if (logger.getLogLevel() >= LogLevel.INFO) {
    logger.info('Actito is ready.');
    return;
  }

  const enabledServices = Object.entries(application.services)
    .filter(([, enabled]) => enabled)
    .map(([service]) => service);

  const enabledComponents = [...components.keys()].sort();

  logger.debug('/==============================================================================/');
  logger.debug('Actito SDK is ready to use for application');
  logger.debug(`App name: ${application.name}`);
  logger.debug(`App ID: ${application.id}`);
  logger.debug(`App services: ${enabledServices.join(', ')}`);
  logger.debug('/==============================================================================/');
  logger.debug(`SDK version: ${SDK_VERSION}`);
  logger.debug(`SDK modules: ${enabledComponents.join(', ')}`);
  logger.debug('/==============================================================================/');
}

async function postLaunch() {
  for (const component of components.values()) {
    try {
      logger.debug(`Post-launch '${component.name}' component.`);

      await component.postLaunch();
    } catch (e) {
      logger.error(`Failed to post-launch the '${component.name}' component.`, e);
    }
  }
}

async function fetchApplicationInternal({
  saveToLocalStorage,
}: {
  saveToLocalStorage: boolean;
}): Promise<ActitoApplication> {
  if (!isConfigured()) throw new ActitoNotConfiguredError();

  const options = getOptions();
  if (!options) throw new ActitoNotConfiguredError();

  const { application: cloudApplication } = await fetchCloudApplication({
    environment: getCloudApiEnvironment(),
    language: options.language,
  });

  const application = convertCloudApplicationToPublic(cloudApplication);

  if (saveToLocalStorage) {
    setStoredApplication(application);
  }

  return application;
}

async function ensureWebPushSupport() {
  let isWebPushCapable = false;

  try {
    logger.debug('Checking for web push support.');
    isWebPushCapable = await hasWebPushSupport();
  } catch (e) {
    logger.warning('Failed to check for web push support.', e);
  }

  if (!isWebPushCapable)
    throw new Error('Unable to launch Actito when the device is not capable of Web Push.');
}
