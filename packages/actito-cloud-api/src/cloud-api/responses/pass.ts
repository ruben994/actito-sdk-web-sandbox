import type { CloudPass } from '~/cloud-api/models/pass';

export interface CloudPassResponse {
  readonly pass: CloudPass;
}
