import type { ActitoNotification } from '@actito/web-core';
import { describe, test, expect } from '@jest/globals';
import { DEFAULT_ACTITO_NOTIFICATION } from '../../../../../stubs';
import { createVideoContent } from '~/internal/ui/notifications/content/video';

describe('test createVideoContent', () => {
  test('when a notification with a YouTube video content is provided, it should render a YouTube iframe with the expected attributes', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Video',
      content: [
        {
          type: 're.notifica.content.YouTube',
          data: 'dQw4w9WgXcQ',
        },
      ],
    };

    const output = await createVideoContent(input);

    expect(output.tagName).toBe('IFRAME');
    expect(output.classList.contains('actito__notification-video-iframe')).toBe(true);
    expect(output.getAttribute('src')).toBe(
      `https://www.youtube-nocookie.com/embed/${input.content[0].data}?autoplay=1&rel=0`,
    );
    expect(output.hasAttribute('allowfullscreen')).toBe(true);
  });

  test('when a notification with a Vimeo video content is provided, it should render a Vimeo iframe with the expected attributes', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Video',
      content: [
        {
          type: 're.notifica.content.Vimeo',
          data: '76979871',
        },
      ],
    };

    const output = await createVideoContent(input);

    expect(output.tagName).toBe('IFRAME');
    expect(output.classList.contains('actito__notification-video-iframe')).toBe(true);
    expect(output.getAttribute('src')).toBe(
      `https://player.vimeo.com/video/${input.content[0].data}?autoplay=1`,
    );
    expect(output.hasAttribute('allowfullscreen')).toBe(true);
  });

  test('when a notification with an HTML5 video content is provided, it should render a video element with the expected source element', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Video',
      content: [
        {
          type: 're.notifica.content.HTML5Video',
          data: 'https://example.com/movie.mp4',
        },
      ],
    };

    // Check the main structure and properties
    const output = await createVideoContent(input);
    expect(output.tagName).toBe('VIDEO');
    expect(output.classList.contains('actito__notification-video')).toBe(true);
    expect(output.hasAttribute('autoplay')).toBe(true);
    expect(output.hasAttribute('controls')).toBe(true);
    expect(output.hasAttribute('preload')).toBe(true);

    // Check if the video source and type are correct
    const outputSource = output.querySelector('source');
    expect(outputSource).not.toBeNull();
    expect(outputSource?.getAttribute('src')).toBe(input.content[0].data);
    expect(outputSource?.getAttribute('type')).toBe('video/mp4');
  });

  test('when a notification without video content is provided, it should throw an error', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Video',
      content: [
        {
          type: 're.notifica.content.URL',
          data: 'https://example.com/some-page',
        },
      ],
    };

    await expect(createVideoContent(input)).rejects.toThrow(
      `Invalid content for notification '${input.type}'.`,
    );
  });

  test('when a notification with no content is provided, it should throw an error', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Video',
      content: [],
    };

    await expect(createVideoContent(input)).rejects.toThrow(
      `Invalid content for notification '${input.type}'.`,
    );
  });
});
