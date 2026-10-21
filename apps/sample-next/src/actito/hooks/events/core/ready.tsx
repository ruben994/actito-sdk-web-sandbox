"use client";

import { useEffect } from "react";
import { OnReadyCallback } from "actito-web/core";
import { useActito } from "@/actito/actito-context";

export function useOnReady(callback: OnReadyCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "ready", callback });
  }, [registerListener, callback]);
}
