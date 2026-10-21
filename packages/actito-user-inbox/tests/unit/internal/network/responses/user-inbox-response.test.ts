import type { CloudDeviceInboxItem } from '@actito/web-cloud-api';
import { describe, expect, test } from '@jest/globals';
import {
  convertNetworkUserInboxItemToPublic,
  type NetworkUserInboxItem,
} from '~/internal/network/responses/user-inbox-response';
import type { ActitoUserInboxItem } from '~/models/actito-user-inbox-item';

describe('test convertNetworkUserInboxItemToPublic', () => {
  const MINIMAL_NETWORK_USER_INBOX_ITEM: NetworkUserInboxItem = {
    _id: '1d9e80ef851d212aca82cf23',
    notification: 'a7f3c91b4e2d8f06c5ab9d12',
    type: 're.notifica.notification.Alert',
    time: '2026-04-27T16:45:20Z',
    message: 'Message',
  };

  const MINIMAL_ACTITO_USER_INBOX_ITEM: ActitoUserInboxItem = {
    id: '1d9e80ef851d212aca82cf23',
    time: '2026-04-27T16:45:20Z',
    opened: false,
    expires: undefined,
    notification: {
      id: 'a7f3c91b4e2d8f06c5ab9d12',
      partial: true,
      type: 're.notifica.notification.Alert',
      time: '2026-04-27T16:45:20Z',
      title: undefined,
      subtitle: undefined,
      message: 'Message',
      content: [],
      actions: [],
      attachments: [],
      extra: {},
    },
  };

  test('when a full NetworkUserInboxItem object is provided, it converts it into an ActitoUserInboxItem object as expected', () => {
    const input: CloudDeviceInboxItem = {
      _id: '1d9e80ef851d212aca82cf23',
      notification: 'a7f3c91b4e2d8f06c5ab9d12',
      type: 're.notifica.notification.Alert',
      time: '2026-04-27T16:45:20Z',
      title: 'Title',
      subtitle: 'Subtitle',
      message: 'Message',
      attachment: {
        mimeType: 'image/jpeg',
        uri: 'https://domain.com/image',
      },
      extra: {
        key1: 'value1',
        key2: 'value2',
      },
      opened: true,
      visible: true,
      expires: '2026-04-27T17:19:20Z',
    };

    const expectedOutput: ActitoUserInboxItem = {
      id: '1d9e80ef851d212aca82cf23',
      time: '2026-04-27T16:45:20Z',
      opened: true,
      expires: '2026-04-27T17:19:20Z',
      notification: {
        id: 'a7f3c91b4e2d8f06c5ab9d12',
        partial: true,
        type: 're.notifica.notification.Alert',
        time: '2026-04-27T16:45:20Z',
        title: 'Title',
        subtitle: 'Subtitle',
        message: 'Message',
        content: [],
        actions: [],
        attachments: [
          {
            mimeType: 'image/jpeg',
            uri: 'https://domain.com/image',
          },
        ],
        extra: {
          key1: 'value1',
          key2: 'value2',
        },
      },
    };

    expect(convertNetworkUserInboxItemToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when a minimal CloudDeviceInboxItem object is provided, it includes the optional fields in the final ActitoUserInboxItem object as expected', () => {
    const input = MINIMAL_NETWORK_USER_INBOX_ITEM;
    const expectedOutput = MINIMAL_ACTITO_USER_INBOX_ITEM;

    expect(convertNetworkUserInboxItemToPublic(input)).toStrictEqual(expectedOutput);
  });
});
