import { useCallback, useEffect, useRef, useState } from "react";
import { NoSymbolIcon } from "@heroicons/react/24/outline";
import {
  clearDoNotDisturb,
  fetchDoNotDisturb,
  updateDoNotDisturb,
  getCurrentDevice,
} from "actito-web/core";
import { Button } from "@/components/button";
import { Card, CardActions, CardContent, CardHeader } from "@/components/card";
import { InputField } from "@/components/input-field";
import { Switch } from "@/components/switch";
import { toast } from "@/components/toast";
import { logger } from "@/utils/logger";

const DEFAULT_DND_START = "23:00";
const DEFAULT_DND_END = "08:00";
const TIME_REGEX = /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/;

export function DoNotDisturbCard() {
  const [state, setState] = useState<DoNotDisturbState>({ status: "idle" });
  const autoLaunched = useRef(false);

  useEffect(() => {
    // Strict mode will (un)mount each component twice.
    // Prevent the fetch from being performed in duplicate.
    if (autoLaunched.current) return;

    autoLaunched.current = true;

    const device = getCurrentDevice();
    if (!device) return;

    const isLocalDeviceDndEnabled = device?.dnd !== undefined;
    const localDeviceDndData = { start: device?.dnd?.start ?? "", end: device?.dnd?.end ?? "" };

    setState(
      isLocalDeviceDndEnabled
        ? { status: "initializing-enabled", data: localDeviceDndData }
        : { status: "initializing-disabled" },
    );

    fetchDoNotDisturb()
      .then((dnd) => {
        setState(
          !!dnd
            ? { status: "enabled", data: { start: dnd.start, end: dnd.end } }
            : { status: "disabled" },
        );
      })
      .catch((error) => {
        setState(
          isLocalDeviceDndEnabled
            ? { status: "enabled", data: localDeviceDndData }
            : { status: "disabled" },
        );
        toast({
          title:
            "Failed to fetch the 'Do not disturb' state. Instead, it's using local device information.",
          description: `${error}`,
          variant: "warning",
        });
        logger.error(`Failed to fetch the 'Do not disturb' state: ${error}`);
      });
  }, []);

  const updateDoNotDisturbCallback = useCallback(() => {
    if (state.status === "disabled") {
      setState({ status: "saving-disabled" });

      clearDoNotDisturb()
        .then(() => {
          toast({
            title: "The 'Do not disturb' mode has been disabled.",
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: "Failed to disable the 'Do not disturb' mode.",
            description: `${error}`,
            variant: "error",
          });
          logger.error(`Failed to disable the 'Do not disturb' mode: ${error}`);
        })
        .finally(() => setState({ status: "disabled" }));
    }

    if (state.status === "enabled") {
      setState({ ...state, status: "saving-enabled" });

      updateDoNotDisturb({
        start: state.data.start,
        end: state.data.end,
      })
        .then(() => {
          toast({
            title: "The 'Do not disturb' mode has been enabled.",
            variant: "success",
          });
        })
        .catch((error) => {
          toast({
            title: "Failed to enable the 'Do not disturb' mode.",
            description: `${error}`,
            variant: "error",
          });
          logger.error(`Failed to enable the 'Do not disturb' mode: ${error}`);
        })
        .finally(() => setState({ status: "enabled", data: state.data }));
    }

    return;
  }, [state]);

  function setTimePeriod(data: { start?: string; end?: string }) {
    if (state.status === "enabled") {
      setState({
        ...state,
        data: {
          start: data.start ?? state.data.start,
          end: data.end ?? state.data.end,
        },
      });
    }
  }

  const isSaving = state.status === "saving-enabled" || state.status === "saving-disabled";
  const isInitializing =
    state.status === "initializing-enabled" || state.status === "initializing-disabled";
  const isEnabled =
    state.status === "initializing-enabled" ||
    state.status === "saving-enabled" ||
    state.status === "enabled";
  const isDisabled =
    state.status === "initializing-disabled" ||
    state.status === "saving-disabled" ||
    state.status === "disabled";
  const isValid =
    !isEnabled || (TIME_REGEX.test(state.data.start) && TIME_REGEX.test(state.data.end));

  return (
    <Card loading={isInitializing}>
      <CardHeader title="Do not disturb" icon={NoSymbolIcon} />

      <CardContent>
        <Switch
          label="Enabled"
          disabled={isSaving || isInitializing}
          checked={isEnabled}
          onChange={(checked) =>
            checked
              ? setState({
                  status: "enabled",
                  data: {
                    start: DEFAULT_DND_START,
                    end: DEFAULT_DND_END,
                  },
                })
              : setState({ status: "disabled" })
          }
        />

        <InputField
          id="dnd-start"
          label="Start"
          value={isEnabled ? state.data.start : ""}
          disabled={isSaving || isInitializing || isDisabled}
          onChange={(event) => setTimePeriod({ start: event.target.value })}
        />

        <InputField
          id="dnd-end"
          label="End"
          value={isEnabled ? state.data.end : ""}
          disabled={isSaving || isInitializing || isDisabled}
          onChange={(event) => setTimePeriod({ end: event.target.value })}
        />
      </CardContent>
      <CardActions>
        <Button
          text="Save"
          disabled={isSaving || isInitializing || !isValid}
          onClick={updateDoNotDisturbCallback}
          loading={isSaving}
          className="w-full"
        />
      </CardActions>
    </Card>
  );
}

type DoNotDisturbState =
  | {
      status: "idle" | "initializing-disabled" | "saving-disabled" | "disabled";
    }
  | {
      status: "initializing-enabled" | "saving-enabled" | "enabled";
      data: {
        start: string;
        end: string;
      };
    };
