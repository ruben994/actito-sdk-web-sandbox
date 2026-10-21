import type { ActitoNotification } from '@actito/web-core';
import { describe, test, expect } from '@jest/globals';
import { DEFAULT_ACTITO_NOTIFICATION } from '../../../../../stubs';
import { createImageContent } from '~/internal/ui/notifications/content/image';

describe('test createImageContent', () => {
  test.each([
    ['re.notifica.content.JPEG', 'https://example.com/photo.jpeg'],
    ['re.notifica.content.JPG', 'https://example.com/photo.jpg'],
    ['re.notifica.content.PNG', 'https://example.com/photo.png'],
    ['re.notifica.content.GIF', 'https://example.com/photo.gif'],
  ])(
    'when a notification with a single valid image content is provided, it should return a DIV container with the image as expected',
    async (inputContentType, inputContentData) => {
      const input: ActitoNotification = {
        ...DEFAULT_ACTITO_NOTIFICATION,
        type: 're.notifica.notification.Image',
        content: [
          {
            type: inputContentType,
            data: inputContentData,
          },
        ],
      };

      const output = await createImageContent(input);

      // Check the main container
      expect(output.tagName).toBe('DIV');
      expect(output.classList.contains('actito__notification-image-slider')).toBe(true);

      // Check if there is only one image
      const outputImageItems = output.querySelectorAll('.actito__notification-image-slider-item');
      expect(outputImageItems).toHaveLength(1);

      // Check if the image source is correct
      const outputImage = outputImageItems[0].querySelector(
        'img.actito__notification-image-slider-image',
      );
      expect(outputImage).not.toBeNull();
      expect(outputImage?.getAttribute('src')).toBe(inputContentData);
    },
  );

  test('when a notification with multiple valid image contents is provided, it should include those images as expected', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Image',
      content: [
        { type: 're.notifica.content.JPEG', data: 'https://example.com/1.jpeg' },
        { type: 're.notifica.content.JPG', data: 'https://example.com/2.jpg' },
        { type: 're.notifica.content.PNG', data: 'https://example.com/3.png' },
        { type: 're.notifica.content.GIF', data: 'https://example.com/4.gif' },
      ],
    };

    const output = await createImageContent(input);

    const outputImageItems = output.querySelectorAll('.actito__notification-image-slider-image');

    expect(outputImageItems).toHaveLength(4);
    expect(outputImageItems[0].getAttribute('src')).toBe('https://example.com/1.jpeg');
    expect(outputImageItems[1].getAttribute('src')).toBe('https://example.com/2.jpg');
    expect(outputImageItems[2].getAttribute('src')).toBe('https://example.com/3.png');
    expect(outputImageItems[3].getAttribute('src')).toBe('https://example.com/4.gif');
  });

  test('when a notification with both image and non-image contents is provided, it should include the image content only', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Image',
      content: [
        { type: 're.notifica.content.Text', data: 'Some text' }, // invalid
        { type: 're.notifica.content.PNG', data: 'https://example.com/valid.png' }, // valid
      ],
    };

    const output = await createImageContent(input);

    // Check if there is only one image
    const outputImageItems = output.querySelectorAll('.actito__notification-image-slider-item');
    expect(outputImageItems).toHaveLength(1);

    // Check if the image source is correct
    const outputImage = output.querySelector('.actito__notification-image-slider-image');
    expect(outputImage?.getAttribute('src')).toBe(input.content[1].data);
  });

  test('when a notification without image content is provided, it should throw an error', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Image',
      content: [
        { type: 're.notifica.content.Vimeo', data: '12345' },
        { type: 're.notifica.content.Text', data: 'Some text' },
      ],
    };

    await expect(createImageContent(input)).rejects.toThrow(
      `Invalid content for notification '${input.type}'.`,
    );
  });

  test('when a notification with no content is provided, it should throw an error', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Image',
      content: [],
    };

    await expect(createImageContent(input)).rejects.toThrow(
      `Invalid content for notification '${input.type}'.`,
    );
  });
});
