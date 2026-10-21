import type { ActitoNotification } from '@actito/web-core';
import { describe, test, expect } from '@jest/globals';
import { DEFAULT_ACTITO_NOTIFICATION } from '../../../../../stubs';
import { createWebViewContent } from '~/internal/ui/notifications/content/webview';

describe('test createWebViewContent', () => {
  test('when a notification with a valid HTML content is provided, it should render an iframe with srcdoc containing the structured HTML template and the expected content data', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.WebView',
      content: [
        {
          type: 're.notifica.content.HTML',
          data: '<h1>Hello World</h1><p>This is a notification</p>',
        },
      ],
    };

    // Check the main iframe
    const output = await createWebViewContent(input);
    expect(output.tagName).toBe('IFRAME');
    expect(output.classList.contains('actito__notification-webview-iframe')).toBe(true);

    // Check if the content is correct
    const outputSrcdocValue = output.getAttribute('srcdoc');
    expect(outputSrcdocValue).not.toBeNull();
    expect(outputSrcdocValue).toContain('<!DOCTYPE html><html><head><title></title>');
    expect(outputSrcdocValue).toContain(
      'meta name="viewport" content="width=device-width, maximum-scale=1, initial-scale=1, user-scalable=0"',
    );
    expect(outputSrcdocValue).toContain(`<body>${input.content[0].data}</body>`);
  });

  test('when a notification without HTML content is provided, it should throw an error', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.WebView',
      content: [
        {
          type: 're.notifica.content.URL',
          data: 'https://example.com',
        },
      ],
    };

    await expect(createWebViewContent(input)).rejects.toThrow(
      `Invalid content for notification '${input.type}'.`,
    );
  });

  test('when a notification with no content is provided, it should throw an error', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.WebView',
      content: [],
    };

    await expect(createWebViewContent(input)).rejects.toThrow(
      `Invalid content for notification '${input.type}'.`,
    );
  });
});
