import type { CloudDoNotDisturb } from '~/cloud-api/models/do-not-disturb';

export interface CloudDeviceDoNotDisturbResponse {
  readonly dnd?: CloudDoNotDisturb | null;
}
