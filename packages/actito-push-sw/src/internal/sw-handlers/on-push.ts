import { fetchCloudNotification } from '@actito/web-cloud-api';
import type { ActitoNotification } from '@actito/web-core';
import { convertCloudNotificationToPublic } from '~/internal/cloud-api/converters/notification-converter';
import { getCloudApiEnvironment } from '~/internal/cloud-api/environment';
import { logNotificationReceived } from '~/internal/cloud-api/requests/events';
import { parseWorkerConfiguration } from '~/internal/configuration/parser';
import { createPartialNotification } from '~/internal/create-partial-notification';
import type { ActitoWorkerNotification, WorkerNotification } from '~/internal/internal-types';
import { logger } from '~/logger';

// Let TS know this is scoped to a service worker.
declare const self: ServiceWorkerGlobalScope;

export async function onPush(event: PushEvent) {
  logger.debug('Received a remote notification.');

  if (!event.data) {
    logger.warning('The push event contained no data. Skipping...');
    return;
  }

  let workerNotification: WorkerNotification;

  try {
    workerNotification = event.data.json();
  } catch {
    logger.error('Unable to parse the push event data.');
    return;
  }

  if (workerNotification['x-sender'] !== 'notificare') {
    await handleUnknownNotification(workerNotification);
    return;
  }

  const workerConfiguration = parseWorkerConfiguration();
  if (
    workerConfiguration &&
    workerConfiguration.applicationId &&
    workerConfiguration.applicationId !== workerNotification['x-application']
  ) {
    logger.warning('Incoming notification originated from another application.');
    logger.debug(workerConfiguration);
    logger.debug(workerNotification);
    return;
  }

  const notification: ActitoWorkerNotification = workerNotification;

  if (notification.system) {
    await handleSystemNotification(notification);
    return;
  }

  await handleNotification(notification);
}

async function handleUnknownNotification(workerNotification: WorkerNotification) {
  logger.debug('Processing an unknown notification.');

  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      cmd: 're.notifica.push.sw.unknown_notification_received',
      message: workerNotification,
    });
  });
}

async function handleSystemNotification(workerNotification: ActitoWorkerNotification) {
  logger.debug('Processing a system notification.', workerNotification);

  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      cmd: 're.notifica.push.sw.system_notification_received',
      message: workerNotification,
    });
  });
}

async function handleNotification(workerNotification: ActitoWorkerNotification) {
  const workerConfiguration = parseWorkerConfiguration();

  if (!workerConfiguration) {
    logger.debug('Service worker has no configuration. Falling back to legacy behaviour.');
    await updateApplicationBadge(workerNotification);
    await showNotificationPreview(workerNotification);

    const clients = await self.clients.matchAll();
    clients.forEach((client) => {
      client.postMessage({
        cmd: 're.notifica.push.sw.notification_received',
        message: workerNotification,
      });
    });

    return;
  }

  await logNotificationReceived(workerNotification.notificationId);
  await updateApplicationBadge(workerNotification);
  await showNotificationPreview(workerNotification);

  const clients = await self.clients.matchAll();
  if (!clients.length) return;

  let notification: ActitoNotification;

  try {
    const response = await fetchCloudNotification({
      environment: await getCloudApiEnvironment(),
      id: workerNotification.id,
    });

    notification = convertCloudNotificationToPublic(response.notification);
  } catch (e) {
    logger.error('Failed to fetch notification.', e);
    notification = createPartialNotification(workerNotification);
  }

  clients.forEach((client) => {
    client.postMessage({
      cmd: 're.notifica.push.sw.notification_received',
      content: {
        message: workerNotification,
        notification,
      },
    });
  });
}

async function updateApplicationBadge(notification: ActitoWorkerNotification) {
  try {
    const { badge } = notification;
    if (!badge) return;

    if (navigator.setAppBadge) await navigator.setAppBadge(badge);
    if (navigator.setClientBadge) navigator.setClientBadge(badge);
  } catch (e) {
    logger.warning('Unable to update the application badge.', e);
  }
}

async function showNotificationPreview(notification: ActitoWorkerNotification) {
  if (!notification.push || !notification.alert) {
    // Silent notification.
    return;
  }

  const title = notification.alertTitle ?? notification.application ?? '';
  const icon = 'image' in Notification.prototype ? notification.icon : notification.attachment?.uri;

  const options: NotificationOptions = {
    tag: notification.id,
    body: notification.alert,
    icon,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    image: notification.attachment?.uri,
    requireInteraction: notification.requireInteraction,
    renotify: notification.renotify,
    actions: notification.actions?.map((action) => ({
      action: action._id,
      title: action.label,
      icon: action.icon,
    })),
    data: notification,
  };

  await self.registration.showNotification(title, options);
}
