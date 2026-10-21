import { describe, expect, test } from '@jest/globals';
import { createPartialNotification } from '~/internal/create-partial-notification';
import type { ActitoWorkerNotification } from '~/internal/internal-types';

describe('test createPartialNotification', () => {
  const MINIMAL_ACTITO_WORKER_NOTIFICATION: ActitoWorkerNotification = {
    'x-sender': 'notificare',
    system: true,
    push: true,
    requireInteraction: false,
    renotify: true,
    urlFormatString: 'string',
    id: '1d9e80ef851d212aca82cf23',
    application: '7c3a91f2b6d4e58c0f12a9d8',
    notificationId: 'a8f04c19e7b632d5f0c9b21a',
    notificationType: 're.notifica.notification.WebView',
  };

  const MINIMAL_ACTITO_NOTIFICATION_WITHOUT_TIME = {
    id: 'a8f04c19e7b632d5f0c9b21a',
    partial: true,
    type: 're.notifica.notification.WebView',
    title: undefined,
    subtitle: undefined,
    message: '',
    content: [],
    actions: [],
    attachments: [],
    extra: {},
  };

  test('when a minimal ActitoWorkerNotification object is provided, it returns an ActitoNotification object as expected', () => {
    const input = MINIMAL_ACTITO_WORKER_NOTIFICATION;
    const expectedOutput = MINIMAL_ACTITO_NOTIFICATION_WITHOUT_TIME;

    // ignore time because it is auto generated
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { time, ...outputWithoutTime } = createPartialNotification(input);

    expect(outputWithoutTime).toStrictEqual(expectedOutput);
  });

  test('when an ActitoWorkerNotification object is provided with valid additional (extra) attributes, it returns an ActitoNotification object with those extra attributes', () => {
    const input: ActitoWorkerNotification = {
      ...MINIMAL_ACTITO_WORKER_NOTIFICATION,
      'extra-attribute-1': 'string',
      'extra-attribute-2': true,
      someArray: [1, 2, 3],
    };

    const expectedOutput = {
      ...MINIMAL_ACTITO_NOTIFICATION_WITHOUT_TIME,
      extra: {
        'extra-attribute-1': 'string',
        'extra-attribute-2': true,
        someArray: [1, 2, 3],
      },
    };

    // ignore time because it is auto generated
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { time, ...outputWithoutTime } = createPartialNotification(input);

    expect(outputWithoutTime).toStrictEqual(expectedOutput);
  });

  test('when an ActitoWorkerNotification object is provided with properties that must not be considered as extra, it returns an ActitoNotification object without including those properties as extra', () => {
    const input: ActitoWorkerNotification = {
      // none of this properties should be included inside 'extra' property in the final object
      'x-sender': 'notificare',
      system: true,
      push: true,
      requireInteraction: false,
      renotify: true,
      urlFormatString: 'string',
      id: '1d9e80ef851d212aca82cf23',
      application: '7c3a91f2b6d4e58c0f12a9d8',
      notificationId: 'a8f04c19e7b632d5f0c9b21a',
      notificationType: 're.notifica.notification.WebView',
      inboxItemId: 'a4f9c2d7e81b6a3c5f0d92e1',
      inboxItemVisible: true,
      inboxItemExpires: 10000,
      alertTitle: 'Title',
      alertSubtitle: 'Subtitle',
      alert: 'Alert',
      icon: 'https://domain.com/icon',
      sound: 'default',
      attachment: {
        mimeType: 'image/jpeg',
        uri: 'https://domain.com/image',
      },
      actions: [
        {
          _id: '9e7b2c4d1f8a6b3c5d0e91fa',
          type: 're.notifica.action.Callback',
          label: 'Yes',
          target: 'string',
          icon: 'https://domain.com/icon',
          keyboard: false,
          camera: false,
        },
      ],
      // custom properties starting with 'x-' should also be ignored
      'x-attribute-1': 'string',
      'x-attribute-2': true,
      'x-attribute-3': {
        a: 'eae',
        b: false,
      },
    };

    // property 'time' is being ignored because it is auto generated in the final object
    const expectedOutput = {
      id: 'a8f04c19e7b632d5f0c9b21a',
      partial: true,
      type: 're.notifica.notification.WebView',
      title: 'Title',
      subtitle: 'Subtitle',
      message: 'Alert',
      content: [],
      actions: [],
      attachments: [
        {
          mimeType: 'image/jpeg',
          uri: 'https://domain.com/image',
        },
      ],
      extra: {},
    };

    // ignore time because it is auto generated
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { time, ...outputWithoutTime } = createPartialNotification(input);

    expect(outputWithoutTime).toStrictEqual(expectedOutput);
  });
});
