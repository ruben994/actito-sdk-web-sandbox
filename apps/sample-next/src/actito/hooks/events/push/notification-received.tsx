"use client";

import { useEffect } from "react";
import { OnNotificationReceivedCallback } from "actito-web/push";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationReceived(callback: OnNotificationReceivedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_received", callback });
  }, [registerListener, callback]);
}
