"use client";

import { useEffect } from "react";
import { OnNotificationSettingsChangedCallback } from "actito-web/push";
import { useActito } from "@/actito/actito-context";

export function useOnNotificationSettingsChanged(callback: OnNotificationSettingsChangedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "notification_settings_changed", callback });
  }, [registerListener, callback]);
}
