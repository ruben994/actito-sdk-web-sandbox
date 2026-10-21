import { describe, expect, test } from '@jest/globals';
import type { WorkerConfiguration } from '~/internal/web-push/configuration/worker-configuration';

describe('test parseWorkerConfiguration', () => {
  const DEFAULT_WORKER_CONFIGURATION: WorkerConfiguration = {
    cloudHost: 'https://cloud.notifica.re',
    applicationId: 'app-123',
    applicationKey: 'key-123',
    applicationSecret: 'secret-123',
    deviceId: 'device-123',
    standalone: true,
  };

  test('when the worker has a valid configuration, it should return the configuration as expected', async () => {
    const input = btoa(JSON.stringify(DEFAULT_WORKER_CONFIGURATION));
    const expectedOutput = DEFAULT_WORKER_CONFIGURATION;

    const { parseWorkerConfiguration } = await import('~/internal/web-push/configuration/parser');

    expect(parseWorkerConfiguration(input)).toStrictEqual(expectedOutput);
  });

  test.each([
    ['no cloudHost', { cloudHost: undefined }],
    ['no applicationKey', { applicationKey: undefined }],
    ['no applicationSecret', { applicationSecret: undefined }],
  ])(
    'when the worker configuration is invalid (%s), it should return undefined',
    async (_, configOverride: Partial<WorkerConfiguration>) => {
      const input = btoa(JSON.stringify({ ...DEFAULT_WORKER_CONFIGURATION, ...configOverride }));

      const { parseWorkerConfiguration } = await import('~/internal/web-push/configuration/parser');

      expect(parseWorkerConfiguration(input)).toBeUndefined();
    },
  );
});
