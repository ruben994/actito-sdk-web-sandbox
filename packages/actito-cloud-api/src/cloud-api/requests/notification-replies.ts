import type { CloudNotificationReplyPayload } from '~/cloud-api/payloads/notification-reply';
import type { CloudNotificationWebhookPayload } from '~/cloud-api/payloads/notification-webhook';
import { cloudRequest, type CloudRequestParams } from '~/cloud-api/request';
import type { CloudUploadNotificationReplyMediaResponse } from '~/cloud-api/responses/upload-notification-reply-media';

export async function callCloudNotificationWebhook(
  params: CallCloudNotificationWebhookParams,
): Promise<void> {
  const { payload, ...rest } = params;

  await cloudRequest({
    ...rest,
    method: 'POST',
    path: `/api/notification/webhook`,
    body: payload,
  });
}

export interface CallCloudNotificationWebhookParams extends CloudRequestParams {
  payload: CloudNotificationWebhookPayload;
}

export async function uploadCloudNotificationReplyMedia(
  params: UploadCloudNotificationReplyMediaParams,
): Promise<CloudUploadNotificationReplyMediaResponse> {
  const { media, ...rest } = params;

  const formData = new FormData();
  formData.append('file', media);

  const response = await cloudRequest({
    ...rest,
    method: 'POST',
    path: '/api/upload/reply',
    formData,
  });

  return response.json();
}

export interface UploadCloudNotificationReplyMediaParams extends CloudRequestParams {
  media: Blob;
}

export async function createCloudNotificationReply(
  params: CreateCloudNotificationReplyParams,
): Promise<void> {
  const { payload, ...rest } = params;

  await cloudRequest({
    ...rest,
    method: 'POST',
    path: '/api/reply',
    body: payload,
  });
}

export interface CreateCloudNotificationReplyParams extends CloudRequestParams {
  payload: CloudNotificationReplyPayload;
}
