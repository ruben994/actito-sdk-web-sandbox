"use client";

import { useEffect } from "react";
import { OnActionFailedToExecuteCallback } from "actito-web/in-app-messaging";
import { useActito } from "@/actito/actito-context";

export function useOnMessageActionFailedToExecute(callback: OnActionFailedToExecuteCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "message_action_failed_to_execute", callback });
  }, [registerListener, callback]);
}
