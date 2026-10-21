import {
  getApplication,
  isReady,
  ActitoApplicationUnavailableError,
  ActitoNotReadyError,
  ActitoServiceUnavailableError,
} from '@actito/web-core';
import { startLocationUpdates, stopLocationUpdates } from './internal/internal-api';
import {
  getLocationServicesEnabled,
  setLocationServicesEnabled,
} from './internal/storage/local-storage';
import { logger } from './logger';

export {
  onLocationUpdated,
  onLocationUpdateError,
  type OnLocationUpdatedCallback,
  type OnLocationUpdateErrorCallback,
} from './internal/consumer-events';

/**
 * Indicates whether location services are enabled.
 *
 * @returns {boolean} - `true` if the location services are enabled, and `false` otherwise.
 */
export function hasLocationServicesEnabled(): boolean {
  return getLocationServicesEnabled();
}

/**
 * Enables location updates, activating location tracking.
 */
export function enableLocationUpdates() {
  try {
    checkPrerequisites();
  } catch {
    return;
  }

  setLocationServicesEnabled(true);
  startLocationUpdates();
}

/**
 * Disables location updates.
 */
export function disableLocationUpdates() {
  try {
    checkPrerequisites();
  } catch {
    return;
  }

  setLocationServicesEnabled(false);
  stopLocationUpdates();
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

  if (!application.services.locationServices) {
    logger.warning('Actito location functionality is not enabled.');
    throw new ActitoServiceUnavailableError('locationServices');
  }

  if (!('geolocation' in navigator)) {
    logger.warning('The browser does not support geolocation.');
    throw new Error('The browser does not support geolocation.');
  }
}
