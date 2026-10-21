"use client";

import { useEffect } from "react";
import { OnMessagePresentedCallback } from "actito-web/in-app-messaging";
import { useActito } from "@/actito/actito-context";

export function useOnMessagePresented(callback: OnMessagePresentedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "message_presented", callback });
  }, [registerListener, callback]);
}
