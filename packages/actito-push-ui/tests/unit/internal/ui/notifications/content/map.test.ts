import type { ActitoNotification } from '@actito/web-core';
import { describe, test, expect } from '@jest/globals';
import { DEFAULT_ACTITO_NOTIFICATION } from '../../../../../stubs';
import { createMapContent } from '~/internal/ui/notifications/content/map';

describe('test createMapContent', () => {
  test.each([
    ['re.notifica.content.JPEG', 'https://example.com/photo.jpeg'],
    ['re.notifica.content.Text', 'Some text'],
  ])(
    'when a notification without valid content is provided (no Marker content), it should throw an error',
    async (inputContentType, inputContentData) => {
      const input: ActitoNotification = {
        ...DEFAULT_ACTITO_NOTIFICATION,
        type: 're.notifica.notification.Map',
        content: [
          {
            type: inputContentType,
            data: inputContentData,
          },
        ],
      };

      await expect(createMapContent(input)).rejects.toThrow(
        `Invalid content for notification '${input.type}'.`,
      );
    },
  );
});
