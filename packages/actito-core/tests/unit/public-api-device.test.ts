import { beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import * as originalLaunchStateModule from '~/internal/launch-state';
import * as originalOptionsModule from '~/internal/options';
import * as originalLocalStorageModule from '~/internal/storage/local-storage';
import type { ActitoApplication } from '~/models/actito-application';

describe('test addTags', () => {
  // MOCKS
  const mockGetStoredApplication = jest.fn();
  const mockGetStoredDevice = jest.fn();
  const mockFetch = jest.fn<typeof fetch>();

  jest.unstable_mockModule('~/internal/storage/local-storage', () => ({
    ...originalLocalStorageModule,
    getStoredApplication: mockGetStoredApplication,
    getStoredDevice: mockGetStoredDevice,
  }));

  jest.unstable_mockModule('~/internal/launch-state', () => ({
    ...originalLaunchStateModule,
    isReady: () => true,
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

  const INVALID_TAG_NAMES_WITH_RESTRICTIONS = [
    ["starts with '-'", '-tag'],
    ["starts with '_'", '_tag'],
    ['starts with a space', ' tag'],
    ["ends with '-'", 'tag-'],
    ["ends with '_'", 'tag_'],
    ["has invalid character '!'", 'tag!'],
    ["has invalid character '@'", 'tag@abc'],
    ["has invalid character '.'", 'tag.abc'],
    ['has a space', 'tag abc'],
    ['contains accents', 'ábcdfg'],
    ['contains emoji', '🔥tag'],
    ['does not respect the minimum size', 'ab'],
    [
      'does not respect the maximum size',
      'aaaaaaaaaabbbbbbbbbbccccccccccddddddddddeeeeeeeeeeffffffffffggggg',
    ],
  ];

  const VALID_TAG_NAMES_WITH_RESTRICTIONS = [
    'a1b',
    'tag',
    'tag1',
    'tag_1',
    'tag-1',
    'tag_name',
    'tag-name',
    'tag_name-1',
    'tag-1_name',
    'a1_b2-c3',
    'Tag123',
    'A1B2C3',
    'a_b',
    'a-b',
    'abc_def-ghi',
    'tag_123_test',
    'test-tag-1',
    'tag1_test2',
    'abc123def',
    'A1_B2-C3',
    'tagA_B-C123',
  ];

  beforeAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    jest.resetAllMocks();

    // Default mocks
    mockGetStoredDevice.mockReturnValue({ id: '123' });
    globalThis.fetch = mockFetch.mockResolvedValue({
      ok: true,
    } as Response);
  });

  test('when the enforceTagRestrictions flag is false and a set of tags is provided, it should add them successfully', async () => {
    mockGetStoredApplication.mockReturnValue({
      ...DEFAULT_ACTITO_APPLICATION,
      enforceTagRestrictions: false,
    });

    const input = [
      ...INVALID_TAG_NAMES_WITH_RESTRICTIONS.map((value) => value[1]),
      ...VALID_TAG_NAMES_WITH_RESTRICTIONS,
    ];

    const { addTags } = await import('~/public-api-device');
    await addTags(input);

    const [, expectedOptions] = mockFetch.mock.calls[0];

    // @ts-expect-error check if the tags are sent as expected
    expect(JSON.parse(expectedOptions.body)).toStrictEqual({
      tags: input,
    });
  });

  test.each([
    ...INVALID_TAG_NAMES_WITH_RESTRICTIONS.map((value) => value[1]),
    ...VALID_TAG_NAMES_WITH_RESTRICTIONS,
  ])(
    "when the enforceTagRestrictions flag is false and the provided tag is '%s', it should add it successfully",
    async (input: string) => {
      mockGetStoredApplication.mockReturnValue({
        ...DEFAULT_ACTITO_APPLICATION,
        enforceTagRestrictions: false,
      });

      const { addTags } = await import('~/public-api-device');
      await addTags([input]);

      const [, expectedOptions] = mockFetch.mock.calls[0];

      // @ts-expect-error check if the tags are sent as expected
      expect(JSON.parse(expectedOptions.body)).toStrictEqual({
        tags: [input],
      });
    },
  );

  test.each(INVALID_TAG_NAMES_WITH_RESTRICTIONS)(
    "when the enforceTagRestrictions flag is true and the provided tag is invalid (%s: '%s'), it should throw an error",
    async (_, input: string) => {
      mockGetStoredApplication.mockReturnValue({
        ...DEFAULT_ACTITO_APPLICATION,
        enforceTagRestrictions: true,
      });

      const { addTags } = await import('~/public-api-device');

      try {
        await addTags([input]);
      } catch (error) {
        expect(error?.constructor.name).toBe('ActitoInvalidArgumentError');
      }
    },
  );

  test.each(VALID_TAG_NAMES_WITH_RESTRICTIONS)(
    "when the enforceTagRestrictions flag is true and the provided tag is valid ('%s'), it should add it successfully",
    async (input: string) => {
      mockGetStoredApplication.mockReturnValue({
        ...DEFAULT_ACTITO_APPLICATION,
        enforceTagRestrictions: true,
      });

      const { addTags } = await import('~/public-api-device');
      await addTags([input]);

      const [, expectedOptions] = mockFetch.mock.calls[0];

      // @ts-expect-error check if the tags are sent as expected
      expect(JSON.parse(expectedOptions.body)).toStrictEqual({
        tags: [input],
      });
    },
  );

  test('when the device is not available, it should throw an error', async () => {
    mockGetStoredApplication.mockReturnValue(DEFAULT_ACTITO_APPLICATION);
    mockGetStoredApplication.mockReturnValue(undefined);

    const input = 'tag-test';

    const { addTags } = await import('~/public-api-device');

    try {
      await addTags([input]);
    } catch (error) {
      expect(error?.constructor.name).toBe('ActitoDeviceUnavailableError');
    }
  });
});
