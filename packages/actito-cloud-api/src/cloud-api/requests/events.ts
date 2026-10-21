import type { CloudCreateEventPayload } from '~/cloud-api/payloads/event';
import { cloudRequest, type CloudRequestParams } from '~/cloud-api/request';

export async function createCloudEvent(params: CreateCloudEventParams): Promise<void> {
  const { payload, ...rest } = params;

  await cloudRequest({
    ...rest,
    method: 'POST',
    path: `/api/event`,
    body: payload,
  });
}

export interface CreateCloudEventParams extends CloudRequestParams {
  payload: CloudCreateEventPayload;
}
