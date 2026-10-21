import type { CloudInAppMessage, CloudInAppMessageAction } from '@actito/web-cloud-api';
import type { ActitoInAppMessage, ActitoInAppMessageAction } from '~/models/actito-in-app-message';

export function convertCloudInAppMessageToPublic(message: CloudInAppMessage): ActitoInAppMessage {
  return {
    id: message._id,
    name: message.name,
    type: message.type,
    context: message.context ?? [],
    title: message.title,
    message: message.message,
    image: message.image,
    landscapeImage: message.landscapeImage,
    delaySeconds: message.delaySeconds ?? 0,
    primaryAction: convertCloudInAppMessageActionToPublic(message.primaryAction),
    secondaryAction: convertCloudInAppMessageActionToPublic(message.secondaryAction),
  };
}

function convertCloudInAppMessageActionToPublic(
  action?: CloudInAppMessageAction,
): ActitoInAppMessageAction | undefined {
  if (!action) return undefined;

  return {
    label: action.label,
    destructive: action.destructive ?? false,
    url: action.url,
  };
}
