import { useCallback, useEffect, useState } from "react";
import { MapPinIcon } from "@heroicons/react/24/outline";
import {
  disableLocationUpdates,
  enableLocationUpdates,
  hasLocationServicesEnabled,
} from "actito-web/geo";
import { Card, CardContent, CardHeader } from "@/components/card";
import { Switch } from "@/components/switch";
import { toast } from "@/components/toast";
import { logger } from "@/utils/logger";

export function LocationCard() {
  const [enabled, setEnabled] = useState(false);
  const [geoPermissionStatus, setGeoPermissionStatus] = useState<PermissionState>("prompt");

  useEffect(function checkLocationServicesStatus() {
    const enabled = hasLocationServicesEnabled();
    setEnabled(enabled);
  }, []);

  useEffect(function checkGeolocationPermissionStatus() {
    navigator.permissions.query({ name: "geolocation" }).then((result) => {
      setGeoPermissionStatus(result.state);

      result.onchange = function onGeolocationSettingsChanged() {
        setGeoPermissionStatus(result.state);
      };
    });
  });

  const updateLocationServicesStatus = useCallback((checked: boolean) => {
    try {
      if (checked) {
        enableLocationUpdates();
        toast({
          title: "The location services were enabled.",
          variant: "success",
        });
      } else {
        disableLocationUpdates();
        toast({
          title: "The location services were disabled.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: `There was a problem ${checked ? "enabling" : "disabling"} the location services.`,
        description: `${error}`,
        variant: "error",
      });
      logger.error(
        `There was a problem ${checked ? "enabling" : "disabling"} the location services: ${error}`,
      );
    } finally {
      const enabled = hasLocationServicesEnabled();
      setEnabled(enabled);
    }
  }, []);

  return (
    <Card>
      <CardHeader title="Location" icon={MapPinIcon} />

      <CardContent>
        <Switch label="Enabled" checked={enabled} onChange={updateLocationServicesStatus} />

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Permission
          </p>
          <p className="text-sm font-mono lowercase text-gray-400">{geoPermissionStatus}</p>
        </div>
      </CardContent>
    </Card>
  );
}
