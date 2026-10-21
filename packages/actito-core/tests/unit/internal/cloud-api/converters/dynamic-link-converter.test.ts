import type { CloudDynamicLink } from '@actito/web-cloud-api';
import { describe, expect, test } from '@jest/globals';
import { convertCloudDynamicLinkToPublic } from '~/internal/cloud-api/converters/dynamic-link-converter';
import type { ActitoDynamicLink } from '~/models/actito-dynamic-link';

describe('test convertCloudDynamicLinkToPublic', () => {
  test('when a CloudDynamicLink object is provided, it converts it into an ActitoDynamicLink object as expected', () => {
    const input: CloudDynamicLink = {
      target: 'https://my-domain.com/example',
    };

    const expectedOutput: ActitoDynamicLink = {
      target: 'https://my-domain.com/example',
    };

    expect(convertCloudDynamicLinkToPublic(input)).toStrictEqual(expectedOutput);
  });
});
