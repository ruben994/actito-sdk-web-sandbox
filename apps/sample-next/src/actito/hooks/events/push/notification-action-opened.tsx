"use client";

import { useEffect } from "react";
import { OnNotificationActionOpenedCallback } from "actito-web/push";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationActionOpened(callback: OnNotificationActionOpenedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_action_opened", callback });
  }, [registerListener, callback]);
}
