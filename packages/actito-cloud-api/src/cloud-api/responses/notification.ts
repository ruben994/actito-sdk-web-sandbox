import type { CloudNotification } from '~/cloud-api/models/notification';

export interface CloudNotificationResponse {
  readonly notification: CloudNotification;
}
