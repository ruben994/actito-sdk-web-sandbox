"use client";

import { useEffect } from "react";
import { OnNotificationWillPresentCallback } from "actito-web/push-ui";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationWillPresent(callback: OnNotificationWillPresentCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_will_present", callback });
  }, [registerListener, callback]);
}
