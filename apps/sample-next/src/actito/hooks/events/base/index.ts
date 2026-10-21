import { v4 as uuidv4 } from "uuid";
import { ActitoCoreListener } from "@/actito/hooks/events/base/listeners/core";
import { ActitoGeoListener } from "@/actito/hooks/events/base/listeners/geo";
import { ActitoInAppMessagingListener } from "@/actito/hooks/events/base/listeners/in-app-messaging";
import { ActitoInboxListener } from "@/actito/hooks/events/base/listeners/inbox";
import { ActitoPushListener } from "@/actito/hooks/events/base/listeners/push";
import { ActitoPushUiListener } from "@/actito/hooks/events/base/listeners/push-ui";

export type ListenerIdentifier = string;

export function createListenerIdentifier(): ListenerIdentifier {
  return uuidv4();
}

export type IdentifiableListener = Listener & {
  identifier: ListenerIdentifier;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
export type TypedListener<Name extends string, Callback extends Function> = {
  event: Name;
  callback: Callback;
};

export type Listener =
  | ActitoCoreListener
  | ActitoGeoListener
  | ActitoInAppMessagingListener
  | ActitoInboxListener
  | ActitoPushListener
  | ActitoPushUiListener;
