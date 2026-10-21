"use client";

import { useEffect } from "react";
import { OnMessageFailedToPresentCallback } from "actito-web/in-app-messaging";
import { useActito } from "@/actito/actito-context";

export function useOnMessageFailedToPresent(callback: OnMessageFailedToPresentCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "message_failed_to_present", callback });
  }, [registerListener, callback]);
}
