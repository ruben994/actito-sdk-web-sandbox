import { fetchCloudPass, fetchCloudPassSaveLinks } from '@actito/web-cloud-api';
import {
  fetchDynamicLink,
  getCloudApiEnvironment,
  getOptions,
  type ActitoInternalOptions,
  type ActitoNotification,
} from '@actito/web-core';
import { presentAction } from './action-presenter';
import { createNotificationModal } from './notifications/notification-modal';
import { ensureCleanState } from './root';
import {
  notifyNotificationFailedToPresent,
  notifyNotificationFinishedPresenting,
  notifyNotificationPresented,
  notifyNotificationWillPresent,
} from '~/internal/consumer-events';
import { resolveUrl, UrlResolverResult } from '~/internal/notification-url-resolver';
import { isAppleDevice, isSafariBrowser } from '~/internal/utils/device';
import { sanitizeContentUrl } from '~/internal/utils/notification-content';
import { logger } from '~/logger';

class NotificationPresenter {
  private notification: ActitoNotification | undefined;

  present(notification: ActitoNotification) {
    ensureCleanState();

    notifyNotificationWillPresent(notification);

    // const application = getApplication();
    // if (!application) {
    //   logger.warning('Unable to present the notification. The cached application is unavailable.');
    //   notifyNotificationFailedToPresent(notification);
    //   return;
    // }

    const options = getOptions();
    if (!options) {
      logger.warning('Unable to present the notification. Actito is not configured.');
      notifyNotificationFailedToPresent(notification);
      return;
    }

    if (!checkNotificationSupport(notification)) {
      logger.warning(
        `Unable to present the notification. Unsupported notification type '${notification.type}'.`,
      );
      notifyNotificationFailedToPresent(notification);
      return;
    }

    logger.debug(`Presenting notification '${notification.id}'.`);
    this.notification = notification;

    this.presentNotification(notification, options)
      .then(() => {
        notifyNotificationPresented(notification);
      })
      .catch((error) => {
        logger.error('Failed to present a notification: ', error);
        notifyNotificationFailedToPresent(notification);
      });
  }

  dismiss() {
    if (this.notification) {
      notifyNotificationFinishedPresenting(this.notification);
    }

    this.notification = undefined;
    ensureCleanState();
  }

  private async presentNotification(
    notification: ActitoNotification,
    options: ActitoInternalOptions,
  ) {
    switch (notification.type) {
      case 're.notifica.notification.None':
        logger.debug(
          "Attempting to present a notification of type 'none'. These should be handled by the application instead.",
        );
        return;

      case 're.notifica.notification.InAppBrowser':
        presentInAppBrowserNotification(notification);
        return;

      case 're.notifica.notification.URLResolver': {
        const result = resolveUrl(notification);

        switch (result) {
          case UrlResolverResult.NONE:
            logger.debug("Resolving as 'none' notification.");
            break;

          case UrlResolverResult.URL_SCHEME:
            logger.debug("Resolving as 'url scheme' notification.");
            await presentUrlSchemeNotification(notification);
            break;

          case UrlResolverResult.IN_APP_BROWSER:
            logger.debug("Resolving as 'in-app browser' notification.");
            presentInAppBrowserNotification(notification);
            break;

          case UrlResolverResult.WEB_VIEW:
            logger.debug("Resolving as 'web view' notification.");
            await this.showNotificationModal(notification);
            break;

          default:
            throw new Error(`Unknown URL resolver result '${result}'.`);
        }

        return;
      }

      case 're.notifica.notification.URLScheme':
        await presentUrlSchemeNotification(notification);
        return;

      case 're.notifica.notification.Passbook':
        await presentPassbookNotification(options, notification);
        return;

      case 're.notifica.notification.Pass':
        await presentPassNotification(options, notification);
        return;

      default:
        break;
    }

    await this.showNotificationModal(notification);
  }

