"use client";

import { useEffect } from "react";
import { OnActionWillExecuteCallback } from "actito-web/push-ui";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationActionWillExecute(callback: OnActionWillExecuteCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_action_will_execute", callback });
  }, [registerListener, callback]);
}
