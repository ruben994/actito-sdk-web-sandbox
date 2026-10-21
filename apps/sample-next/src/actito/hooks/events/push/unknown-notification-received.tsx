"use client";

import { useEffect } from "react";
import { OnUnknownNotificationReceivedCallback } from "actito-web/push";
import { useActito } from "@/actito/actito-context";

export function useOnUnknownNotificationReceived(callback: OnUnknownNotificationReceivedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "unknown_notification_received", callback });
  }, [registerListener, callback]);
}