  private async showNotificationModal(notification: ActitoNotification) {
    const ui = await createNotificationModal({
      notification,
      dismiss: () => this.dismiss(),
      presentAction: (action) => {
        this.dismiss();
        presentAction(notification, action);
      },
    });

    // Add the complete notification DOM to the page.
    document.body.appendChild(ui);
  }
}

export const notificationPresenter = new NotificationPresenter();

function checkNotificationSupport(notification: ActitoNotification): boolean {
  switch (notification.type) {
    case 're.notifica.notification.None':
    case 're.notifica.notification.Alert':
    case 're.notifica.notification.Image':
    case 're.notifica.notification.InAppBrowser':
    case 're.notifica.notification.Map':
    case 're.notifica.notification.Passbook':
    case 're.notifica.notification.Pass':
    case 're.notifica.notification.URL':
    case 're.notifica.notification.URLResolver':
    case 're.notifica.notification.URLScheme':
    case 're.notifica.notification.Video':
    case 're.notifica.notification.WebView':
      return true;
    default:
      return false;
  }
}

function presentInAppBrowserNotification(notification: ActitoNotification) {
  const content = notification.content.find(({ type }) => type === 're.notifica.content.URL');
  if (!content) throw new Error('Invalid notification content.');

  window.location.href = sanitizeContentUrl(content);
}

async function presentPassNotification(
  options: ActitoInternalOptions,
  notification: ActitoNotification,
) {
  const content = notification.content.find(({ type }) => type === 're.notifica.content.Pass');

  if (!content) throw new Error('Missing content for Pass type notification.');

  const code = content.data.serial ?? content.data.barcode;

  if (!code) {
    throw new Error('Malformed content for Pass type notification. No serial or barcode found.');
  }

  await displayPass(options, code);
}

async function presentPassbookNotification(
  options: ActitoInternalOptions,
  notification: ActitoNotification,
) {
  const content = notification.content.find(({ type }) => type === 're.notifica.content.PKPass');

  if (!content) throw new Error('Missing content for Passbook type notification.');

  const passUrlStr: string = content.data;

  const components = passUrlStr.split('/');
  if (!components.length) throw new Error('Invalid content for Passbook type notification.');

  const code: string = components[components.length - 1];

  await displayPass(options, code);
}

async function displayPass(options: ActitoInternalOptions, code: string) {
  const { pass } = await fetchCloudPass({
    environment: getCloudApiEnvironment(),
    code: code,
  });

  if (pass.version === 2) {
    const { saveLinks } = await fetchCloudPassSaveLinks({
      environment: getCloudApiEnvironment(),
      serial: pass.serial,
    });

    if (isAppleDevice() && isSafariBrowser() && saveLinks?.appleWallet) {
      window.location.href = saveLinks.appleWallet;
      return;
    }

    if (saveLinks?.googlePay) {
      window.location.href = saveLinks.googlePay;
      return;
    }
  }

  if (isAppleDevice() && isSafariBrowser()) {
    window.location.href = `${options.hosts.restApi}/pass/pkpass/${pass.serial}`;
    return;
  }

  window.location.href = `${options.hosts.restApi}/pass/web/${pass.serial}?showWebVersion=1`;
}

async function presentUrlSchemeNotification(notification: ActitoNotification) {
  const content = notification.content.find(({ type }) => type === 're.notifica.content.URL');
  if (!content) throw new Error('Invalid notification content.');

  if (!content.data || !content.data.trim()) {
    window.location.href = '/';
    return;
  }

  const urlStr: string = content.data.trim();
  let url: URL;

  try {
    url = new URL(urlStr);
  } catch (e) {
    logger.error(`Unable to parse URL string '${urlStr}'.`, e);
    window.location.href = urlStr;
    return;
  }

  if (!url.host.endsWith('ntc.re')) {
    window.location.href = urlStr;
    return;
  }

  const link = await fetchDynamicLink(urlStr);
  window.location.href = link.target;
}
