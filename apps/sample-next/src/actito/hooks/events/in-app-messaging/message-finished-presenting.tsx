"use client";

import { useEffect } from "react";
import { OnMessageFinishedPresentingCallback } from "actito-web/in-app-messaging";
import { useActito } from "@/actito/actito-context";

export function useOnMessageFinishedPresenting(callback: OnMessageFinishedPresentingCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "message_finished_presenting", callback });
  }, [registerListener, callback]);
}
