import { CogIcon } from "@heroicons/react/24/outline";
import { Card, CardContent, CardHeader } from "@/components/card";
import { ConfigurationFormState } from "@/components/configuration/configuration-form-state";
import { InputField } from "@/components/input-field";
import { Switch } from "@/components/switch";

export function GeneralSettingsCard({ state, onChange }: GeneralSettingsCardProps) {
  return (
    <Card>
      <CardHeader title="General settings" icon={CogIcon} />

      <CardContent>
        <Switch
          label="Debug logging enabled"
          description="Enable this setting to print additional log messages."
          disabled={!onChange}
          checked={state.debugLoggingEnabled}
          onChange={(checked) => {
            onChange?.({
              ...state,
              debugLoggingEnabled: checked,
            });
          }}
        />

        <InputField
          id="application-version"
          label="Application version"
          placeholder="1.0.0"
          disabled={!onChange}
          value={state.applicationVersion}
          onChange={(e) => {
            onChange?.({
              ...state,
              applicationVersion: e.target.value,
            });
          }}
        />

        <InputField
          id="language"
          label="Language"
          placeholder="nl"
          disabled={!onChange}
          value={state.language}
          onChange={(e) => {
            onChange?.({
              ...state,
              language: e.target.value,
            });
          }}
        />
      </CardContent>
    </Card>
  );
}

interface GeneralSettingsCardProps {
  state: GeneralSettingsFormState;
  onChange?: GeneralSettingsOnChange;
}

type GeneralSettingsFormState = Pick<
  ConfigurationFormState,
  "debugLoggingEnabled" | "applicationVersion" | "language"
>;

type GeneralSettingsOnChange = (state: GeneralSettingsFormState) => void;
