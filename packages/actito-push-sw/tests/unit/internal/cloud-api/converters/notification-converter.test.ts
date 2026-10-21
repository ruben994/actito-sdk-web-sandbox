import type { CloudNotification } from '@actito/web-cloud-api';
import type { ActitoNotification } from '@actito/web-core';
import { describe, expect, test } from '@jest/globals';
import { convertCloudNotificationToPublic } from '~/internal/cloud-api/converters/notification-converter';

describe('test convertCloudApplicationToPublic', () => {
  const MINIMAL_CLOUD_NOTIFICATION: CloudNotification = {
    _id: '1d9e80ef851d212aca82cf23',
    type: 're.notifica.notification.WebView',
    time: '2026-04-28T15:30:20Z',
    message: 'Message',
  };

  const MINIMAL_ACTITO_NOTIFICATION: ActitoNotification = {
    id: '1d9e80ef851d212aca82cf23',
    partial: false,
    type: 're.notifica.notification.WebView',
    time: '2026-04-28T15:30:20Z',
    title: undefined,
    subtitle: undefined,
    message: 'Message',
    content: [],
    actions: [],
    attachments: [],
    extra: {},
  };

  test('when a full CloudNotification object is provided, it converts it into an ActitoNotification object as expected', () => {
    const input: CloudNotification = {
      _id: '1d9e80ef851d212aca82cf23',
      partial: false,
      type: 're.notifica.notification.WebView',
      time: '2026-04-28T15:30:20Z',
      title: 'Title',
      subtitle: 'Subtitle',
      message: 'Message',
      content: [
        {
          type: 're.notifica.content.HTML',
          data: '<h1>Hello</h1>',
        },
      ],
      actions: [
        {
          _id: '7c3a19b4f0d62e8c9a5d11f2',
          type: 're.notifica.action.Callback',
          label: 'Yes',
          target: 'http://example.com',
          keyboard: false,
          camera: false,
        },
      ],
      attachments: [
        {
          mimeType: 'image/jpeg',
          uri: 'https://domain.com/image',
        },
      ],
      extra: {
        key1: 'value1',
        key2: true,
      },
    };

    const expectedOutput: ActitoNotification = {
      id: '1d9e80ef851d212aca82cf23',
      partial: false,
      type: 're.notifica.notification.WebView',
      time: '2026-04-28T15:30:20Z',
      title: 'Title',
      subtitle: 'Subtitle',
      message: 'Message',
      content: [
        {
          type: 're.notifica.content.HTML',
          data: '<h1>Hello</h1>',
        },
      ],
      actions: [
        {
          id: '7c3a19b4f0d62e8c9a5d11f2',
          type: 're.notifica.action.Callback',
          label: 'Yes',
          target: 'http://example.com',
          keyboard: false,
          camera: false,
        },
      ],
      attachments: [
        {
          mimeType: 'image/jpeg',
          uri: 'https://domain.com/image',
        },
      ],
      extra: {
        key1: 'value1',
        key2: true,
      },
    };

    expect(convertCloudNotificationToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when a minimal CloudNotification object is provided, it includes the optional fields in the final ActitoNotification object as expected', () => {
    const input = MINIMAL_CLOUD_NOTIFICATION;
    const expectedOutput = MINIMAL_ACTITO_NOTIFICATION;

    expect(convertCloudNotificationToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when an action does not have a label, it is set as undefined in the final object', () => {
    const input: CloudNotification = {
      ...MINIMAL_CLOUD_NOTIFICATION,
      actions: [
        {
          _id: '7c3a19b4f0d62e8c9a5d11f2',
          type: 're.notifica.action.Callback',
          target: 'http://example.com',
          keyboard: false,
          camera: false,
        },
      ],
    };

    const expectedOutput: ActitoNotification = {
      ...MINIMAL_ACTITO_NOTIFICATION,
      actions: [],
    };

    expect(convertCloudNotificationToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when an action does not specify if it uses camera and keyboard, it sets both options as false in the final object', () => {
    const input: CloudNotification = {
      ...MINIMAL_CLOUD_NOTIFICATION,
      actions: [
        {
          _id: '7c3a19b4f0d62e8c9a5d11f2',
          type: 're.notifica.action.Callback',
          label: 'Yes',
          target: 'http://example.com',
        },
      ],
    };

    const expectedOutput: ActitoNotification = {
      ...MINIMAL_ACTITO_NOTIFICATION,
      actions: [
        {
          id: '7c3a19b4f0d62e8c9a5d11f2',
          type: 're.notifica.action.Callback',
          label: 'Yes',
          target: 'http://example.com',
          camera: false,
          keyboard: false,
        },
      ],
    };

    expect(convertCloudNotificationToPublic(input)).toStrictEqual(expectedOutput);
  });
});
