"use client";

import { useEffect } from "react";
import { OnActionFailedToExecuteCallback } from "actito-web/push-ui";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationActionFailedToExecute(callback: OnActionFailedToExecuteCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_action_failed_to_execute", callback });
  }, [registerListener, callback]);
}
