import {
  type ActitoApplication,
  ActitoApplicationUnavailableError,
  type ActitoInternalOptions,
  ActitoNotConfiguredError,
} from '@actito/web-core';
import * as originalActitoCoreModule from '@actito/web-core';
import { beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import type { WorkerConfiguration } from '~/internal/web-push/configuration/worker-configuration';
import { createWebPushSubscription } from '~/internal/web-push/service-worker';

describe('test registerServiceWorker', () => {
  // MOCKS
  const mockServiceWorkerRegister = jest.fn();
  const mockServiceWorkerReadyPromise = jest.fn();
  const mockServiceWorkerGetRegistrations = jest.fn();
  const mockGetOptions = jest.fn();
  const mockGetApplication = jest.fn();

  Object.defineProperty(navigator, 'serviceWorker', {
    value: {
      register: mockServiceWorkerRegister,
      ready: mockServiceWorkerReadyPromise,
      getRegistrations: mockServiceWorkerGetRegistrations,
    },
  });

  Object.defineProperty(navigator, 'standalone', {
    value: false,
  });

  jest.unstable_mockModule('@actito/web-core', () => ({
    ...originalActitoCoreModule,
    getOptions: mockGetOptions,
    getApplication: mockGetApplication,
  }));

  // UTILS
  const generateConfiguredWorkerURL = (url: string, workerConfiguration: WorkerConfiguration) =>
    `${url}?notificareConfig=${encodeURIComponent(btoa(JSON.stringify(workerConfiguration)))}`;

  // DEFAULT DATA
  const DEFAULT_ACTITO_INTERNAL_OPTIONS: ActitoInternalOptions = {
    hosts: {
      cloudApi: 'https://cloud.notifica.re',
      restApi: 'https://push.notifica.re',
    },
    applicationKey: 'key-123',
    applicationSecret: 'secret-123',
    applicationHost: 'http://localhost:3000',
    applicationVersion: '1.0.0',
    serviceWorker: '/sw.js',
    serviceWorkerScope: '/',
  };

  const DEFAULT_ACTITO_APPLICATION: ActitoApplication = {
    id: '123',
    name: 'My App',
    category: 'Other',
    services: {},
    userDataFields: [],
    actionCategories: [],
  };

  const DEFAULT_WORKER_CONFIGURATION: WorkerConfiguration = {
    cloudHost: 'https://cloud.notifica.re',
    applicationId: '123',
    applicationKey: 'key-123',
    applicationSecret: 'secret-123',
    deviceId: undefined,
    standalone: undefined,
  };

  beforeAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    jest.resetAllMocks();

    // Default mocks for navigator.serviceWorker.getRegistrations(), getOptions() and getApplication()
    mockServiceWorkerGetRegistrations.mockReturnValue([]);
    mockGetOptions.mockReturnValue(DEFAULT_ACTITO_INTERNAL_OPTIONS);
    mockGetApplication.mockReturnValue(DEFAULT_ACTITO_APPLICATION);
  });

  test.each(['http://example.com', 'ftp://ftp.example.com'])(
    'when the application host protocol is not HTTPS or localhost (%s), it should throw an error',
    async (inputApplicationHost: string) => {
      const input: ActitoInternalOptions = {
        ...DEFAULT_ACTITO_INTERNAL_OPTIONS,
        applicationHost: inputApplicationHost,
      };

      const { registerServiceWorker } = await import('~/internal/web-push/service-worker');

      await expect(registerServiceWorker(input)).rejects.toThrow(
        'Service workers are only available over HTTPS or localhost.',
      );
    },
  );

  test('when there are no registered Service Workers, it registers a new one as expected', async () => {
    mockServiceWorkerGetRegistrations.mockReturnValue([]);

    const input = DEFAULT_ACTITO_INTERNAL_OPTIONS;

    const expectedScriptURL = generateConfiguredWorkerURL('/sw.js', DEFAULT_WORKER_CONFIGURATION);
    const expectedOptions = {
      scope: '/',
    };

    const { registerServiceWorker } = await import('~/internal/web-push/service-worker');
    await registerServiceWorker(input);

    expect(mockServiceWorkerRegister).toHaveBeenCalledWith(expectedScriptURL, expectedOptions);
  });

  test('when a Service Worker registration is found and it is not active, it does not register a new Service Worker and returns that registration instead', async () => {
    mockServiceWorkerGetRegistrations.mockReturnValue([
      {
        active: null,
      },
    ]);

    const input = DEFAULT_ACTITO_INTERNAL_OPTIONS;
    const expectedOutput: Partial<ServiceWorkerRegistration> = {
      active: null,
    };

    const { registerServiceWorker } = await import('~/internal/web-push/service-worker');

    expect(await registerServiceWorker(input)).toStrictEqual(expectedOutput);
    expect(mockServiceWorkerRegister).not.toHaveBeenCalled();
  });

  test('when a Service Worker registration is found and its pathname is different from the new one, it ignores it and registers a new Service Worker', async () => {
    mockServiceWorkerGetRegistrations.mockReturnValue([
      {
        active: {
          scriptURL: generateConfiguredWorkerURL(
            'https://example.com/my-registered-sw/sw.js',
            DEFAULT_WORKER_CONFIGURATION,
          ),
        },
      },
    ]);

    const input: ActitoInternalOptions = {
      ...DEFAULT_ACTITO_INTERNAL_OPTIONS,
      serviceWorker: '/my-new-sw/sw.js',
    };

    const expectedScriptURL = generateConfiguredWorkerURL(
      '/my-new-sw/sw.js',
      DEFAULT_WORKER_CONFIGURATION,
    );
    const expectedOptions = {
      scope: '/',
    };

    const { registerServiceWorker } = await import('~/internal/web-push/service-worker');
    await registerServiceWorker(input);

    expect(mockServiceWorkerRegister).toHaveBeenCalledWith(expectedScriptURL, expectedOptions);
  });

  test('when a Service Worker registration is found but it does not contain the notificareConfig search param, it ignores it and registers a new Service Worker', async () => {
    mockServiceWorkerGetRegistrations.mockReturnValue([
      {
        active: {
          scriptURL: 'https://example.com/sw.js',
        },
      },
    ]);

    const input = DEFAULT_ACTITO_INTERNAL_OPTIONS;

    const expectedScriptURL = generateConfiguredWorkerURL('/sw.js', DEFAULT_WORKER_CONFIGURATION);
    const expectedOptions = {
      scope: '/',
    };

    const { registerServiceWorker } = await import('~/internal/web-push/service-worker');
    await registerServiceWorker(input);

    expect(mockServiceWorkerRegister).toHaveBeenCalledWith(expectedScriptURL, expectedOptions);
  });

  test.each([
    ['no cloudHost', { cloudHost: undefined }],
    ['no applicationKey', { applicationKey: undefined }],
    ['no applicationSecret', { applicationSecret: undefined }],
  ])(
    'when a Service Worker registration is found but it has an invalid configuration (%s), it ignores it and registers a new Service Worker',
    async (_, configOverride: Partial<WorkerConfiguration>) => {
      mockServiceWorkerGetRegistrations.mockReturnValue([
        {
          active: {
            scriptURL: generateConfiguredWorkerURL('https://example.com/sw.js', {
              ...DEFAULT_WORKER_CONFIGURATION,
              ...configOverride,
            }),
          },
        },
      ]);

      const input = DEFAULT_ACTITO_INTERNAL_OPTIONS;

      const expectedScriptURL = generateConfiguredWorkerURL('/sw.js', DEFAULT_WORKER_CONFIGURATION);
      const expectedOptions = {
        scope: '/',
      };

      const { registerServiceWorker } = await import('~/internal/web-push/service-worker');
      await registerServiceWorker(input);

      expect(mockServiceWorkerRegister).toHaveBeenCalledWith(expectedScriptURL, expectedOptions);
    },
  );

  test('when Actito is not configured, it should throw an error', async () => {
    mockGetOptions.mockReturnValue(undefined);

    const input: ActitoInternalOptions = DEFAULT_ACTITO_INTERNAL_OPTIONS;

    const { registerServiceWorker } = await import('~/internal/web-push/service-worker');
    await expect(registerServiceWorker(input)).rejects.toThrow(ActitoNotConfiguredError);
  });

  test('when Actito application is not available, it should throw an error', async () => {
    mockGetApplication.mockReturnValue(undefined);

    const input: ActitoInternalOptions = DEFAULT_ACTITO_INTERNAL_OPTIONS;

    const { registerServiceWorker } = await import('~/internal/web-push/service-worker');
    await expect(registerServiceWorker(input)).rejects.toThrow(ActitoApplicationUnavailableError);
  });

  test('when an active Service Worker registration is found, it has the same worker configuration and it also corresponds to the current app configuration, it does not register a new Service Worker and returns that registration instead', async () => {
    const registeredWorker = {
      active: {
        scriptURL: generateConfiguredWorkerURL(
          'https://example.com/sw.js',
          DEFAULT_WORKER_CONFIGURATION,
        ),
      },
    };

    mockServiceWorkerGetRegistrations.mockReturnValue([registeredWorker]);
    mockGetOptions.mockReturnValue(DEFAULT_ACTITO_INTERNAL_OPTIONS);
    mockGetApplication.mockReturnValue(DEFAULT_ACTITO_APPLICATION);

    const input: ActitoInternalOptions = DEFAULT_ACTITO_INTERNAL_OPTIONS;
    const expectedOutput = registeredWorker;

    const { registerServiceWorker } = await import('~/internal/web-push/service-worker');

    expect(await registerServiceWorker(input)).toStrictEqual(expectedOutput);
    expect(mockServiceWorkerRegister).not.toHaveBeenCalled();
  });
});

