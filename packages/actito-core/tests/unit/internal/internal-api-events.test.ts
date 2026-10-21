import { beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as originalLaunchStateModule from '~/internal/launch-state';
import * as originalOptionsModule from '~/internal/options';
import type { ActitoApplication } from '~/models/actito-application';
import * as originalPublicAPIModule from '~/public-api';

describe('test logCustom', () => {
  // MOCKS
  const mockGetApplication = jest.fn();
  const mockFetch = jest.fn<typeof fetch>();

  jest.unstable_mockModule('~/public-api', () => ({
    ...originalPublicAPIModule,
    getApplication: mockGetApplication,
    isReady: () => true,
  }));

  jest.unstable_mockModule('~/internal/launch-state', () => ({
    ...originalLaunchStateModule,
    isConfigured: () => true,
  }));

  jest.unstable_mockModule('~/internal/options', () => ({
    ...originalOptionsModule,
    getOptions: () => ({
      hosts: {
        cloudApi: 'https://cloud.notifica.re',
      },
      applicationKey: 'key-123',
      applicationSecret: 'secret-123',
    }),
  }));

  // DEFAULT DATA
  const DEFAULT_ACTITO_APPLICATION: ActitoApplication = {
    id: '123',
    name: 'My App',
    category: 'Other',
    services: {},
    userDataFields: [],
    actionCategories: [],
  };

  const INVALID_EVENT_NAMES_WITH_RESTRICTIONS = [
    ["starts with '-'", '-event'],
    ["starts with '_'", '_event'],
    ['starts with a space', ' event'],
    ["ends with '-'", 'event-'],
    ["ends with '_'", 'event_'],
    ["has invalid character '!'", 'event!'],
    ["has invalid character '@'", 'event@abc'],
    ["has invalid character '.'", 'event.abc'],
    ['has a space', 'event abc'],
    ['contains accents', 'ábcdfg'],
    ['contains emoji', '🔥event'],
    ['does not respect the minimum size', 'ab'],
    [
      'does not respect the maximum size',
      'aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffffggggg',
    ],
  ];

  const VALID_EVENT_NAMES_WITH_RESTRICTIONS = [
    'a1b',
    'abc',
    'event',
    'event1',
    'event_1',
    'event-1',
    'event_name',
    'event-name',
    'event_name-1',
    'event-1_name',
    'a1_b2-c3',
    'Event123',
    'A1B2C3',
    'eventA1',
    'a_b',
    'a-b',
    'abc_def-ghi',
    'event_123_test',
    'test-event-1',
    'event1_test2',
    'abc123def',
    'A1_B2-C3',
    'eventA_B-C123',
  ];

  beforeAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    jest.resetAllMocks();

    globalThis.fetch = mockFetch.mockResolvedValue({
      ok: true,
    } as Response);
  });

  test.each([
    ...INVALID_EVENT_NAMES_WITH_RESTRICTIONS.map((value) => value[1]),
    ...VALID_EVENT_NAMES_WITH_RESTRICTIONS,
  ])(
    "when the enforceEventNameRestrictions flag is false and the provided event name is '%s', it should log the event successfully",
    async (inputEventName: string) => {
      mockGetApplication.mockReturnValue({
        ...DEFAULT_ACTITO_APPLICATION,
        enforceEventNameRestrictions: false,
      });

      const { logCustom } = await import('~/public-api-events');
      await logCustom(inputEventName);

      const [, expectedOptions] = mockFetch.mock.calls[0];

      // @ts-expect-error check if the event is sent as expected
      expect(JSON.parse(expectedOptions.body)).toMatchObject({
        type: `re.notifica.event.custom.${inputEventName}`,
        timestamp: expect.any(Number),
      });
    },
  );

  test.each(VALID_EVENT_NAMES_WITH_RESTRICTIONS)(
    "when the enforceEventNameRestrictions flag is true and the event name is valid ('%s'), it should log the event successfully",
    async (inputEventName: string) => {
      mockGetApplication.mockReturnValue({
        ...DEFAULT_ACTITO_APPLICATION,
        enforceEventNameRestrictions: true,
      });

      const { logCustom } = await import('~/public-api-events');
      await logCustom(inputEventName);

      const [, expectedOptions] = mockFetch.mock.calls[0];

      // @ts-expect-error check if the event is sent as expected
      expect(JSON.parse(expectedOptions.body)).toMatchObject({
        type: `re.notifica.event.custom.${inputEventName}`,
        timestamp: expect.any(Number),
      });
    },
  );

  test.each(INVALID_EVENT_NAMES_WITH_RESTRICTIONS)(
    "when the enforceEventNameRestrictions flag is true and the provided event name is invalid (%s: '%s'), it should throw an error",
    async (_, inputEventName: string) => {
      expect.assertions(1);

      mockGetApplication.mockReturnValue({
        ...DEFAULT_ACTITO_APPLICATION,
        enforceEventNameRestrictions: true,
      });

      const { logCustom } = await import('~/public-api-events');

      try {
        await logCustom(inputEventName);
      } catch (error) {
        expect(error?.constructor.name).toBe('ActitoInvalidArgumentError');
      }
    },
  );

  test('when the enforceSizeLimit flag is true and the provided event data size is valid, it should log the event successfully', async () => {
    mockGetApplication.mockReturnValue({
      ...DEFAULT_ACTITO_APPLICATION,
      enforceSizeLimit: true,
    });

    const inputEventName = 'test-event';
    const inputEventData: Record<string, unknown> = {
      field1: 'string',
      field2: 1000,
      field3: [1, 2, 3],
      field4: {
        data: 'string',
      },
    };

    const { logCustom } = await import('~/public-api-events');
    await logCustom(inputEventName, inputEventData);

    const [, expectedOptions] = mockFetch.mock.calls[0];

    // @ts-expect-error check if the event data is sent as expected
    expect(JSON.parse(expectedOptions.body)).toMatchObject({
      type: `re.notifica.event.custom.${inputEventName}`,
      timestamp: expect.any(Number),
      data: {
        field1: 'string',
        field2: 1000,
        field3: [1, 2, 3],
        field4: {
          data: 'string',
        },
      },
    });
  });

  test('when the enforceSizeLimit flag is true and the provided event data is too large, it should throw an error', async () => {
    expect.assertions(1);

    mockGetApplication.mockReturnValue({
      ...DEFAULT_ACTITO_APPLICATION,
      enforceSizeLimit: true,
    });

    const inputEventName = 'test-event';
    const inputEventData: Record<string, unknown> = { data: 'a'.repeat(2038) }; // 2049 bytes size

    const { logCustom } = await import('~/public-api-events');

    try {
      await logCustom(inputEventName, inputEventData);
    } catch (error) {
      expect(error?.constructor.name).toBe('ActitoContentTooLargeError');
    }
  });

  test.each([
    { data: 'a'.repeat(2038) }, // 2049 bytes size
    {
      field1: 'string',
      field2: 1000,
      field3: [1, 2, 3],
      field4: {
        data: 'string',
      },
    },
  ])(
    'when the enforceSizeLimit flag is false, it should accept any event data size and log the event successfully',
    async (inputEventData: Record<string, unknown>) => {
      mockGetApplication.mockReturnValue({
        ...DEFAULT_ACTITO_APPLICATION,
        enforceSizeLimit: false,
      });

      const inputEventName = 'test-event';

      const { logCustom } = await import('~/public-api-events');
      await logCustom(inputEventName, inputEventData);

      const [, expectedOptions] = mockFetch.mock.calls[0];

      // @ts-expect-error check if the event data is sent as expected
      expect(JSON.parse(expectedOptions.body)).toMatchObject({
        type: `re.notifica.event.custom.${inputEventName}`,
        timestamp: expect.any(Number),
        data: inputEventData,
      });
    },
  );

  test('when both enforceEventNameRestrictions and enforceSizeLimit flags are true and both event name and data are valid, it should log the event successfully', async () => {
    mockGetApplication.mockReturnValue({
      ...DEFAULT_ACTITO_APPLICATION,
      enforceEventNameRestrictions: true,
      enforceSizeLimit: true,
    });

    const inputEventName = 'test-event';
    const inputEventData: Record<string, unknown> = {
      field1: 'string',
      field2: 1000,
      field3: [1, 2, 3],
      field4: {
        data: 'string',
      },
    };

    const { logCustom } = await import('~/public-api-events');
    await logCustom(inputEventName, inputEventData);

    const [, expectedOptions] = mockFetch.mock.calls[0];

    // @ts-expect-error check if the event data is sent as expected
    expect(JSON.parse(expectedOptions.body)).toMatchObject({
      type: `re.notifica.event.custom.${inputEventName}`,
      timestamp: expect.any(Number),
      data: {
        field1: 'string',
        field2: 1000,
        field3: [1, 2, 3],
        field4: {
          data: 'string',
        },
      },
    });
  });
});
