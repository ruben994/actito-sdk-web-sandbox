import { useEffect, useState } from "react";
import { ActitoOptions } from "@actito/web-core";
import { logger } from "@/utils/logger";

export function useActitoConfiguration() {
  const [appConfiguration, setAppConfiguration] = useState<
    (ActitoOptions & { debugLoggingEnabled?: boolean }) | null
  >();
  const [actitoOptions, setActitoOptions] = useState<ActitoOptions | null>();
  const [hasConfigurationMismatch, setHasConfigurationMismatch] = useState<boolean>();

  useEffect(
    function checkConfigMismatch() {
      if (appConfiguration === undefined || actitoOptions === undefined) return;

      if (appConfiguration === null) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setHasConfigurationMismatch(false);
        return;
      }

      const mismatch =
        appConfiguration.applicationKey !== actitoOptions?.applicationKey ||
        appConfiguration.applicationSecret !== actitoOptions?.applicationSecret;

      setHasConfigurationMismatch(mismatch);
    },
    [appConfiguration, actitoOptions],
  );

  useEffect(function loadAppConfiguration() {
    const encodedConfig = localStorage.getItem("app_configuration");

    if (!encodedConfig) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAppConfiguration(null);
      return;
    }

    const config = JSON.parse(encodedConfig);
    setAppConfiguration(config);
  }, []);

  useEffect(() => {
    async function loadActitoOptions() {
      try {
        const response = await fetch("/actito-services.json");
        const config: ActitoOptions = await response.json();

        setActitoOptions(config);
      } catch (e) {
        setActitoOptions(null);
        logger.error(`It was not possible to get the current Actito options: ${e}`);
      }
    }

    loadActitoOptions();
  }, []);

  return {
    appConfiguration,
    actitoOptions,
    hasConfigurationMismatch,
  };
}
