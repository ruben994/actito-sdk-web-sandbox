import { describe, expect, jest, test, beforeEach } from '@jest/globals';
import { parseWorkerConfiguration } from '~/internal/configuration/parser';
import type { WorkerConfiguration } from '~/internal/configuration/worker-configuration';
import type { WorkerNotification } from '~/internal/internal-types';

describe('test parseWorkerConfiguration', () => {
  // MOCKS
  const mockServiceWorkerLocationSearch = (config: string) =>
    Object.defineProperty(globalThis, 'self', {
      value: {
        ...globalThis.self,
        location: {
          ...globalThis.self.location,
          search: config,
        },
      },
    });

  // DEFAULT DATA
  const FULL_WORKER_CONFIGURATION: WorkerConfiguration = {
    cloudHost: 'https://cloud.notifica.re',
    applicationId: 'app-123',
    applicationKey: 'key-123',
    applicationSecret: 'secret-123',
    deviceId: 'device-123',
    standalone: true,
  };

  beforeEach(() => {
    jest.resetModules();
  });

  test('when the worker has a valid configuration, it should return the configuration as expected', async () => {
    mockServiceWorkerLocationSearch(
      `?notificareConfig=${encodeURIComponent(btoa(JSON.stringify(FULL_WORKER_CONFIGURATION)))}`,
    );

    const expectedOutput: WorkerNotification = FULL_WORKER_CONFIGURATION;

    expect(parseWorkerConfiguration()).toStrictEqual(expectedOutput);
  });

  test('when the worker configuration does not exist (missing notificareConfig search param), it should return undefined', async () => {
    mockServiceWorkerLocationSearch('?someParam=123');

    expect(parseWorkerConfiguration()).toBeUndefined();
  });

  test.each([
    ['no cloudHost', { cloudHost: undefined }],
    ['no applicationKey', { applicationKey: undefined }],
    ['no applicationSecret', { applicationSecret: undefined }],
    ['no deviceId', { deviceId: undefined }],
  ])(
    'when the worker configuration is invalid (%s), it should return undefined',
    async (_, configOverride: Partial<WorkerConfiguration>) => {
      mockServiceWorkerLocationSearch(
        `?notificareConfig=${encodeURIComponent(btoa(JSON.stringify({ ...FULL_WORKER_CONFIGURATION, ...configOverride })))}`,
      );

      expect(parseWorkerConfiguration()).toBeUndefined();
    },
  );
});
