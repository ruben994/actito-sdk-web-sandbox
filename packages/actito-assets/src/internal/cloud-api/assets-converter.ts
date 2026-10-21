import type { CloudAsset, CloudAssetButton } from '@actito/web-cloud-api';
import { getOptions } from '@actito/web-core';
import type { ActitoAsset, ActitoAssetButton } from '~/models/actito-asset';

export function convertCloudAssetToPublic(asset: CloudAsset): ActitoAsset {
  return {
    id: asset._id,
    title: asset.title,
    description: asset.description ?? undefined,
    key: asset.key ?? undefined,
    url: createAssetUrl(asset),
    button: convertCloudAssetButtonToPublic(asset.button),
    metaData: asset?.metaData,
    extra: asset.extra ?? {},
  };
}

function createAssetUrl({ key }: CloudAsset): string | undefined {
  const options = getOptions();
  if (!options || !key) return undefined;

  const host = options.hosts.restApi;
  return `${host}/asset/file/${key}`;
}

function convertCloudAssetButtonToPublic(button?: CloudAssetButton): ActitoAssetButton | undefined {
  if (!button) return undefined;
  if (!button.label && !button.action) return undefined;

  return {
    label: button.label,
    action: button.action,
  };
}
