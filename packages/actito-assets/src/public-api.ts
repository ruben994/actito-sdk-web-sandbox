import { fetchCloudAssetGroup } from '@actito/web-cloud-api';
import {
  getApplication,
  getCloudApiEnvironment,
  getCurrentDevice,
  isReady,
  ActitoApplicationUnavailableError,
  ActitoDeviceUnavailableError,
  ActitoNotReadyError,
  ActitoServiceUnavailableError,
} from '@actito/web-core';
import { convertCloudAssetToPublic } from './internal/cloud-api/assets-converter';
import { logger } from './logger';
import type { ActitoAsset } from './models/actito-asset';

/**
 * Fetches a list of {@link ActitoAsset} for a specified group.
 *
 * @param {string} group - The name of the group whose assets are to be fetched.
 * @return {Promise<ActitoAsset[]>} - A promise that resolves to a list of {@link ActitoAsset}
 * belonging to the specified group.
 */
export async function fetchAssets(group: string): Promise<ActitoAsset[]> {
  checkPrerequisites();

  const device = getCurrentDevice();
  if (!device) throw new ActitoDeviceUnavailableError();

  const { assets } = await fetchCloudAssetGroup({
    environment: getCloudApiEnvironment(),
    deviceId: device.id,
    userId: device.userId,
    group,
  });

  return assets.map((asset) => convertCloudAssetToPublic(asset));
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

  if (!application.services.storage) {
    logger.warning('Actito storage functionality is not enabled.');
    throw new ActitoServiceUnavailableError('storage');
  }
}
