"use client";

import { useEffect } from "react";
import { OnLocationUpdatedCallback } from "actito-web/geo";
import { useActito } from "@/actito/actito-context";

export function useOnLocationUpdated(callback: OnLocationUpdatedCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "location_updated", callback });
  }, [registerListener, callback]);
}
