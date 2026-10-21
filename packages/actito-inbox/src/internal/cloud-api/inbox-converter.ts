import type { CloudDeviceInboxItem, CloudDeviceInboxItemAttachment } from '@actito/web-cloud-api';
import type { ActitoNotificationAttachment } from '@actito/web-core';
import type { ActitoInboxItem } from '~/models/actito-inbox-item';

export function convertCloudInboxItemToPublic(inboxItem: CloudDeviceInboxItem): ActitoInboxItem {
  return {
    id: inboxItem._id,
    time: inboxItem.time,
    opened: inboxItem.opened ?? false,
    expires: inboxItem.expires,
    notification: {
      id: inboxItem.notification,
      partial: true,
      type: inboxItem.type,
      time: inboxItem.time,
      title: inboxItem.title,
      subtitle: inboxItem.subtitle,
      message: inboxItem.message,
      content: [],
      actions: [],
      attachments: inboxItem.attachment
        ? [convertNetworkInboxItemAttachmentToPublic(inboxItem.attachment)]
        : [],
      extra: inboxItem.extra ?? {},
    },
  };
}

function convertNetworkInboxItemAttachmentToPublic(
  attachment: CloudDeviceInboxItemAttachment,
): ActitoNotificationAttachment {
  return {
    mimeType: attachment.mimeType,
    uri: attachment.uri,
  };
}
