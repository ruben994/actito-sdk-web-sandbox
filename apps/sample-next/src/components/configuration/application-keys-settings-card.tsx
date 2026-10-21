import { KeyIcon } from "@heroicons/react/24/outline";
import { useActitoConfiguration } from "@/actito/hooks/actito-configuration";
import { Card, CardContent, CardHeader } from "@/components/card";
import { InputField } from "@/components/input-field";

export function ApplicationKeysSettingsCard() {
  const { actitoOptions } = useActitoConfiguration();

  return (
    <Card>
      <CardHeader title="Application keys" icon={KeyIcon} />

      <CardContent>
        <InputField
          id="application-key"
          label="Application key"
          value={actitoOptions?.applicationKey ?? ""}
          disabled
        />

        <InputField
          id="application-secret"
          label="Application secret"
          value={actitoOptions?.applicationSecret ?? ""}
          disabled
        />
      </CardContent>
    </Card>
  );
}
