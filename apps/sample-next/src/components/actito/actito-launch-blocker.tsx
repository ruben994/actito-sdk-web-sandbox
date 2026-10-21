"use client";

import { PropsWithChildren } from "react";
import { useActitoLaunchFlow } from "@/actito/hooks/actito-launch-flow";
import { ActitoConfigurationBlocker } from "@/components/actito/actito-configuration-blocker";
import { Alert } from "@/components/alert";
import { ProgressIndicator } from "@/components/progress-indicator";

export function ActitoLaunchBlocker({ children }: PropsWithChildren) {
  const { state, launch } = useActitoLaunchFlow();

  return (
    <ActitoConfigurationBlocker>
      {state.status === "idle" && (
        <Alert
          variant="warning"
          message="Actito is idle."
          action={{
            label: "Launch",
            onClick: () => launch(),
          }}
        />
      )}

      {state.status === "launch-failed" && (
        <Alert variant="error" message="Actito failed to launch." />
      )}

      {state.status === "unlaunch-failed" && (
        <Alert variant="error" message="Actito failed to unlaunch." />
      )}

      {state.status === "launching" && (
        <ProgressIndicator
          title="Launch flow in progress"
          message="Wait a moment while Actito finishes launching."
        />
      )}

      {state.status === "launched" && <>{children}</>}

      {state.status === "unlaunching" && (
        <ProgressIndicator
          title="Unlaunch flow in progress"
          message="Wait a moment while Actito finishes unlaunching."
        />
      )}
    </ActitoConfigurationBlocker>
  );
}
