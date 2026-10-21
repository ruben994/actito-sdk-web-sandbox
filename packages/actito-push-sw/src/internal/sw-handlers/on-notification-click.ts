import {
  fetchCloudApplication,
  fetchCloudDeviceInbox,
  fetchCloudNotification,
} from '@actito/web-cloud-api';
import { convertCloudNotificationToPublic } from '~/internal/cloud-api/converters/notification-converter';
import { getCloudApiEnvironment } from '~/internal/cloud-api/environment';
import {
  logNotificationInfluenced,
  logNotificationOpen,
} from '~/internal/cloud-api/requests/events';
import { getCurrentDeviceId, parseWorkerConfiguration } from '~/internal/configuration/parser';
import {
  createNotificationReply,
  presentNotificationAction,
} from '~/internal/ui/notification-actions';
import { presentNotification } from '~/internal/ui/notifications';
import { ensureOpenWindowClient } from '~/internal/ui/window-client';
import { logger } from '~/logger';

// Let TS know this is scoped to a service worker.
declare const self: ServiceWorkerGlobalScope;

export async function onNotificationClick(event: NotificationEvent) {
  event.notification.close();

  const workerConfiguration = parseWorkerConfiguration();

  if (workerConfiguration) {
    await handleStandardClick(event);
  } else {
    await handleLegacyClick(event);
  }
}

async function handleLegacyClick(event: NotificationEvent) {
  const client = await ensureOpenWindowClient();

  client.postMessage({
    cmd: event.action
      ? 're.notifica.push.sw.notification_reply'
      : 're.notifica.push.sw.notification_clicked',
    notification: event.notification.data,
    action: event.action,
  });

  try {
    await client.focus();
  } catch (e) {
    logger.error('Failed to focus client: ', client, e);
  }
}

async function handleStandardClick(event: NotificationEvent) {
  await logNotificationOpen(event.notification.data.notificationId);
  await logNotificationInfluenced(event.notification.data.notificationId);
  await broadcastInboxUpdate();

  const response = await fetchCloudNotification({
    environment: await getCloudApiEnvironment(),
    id: event.notification.data.id,
  });

  const notification = convertCloudNotificationToPublic(response.notification);

  if (!event.action) {
    await presentNotification(notification);
    await refreshApplicationBadge();
    return;
  }

  const action = notification.actions.find((element) => element.id === event.action);
  if (!action) throw new Error('Cannot find the action clicked to process the event.');

  const isQuickResponse =
    action.type === 're.notifica.action.Callback' && !action.camera && !action.keyboard;

  if (isQuickResponse) {
    await createNotificationReply(notification, action);
    await refreshApplicationBadge();
    return;
  }

  await presentNotificationAction(notification, action);
  await refreshApplicationBadge();
}

async function refreshApplicationBadge() {
  logger.debug('Updating application badge.');

  if (!navigator.setAppBadge && !navigator.setClientBadge) {
    logger.debug('There is no badge support. Skipping badge update.');
    return;
  }

  try {
    const { application } = await fetchCloudApplication({
      environment: await getCloudApiEnvironment(),
    });

    if (!application.inboxConfig?.autoBadge) {
      logger.debug('Auto badge functionality disabled. Skipping badge update.');
      return;
    }

    const { unread } = await fetchCloudDeviceInbox({
      environment: await getCloudApiEnvironment(),
      deviceId: getCurrentDeviceId(),
      skip: 0,
      limit: 0,
    });

    if (navigator.setAppBadge) await navigator.setAppBadge(unread);
    if (navigator.setClientBadge) navigator.setClientBadge(unread);
  } catch (e) {
    logger.warning('Failed to update the application badge.', e);
  }
}

async function broadcastInboxUpdate() {
  const clients = await self.clients.matchAll();
  clients.forEach((client) => {
    client.postMessage({
      cmd: 're.notifica.push.sw.update_inbox',
    });
  });
}
