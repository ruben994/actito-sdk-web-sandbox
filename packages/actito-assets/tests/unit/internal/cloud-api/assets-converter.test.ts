import type { CloudAsset } from '@actito/web-cloud-api';
import { describe, expect, test } from '@jest/globals';
import { convertCloudAssetToPublic } from '~/internal/cloud-api/assets-converter';
import type { ActitoAsset } from '~/models/actito-asset';

describe('test convertCloudAssetToPublic', () => {
  const MINIMAL_CLOUD_ASSET: CloudAsset = {
    _id: '1d9e80ef851d212aca82cf23',
    title: 'Screen Shot 2026-04-21 at 12.30.45.png',
  };

  const MINIMAL_ACTITO_ASSET: ActitoAsset = {
    id: '1d9e80ef851d212aca82cf23',
    title: 'Screen Shot 2026-04-21 at 12.30.45.png',
    description: undefined,
    key: undefined,
    url: undefined,
    button: undefined,
    metaData: undefined,
    extra: {},
  };

  test('when a full CloudAsset object is provided, it converts it into an ActitoAsset object as expected', () => {
    const input: CloudAsset = {
      _id: '1d9e80ef851d212aca82cf23',
      title: 'Screen Shot 2026-04-21 at 12.30.45.png',
      description: 'A screen shot',
      key: '3d99d18148e6f3dbcf4ff891c9a0ff63b0311feccc7b9d0c8c79fee9b4dde19/e457c97c76bc41ff524af3697cc5236cc06fd982a83f983046fff68ea56b1b6',
      button: {
        label: 'Test button',
        action: 'testAction',
      },
      metaData: {
        originalFileName: 'Screenshot_2026-04-21-12-30-45.png',
        contentType: 'image/png',
        contentLength: 59609,
      },
      extra: {
        key1: 'value1',
        key2: 5,
      },
    };

    const expectedOutput: ActitoAsset = {
      id: '1d9e80ef851d212aca82cf23',
      title: 'Screen Shot 2026-04-21 at 12.30.45.png',
      description: 'A screen shot',
      key: '3d99d18148e6f3dbcf4ff891c9a0ff63b0311feccc7b9d0c8c79fee9b4dde19/e457c97c76bc41ff524af3697cc5236cc06fd982a83f983046fff68ea56b1b6',
      url: undefined,
      button: {
        label: 'Test button',
        action: 'testAction',
      },
      metaData: {
        originalFileName: 'Screenshot_2026-04-21-12-30-45.png',
        contentType: 'image/png',
        contentLength: 59609,
      },
      extra: {
        key1: 'value1',
        key2: 5,
      },
    };

    expect(convertCloudAssetToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when a minimal CloudAsset object is provided, it includes the optional fields in the final ActitoAsset object as expected', () => {
    const input = MINIMAL_CLOUD_ASSET;
    const expectedOutput = MINIMAL_ACTITO_ASSET;

    expect(convertCloudAssetToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when there is a button without a label and an action, it sets is as undefined in the final object', () => {
    const input: CloudAsset = {
      ...MINIMAL_CLOUD_ASSET,
      button: {
        label: undefined,
        action: undefined,
      },
    };

    const expectedOutput: ActitoAsset = {
      ...MINIMAL_ACTITO_ASSET,
      button: undefined,
    };

    expect(convertCloudAssetToPublic(input)).toStrictEqual(expectedOutput);
  });
});
