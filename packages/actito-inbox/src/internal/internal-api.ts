import { clearCloudDeviceInbox, fetchCloudDeviceInbox } from '@actito/web-cloud-api';
import {
  getApplication,
  getCloudApiEnvironment,
  getCurrentDevice,
  ActitoApplicationUnavailableError,
  ActitoDeviceUnavailableError,
} from '@actito/web-core';
import { notifyBadgeUpdated } from './consumer-events';
import { ActitoAutoBadgeUnavailableError } from '~/errors/actito-auto-badge-unavailable-error';
import { logger } from '~/logger';

export async function refreshBadgeInternal(): Promise<number> {
  const application = getApplication();
  if (!application) throw new ActitoApplicationUnavailableError();

  if (!application.inboxConfig?.autoBadge) {
    logger.warning('Actito auto badge functionality is not enabled.');
    throw new ActitoAutoBadgeUnavailableError();
  }

  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  const { unread } = await fetchCloudDeviceInbox({
    environment: getCloudApiEnvironment(),
    deviceId: device.id,
    skip: 0,
    limit: 1,
  });

  localStorage.setItem('re.notifica.inbox.badge', unread.toString());

  if (navigator.setAppBadge) navigator.setAppBadge(unread);
  if (navigator.setClientBadge) navigator.setClientBadge(unread);

  notifyBadgeUpdated(unread);

  return unread;
}

export async function clearInboxInternal() {
  await clearRemoteInbox();
  clearLocalBadge();
}

export async function clearRemoteInbox(): Promise<void> {
  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  await clearCloudDeviceInbox({
    environment: getCloudApiEnvironment(),
    deviceId: device.id,
  });
}

function clearLocalBadge() {
  localStorage.removeItem('re.notifica.inbox.badge');
}
