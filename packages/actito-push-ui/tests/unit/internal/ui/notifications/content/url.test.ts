import type { ActitoNotification } from '@actito/web-core';
import { describe, expect, test } from '@jest/globals';
import { DEFAULT_ACTITO_NOTIFICATION } from '../../../../../stubs';
import { createUrlContent } from '~/internal/ui/notifications/content/url';

describe('test createUrlContent', () => {
  test('when a notification has a valid URL content, it should render an iframe with the sanitized URL as expected', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.URL',
      content: [
        {
          type: 're.notifica.content.URL',
          data: 'https://example.com/some-page',
        },
      ],
    };

    const output = await createUrlContent(input);

    expect(output.tagName).toBe('IFRAME');
    expect(output.classList.contains('actito__notification-url-iframe')).toBe(true);
    expect(output.getAttribute('src')).toBe('https://example.com/some-page');
  });

  test('when a notification without URL content is provided, it should throw an error', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.URL',
      content: [
        {
          type: 're.notifica.content.PNG',
          data: 'https://example.com/some-image.png',
        },
      ],
    };

    await expect(createUrlContent(input)).rejects.toThrow(
      `Invalid content for notification '${input.type}'.`,
    );
  });

  test('when a notification with no content is provided, it should throw an error', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.URL',
      content: [],
    };

    await expect(createUrlContent(input)).rejects.toThrow(
      `Invalid content for notification '${input.type}'.`,
    );
  });
});
