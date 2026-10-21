"use client";

import { useEffect } from "react";
import { OnNotificationFailedToPresentCallback } from "actito-web/push-ui";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationFailedToPresent(callback: OnNotificationFailedToPresentCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_failed_to_present", callback });
  }, [registerListener, callback]);
}
