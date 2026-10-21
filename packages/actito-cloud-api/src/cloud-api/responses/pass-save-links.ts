import type { CloudPassSaveLinks } from '~/cloud-api/models/pass-save-links';

export interface CloudPassSaveLinksResponse {
  readonly saveLinks: CloudPassSaveLinks;
}
