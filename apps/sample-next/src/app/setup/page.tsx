"use client";

import { useCallback, useEffect, useState } from "react";
import { CheckIcon } from "@heroicons/react/20/solid";
import { useActitoConfiguration } from "@/actito/hooks/actito-configuration";
import { ConfigurationForm } from "@/components/configuration/configuration-form";
import { ConfigurationFormState } from "@/components/configuration/configuration-form-state";
import { PageHeader, PageHeaderAction } from "@/components/page-header";
import { toast } from "@/components/toast";

export default function Setup() {
  const [state, setState] = useState<ConfigurationFormState>({
    debugLoggingEnabled: true,
    applicationVersion: "",
    language: "",
    serviceWorkerLocation: "",
    serviceWorkerScope: "",
    geolocationHighAccuracyEnabled: false,
    geolocationMaximumAge: "",
    geolocationTimeout: "",
  });

  const { appConfiguration, actitoOptions, hasConfigurationMismatch } = useActitoConfiguration();

  useEffect(
    function updateFormStateWithConfigFile() {
      if (appConfiguration && hasConfigurationMismatch) {
        setState({
          debugLoggingEnabled: true,
          applicationVersion: appConfiguration.applicationVersion || "",
          language: appConfiguration.language || "",
          serviceWorkerLocation: appConfiguration.serviceWorker || "",
          serviceWorkerScope: appConfiguration.serviceWorkerScope || "",
          geolocationHighAccuracyEnabled: appConfiguration.geolocation?.enableHighAccuracy || false,
          geolocationMaximumAge: appConfiguration.geolocation?.maximumAge?.toString() || "",
          geolocationTimeout: appConfiguration.geolocation?.timeout?.toString() || "",
        });

        return;
      }

      setState({
        debugLoggingEnabled: true,
        applicationVersion: actitoOptions?.applicationVersion || "",
        language: actitoOptions?.language || "",
        serviceWorkerLocation: actitoOptions?.serviceWorker || "",
        serviceWorkerScope: actitoOptions?.serviceWorkerScope || "",
        geolocationHighAccuracyEnabled: actitoOptions?.geolocation?.enableHighAccuracy || false,
        geolocationMaximumAge: actitoOptions?.geolocation?.maximumAge?.toString() || "",
        geolocationTimeout: actitoOptions?.geolocation?.timeout?.toString() || "",
      });
    },
    [appConfiguration, actitoOptions, hasConfigurationMismatch],
  );

  const setup = useCallback(() => {
    if (appConfiguration && !hasConfigurationMismatch) return;

    const config = { ...actitoOptions };

    const isEmpty = Object.keys(config).length === 0;

    if (isEmpty) {
      toast({
        title:
          "Your configuration is empty or could not be loaded. Please check your actito-services.json file.",
        variant: "error",
      });
      return;
    }

    config.applicationVersion = state.applicationVersion.trim() || undefined;
    config.language = state.language.trim() || undefined;

    config.serviceWorker = state.serviceWorkerLocation.trim() || undefined;
    config.serviceWorkerScope = state.serviceWorkerScope.trim() || undefined;

    config.geolocation = {
      enableHighAccuracy: state.geolocationHighAccuracyEnabled,
    };

    const maximumAge = parseInt(state.geolocationMaximumAge.trim());
    if (!isNaN(maximumAge)) config.geolocation.maximumAge = maximumAge;

    const timeout = parseInt(state.geolocationTimeout.trim());
    if (!isNaN(timeout)) config.geolocation.timeout = timeout;

    localStorage.setItem(
      "app_configuration",
      JSON.stringify({
        debugLoggingEnabled: state.debugLoggingEnabled,
        ...config,
      }),
    );
    window.location.href = "/";
  }, [appConfiguration, hasConfigurationMismatch, actitoOptions, state]);

  useEffect(
    function ensureCleanState() {
      if (appConfiguration && hasConfigurationMismatch === false) window.location.href = "/";
    },
    [appConfiguration, hasConfigurationMismatch],
  );

  return (
    <main className="py-10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <PageHeader
          title="Setup your environment"
          message="These options will be persisted across restart unless you remove them from local storage."
          actions={<PageHeaderAction label="Continue" icon={CheckIcon} onClick={setup} />}
        />

        <ConfigurationForm state={state} onChange={setState} />
      </div>
    </main>
  );
}
