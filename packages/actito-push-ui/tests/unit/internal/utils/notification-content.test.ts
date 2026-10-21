import type { ActitoNotificationContent } from '@actito/web-core';
import { describe, expect, test } from '@jest/globals';
import { sanitizeContentUrl } from '~/internal/utils/notification-content';

describe('test sanitizeContentUrl', () => {
  test.each([
    ['undefined', undefined],
    ['empty string', ''],
    ['only blank spaces', '   '],
  ])("when the content data is missing or it's empty (%s), it should return '/'", (_, data) => {
    const input: ActitoNotificationContent = {
      type: 're.notifica.content.URL',
      data: data,
    };
    const expectedOutput = '/';

    expect(sanitizeContentUrl(input)).toBe(expectedOutput);
  });

  test.each([
    ['https://example.com/page', 'https://example.com/page'],
    ['https://example.com/page?notificareWebView=true', 'https://example.com/page'],
    [
      'https://example.com/page?notificareWebView=1&campaign=spring',
      'https://example.com/page?campaign=spring',
    ],
    [
      'https://example.com/?utm_source=app&notificareWebView=1&utm_medium=push',
      'https://example.com/?utm_source=app&utm_medium=push',
    ],
    ['    https://example.com/with-spaces   ', 'https://example.com/with-spaces'],
  ])("when the URL is valid and it is '%s', it should return '%s'", (data, expectedOutput) => {
    const input: ActitoNotificationContent = {
      type: 're.notifica.content.URL',
      data: data,
    };
    expect(sanitizeContentUrl(input)).toBe(expectedOutput);
  });

  test.each([
    ['/just-a-relative-url', '/just-a-relative-url'],
    ['not-a-url', 'not-a-url'],
    ['  /relative-url-with-spaces  ', '/relative-url-with-spaces'],
  ])(
    "when the URL is invalid ('%s'), it only applies a trim to the original value and returns it",
    (data, expectedOutput) => {
      const input: ActitoNotificationContent = {
        type: 're.notifica.content.URL',
        data: data,
      };
      expect(sanitizeContentUrl(input)).toBe(expectedOutput);
    },
  );
});
