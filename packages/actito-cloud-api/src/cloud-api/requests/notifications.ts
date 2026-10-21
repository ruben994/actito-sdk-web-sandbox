import { cloudRequest, type CloudRequestParams } from '~/cloud-api/request';
import type { CloudNotificationResponse } from '~/cloud-api/responses/notification';

export async function fetchCloudNotification(
  params: FetchCloudNotificationParams,
): Promise<CloudNotificationResponse> {
  const { id, ...rest } = params;

  const response = await cloudRequest({
    ...rest,
    path: `/api/notification/${encodeURIComponent(id)}`,
  });

  return response.json();
}

export interface FetchCloudNotificationParams extends CloudRequestParams {
  id: string;
}
