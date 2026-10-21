"use client";

import { useCallback, useEffect, useState } from "react";
import { getCurrentDevice, ActitoDevice } from "actito-web/core";
import { useOnDeviceRegistered } from "@/actito/hooks/events/core/device-registered";
import { ActitoLaunchBlocker } from "@/components/actito/actito-launch-blocker";
import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import { PageHeader } from "@/components/page-header";
import { toast } from "@/components/toast";
import { logger } from "@/utils/logger";

export default function Device() {
  const [device, setDevice] = useState<ActitoDevice>();

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setDevice(getCurrentDevice()), []);

  useOnDeviceRegistered((device) => setDevice(device));

  const copyToClipboardCallback = useCallback(async () => {
    if (!device) return;

    try {
      await navigator.clipboard.writeText(device.id);

      toast({
        title: "The device ID was successfully copied to the clipboard!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to copy the device ID to the clipboard.",
        description: `${error}`,
        variant: "error",
      });
      logger.error(`Failed to copy the device ID to the clipboard: ${error}`);
    }
  }, [device]);

  const copyUrlEncodedToClipboardCallback = useCallback(async () => {
    if (!device) return;

    try {
      await navigator.clipboard.writeText(encodeURIComponent(device.id));

      toast({
        title: "The URL-encoded device ID was successfully copied to the clipboard!",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "Failed to copy the URL-encoded device ID to the clipboard.",
        description: `${error}`,
        variant: "error",
      });
      logger.error(`Failed to copy the URL-encoded device ID to the clipboard: ${error}`);
    }
  }, [device]);

  return (
    <>
      <PageHeader
        title="Registered device"
        message="Inspect the registered device in your local storage."
      />

      <ActitoLaunchBlocker>
        <div className="md:max-w-2xl flex flex-col gap-4">
          {!device && (
            <Alert variant="warning" message="There is no device registered at the moment." />
          )}

          {device && (
            <>
              <div className="flex flex-row gap-4">
                <Button text="Copy deviceId" onClick={copyToClipboardCallback} />

                <Button
                  text="Copy URL-encoded deviceId"
                  onClick={copyUrlEncodedToClipboardCallback}
                />
              </div>

              <pre className="bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded p-4 overflow-scroll">
                {JSON.stringify(device, null, 2)}
              </pre>
            </>
          )}
        </div>
      </ActitoLaunchBlocker>
    </>
  );
}
