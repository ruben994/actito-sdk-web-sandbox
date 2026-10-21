"use client";

import { useEffect } from "react";
import { OnCustomActionReceivedCallback } from "actito-web/push-ui";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationCustomActionReceived(callback: OnCustomActionReceivedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_custom_action_received", callback });
  }, [registerListener, callback]);
}
