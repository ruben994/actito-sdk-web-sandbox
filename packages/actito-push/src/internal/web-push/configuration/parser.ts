import type { WorkerConfiguration } from './worker-configuration';
import { base64Decode, base64Encode } from '~/internal/utils/base64';

export function parseWorkerConfiguration(encoded: string): WorkerConfiguration | undefined {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let config: any;

  try {
    const decoded = base64Decode(encoded);
    config = JSON.parse(decoded);
  } catch {
    return undefined;
  }

  const { cloudHost } = config;
  if (!cloudHost) return undefined;

  const { applicationKey } = config;
  if (!applicationKey) return undefined;

  const { applicationSecret } = config;
  if (!applicationSecret) return undefined;

  return {
    cloudHost,
    applicationId: config.applicationId,
    applicationKey,
    applicationSecret,
    deviceId: config.deviceId,
    standalone: config.standalone,
  };
}

export function encodeWorkerConfiguration(config: WorkerConfiguration): string {
  return base64Encode(JSON.stringify(config));
}