describe('test createWebPushSubscription', () => {
  // MOCKS
  const mockSubscriptionSubscribe = jest.fn();
  const mockSubscriptionUnsubscribe = jest.fn();

  // UTILS
  const generateServiceWorkerRegistration = (
    applicationServerKey?: ArrayBuffer,
    expirationTime?: number,
  ) => {
    return {
      pushManager: {
        getSubscription: async () =>
          new Promise((resolve) => {
            resolve(
              applicationServerKey
                ? {
                    options: {
                      applicationServerKey,
                    },
                    expirationTime,
                    unsubscribe: mockSubscriptionUnsubscribe,
                  }
                : null,
            );
          }),
        subscribe: mockSubscriptionSubscribe,
      },
    } as unknown as ServiceWorkerRegistration;
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('when there is no active subscription, it does a new one', async () => {
    const inputRegistration = generateServiceWorkerRegistration();
    const inputVapidPublicKey = 'MTIz';

    const expectedSubscribeInput = {
      userVisibleOnly: true,
      applicationServerKey: new Uint8Array([49, 50, 51]), // corresponds to MTIz
    };

    await createWebPushSubscription(inputRegistration, inputVapidPublicKey);

    expect(mockSubscriptionUnsubscribe).not.toHaveBeenCalled();
    expect(mockSubscriptionSubscribe).toHaveBeenCalledWith(expectedSubscribeInput);
  });

  test('when there is already a subscription and the provided VAPID public key is different from its application server key, it unsubscribes the current subscription and does a new one', async () => {
    const inputRegistration = generateServiceWorkerRegistration(
      new Uint8Array([49, 50, 51]).buffer, // corresponds to MTIz
    );
    const inputVapidPublicKey = 'NDU2';

    const expectedSubscribeInput = {
      userVisibleOnly: true,
      applicationServerKey: new Uint8Array([52, 53, 54]), // corresponds to NDU2
    };

    await createWebPushSubscription(inputRegistration, inputVapidPublicKey);

    expect(mockSubscriptionUnsubscribe).toHaveBeenCalledTimes(1);
    expect(mockSubscriptionSubscribe).toHaveBeenCalledWith(expectedSubscribeInput);
  });

  test.each([
    ['1 hour', Date.now() + 60 * 60 * 1000],
    ['1 day', Date.now() + 24 * 60 * 60 * 1000],
    ['3 days', Date.now() + 3 * 24 * 60 * 60 * 1000],
    ['5 days', Date.now() + 5 * 24 * 60 * 60 * 1000],
  ])(
    'when there is already a subscription, the provided VAPID public key is the same one as its application server key and it is about to expire (%s), it unsubscribes the current subscription and does a new one',
    async (_, expirationTime) => {
      const inputRegistration = generateServiceWorkerRegistration(
        new Uint8Array([49, 50, 51]).buffer, // corresponds to MTIz
        expirationTime,
      );
      const inputVapidPublicKey = 'MTIz';

      const expectedSubscribeInput = {
        userVisibleOnly: true,
        applicationServerKey: new Uint8Array([49, 50, 51]), // corresponds to MTIz
      };

      await createWebPushSubscription(inputRegistration, inputVapidPublicKey);

      expect(mockSubscriptionUnsubscribe).toHaveBeenCalledTimes(1);
      expect(mockSubscriptionSubscribe).toHaveBeenCalledWith(expectedSubscribeInput);
    },
  );

  test.each([
    ['6 days', Date.now() + 6 * 24 * 60 * 60 * 1000],
    ['10 days', Date.now() + 10 * 24 * 60 * 60 * 1000],
    ['150 days', Date.now() + 150 * 24 * 60 * 60 * 1000],
  ])(
    'when there is already a subscription, the provided VAPID public key is the same one as its application server key and it is not about to expire (%s), it does a new subscription',
    async (_, expirationTime) => {
      const inputRegistration = generateServiceWorkerRegistration(
        new Uint8Array([49, 50, 51]).buffer, // corresponds to MTIz
        expirationTime,
      );
      const inputVapidPublicKey = 'MTIz';

      const expectedSubscribeInput = {
        userVisibleOnly: true,
        applicationServerKey: new Uint8Array([49, 50, 51]), // corresponds to MTIz
      };

      await createWebPushSubscription(inputRegistration, inputVapidPublicKey);

      expect(mockSubscriptionUnsubscribe).not.toHaveBeenCalled();
      expect(mockSubscriptionSubscribe).toHaveBeenCalledWith(expectedSubscribeInput);
    },
  );
});
