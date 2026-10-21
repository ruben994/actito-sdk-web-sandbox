import type { CloudInAppMessage } from '@actito/web-cloud-api';
import { describe, expect, test } from '@jest/globals';
import { convertCloudInAppMessageToPublic } from '~/internal/cloud-api/in-app-message-converter';
import type { ActitoInAppMessage } from '~/models/actito-in-app-message';

describe('test convertCloudInAppMessageToPublic', () => {
  const MINIMAL_CLOUD_IN_APP_MESSAGE: CloudInAppMessage = {
    _id: '1d9e80ef851d212aca82cf23',
    name: 'string',
    type: 're.notifica.inappmessage.Card',
  };

  const MINIMAL_ACTITO_IN_APP_MESSAGE: ActitoInAppMessage = {
    id: '1d9e80ef851d212aca82cf23',
    name: 'string',
    type: 're.notifica.inappmessage.Card',
    context: [],
    title: undefined,
    message: undefined,
    image: undefined,
    landscapeImage: undefined,
    delaySeconds: 0,
    primaryAction: undefined,
    secondaryAction: undefined,
  };

  test('when a full CloudInAppMessage object is provided, it converts it into an ActitoInAppMessage object as expected', () => {
    const input: CloudInAppMessage = {
      _id: '1d9e80ef851d212aca82cf23',
      name: 'string',
      type: 're.notifica.inappmessage.Card',
      context: ['launch', 'foreground'],
      title: 'Hello world',
      message: 'Hello world',
      image: 'http://example.com',
      landscapeImage: 'http://example.com',
      delaySeconds: 10,
      primaryAction: {
        label: 'Yes',
        url: 'http://example.com',
        destructive: false,
      },
      secondaryAction: {
        label: 'No',
        url: 'http://example.com',
        destructive: true,
      },
    };

    const expectedOutput: ActitoInAppMessage = {
      id: '1d9e80ef851d212aca82cf23',
      name: 'string',
      type: 're.notifica.inappmessage.Card',
      context: ['launch', 'foreground'],
      title: 'Hello world',
      message: 'Hello world',
      image: 'http://example.com',
      landscapeImage: 'http://example.com',
      delaySeconds: 10,
      primaryAction: {
        label: 'Yes',
        url: 'http://example.com',
        destructive: false,
      },
      secondaryAction: {
        label: 'No',
        url: 'http://example.com',
        destructive: true,
      },
    };

    expect(convertCloudInAppMessageToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when a minimal CloudInAppMessage object is provided, it includes the optional fields in the final ActitoInAppMessage object as expected', () => {
    const input = MINIMAL_CLOUD_IN_APP_MESSAGE;
    const expectedOutput = MINIMAL_ACTITO_IN_APP_MESSAGE;

    expect(convertCloudInAppMessageToPublic(input)).toStrictEqual(expectedOutput);
  });

  test('when there is an action that is not defined as destructive or not, it sets it as not destructive (false) in the final object', () => {
    const input: CloudInAppMessage = {
      ...MINIMAL_CLOUD_IN_APP_MESSAGE,
      primaryAction: {
        label: 'Yes',
        url: 'http://example.com',
      },
      secondaryAction: {
        label: 'No',
        url: 'http://example.com',
      },
    };

    const expectedOutput: ActitoInAppMessage = {
      ...MINIMAL_ACTITO_IN_APP_MESSAGE,
      primaryAction: {
        label: 'Yes',
        destructive: false,
        url: 'http://example.com',
      },
      secondaryAction: {
        label: 'No',
        destructive: false,
        url: 'http://example.com',
      },
    };

    expect(convertCloudInAppMessageToPublic(input)).toStrictEqual(expectedOutput);
  });
});
