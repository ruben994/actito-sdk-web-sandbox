import type { CloudNotification } from '@actito/web-cloud-api';
import { describe, expect, test } from '@jest/globals';
import { convertCloudNotificationToPublic } from '~/internal/cloud-api/converters/notification-converter';
import type { ActitoNotification } from '~/models/actito-notification';

describe('test convertCloudNotificationToPublic', () => {
  const MINIMAL_CLOUD_NOTIFICATION: CloudNotification = {
    _id: '1d9e80ef851d212aca82cf23',
    type: 're.notifica.notification.WebView',
    time: '2026-04-07T14:15:22Z',
    message: 'Message',
  };

  const MINIMAL_ACTITO_NOTIFICATION: ActitoNotification = {
    id: '1d9e80ef851d212aca82cf23',
    partial: false,
    type: 're.notifica.notification.WebView',
    time: '2026-04-07T14:15:22Z',
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
      time: '2026-04-07T14:15:22Z',
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
          _id: '1',
          type: 're.notifica.action.Callback',
          label: 'Call',
          target: 'tel:0123456789',
          camera: false,
          keyboard: false,
        },
      ],
      attachments: [
        {
          mimeType: 'image/jpeg',
          uri: 'https://domain.com/image',
        },
      ],
      extra: {
        extra1: 'string',
        extra2: true,
      },
    };

    const expectedOutput: ActitoNotification = {
      id: '1d9e80ef851d212aca82cf23',
      partial: false,
      type: 're.notifica.notification.WebView',
      time: '2026-04-07T14:15:22Z',
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
          id: '1',
          type: 're.notifica.action.Callback',
          label: 'Call',
          target: 'tel:0123456789',
          camera: false,
          keyboard: false,
        },
      ],
      attachments: [
        {
          mimeType: 'image/jpeg',
          uri: 'https://domain.com/image',
        },
      ],
      extra: {
        extra1: 'string',
        extra2: true,
      },
    };

    expect(convertCloudNotificationToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when a minimal CloudNotification is provided, it includes the optional fields in the final ActitoNotification object as expected', () => {
    const input = MINIMAL_CLOUD_NOTIFICATION;
    const expectedOutput = MINIMAL_ACTITO_NOTIFICATION;

    expect(convertCloudNotificationToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when there is an action without a label, it is not included in the final object', () => {
    const input: CloudNotification = {
      ...MINIMAL_CLOUD_NOTIFICATION,
      actions: [
        {
          _id: '1',
          type: 're.notifica.action.Callback',
          target: 'tel:0123456789',
          camera: false,
          keyboard: false,
        },
      ],
    };

    const expectedOutput: ActitoNotification = {
      ...MINIMAL_ACTITO_NOTIFICATION,
      actions: [],
    };

    expect(convertCloudNotificationToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when there is an action without camera and keyboard options, it sets those options as false in the final object', () => {
    const input: CloudNotification = {
      ...MINIMAL_CLOUD_NOTIFICATION,
      actions: [
        {
          _id: '1',
          type: 're.notifica.action.Callback',
          label: 'Call',
          target: 'tel:0123456789',
        },
      ],
    };

    const expectedOutput: ActitoNotification = {
      ...MINIMAL_ACTITO_NOTIFICATION,
      actions: [
        {
          id: '1',
          type: 're.notifica.action.Callback',
          label: 'Call',
          target: 'tel:0123456789',
          camera: false,
          keyboard: false,
        },
      ],
    };

    expect(convertCloudNotificationToPublic(input)).toStrictEqual(expectedOutput);
  });
});
