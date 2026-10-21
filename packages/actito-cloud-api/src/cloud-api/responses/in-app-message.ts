import type { CloudInAppMessage } from '~/cloud-api/models/in-app-message';

export interface CloudInAppMessageResponse {
  readonly message: CloudInAppMessage;
}
