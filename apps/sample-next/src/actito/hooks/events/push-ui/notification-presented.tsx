"use client";

import { useEffect } from "react";
import { OnNotificationPresentedCallback } from "actito-web/push-ui";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationPresented(callback: OnNotificationPresentedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_presented", callback });
  }, [registerListener, callback]);
}
