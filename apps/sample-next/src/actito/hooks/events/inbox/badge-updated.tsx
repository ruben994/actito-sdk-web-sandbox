"use client";

import { useEffect } from "react";
import { OnBadgeUpdatedCallback } from "actito-web/inbox";
import { useActito } from "@/actito/actito-context";

export function useOnBadgeUpdated(callback: OnBadgeUpdatedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "badge_updated", callback });
  }, [registerListener, callback]);
}
