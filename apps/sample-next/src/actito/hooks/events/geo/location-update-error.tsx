"use client";

import { useEffect } from "react";
import { OnLocationUpdateErrorCallback } from "actito-web/geo";
import { useActito } from "@/actito/actito-context";

export function useOnLocationUpdateError(callback: OnLocationUpdateErrorCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "location_update_error", callback });
  }, [registerListener, callback]);
}
