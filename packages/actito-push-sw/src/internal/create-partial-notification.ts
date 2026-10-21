import type { ActitoNotification } from '@actito/web-core';
import type { ActitoWorkerNotification } from './internal-types';

export function createPartialNotification(message: ActitoWorkerNotification): ActitoNotification {
  const ignoreKeys: (keyof ActitoWorkerNotification)[] = [
    'system',
    'push',
    'requireInteraction',
    'renotify',
    'urlFormatString',
    'badge',
    'id',
    'inboxItemId',
    'inboxItemVisible',
    'inboxItemExpires',
    'notificationId',
    'notificationType',
    'application',
    'alertTitle',
    'alertSubtitle',
    'alert',
    'icon',
    'sound',
    'attachment',
    'actions',
  ];

  const extras = Object.keys(message)
    .filter((key) => !ignoreKeys.includes(key) && !key.startsWith('x-'))
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = message[key];
      return acc;
    }, {});

  return {
    id: message.notificationId,
    partial: true,
    type: message.notificationType,
    time: new Date().toUTCString(),
    title: message.alertTitle,
    subtitle: message.alertSubtitle,
    message: message.alert ?? '',
    content: [],
    actions: [],
    attachments: message.attachment ? [message.attachment] : [],
    extra: extras,
  };
}
