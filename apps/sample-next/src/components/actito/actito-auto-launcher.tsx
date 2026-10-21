"use client";

import { useEffect, useRef } from "react";
import { configure, setLogLevel } from "actito-web/core";
import { useActitoConfiguration } from "@/actito/hooks/actito-configuration";
import { useActitoLaunchFlow } from "@/actito/hooks/actito-launch-flow";
import { toast } from "@/components/toast";
import { useSampleUser } from "@/hooks/sample-user";
import { logger } from "@/utils/logger";

export function ActitoAutoLauncher() {
  useSampleUser();

  const { launch } = useActitoLaunchFlow();
  const { appConfiguration, hasConfigurationMismatch } = useActitoConfiguration();

  const autoLaunched = useRef(false);

  useEffect(() => {
    // Strict mode will (un)mount each component twice.
    // Prevent the configuration from running in duplicate.
    if (autoLaunched.current) return;

    if (!appConfiguration || hasConfigurationMismatch !== false) {
      return;
    }

    setLogLevel(appConfiguration.debugLoggingEnabled ? "debug" : "info");

    try {
      configure(appConfiguration);
    } catch (error) {
      toast({
        title: "The app could not be configured.",
        description: `${error}`,
        variant: "error",
      });
      logger.error(`The app could not be configured: ${error}`);
      return;
    }

    launch();
    autoLaunched.current = true;
  }, [appConfiguration, hasConfigurationMismatch, launch]);

  return null;
}
