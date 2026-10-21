import {
  getApplication,
  isReady,
  ActitoApplicationUnavailableError,
  ActitoNotReadyError,
  ActitoServiceUnavailableError,
} from '@actito/web-core';
import {
  disableRemoteNotifications as disableRemoteNotificationsInternal,
  enableRemoteNotifications as enableRemoteNotificationsInternal,
} from './internal/internal-api';
import {
  getRemoteNotificationsEnabled,
  retrieveAllowedUI,
  retrieveSubscription,
  retrieveTransport,
} from './internal/storage/local-storage';
import { logger } from './logger';
import type { ActitoPushSubscription } from './models/actito-push-subscription';
import type { ActitoTransport } from './models/actito-transport';

export {
  onNotificationSettingsChanged,
  onNotificationReceived,
  onNotificationOpened,
  onNotificationActionOpened,
  onSubscriptionChanged,
  onSystemNotificationReceived,
  onUnknownNotificationReceived,
  type OnNotificationSettingsChangedCallback,
  type OnNotificationReceivedCallback,
  type OnSubscriptionChangedCallback,
  type OnSystemNotificationReceivedCallback,
  type OnNotificationActionOpenedCallback,
  type OnNotificationOpenedCallback,
  type OnUnknownNotificationReceivedCallback,
} from './internal/consumer-events';

export { hasWebPushCapabilities } from './internal/internal-api';

/**
 * Indicates whether remote notifications are enabled.
 *
 * @returns {boolean} - `true` if remote notifications are enabled for the application, and `false`
 * otherwise.
 */
export function hasRemoteNotificationsEnabled(): boolean {
  return getRemoteNotificationsEnabled() ?? false;
}

/**
 * Indicates whether the device is capable of receiving remote notifications.
 *
 * This property returns `true` if the user has granted permission to receive push notifications and
 * the device has successfully obtained a push token from the notification service. It reflects
 * whether the app can present notifications as allowed by the system and user settings.
 *
 * @returns {boolean} - `true` if the device can receive remote notifications, `false` otherwise.
 */
export function getAllowedUI(): boolean {
  return retrieveAllowedUI() ?? false;
}

/**
 * Provides the current push transport information.
 *
 * @returns {ActitoTransport | undefined} - The {@link ActitoTransport} assigned to the
 * device,  or `undefined` if no transport
 * has been set.
 */
export function getTransport(): ActitoTransport | undefined {
  return retrieveTransport();
}

/**
 * Provides the current push subscription token.
 *
 * @returns {ActitoPushSubscription | undefined} - The device's current
 * {@link ActitoPushSubscription}, or `undefined` if no {@link ActitoPushSubscription}
 * is available.
 */
export function getSubscription(): ActitoPushSubscription | undefined {
  return retrieveSubscription();
}

/**
 * Enables remote notifications.
 *
 * This function enables remote notifications for the application, allowing push notifications to be
 * received.
 *
 * @returns {Promise<void>} - A promise that resolves when remote notifications
 * have been successfully enabled.
 */
export async function enableRemoteNotifications(): Promise<void> {
  checkPrerequisites();

  const application = getApplication();
  if (!application) throw new ActitoApplicationUnavailableError();

  if (application.websitePushConfig?.launchConfig) {
    logger.warning(
      'Managed push onboarding is enabled for this application. Remote notifications are managed automatically; manual configuration may cause conflicts.',
    );
  }

  await enableRemoteNotificationsInternal();
}

/**
 * Disables remote notifications.
 *
 * This function disables remote notifications for the application, preventing push notifications
 * from being received.
 *
 * @returns {Promise<void>} - A promise that resolves when remote notifications
 * have been successfully disabled.
 */
export async function disableRemoteNotifications(): Promise<void> {
  checkPrerequisites();
  await disableRemoteNotificationsInternal();
}

function checkPrerequisites() {
  if (!isReady()) {
    logger.warning('Actito is not ready yet.');
    throw new ActitoNotReadyError();
  }

  const application = getApplication();
  if (!application) {
    logger.warning('Actito application is not yet available.');
    throw new ActitoApplicationUnavailableError();
  }

  if (!application.services.websitePush) {
    logger.warning('Actito website push functionality is not enabled.');
    throw new ActitoServiceUnavailableError('websitePush');
  }
}
