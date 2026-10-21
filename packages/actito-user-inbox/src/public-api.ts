import { fetchCloudUserInboxNotification, removeCloudUserInboxItem } from '@actito/web-cloud-api';
import {
  getApplication,
  getCloudApiEnvironment,
  getCurrentDevice,
  isConfigured,
  isReady,
  logNotificationOpen,
  ActitoApplicationUnavailableError,
  ActitoDeviceUnavailableError,
  ActitoNotConfiguredError,
  type ActitoNotification,
  ActitoNotReadyError,
  ActitoServiceUnavailableError,
  convertCloudNotificationToPublic,
} from '@actito/web-core';
import {
  convertNetworkUserInboxItemToPublic,
  type NetworkUserInboxResponse,
} from './internal/network/responses/user-inbox-response';
import { logger } from './logger';
import type { ActitoUserInboxItem } from './models/actito-user-inbox-item';
import type { ActitoUserInboxResponse } from './models/actito-user-inbox-response';

/**
 * Parses a {@link NetworkUserInboxResponse} object to produce a {@link ActitoUserInboxItem}.
 *
 * This method takes a {@link NetworkUserInboxResponse} and converts it into a structured
 * {@link ActitoUserInboxItem}.
 *
 * @param {ActitoUserInboxResponse} response - The {@link NetworkUserInboxResponse} representing
 * the user inbox response.
 * @return {Promise<ActitoUserInboxResponse>} - A promise that resolves to a
 * {@link ActitoUserInboxItem} object parsed from the provided {@link NetworkUserInboxResponse}.
 */
export async function parseInboxResponse(
  response: NetworkUserInboxResponse,
): Promise<ActitoUserInboxResponse> {
  checkPrerequisites();

  if (response.count == null) {
    throw new Error("Missing 'count' parameter.");
  }
  if (response.unread == null) {
    throw new Error("Missing 'unread' parameter.");
  }
  if (response.inboxItems == null) {
    throw new Error("Missing 'inboxItems' parameter.");
  }
  if (!Array.isArray(response.inboxItems)) {
    throw new Error("Invalid 'inboxItems' parameter: expected an array.");
  }

  return {
    items: response.inboxItems.map(convertNetworkUserInboxItemToPublic),
    count: response.count,
    unread: response.unread,
  };
}

/**
 * Opens an inbox item and retrieves its associated notification.
 *
 * This function opens the provided {@link ActitoUserInboxItem} and returns the associated
 * {@link ActitoNotification}. This operation marks the item as read.
 *
 * @param {ActitoUserInboxItem} item - The {@link ActitoUserInboxItem} to be opened.
 * @return {Promise<ActitoNotification>} - A promise that resolves to a
 * {@link ActitoNotification} associated with the opened inbox item.
 */
export async function openInboxItem(item: ActitoUserInboxItem): Promise<ActitoNotification> {
  checkPrerequisites();

  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  // User inbox items are always partial.
  const notification = await fetchUserInboxNotification(item);

  await markInboxItemAsRead(item);

  return notification;
}

/**
 * Marks an inbox item as read.
 *
 * This function updates the status of the provided {@link ActitoUserInboxItem} to read.
 *
 * @param {ActitoUserInboxItem} item - The {@link ActitoUserInboxItem} to mark as read.
 * @returns {Promise<void>} - A promise that resolves when the inbox item has
 * been successfully marked as read.
 */
export async function markInboxItemAsRead(item: ActitoUserInboxItem): Promise<void> {
  checkPrerequisites();

  await logNotificationOpen(item.notification.id);
}

/**
 * Removes an inbox item from the user's inbox.
 *
 * This function deletes the provided {@link ActitoUserInboxItem} from the user's inbox.
 *
 * @param {ActitoUserInboxItem} item - The {@link ActitoUserInboxItem} to be removed.
 * @returns {Promise<void>} - A promise that resolves when the inbox item has
 * been successfully removed.
 */
export async function removeInboxItem(item: ActitoUserInboxItem): Promise<void> {
  checkPrerequisites();

  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  await removeCloudUserInboxItem({
    environment: getCloudApiEnvironment(),
    deviceId: device.id,
    id: item.id,
  });
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

  if (!application.services.inbox) {
    logger.warning('Actito inbox functionality is not enabled.');
    throw new ActitoServiceUnavailableError('inbox');
  }

  if (!application.inboxConfig?.useInbox) {
    logger.warning('Actito inbox functionality is not enabled.');
    throw new ActitoServiceUnavailableError('inbox');
  }

  if (!application.inboxConfig?.useUserInbox) {
    logger.warning('Actito user inbox functionality is not enabled.');
    throw new ActitoServiceUnavailableError('inbox');
  }
}

async function fetchUserInboxNotification(item: ActitoUserInboxItem): Promise<ActitoNotification> {
  if (!isConfigured()) throw new ActitoNotConfiguredError();

  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  const { notification } = await fetchCloudUserInboxNotification({
    environment: getCloudApiEnvironment(),
    deviceId: device.id,
    id: item.id,
  });

  return convertCloudNotificationToPublic(notification);
}
