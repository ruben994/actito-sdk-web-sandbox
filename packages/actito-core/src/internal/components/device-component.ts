import { ActitoNetworkRequestError, type CloudCreateDevicePayload } from '@actito/web-cloud-api';
import { Component } from '~/internal/component';
import { components } from '~/internal/component-cache';
import { notifyDeviceRegistered } from '~/internal/consumer-events';
import {
  createDevice,
  deleteDevice,
  registerTestDevice,
  updateDevice,
  upgradeToLongLivedDeviceWhenNeeded,
} from '~/internal/internal-api-device';
import {
  logApplicationInstall,
  logApplicationRegistration,
  logApplicationUpgrade,
} from '~/internal/internal-api-events';
import {
  launch as launchSession,
  unlaunch as unlaunchSession,
} from '~/internal/internal-api-session';
import { isReady } from '~/internal/launch-state';
import { logger } from '~/internal/logger';
import {
  asPublicDevice,
  getStoredApplication,
  getStoredDevice,
  setStoredDevice,
} from '~/internal/storage/local-storage';
import { getApplicationVersion } from '~/internal/utils';

export class DeviceComponent extends Component {
  private hasPendingDeviceRegistrationEvent = false;

  constructor() {
    super('device');
  }

  configure() {
    //
  }

  async launch(): Promise<void> {
    await upgradeToLongLivedDeviceWhenNeeded();

    const application = getStoredApplication();
    const device = getStoredDevice();

    if (!device && !application?.websitePushConfig?.ignoreTemporaryDevices) {
      logger.debug('New install detected.');

      try {
        await this.handleCreateDeviceWithSession();
      } catch (e) {
        logger.warning('Failed to register temporary device.', e);
        throw e;
      }
    } else if (device) {
      const isApplicationUpgrade = device.appVersion !== getApplicationVersion();

      try {
        await updateDevice();
      } catch (e) {
        if (e instanceof ActitoNetworkRequestError && e.response.status === 404) {
          logger.warning('The device was removed from Actito. Recovering...');

          logger.debug('Resetting local storage.');
          await this.resetLocalStorage();

          if (!application?.websitePushConfig?.ignoreTemporaryDevices) {
            logger.debug('Creating a new device.');
            await this.handleCreateDeviceWithSession();
          }

          return;
        }

        throw e;
      }

      // Having a stored device, we can safely launch the session module.
      await launchSession();

      if (isApplicationUpgrade) {
        // It's not the same version, let's log it as an upgrade.
        logger.debug('New version detected.');
        await logApplicationUpgrade();
      }
    } else {
      logger.debug('Ignoring temporary devices.');
    }

    this.handleTestDeviceRegistration();
  }

  async unlaunch(): Promise<void> {
    //
  }

  async postLaunch(): Promise<void> {
    const device = getStoredDevice();
    if (device && this.hasPendingDeviceRegistrationEvent) {
      notifyDeviceRegistered(asPublicDevice(device));
      this.hasPendingDeviceRegistrationEvent = false;
    }
  }

  async executeCommand(command: string, data?: unknown): Promise<unknown> {
    if (command === 'createDevice') {
      await this.handleCreateDeviceWithSession(data as CreateDeviceCommandData);
      return;
    }

    if (command === 'deleteDevice') {
      await this.handleDeleteDeviceWithSession();
      return;
    }

    throw new Error(`Unsupported command '${command}' in '${this.name}' component.`);
  }

  private handleTestDeviceRegistration() {
    const searchParams = new URLSearchParams(window.location.search);

    const nonce = searchParams.get('notificareTestNonce');
    if (!nonce) return;

    registerTestDevice(nonce)
      .then(() => logger.debug('Test device registered.'))
      .catch((error) => logger.error(`Failed to register the test device: ${error}`));
  }

  private async handleCreateDeviceWithSession(data?: CreateDeviceCommandData) {
    await createDevice(data);

    if (isReady()) {
      const device = getStoredDevice();
      if (device) notifyDeviceRegistered(asPublicDevice(device));
    } else {
      this.hasPendingDeviceRegistrationEvent = true;
    }

    // Having a stored device, we can safely launch the session module.
    await launchSession();

    // We will log the Installation & Registration events here since this will execute only one time at the start.
    await logApplicationInstall();
    await logApplicationRegistration();
  }

  private async handleDeleteDeviceWithSession() {
    await unlaunchSession();
    await deleteDevice();
  }

  private async resetLocalStorage() {
    for (const component of components.values()) {
      logger.debug(`Resetting '${component.name}' component.`);
      await component.clearStorage();
    }

    // Should only clear device-related local storage properties.
    setStoredDevice(undefined);
    localStorage.removeItem('re.notifica.preferred_language');
    localStorage.removeItem('re.notifica.preferred_region');

    // Clear cached session to prevent resuming the previous session.
    // It should create a new session.
    localStorage.removeItem('re.notifica.session');
    localStorage.removeItem('re.notifica.unload_timestamp');
  }
}

export type CreateDeviceCommandData = Pick<
  CloudCreateDevicePayload,
  'transport' | 'subscriptionId' | 'keys' | 'allowedUI' | 'webPushCapable'
>;
