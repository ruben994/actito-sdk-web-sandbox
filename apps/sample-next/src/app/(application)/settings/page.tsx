"use client";

import { useEffect, useState } from "react";
import { ActitoOptions } from "actito-web/core";
import { useActitoConfiguration } from "@/actito/hooks/actito-configuration";
import { ActitoLaunchBlocker } from "@/components/actito/actito-launch-blocker";
import { ConfigurationForm } from "@/components/configuration/configuration-form";
import { ConfigurationFormState } from "@/components/configuration/configuration-form-state";
import { PageHeader } from "@/components/page-header";

export default function Settings() {
  const [state, setState] = useState<ConfigurationFormState>();
  const { appConfiguration } = useActitoConfiguration();

  useEffect(
    function loadConfiguration() {
      if (!appConfiguration) return;

      const { debugLoggingEnabled, ...rest } = appConfiguration;
      const options: ActitoOptions = rest;

      setState({
        debugLoggingEnabled: debugLoggingEnabled ?? false,
        applicationVersion: options.applicationVersion ?? "",
        language: options.language ?? "",
        serviceWorkerLocation: options.serviceWorker ?? "",
        serviceWorkerScope: options.serviceWorkerScope ?? "",
        geolocationHighAccuracyEnabled: options.geolocation?.enableHighAccuracy ?? false,
        geolocationMaximumAge: options.geolocation?.maximumAge?.toString() ?? "",
        geolocationTimeout: options.geolocation?.timeout?.toString() ?? "",
      });
    },
    [appConfiguration],
  );

  return (
    <>
      <PageHeader
        title="Settings"
        message="Review the options you configured for your environment."
      />

      <ActitoLaunchBlocker>{state && <ConfigurationForm state={state} />}</ActitoLaunchBlocker>
    </>
  );
}
