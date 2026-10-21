import { cloudRequest, type CloudRequestParams } from '~/cloud-api/request';
import type { CloudPassResponse } from '~/cloud-api/responses/pass';
import type { CloudPassSaveLinksResponse } from '~/cloud-api/responses/pass-save-links';

export async function fetchCloudPass(params: FetchCloudPassParams): Promise<CloudPassResponse> {
  const { code, ...rest } = params;

  // This endpoint accepts both serial numbers and barcodes
  const response = await cloudRequest({
    ...rest,
    path: `/api/pass/forserial/${encodeURIComponent(code)}`,
  });

  return response.json();
}

export interface FetchCloudPassParams extends CloudRequestParams {
  code: string;
}

export async function fetchCloudPassSaveLinks(
  params: FetchCloudPassSaveLinksParams,
): Promise<CloudPassSaveLinksResponse> {
  const { serial, ...rest } = params;

  const response = await cloudRequest({
    ...rest,
    path: `/api/pass/savelinks/${encodeURIComponent(serial)}`,
  });

  return response.json();
}

export interface FetchCloudPassSaveLinksParams extends CloudRequestParams {
  serial: string;
}
