"use client";

import { useEffect } from "react";
import { OnNotificationFinishedPresentingCallback } from "actito-web/push-ui";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationFinishedPresenting(
  callback: OnNotificationFinishedPresentingCallback,
) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_finished_presenting", callback });
  }, [registerListener, callback]);
}
