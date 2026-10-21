"use client";

import { useEffect } from "react";
import { OnDeviceRegisteredCallback } from "actito-web/core";
import { useActito } from "@/actito/actito-context";

export function useOnDeviceRegistered(callback: OnDeviceRegisteredCallback) {
  const { registerListener } = useActito();

  useEffect(() => {
    return registerListener({ event: "device_registered", callback });
  }, [registerListener, callback]);
}
