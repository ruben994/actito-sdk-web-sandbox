import { cloudRequest, type CloudRequestParams } from '~/cloud-api/request';
import type { CloudApplicationResponse } from '~/cloud-api/responses/application';

export async function fetchCloudApplication(
  params: FetchCloudApplicationParams,
): Promise<CloudApplicationResponse> {
  const { language, ...rest } = params;
  const searchParams = new URLSearchParams();

  if (language) searchParams.set('language', language);

  const response = await cloudRequest({
    ...rest,
    path: '/api/application/info',
    searchParams,
  });

  return response.json();
}

export interface FetchCloudApplicationParams extends CloudRequestParams {
  language?: string;
}
