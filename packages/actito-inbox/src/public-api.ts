import {
  clearCloudDeviceInbox,
  fetchCloudDeviceInbox,
  markCloudDeviceInboxAsRead,
  removeCloudDeviceInboxItem,
} from '@actito/web-cloud-api';
import {
  fetchNotification,
  getApplication,
  getCloudApiEnvironment,
  getCurrentDevice,
  isReady,
  logNotificationOpen,
  ActitoApplicationUnavailableError,
  ActitoDeviceUnavailableError,
  type ActitoNotification,
  ActitoNotReadyError,
  ActitoServiceUnavailableError,
} from '@actito/web-core';
import { convertCloudInboxItemToPublic } from './internal/cloud-api/inbox-converter';
import { notifyInboxUpdated } from './internal/consumer-events';
import { refreshBadgeInternal } from './internal/internal-api';
import { logger } from './logger';
import type { ActitoInboxItem } from './models/actito-inbox-item';
import type { ActitoInboxResponse } from './models/actito-inbox-response';

export {
  onInboxUpdated,
  onBadgeUpdated,
  type OnInboxUpdatedCallback,
  type OnBadgeUpdatedCallback,
} from './internal/consumer-events';

/**
 * @returns {number} - The current badge count, representing the number of unread inbox items.
 */
export function getBadge(): number {
  const application = getApplication();
  if (!application) {
    logger.warning('Actito application is not yet available.');
    return 0;
  }

  if (!application.inboxConfig?.useInbox) {
    logger.warning('Actito inbox functionality is not enabled.');
    return 0;
  }

  if (!application.inboxConfig?.autoBadge) {
    logger.warning('Actito auto badge functionality is not enabled.');
    return 0;
  }

  const badgeStr = localStorage.getItem('re.notifica.inbox.badge');
  if (!badgeStr) return 0;

  return parseInt(badgeStr, 10);
}

/**
 * Fetches the current inbox, returning all the inbox items, inbox count and unread count.
 *
 * @param {FetchInboxOptions} options - An {@link FetchInboxOptions} object with the inbox fetching
 * options.
 * @returns {Promise<ActitoInboxResponse>} - A promise that resolves to a
 * {@link ActitoInboxResponse} object containing all the inbox items, inbox count and unread count.
 */
export async function fetchInbox(options?: FetchInboxOptions): Promise<ActitoInboxResponse> {
  checkPrerequisites();

  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  const { inboxItems, count, unread } = await fetchCloudDeviceInbox({
    environment: getCloudApiEnvironment(),
    deviceId: device.id,
    skip: options?.skip ?? 0,
    limit: options?.limit ?? 100,
    since: options?.since,
  });

  const now = Date.now();
  const items = inboxItems
    .filter(({ visible, expires }) => visible && (!expires || Date.parse(expires) > now))
    .map(convertCloudInboxItemToPublic);

  return {
    items,
    count,
    unread,
  };
}

/**
 * Refreshes the badge count reflecting the number of unread inbox items.
 *
 * @returns {Promise<number>} - A promise that resolves to a number  of unread inbox items.
 */
export async function refreshBadge(): Promise<number> {
  checkPrerequisites();

  return refreshBadgeInternal();
}

/**
 * Opens a specified inbox item, marking it as read and returning the associated notification.
 *
 * @param {ActitoInboxItem} item - The {@link ActitoInboxItem} to open.
 * @return {Promise<ActitoNotification>} - The {@link ActitoNotification} associated with
 * the inbox item.
 */
export async function openInboxItem(item: ActitoInboxItem): Promise<ActitoNotification> {
  checkPrerequisites();

  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  let { notification } = item;
  if (item.notification.partial) {
    notification = await fetchNotification(item.id);
  }

  await markInboxItemAsRead(item);

  if (!item.opened) {
    notifyInboxUpdated();
  }

  return notification;
}

/**
 * Marks the specified inbox item as read.
 *
 * @param {ActitoInboxItem} item - The {@link ActitoInboxItem} to mark as read.
 * @returns {Promise<void>} - A promise that resolves when the inbox item has
 * been successfully marked as read.
 */
export async function markInboxItemAsRead(item: ActitoInboxItem): Promise<void> {
  checkPrerequisites();

  await logNotificationOpen(item.notification.id);
  await refreshBadge();
}

/**
 * Marks all inbox items as read.
 *
 * @returns {Promise<void>} - A promise that resolves when all inbox items
 * have been successfully marked as read.
 */
export async function markAllInboxItemsAsRead(): Promise<void> {
  checkPrerequisites();

  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  await markCloudDeviceInboxAsRead({
    environment: getCloudApiEnvironment(),
    deviceId: device.id,
  });

  await refreshBadge();
}

/**
 * Permanently removes the specified inbox item from the inbox.
 *
 * @param {ActitoInboxItem} item - The {@link ActitoInboxItem} to remove.
 * @returns {Promise<void>} - A promise that resolves when the inbox item has
 * been successfully removed.
 */
export async function removeInboxItem(item: ActitoInboxItem): Promise<void> {
  checkPrerequisites();

  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  await removeCloudDeviceInboxItem({
    environment: getCloudApiEnvironment(),
    id: item.id,
  });

  await refreshBadge();
}

/**
 * Clears all inbox items, permanently deleting them from the inbox.
 *
 * @returns {Promise<void>} - A promise that resolves when all inbox items
 * have been successfully cleared.
 */
export async function clearInbox(): Promise<void> {
  checkPrerequisites();

  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  await clearCloudDeviceInbox({
    environment: getCloudApiEnvironment(),
    deviceId: device.id,
  });

  await refreshBadge();
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
}

interface FetchInboxOptions {
  since?: string;
  skip?: number;
  limit?: number;
}
