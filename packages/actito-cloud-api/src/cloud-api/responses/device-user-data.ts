import type { CloudUserData } from '~/cloud-api/models/user-data';

export interface CloudDeviceUserDataResponse {
  readonly userData?: CloudUserData;
}
