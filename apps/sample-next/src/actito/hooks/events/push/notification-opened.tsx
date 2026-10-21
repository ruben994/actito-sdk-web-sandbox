"use client";

import { useEffect } from "react";
import { OnNotificationOpenedCallback } from "actito-web/push";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationOpened(callback: OnNotificationOpenedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_opened", callback });
  }, [registerListener, callback]);
}
