"use client";

import { useEffect } from "react";
import { OnActionExecutedCallback } from "actito-web/push-ui";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationActionExecuted(callback: OnActionExecutedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_action_executed", callback });
  }, [registerListener, callback]);
}
