"use client";

import { presentAction, presentNotification } from "actito-web/push-ui";
import { useOnNotificationActionOpened } from "@/actito/hooks/events/push/notification-action-opened";
import { useOnNotificationOpened } from "@/actito/hooks/events/push/notification-opened";
import { useOnNotificationCustomActionReceived } from "@/actito/hooks/events/push-ui/notification-custom-action-received";

export function ActitoEventHandler() {
  useOnNotificationOpened((notification) => {
    presentNotification(notification);
  });

  useOnNotificationActionOpened((notification, action) => {
    presentAction(notification, action);
  });

  useOnNotificationCustomActionReceived((notification, action, target) => {
    window.location.href = target;
  });

  return null;
}
