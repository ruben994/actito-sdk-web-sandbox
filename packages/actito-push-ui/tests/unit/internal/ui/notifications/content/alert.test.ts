import type { ActitoNotification } from '@actito/web-core';
import { describe, expect, test } from '@jest/globals';
import { DEFAULT_ACTITO_NOTIFICATION } from '../../../../../stubs';
import { createAlertContent } from '~/internal/ui/notifications/content/alert';

describe('test createAlertContent', () => {
  test('it should create a DIV container with the notification message and the expected CSS classes', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Alert',
      message: 'Test message',
    };

    const output = await createAlertContent(input);

    // Check the main container
    expect(output).toBeInstanceOf(HTMLDivElement);
    expect(output.classList.contains('actito__notification-alert')).toBe(true);

    // Check the message
    const outputMessage = output.querySelector('.actito__notification-alert-message');
    expect(outputMessage).toBeTruthy();
    expect(outputMessage?.innerHTML).toBe(input.message);
  });

  test('when a notification with a title and a subtitle is provided, it should include both title and subtitle elements as expected', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Alert',
      title: 'Test title',
      subtitle: 'Test subtitle',
    };

    const output = await createAlertContent(input);

    // Check the title
    const outputTitle = output.querySelector('.actito__notification-alert-title');
    expect(outputTitle?.innerHTML).toBe(input.title);

    // Check the subtitle
    const outputSubtitle = output.querySelector('.actito__notification-content-subtitle');
    expect(outputSubtitle?.innerHTML).toBe(input.subtitle);
  });

  test('when a notification without title and subtitle is provided, it should not include both title and subtitle elements', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Alert',
      title: undefined,
      subtitle: undefined,
    };

    const output = await createAlertContent(input);

    expect(output.querySelector('.actito__notification-alert-title')).toBeNull();
    expect(output.querySelector('.actito__notification-content-subtitle')).toBeNull();
  });

  test.each([
    ['https://example.com/banner.png', 'image/png'],
    ['https://example.com/image.jpeg', 'image/jpeg'],
    ['https://example.com/some-gif.gif', 'image/gif'],
  ])(
    'when a notification with a valid image attachment is provided, it should include the attachment as expected',
    async (inputURI, inputMimeType) => {
      const input: ActitoNotification = {
        ...DEFAULT_ACTITO_NOTIFICATION,
        type: 're.notifica.notification.Alert',
        attachments: [{ uri: inputURI, mimeType: inputMimeType }],
      };

      const output = await createAlertContent(input);

      const outputAttachment = output.querySelector('.actito__notification-alert-attachment');

      expect(outputAttachment).toBeTruthy();
      expect(outputAttachment?.tagName).toBe('IMG');
      expect(outputAttachment?.getAttribute('src')).toBe(inputURI);
    },
  );

  test.each([
    ['https://example.com/document.pdf', 'application/pdf'],
    ['https://example.com/song.mp3', 'audio/mpeg'],
  ])(
    'when a notification with an invalid attachment is provided, it should not include the attachment',
    async (inputURI, inputMimeType) => {
      const input: ActitoNotification = {
        ...DEFAULT_ACTITO_NOTIFICATION,
        type: 're.notifica.notification.Alert',
        attachments: [{ uri: inputURI, mimeType: inputMimeType }],
      };

      const output = await createAlertContent(input);

      const outputAttachment = output.querySelector('.actito__notification-alert-attachment');

      expect(outputAttachment).toBeNull();
    },
  );
});
