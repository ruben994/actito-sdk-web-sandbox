import { logger } from './logger';
import type { EventSubscription } from '~/event-subscription';
import type { ActitoApplication } from '~/models/actito-application';
import type { ActitoDevice } from '~/models/actito-device';

let onReadyCallback: OnReadyCallback | undefined;
let unlaunchedCallback: OnUnlaunchedCallback | undefined;
let deviceRegisteredCallback: OnDeviceRegisteredCallback | undefined;

export type OnReadyCallback = (application: ActitoApplication) => void;
export type OnUnlaunchedCallback = () => void;
export type OnDeviceRegisteredCallback = (device: ActitoDevice) => void;

/**
 * Called when the Actito SDK is fully ready and the application metadata is available.
 *
 * This method is invoked after the SDK has been successfully launched and is available for use.
 *
 * @param {OnReadyCallback} callback - A {@link OnReadyCallback} that will be invoked with the result
 * of the onReady event.
 * - The callback receives a single parameter:
 *     - `application`: The {@link ActitoApplication} instance containing the application
 *     metadata.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onReady event.
 */
export function onReady(callback: OnReadyCallback): EventSubscription {
  onReadyCallback = callback;

  return {
    remove: () => {
      onReadyCallback = undefined;
    },
  };
}

/**
 * Called when the Actito SDK has been unlaunched.
 *
 * This method is invoked after the SDK has been shut down (unlaunched) and is no longer in use.
 *
 * @param {OnUnlaunchedCallback} callback - A {@link OnUnlaunchedCallback} that will be invoked with
 * the result of the onUnlaunched event.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onUnlaunched event.
 * */
export function onUnlaunched(callback: OnUnlaunchedCallback): EventSubscription {
  unlaunchedCallback = callback;

  return {
    remove: () => {
      unlaunchedCallback = undefined;
    },
  };
}

/**
 * Called when the device has been successfully registered with the Actito platform.
 *
 * This method is triggered after the device is initially created, which happens the first time
 * `launch()` is called.
 * Once created, the method will not trigger again unless the device is deleted by calling
 * `unlaunch()` and created again on a new `launch()`.
 *
 * @param {OnDeviceRegisteredCallback} callback - A {@link OnDeviceRegisteredCallback} that will be
 * invoked with the result of the onDeviceRegistered event.
 * - The callback receives a single parameter:
 *     - `device`: The {@link ActitoDevice} instance containing the device's registration
 *     details.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onDeviceRegistered event.
 */
export function onDeviceRegistered(callback: OnDeviceRegisteredCallback): EventSubscription {
  deviceRegisteredCallback = callback;

  return {
    remove: () => {
      deviceRegisteredCallback = undefined;
    },
  };
}

export function notifyOnReady(application: ActitoApplication) {
  const callback = onReadyCallback;
  if (!callback) {
    logger.debug("The 'on_ready' handler is not configured.");
    return;
  }

  callback(application);
}

export function notifyUnlaunched() {
  const callback = unlaunchedCallback;
  if (!callback) {
    logger.debug("The 'on_unlaunched' handler is not configured.");
    return;
  }

  callback();
}

export function notifyDeviceRegistered(device: ActitoDevice) {
  const callback = deviceRegisteredCallback;
  if (!callback) {
    logger.debug("The 'device_registered' handler is not configured.");
    return;
  }

  callback(device);
}
