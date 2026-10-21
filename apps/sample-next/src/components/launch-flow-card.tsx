"use client";

import { XCircleIcon } from "@heroicons/react/20/solid";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { isConfigured } from "actito-web/core";
import { useActitoLaunchFlow } from "@/actito/hooks/actito-launch-flow";
import { Button } from "@/components/button";
import { Card, CardActions, CardContent, CardHeader } from "@/components/card";

export function LaunchFlowCard() {
  const { state, launch, unlaunch } = useActitoLaunchFlow();

  return (
    <Card>
      <CardHeader title="Launch flow" icon={ArrowTopRightOnSquareIcon} />

      <CardContent>
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Configured
          </p>

          {isConfigured() && <CheckCircleIcon className="shrink-0 h-6 w-6 text-green-700" />}

          {!isConfigured() && <XCircleIcon className="shrink-0 h-6 w-6 text-red-700" />}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">Ready</p>

          {state.status === "launched" && (
            <CheckCircleIcon className="shrink-0 h-6 w-6 text-green-700" />
          )}

          {state.status !== "launched" && <XCircleIcon className="shrink-0 h-6 w-6 text-red-700" />}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Current state
          </p>

          <p className="text-sm font-mono lowercase text-gray-400">{state.status}</p>
        </div>
      </CardContent>

      <CardActions>
        <Button
          text="Launch"
          disabled={state.status !== "idle"}
          onClick={launch}
          loading={state.status === "launching"}
          className="w-full"
        />
        <Button
          text="Unlaunch"
          disabled={state.status !== "launched"}
          onClick={unlaunch}
          loading={state.status === "unlaunching"}
          className="w-full"
        />
      </CardActions>
    </Card>
  );
}
