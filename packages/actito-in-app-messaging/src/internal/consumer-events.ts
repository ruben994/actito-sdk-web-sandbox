import type { EventSubscription } from '@actito/web-core';
import { logger } from '~/logger';
import type { ActitoInAppMessage, ActitoInAppMessageAction } from '~/models/actito-in-app-message';

let messagePresentedCallback: OnMessagePresentedCallback | undefined;
let messageFinishedPresentingCallback: OnMessageFinishedPresentingCallback | undefined;
let messageFailedToPresentCallback: OnMessageFailedToPresentCallback | undefined;
let actionExecutedCallback: OnActionExecutedCallback | undefined;
let actionFailedToExecuteCallback: OnActionFailedToExecuteCallback | undefined;

export type OnMessagePresentedCallback = (message: ActitoInAppMessage) => void;
export type OnMessageFinishedPresentingCallback = (message: ActitoInAppMessage) => void;
export type OnMessageFailedToPresentCallback = (message: ActitoInAppMessage) => void;
export type OnActionExecutedCallback = (
  message: ActitoInAppMessage,
  action: ActitoInAppMessageAction,
) => void;
export type OnActionFailedToExecuteCallback = (
  message: ActitoInAppMessage,
  action: ActitoInAppMessageAction,
) => void;

/**
 * Called when an in-app message is successfully presented to the user.
 *
 * @param {OnMessagePresentedCallback} callback - A {@link OnMessagePresentedCallback} that will be
 * invoked with the result of the onMessagePresented event.
 *  - The callback receives a single parameter:
 *     - `message`: The {@link ActitoInAppMessage} that was presented.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onMessagePresented event.
 */
export function onMessagePresented(callback: OnMessagePresentedCallback): EventSubscription {
  messagePresentedCallback = callback;

  return {
    remove: () => {
      messagePresentedCallback = undefined;
    },
  };
}

/**
 * Called when the presentation of an in-app message has finished.
 *
 * @param {OnMessageFinishedPresentingCallback} callback - A {@link OnMessageFinishedPresentingCallback}
 * that will be invoked with the result of the onMessageFinishedPresenting event.
 *  - The callback receives a single parameter:
 *     - `message`: The {@link ActitoInAppMessage} that finished presenting.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onMessageFinishedPresenting
 * event.
 */
export function onMessageFinishedPresenting(
  callback: OnMessageFinishedPresentingCallback,
): EventSubscription {
  messageFinishedPresentingCallback = callback;

  return {
    remove: () => {
      messageFinishedPresentingCallback = undefined;
    },
  };
}

/**
 * Called when an in-app message failed to present.
 *
 * @param {OnMessageFailedToPresentCallback} callback - A {@link OnMessageFailedToPresentCallback}
 * that will be invoked with the result of the onMessageFailedToPresent event.
 *  - The callback receives a single parameter:
 *     - `message`: The {@link ActitoInAppMessage} that failed to present.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onMessageFailedToPresent
 * event.
 */
export function onMessageFailedToPresent(
  callback: OnMessageFailedToPresentCallback,
): EventSubscription {
  messageFailedToPresentCallback = callback;

  return {
    remove: () => {
      messageFailedToPresentCallback = undefined;
    },
  };
}

/**
 * Called when an action is successfully executed for an in-app message.
 *
 * @param {OnActionExecutedCallback} callback - A {@link OnActionExecutedCallback} that will be
 * invoked with the result of the onActionExecuted event.
 * - The callback receives the following parameters:
 *     - `message`: The {@link ActitoInAppMessage} for which the action was executed.
 *     - `action`: The {@link ActitoInAppMessageAction} that was executed.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onActionExecuted event.
 */
export function onActionExecuted(callback: OnActionExecutedCallback): EventSubscription {
  actionExecutedCallback = callback;

  return {
    remove: () => {
      actionExecutedCallback = undefined;
    },
  };
}

/**
 * Called when an action execution failed for an in-app message.
 *
 * @param {OnActionFailedToExecuteCallback} callback - A {@link OnActionFailedToExecuteCallback}
 * that will be invoked with the result of the onActionFailedToExecute event.
 * - The callback receives the following parameters:
 *     - `message`: The {@link ActitoInAppMessage} for which the action was attempted.
 *     - `action`: The {@link ActitoInAppMessageAction} that failed to execute.
 * @returns {EventSubscription} - The {@link EventSubscription} for the onActionFailedToExecute
 * event.
 */
export function onActionFailedToExecute(
  callback: OnActionFailedToExecuteCallback,
): EventSubscription {
  actionFailedToExecuteCallback = callback;

  return {
    remove: () => {
      actionFailedToExecuteCallback = undefined;
    },
  };
}

export function notifyMessagePresented(message: ActitoInAppMessage) {
  const callback = messagePresentedCallback;
  if (!callback) {
    logger.debug("The 'message_presented' handler is not configured.");
    return;
  }

  callback(message);
}

export function notifyMessageFinishedPresenting(message: ActitoInAppMessage) {
  const callback = messageFinishedPresentingCallback;
  if (!callback) {
    logger.debug("The 'message_finished_presenting' handler is not configured.");
    return;
  }

  callback(message);
}

export function notifyMessageFailedToPresent(message: ActitoInAppMessage) {
  const callback = messageFailedToPresentCallback;
  if (!callback) {
    logger.debug("The 'message_failed_to_present' handler is not configured.");
    return;
  }

  callback(message);
}

export function notifyActionExecuted(
  message: ActitoInAppMessage,
  action: ActitoInAppMessageAction,
) {
  const callback = actionExecutedCallback;
  if (!callback) {
    logger.debug("The 'action_executed' handler is not configured.");
    return;
  }

  callback(message, action);
}

export function notifyActionFailedToExecute(
  message: ActitoInAppMessage,
  action: ActitoInAppMessageAction,
) {
  const callback = actionFailedToExecuteCallback;
  if (!callback) {
    logger.debug("The 'action_failed_to_execute' handler is not configured.");
    return;
  }

  callback(message, action);
}
