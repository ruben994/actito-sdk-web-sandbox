"use client";

import { useEffect } from "react";
import { OnSystemNotificationReceivedCallback } from "actito-web/push";
import { useActito } from "@/actito/actito-context";

export function useOnSystemNotificationReceived(callback: OnSystemNotificationReceivedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "system_notification_received", callback });
  }, [registerListener, callback]);
}
