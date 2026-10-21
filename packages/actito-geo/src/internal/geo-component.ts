import { Component, getApplication, getCurrentDevice } from '@actito/web-core';
import { clearLocation, startLocationUpdates } from './internal-api';
import {
  getLocationServicesEnabled,
  setCurrentLocation,
  setLocationServicesEnabled,
} from './storage/local-storage';
import { logger } from '~/logger';

export class GeoComponent extends Component {
  constructor() {
    super('geo');
  }

  migrate() {
    if (localStorage.getItem('notificarePosition')) {
      setLocationServicesEnabled(true);
    }

    localStorage.removeItem('notificarePosition');
    localStorage.removeItem('notificareRegions');
  }

  configure() {
    //
  }

  async clearStorage(): Promise<void> {
    setLocationServicesEnabled(undefined);
    setCurrentLocation(undefined);
  }

  async launch(): Promise<void> {
    const application = getApplication();
    const device = getCurrentDevice();
    if (application?.websitePushConfig?.ignoreTemporaryDevices && !device) return;

    if (getLocationServicesEnabled()) {
      logger.debug('Automatically starting location updates.');
      startLocationUpdates();
    }
  }

  async unlaunch(): Promise<void> {
    setLocationServicesEnabled(undefined);

    if (!getCurrentDevice()) return;

    await clearLocation();
  }
}
