import { logInternal } from '@actito/web-core';
import { ActionType } from './types/action-type';
import type { ActitoInAppMessage } from '~/models/actito-in-app-message';

export async function logInAppMessageViewed(message: ActitoInAppMessage) {
  await logInternal({
    type: 're.notifica.event.inappmessage.View',
    data: { message: message.id },
  });
}

export async function logInAppMessageActionClicked(
  message: ActitoInAppMessage,
  actionType: ActionType,
) {
  await logInternal({
    type: 're.notifica.event.inappmessage.Action',
    data: {
      message: message.id,
      action: actionType,
    },
  });
}
