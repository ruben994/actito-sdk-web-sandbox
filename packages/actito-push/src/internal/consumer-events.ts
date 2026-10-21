import type {
  EventSubscription,
  ActitoNotification,
  ActitoNotificationAction,
} from '@actito/web-core';
import { logger } from '~/logger';
import type { ActitoNotificationDeliveryMechanism } from '~/models/actito-notification-delivery-mechanism';
import type { ActitoPushSubscription } from '~/models/actito-push-subscription';
import type { ActitoSystemNotification } from '~/models/actito-system-notification';

let subscriptionChangedCallback: OnSubscriptionChangedCallback | undefined;
let notificationSettingsChangedCallback: OnNotificationSettingsChangedCallback | undefined;
let notificationReceivedCallback: OnNotificationReceivedCallback | undefined;
let notificationOpenedCallback: OnNotificationOpenedCallback | undefined;
let notificationActionOpenedCallback: OnNotificationActionOpenedCallback | undefined;
let systemNotificationReceivedCallback: OnSystemNotificationReceivedCallback | undefined;
let unknownNotificationReceivedCallback: OnUnknownNotificationReceivedCallback | undefined;

export type OnSubscriptionChangedCallback = (
  subscription: ActitoPushSubscription | undefined,
) => void;
export type OnNotificationSettingsChangedCallback = (allowedUI: boolean) => void;
export type OnNotificationReceivedCallback = (
  notification: ActitoNotification,
  deliveryMechanism: ActitoNotificationDeliveryMechanism,
) => void;
export type OnNotificationOpenedCallback = (notification: ActitoNotification) => void;
export type OnNotificationActionOpenedCallback = (
  notification: ActitoNotification,
  action: ActitoNotificationAction,
) => void;
export type OnSystemNotificationReceivedCallback = (notification: ActitoSystemNotification) => void;
export type OnUnknownNotificationReceivedCallback = (notification: unknown) => void;

/**
 * Called when the device's push subscription changes.
 *
 * @param {OnSubscriptionChangedCallback} callback - A {@link OnSubscriptionChangedCallback} that
 * will be invoked with the result of the onSubscriptionChanged event.
 *  - The callback receives a single parameter:
 *     - `subscription`: The updated {@link ActitoPushSubscription}, or `undefined` if the
 *     subscription token is unavailable.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onSubscriptionChanged event.
 */
export function onSubscriptionChanged(callback: OnSubscriptionChangedCallback): EventSubscription {
  subscriptionChangedCallback = callback;

  return {
    remove: () => {
      subscriptionChangedCallback = undefined;
    },
  };
}

/**
 * Called when the notification settings are changed.
 *
 * @param callback A {@link OnNotificationSettingsChangedCallback} that will be invoked with the
 * result of the onNotificationSettingsChanged event.
 *  - The callback receives a single parameter:
 *     - `allowedUI`: A Boolean indicating whether the app is permitted to display notifications.
 *     `true` if notifications are allowed, `false` if they are restricted by the user.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onNotificationsSettingsChanged
 * event.
 */
export function onNotificationSettingsChanged(
  callback: OnNotificationSettingsChangedCallback,
): EventSubscription {
  notificationSettingsChangedCallback = callback;

  return {
    remove: () => {
      notificationSettingsChangedCallback = undefined;
    },
  };
}

/**
 * Called when a push notification is received.
 *
 * @param {OnNotificationReceivedCallback} callback - A {@link OnNotificationReceivedCallback} that
 * will be invoked with the result of the onNotificationReceived event.
 *  - The callback receives the following parameters:
 *     - `notification`: The received {@link ActitoNotification} object.
 *     - `deliveryMechanism`: The mechanism used to deliver the notification.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onNotificationReceived event.
 */
export function onNotificationReceived(
  callback: OnNotificationReceivedCallback,
): EventSubscription {
  notificationReceivedCallback = callback;

  return {
    remove: () => {
      notificationReceivedCallback = undefined;
    },
  };
}

/**
 * Called when a push notification is opened by the user.
 *
 * @param {OnNotificationOpenedCallback} callback - A {@link OnNotificationOpenedCallback} that will
 * be invoked with the result of the onNotificationOpened event.
 *  - The callback receives a single parameter:
 *     - `notification`: The {@link ActitoNotification} opened.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onNotificationOpened event.
 */
