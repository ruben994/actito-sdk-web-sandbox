import {
  fetchCloudDynamicLink,
  fetchCloudPass,
  fetchCloudPassSaveLinks,
} from '@actito/web-cloud-api';
import type { ActitoNotification, ActitoNotificationContent } from '@actito/web-core';
import { presentWindowClient } from './window-client';
import { getCloudApiEnvironment } from '~/internal/cloud-api/environment';
import { InvalidWorkerConfigurationError } from '~/internal/configuration/errors';
import { getCurrentDeviceId, parseWorkerConfiguration } from '~/internal/configuration/parser';
import { resolveUrl, UrlResolverResult } from '~/internal/notification-url-resolver';
import { isAppleDevice, isSafariBrowser } from '~/internal/utils';
import { logger } from '~/logger';

// Let TS know this is scoped to a service worker.
declare const self: ServiceWorkerGlobalScope;

export async function presentNotification(notification: ActitoNotification) {
  const config = parseWorkerConfiguration();
  if (!config) throw new InvalidWorkerConfigurationError();

  if (config.standalone) {
    logger.debug('Presenting a notification in standalone mode.');
    await presentWindowClient(notification);
    return;
  }

  switch (notification.type) {
    case 're.notifica.notification.InAppBrowser':
      await presentInAppBrowserNotification(notification);
      break;
    case 're.notifica.notification.Passbook':
      await presentPassbookNotification(notification);
      break;
    case 're.notifica.notification.Pass':
      await presentPassNotification(notification);
      break;
    case 're.notifica.notification.URLResolver':
      await presentUrlResolverNotification(notification);
      break;
    case 're.notifica.notification.URLScheme':
      await presentUrlSchemeNotification(notification);
      break;
    default:
      await presentWindowClient(notification);
  }
}

async function presentInAppBrowserNotification(notification: ActitoNotification) {
  const content = notification.content.find(({ type }) => type === 're.notifica.content.URL');
  if (!content) throw new Error('Invalid notification content.');

  const url = sanitizeContentUrl(content);
  await self.clients.openWindow(url);
}

function sanitizeContentUrl(content: ActitoNotificationContent): string {
  const url = content.data?.trim();
  if (!url) return '/';

  try {
    const parsedUrl = new URL(url);

    // The URLResolver type may include an auxiliary notificareWebView parameter.
    // Remove it from the destination URL.
    parsedUrl.searchParams.delete('notificareWebView');

    return parsedUrl.toString();
  } catch {
    return url;
  }
}

async function presentPassNotification(notification: ActitoNotification) {
  const content = notification.content.find(({ type }) => type === 're.notifica.content.Pass');

  if (!content) throw new Error('Missing content for Pass type notification.');

  const code = content.data.serial ?? content.data.barcode;

  if (!code) {
    throw new Error('Malformed content for Pass type notification. No serial or barcode found.');
  }

  await displayPass(code);
}

async function presentPassbookNotification(notification: ActitoNotification) {
  const content = notification.content.find(({ type }) => type === 're.notifica.content.PKPass');

  if (!content) throw new Error('Missing content for Passbook type notification.');

  const passUrlStr: string = content.data;

  const components = passUrlStr.split('/');
  if (!components.length) throw new Error('Invalid content for Passbook type notification.');

  const code: string = components[components.length - 1];

  await displayPass(code);
}

async function displayPass(code: string) {
  const { pass } = await fetchCloudPass({
    environment: await getCloudApiEnvironment(),
    code: code,
  });

  if (pass.version === 2) {
    const { saveLinks } = await fetchCloudPassSaveLinks({
      environment: await getCloudApiEnvironment(),
      serial: pass.serial,
    });

    if (isAppleDevice() && isSafariBrowser() && saveLinks?.appleWallet) {
      await self.clients.openWindow(saveLinks.appleWallet);
      return;
    }

    if (saveLinks?.googlePay) {
      await self.clients.openWindow(saveLinks.googlePay);
      return;
    }
  }

  const config = parseWorkerConfiguration();
  if (!config) throw new InvalidWorkerConfigurationError();

  if (isAppleDevice() && isSafariBrowser()) {
    await self.clients.openWindow(`${config.cloudHost}/pass/pkpass/${pass.serial}`);
    return;
  }

  await self.clients.openWindow(`${config.cloudHost}/pass/web/${pass.serial}?showWebVersion=1`);
}

async function presentUrlResolverNotification(notification: ActitoNotification) {
  const result = resolveUrl(notification);

  switch (result) {
    case UrlResolverResult.NONE:
      logger.debug("Resolving as 'none' notification.");
      await presentWindowClient(notification);
      break;

    case UrlResolverResult.URL_SCHEME:
      logger.debug("Resolving as 'url scheme' notification.");
      await presentUrlSchemeNotification(notification);
      break;

    case UrlResolverResult.IN_APP_BROWSER:
      logger.debug("Resolving as 'in-app browser' notification.");
      await presentInAppBrowserNotification(notification);
      break;

    case UrlResolverResult.WEB_VIEW:
      logger.debug("Resolving as 'web view' notification.");
      await presentWindowClient(notification);
      break;

    default:
      throw new Error(`Unknown URL resolver result '${result}'.`);
  }
}

async function presentUrlSchemeNotification(notification: ActitoNotification) {
  const content = notification.content.find(({ type }) => type === 're.notifica.content.URL');
  if (!content) throw new Error('Invalid notification content.');

  if (!content.data || !content.data.trim()) {
    await self.clients.openWindow('/');
    return;
  }

  const urlStr: string = content.data.trim();
  let url: URL;

  try {
    url = new URL(urlStr);
  } catch (e) {
    logger.warning(`Unable to parse URL string '${urlStr}'.`, e);

    try {
      await self.clients.openWindow(urlStr);
    } catch {
      // The promise fails when opening a deep link
      // even when it succeeds in processing it.
    }

    return;
  }

  if (!url.host.endsWith('ntc.re')) {
    try {
      await self.clients.openWindow(urlStr);
    } catch {
      // The promise fails when opening a deep link
      // even when it succeeds in processing it.
    }

    return;
  }

  const { link } = await fetchCloudDynamicLink({
    environment: await getCloudApiEnvironment(),
    deviceId: getCurrentDeviceId(),
    url: urlStr,
  });

  try {
    await self.clients.openWindow(link.target);
  } catch {
    // The promise fails when opening a deep link
    // even when it succeeds in processing it.
  }
}
