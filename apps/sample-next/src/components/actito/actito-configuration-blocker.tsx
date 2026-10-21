"use client";

import { PropsWithChildren } from "react";
import { useActitoConfiguration } from "@/actito/hooks/actito-configuration";
import { Alert } from "@/components/alert";

export function ActitoConfigurationBlocker({ children }: PropsWithChildren) {
  const { appConfiguration, hasConfigurationMismatch } = useActitoConfiguration();

  return (
    <>
      {appConfiguration === null && (
        <Alert
          variant="warning"
          message="Your environment is not configured."
          action={{
            label: "Configure",
            url: "/setup",
          }}
        />
      )}

      {hasConfigurationMismatch && (
        <Alert
          variant="warning"
          message="It was detected a mismatch in your application keys. Please, recheck your configuration."
          action={{
            label: "Reconfigure",
            url: "/setup",
          }}
        />
      )}

      {appConfiguration && hasConfigurationMismatch === false && <>{children}</>}
    </>
  );
}