export function onNotificationOpened(callback: OnNotificationOpenedCallback): EventSubscription {
  notificationOpenedCallback = callback;

  return {
    remove: () => {
      notificationOpenedCallback = undefined;
    },
  };
}

/**
 * Called when a push notification action is opened by the user.
 *
 * @param {OnNotificationActionOpenedCallback} callback - A {@link OnNotificationActionOpenedCallback}
 * that will be invoked with the result of the onNotificationActionOpened event.
 *  - The callback receives the following parameters:
 *     - `notification`: The {@link ActitoNotification} opened.
 *     - `action`: The specific action opened by the user.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onNotificationActionOpened
 * event.
 */
export function onNotificationActionOpened(
  callback: OnNotificationActionOpenedCallback,
): EventSubscription {
  notificationActionOpenedCallback = callback;

  return {
    remove: () => {
      notificationActionOpenedCallback = undefined;
    },
  };
}

/**
 * Called when a custom system notification is received.
 *
 * @param {OnSystemNotificationReceivedCallback} callback - A {@link OnSystemNotificationReceivedCallback}
 * that will be invoked with the result of the onSystemNotificationReceived event.
 *  - The callback receives a single parameter:
 *     - `notification`: The {@link ActitoSystemNotification} received.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onSystemNotificationReceived
 * event.
 */
export function onSystemNotificationReceived(
  callback: OnSystemNotificationReceivedCallback,
): EventSubscription {
  systemNotificationReceivedCallback = callback;

  return {
    remove: () => {
      systemNotificationReceivedCallback = undefined;
    },
  };
}

/**
 * Called when an unknown notification is received.
 *
 * @param {OnUnknownNotificationReceivedCallback} callback - A {@link OnUnknownNotificationReceivedCallback}
 * that will be invoked with the result of the onUnknownNotificationReceived event.
 *  - The callback receives a single parameter:
 *     - `notification`: The unknown notification received.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onUnknownNotificationReceived
 * event.
 */
export function onUnknownNotificationReceived(
  callback: OnUnknownNotificationReceivedCallback,
): EventSubscription {
  unknownNotificationReceivedCallback = callback;

  return {
    remove: () => {
      unknownNotificationReceivedCallback = undefined;
    },
  };
}

export function notifySubscriptionChanged(subscription: ActitoPushSubscription | undefined) {
  const callback = subscriptionChangedCallback;
  if (!callback) {
    logger.debug("The 'subscription_changed' handler is not configured.");
    return;
  }

  callback(subscription);
}

export function notifyNotificationSettingsChanged(allowedUI: boolean) {
  const callback = notificationSettingsChangedCallback;
  if (!callback) {
    logger.debug("The 'notification_settings_changed' handler is not configured.");
    return;
  }

  callback(allowedUI);
}

export function notifyNotificationReceived(
  notification: ActitoNotification,
  deliveryMechanism: ActitoNotificationDeliveryMechanism,
) {
  const callback = notificationReceivedCallback;
  if (!callback) {
    logger.warning("The 'notification_received' handler is not configured.");
    return;
  }

  callback(notification, deliveryMechanism);
}

export function notifyNotificationOpened(notification: ActitoNotification) {
  const callback = notificationOpenedCallback;
  if (!callback) {
    logger.warning("The 'notification_opened' handler is not configured.");
    return;
  }

  callback(notification);
}

export function notifyNotificationActionOpened(
  notification: ActitoNotification,
  action: ActitoNotificationAction,
) {
  const callback = notificationActionOpenedCallback;
  if (!callback) {
    logger.warning("The 'notification_action_opened' handler is not configured.");
    return;
  }

  callback(notification, action);
}

export function notifySystemNotificationReceived(notification: ActitoSystemNotification) {
  const callback = systemNotificationReceivedCallback;
  if (!callback) {
    logger.warning("The 'system_notification_received' handler is not configured.");
    return;
  }

  callback(notification);
}

export function notifyUnknownNotificationReceived(notification: unknown) {
  const callback = unknownNotificationReceivedCallback;
  if (!callback) {
    logger.warning("The 'unknown_notification_received' handler is not configured.");
    return;
  }

  callback(notification);
}
