import type {
  CloudNotification,
  CloudNotificationAction,
  CloudNotificationAttachment,
  CloudNotificationContent,
} from '@actito/web-cloud-api';
import type {
  ActitoNotification,
  ActitoNotificationAction,
  ActitoNotificationAttachment,
  ActitoNotificationContent,
} from '@actito/web-core';

export function convertCloudNotificationToPublic(
  notification: CloudNotification,
): ActitoNotification {
  return {
    id: notification._id,
    partial: notification.partial ?? false,
    type: notification.type,
    time: notification.time,
    title: notification.title,
    subtitle: notification.subtitle,
    message: notification.message,
    content: notification.content?.map(convertNotificationContentToPublic) ?? [],
    actions: (notification.actions ?? []).reduce((acc, currentValue) => {
      const action = convertNotificationActionToPublic(currentValue);
      if (action) acc.push(action);

      return acc;
    }, [] as ActitoNotificationAction[]),
    attachments: notification.attachments?.map(convertNotificationAttachmentToPublic) ?? [],
    extra: notification.extra ?? {},
  };
}

function convertNotificationContentToPublic(
  content: CloudNotificationContent,
): ActitoNotificationContent {
  return {
    type: content.type,
    data: content.data,
  };
}

function convertNotificationActionToPublic(
  action: CloudNotificationAction,
): ActitoNotificationAction | undefined {
  if (!action.label) return undefined;

  return {
    id: action._id,
    type: action.type,
    label: action.label,
    target: action.target,
    camera: action.camera ?? false,
    keyboard: action.keyboard ?? false,
  };
}

function convertNotificationAttachmentToPublic(
  attachment: CloudNotificationAttachment,
): ActitoNotificationAttachment {
  return {
    mimeType: attachment.mimeType,
    uri: attachment.uri,
  };
}
