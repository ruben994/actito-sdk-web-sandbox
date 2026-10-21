import type { CloudAsset } from '~/cloud-api/models/asset';

export interface CloudAssetsResponse {
  readonly assets: CloudAsset[];
}
