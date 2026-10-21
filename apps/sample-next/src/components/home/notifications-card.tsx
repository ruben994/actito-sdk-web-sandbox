import { useEffect, useState } from "react";
import { BellAlertIcon } from "@heroicons/react/24/outline";
import {
  disableRemoteNotifications,
  enableRemoteNotifications,
  hasRemoteNotificationsEnabled,
  getAllowedUI,
  getPushPermissionStatus,
  getTransport,
  ActitoPushPermissionStatus,
  ActitoTransport,
} from "actito-web/push";
import { useOnDeviceRegistered } from "@/actito/hooks/events/core/device-registered";
import { useOnNotificationSettingsChanged } from "@/actito/hooks/events/push/notification-settings-changed";
import { Card, CardContent, CardHeader } from "@/components/card";
import { Switch } from "@/components/switch";
import { toast } from "@/components/toast";
import { logger } from "@/utils/logger";

export function NotificationsCard() {
  const [enabled, setEnabled] = useState(false);
  const [allowedUI, setAllowedUI] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<ActitoPushPermissionStatus>();
  const [transport, setTransport] = useState<ActitoTransport>();

  useEffect(() => {
    const enabled = hasRemoteNotificationsEnabled();
    setEnabled(enabled);

    const allowedUI = getAllowedUI();
    setAllowedUI(allowedUI);
    setTransport(getTransport());

    const permissionStatus = getPushPermissionStatus();
    setPermissionStatus(permissionStatus);
  }, []);

  useOnDeviceRegistered(() => {
    const enabled = hasRemoteNotificationsEnabled();
    setEnabled(enabled);
  });

  useOnNotificationSettingsChanged((allowedUI) => {
    const enabled = hasRemoteNotificationsEnabled();
    setEnabled(enabled);

    setAllowedUI(allowedUI);
    setTransport(getTransport());

    const permissionStatus = getPushPermissionStatus();
    setPermissionStatus(permissionStatus);
  });

  async function updateRemoteNotificationsStatus(checked: boolean) {
    try {
      setLoading(true);

      if (checked) {
        await enableRemoteNotifications();
        toast({
          title: "Remote notifications have been enabled.",
          variant: "success",
        });
      } else {
        await disableRemoteNotifications();
        toast({
          title: "Remote notifications have been disabled.",
          variant: "success",
        });
      }
    } catch (error) {
      toast({
        title: `There was a problem ${checked ? "enabling" : "disabling"} remote notifications.`,
        description: `${error}`,
        variant: "error",
      });
      logger.error(
        `There was a problem ${checked ? "enabling" : "disabling"} remote notifications: ${error}`,
      );
    } finally {
      const enabled = hasRemoteNotificationsEnabled();
      setEnabled(enabled);

      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader title="Notifications" icon={BellAlertIcon} />

      <CardContent>
        <Switch
          label="Enabled"
          checked={enabled}
          loading={loading}
          onChange={(checked) => updateRemoteNotificationsStatus(checked)}
        />

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Allowed UI
          </p>
          <p className="text-sm font-mono lowercase text-gray-400">{allowedUI.toString()}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Permission
          </p>
          <p className="text-sm font-mono lowercase text-gray-400">{permissionStatus}</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
            Transport
          </p>
          <p className="text-sm font-mono text-gray-400">{transport}</p>
        </div>
      </CardContent>
    </Card>
  );
}
