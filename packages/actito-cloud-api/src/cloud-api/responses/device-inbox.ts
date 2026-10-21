import type { CloudDeviceInboxItem } from '~/cloud-api/models/device-inbox';

export interface CloudDeviceInboxResponse {
  readonly inboxItems: CloudDeviceInboxItem[];
  readonly count: number;
  readonly unread: number;
}
