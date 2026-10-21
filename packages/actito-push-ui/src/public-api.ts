import type { ActitoNotification, ActitoNotificationAction } from '@actito/web-core';
import { presentAction as presentActionInternal } from './internal/ui/action-presenter';
import { notificationPresenter } from './internal/ui/notification-presenter';

export {
  onNotificationWillPresent,
  onNotificationPresented,
  onNotificationFinishedPresenting,
  onNotificationFailedToPresent,
  onActionWillExecute,
  onActionExecuted,
  onActionFailedToExecute,
  onCustomActionReceived,
  type OnNotificationWillPresentCallback,
  type OnNotificationPresentedCallback,
  type OnNotificationFinishedPresentingCallback,
  type OnNotificationFailedToPresentCallback,
  type OnActionWillExecuteCallback,
  type OnActionExecutedCallback,
  type OnActionFailedToExecuteCallback,
  type OnCustomActionReceivedCallback,
} from './internal/consumer-events';

/**
 * Presents a notification to the user.
 *
 * This method launches the UI for displaying the provided {@link ActitoNotification}.
 *
 * @param {ActitoNotification} notification - The {@link ActitoNotification} to present.
 */
export function presentNotification(notification: ActitoNotification) {
  notificationPresenter.present(notification);
}

/**
 * Presents an action associated with a notification.
 *
 * This method presents the UI for executing a specific {@link ActitoNotificationAction}
 * associated with the provided {@link ActitoNotification}.
 *
 * @param {ActitoNotification} notification - The {@link ActitoNotification} to present.
 * @param {ActitoNotificationAction} action  - The {@link ActitoNotificationAction} to
 * execute.
 */
export function presentAction(notification: ActitoNotification, action: ActitoNotificationAction) {
  presentActionInternal(notification, action);
}
