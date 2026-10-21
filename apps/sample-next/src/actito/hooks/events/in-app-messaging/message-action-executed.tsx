"use client";

import { useEffect } from "react";
import { OnActionExecutedCallback } from "actito-web/in-app-messaging";
import { useActito } from "@/actito/actito-context";

export function useOnMessageActionExecuted(callback: OnActionExecutedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "message_action_executed", callback });
  }, [registerListener, callback]);
}
