import { OnBadgeUpdatedCallback, OnInboxUpdatedCallback } from "actito-web/inbox";
import { TypedListener } from "@/actito/hooks/events/base";

export type ActitoInboxListener = InboxUpdatedListener | BadgeUpdatedListener;

export type InboxUpdatedListener = TypedListener<"inbox_updated", OnInboxUpdatedCallback>;

export type BadgeUpdatedListener = TypedListener<"badge_updated", OnBadgeUpdatedCallback>;
