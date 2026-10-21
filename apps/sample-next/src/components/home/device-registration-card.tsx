import { useCallback, useState } from "react";
import { ArrowRightEndOnRectangleIcon } from "@heroicons/react/24/outline";
import { updateUser } from "actito-web/core";
import { Button } from "@/components/button";
import { Card, CardActions, CardContent, CardHeader } from "@/components/card";
import { InputField } from "@/components/input-field";
import { toast } from "@/components/toast";
import { useCurrentUser } from "@/context/current-user";
import { logger } from "@/utils/logger";

export function DeviceRegistrationCard() {
  const { user, setUser } = useCurrentUser();

  const [userId, setUserId] = useState<string>(user?.userId ?? "");
  const [userName, setUserName] = useState<string>(user?.userName ?? "");
  const [loading, setLoading] = useState<boolean>(false);

  const onRegisterClick = useCallback(() => {
    setLoading(true);

    updateUser({ userId: userId.trim() || null, userName: userName.trim() || null })
      .then(() => {
        setLoading(false);
        setUser({ userId: userId, userName: userName });
        toast({
          title: "The device was registered.",
          variant: "success",
        });
      })
      .catch((error) => {
        setLoading(false);
        toast({
          title: "Unable to register the device.",
          description: `${error}`,
          variant: "error",
        });
        logger.error(`Unable to register the device: ${error}`);
      });
  }, [setUser, userId, userName]);

  return (
    <Card>
      <CardHeader title="Device registration" icon={ArrowRightEndOnRectangleIcon} />

      <CardContent>
        <InputField
          id="user-id"
          label="User ID"
          placeholder="63d38bb3-0d2b-4059-b2d2-775a9deae263"
          disabled={loading}
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
        />

        <InputField
          id="user-name"
          label="User name"
          placeholder="John Doe"
          disabled={loading}
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
      </CardContent>

      <CardActions>
        <Button
          text="Register user"
          loading={loading}
          onClick={onRegisterClick}
          className="w-full"
        />
      </CardActions>
    </Card>
  );
}
