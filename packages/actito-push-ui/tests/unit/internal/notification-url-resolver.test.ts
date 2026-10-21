import type { ActitoNotification, ActitoNotificationContent } from '@actito/web-core';
import { describe, expect, test } from '@jest/globals';
import { resolveUrl, UrlResolverResult } from '~/internal/notification-url-resolver';

describe('test resolveUrl', () => {
  const MINIMAL_ACTITO_NOTIFICATION: ActitoNotification = {
    id: '1d9e80ef851d212aca82cf23',
    partial: false,
    type: 're.notifica.notification.URLResolver',
    time: '2026-04-28T15:30:20Z',
    title: undefined,
    subtitle: undefined,
    message: 'Message',
    content: [],
    actions: [],
    attachments: [],
    extra: {},
  };

  test.each([
    {
      type: 're.notifica.content.URL',
      data: 1,
    },
    {
      type: 're.notifica.content.URL',
      data: '',
    },
    { type: 're.notifica.content.URL', data: 'invalid-url' },
  ])(
    'when the provided notification does not have a valid content, it should resolve it as None type notification',
    (content: ActitoNotificationContent) => {
      const input: ActitoNotification = {
        ...MINIMAL_ACTITO_NOTIFICATION,
        content: [content],
      };

      const expectedOutput = UrlResolverResult.NONE;

      expect(resolveUrl(input)).toStrictEqual(expectedOutput);
    },
  );

  test.each(['http://my-domain.com/page', 'https://my-domain.com/page'])(
    'when the content data is an HTTP/HTTPS URL (%s), it should resolve it as an In-app Browser type notification',
    (url) => {
      const input: ActitoNotification = {
        ...MINIMAL_ACTITO_NOTIFICATION,
        content: [
          {
            type: 're.notifica.content.URL',
            data: url,
          },
        ],
      };

      const expectedOutput = UrlResolverResult.IN_APP_BROWSER;

      expect(resolveUrl(input)).toStrictEqual(expectedOutput);
    },
  );

  test.each([
    'http://my-domain.com?notificareWebView=1',
    'https://my-domain.com?notificareWebView=1',
  ])(
    'when the content data is an HTTP/HTTPS URL with notificareWebView=1 query parameter (%s), it should resolve it as an Web View type notification',
    (url) => {
      const input: ActitoNotification = {
        ...MINIMAL_ACTITO_NOTIFICATION,
        content: [
          {
            type: 're.notifica.content.URL',
            data: url,
          },
        ],
      };

      const expectedOutput = UrlResolverResult.WEB_VIEW;

      expect(resolveUrl(input)).toStrictEqual(expectedOutput);
    },
  );

  test("when the content data is a relative URL (starts with '/'), it should resolve it as an In-app Browser type notification", () => {
    const input: ActitoNotification = {
      ...MINIMAL_ACTITO_NOTIFICATION,
      content: [
        {
          type: 're.notifica.content.URL',
          data: '/example',
        },
      ],
    };

    const expectedOutput = UrlResolverResult.IN_APP_BROWSER;

    expect(resolveUrl(input)).toStrictEqual(expectedOutput);
  });

  test('when the content data is a custom URL Scheme, it should resolve it as an URL Scheme type notification', () => {
    const input: ActitoNotification = {
      ...MINIMAL_ACTITO_NOTIFICATION,
      content: [
        {
          type: 're.notifica.content.URL',
          data: 'com.domain://domain.com',
        },
      ],
    };

    const expectedOutput = UrlResolverResult.URL_SCHEME;

    expect(resolveUrl(input)).toStrictEqual(expectedOutput);
  });

  test("when the content data is a Dynamic Link (URL whose host ends with 'ntc.re'), it should resolve it as an URL Scheme type notification", () => {
    const input: ActitoNotification = {
      ...MINIMAL_ACTITO_NOTIFICATION,
      content: [
        {
          type: 're.notifica.content.URL',
          data: 'https://ntc.re',
        },
      ],
    };

    const expectedOutput = UrlResolverResult.URL_SCHEME;

    expect(resolveUrl(input)).toStrictEqual(expectedOutput);
  });
});
