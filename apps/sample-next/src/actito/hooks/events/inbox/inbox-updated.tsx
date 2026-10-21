"use client";

import { useEffect } from "react";
import { OnInboxUpdatedCallback } from "actito-web/inbox";
import { useActito } from "@/actito/actito-context";

export function useOnInboxUpdated(callback: OnInboxUpdatedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "inbox_updated", callback });
  }, [registerListener, callback]);
}
