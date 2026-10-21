"use client";

import { useEffect } from "react";
import { OnUnlaunchedCallback } from "actito-web/core";
import { useActito } from "@/actito/actito-context";

export function useOnUnlaunched(callback: OnUnlaunchedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "unlaunched", callback });
  }, [registerListener, callback]);
}
