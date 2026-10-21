import { Switch as HeadlessSwitch, Field, Label, Description } from "@headlessui/react";
import cx from "classnames";
import { Spinner } from "@/components/spinner";

export function Switch({
  label,
  description,
  disabled = false,
  checked,
  loading,
  switchPosition = "right",
  onChange,
}: SwitchProps) {
  return (
    <Field
      as="div"
      className={cx("flex items-center justify-between gap-3", {
        "flex-row-reverse": switchPosition === "left",
      })}
    >
      {label && (
        <span className="flex grow flex-col">
          <Label
            as="span"
            className="text-sm font-medium leading-6 text-gray-900 dark:text-gray-200"
            passive
          >
            {label}
          </Label>

          {description && (
            <Description as="span" className="text-sm text-gray-500 dark:text-neutral-500">
              {description}
            </Description>
          )}
        </span>
      )}

      <div className="flex gap-2.5">
        {loading && <Spinner className="w-6 h-6 dark:text-neutral-400" />}

        <HeadlessSwitch
          disabled={disabled || loading}
          checked={checked}
          onChange={onChange}
          className={cx(
            "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:cursor-not-allowed dark:focus:ring-offset-neutral-900",
            {
              "bg-indigo-600": checked,
              "bg-gray-200 dark:bg-neutral-800": !checked,
            },
          )}
        >
          <span
            aria-hidden="true"
            className={cx(
              "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out",
              {
                "translate-x-5": checked,
                "translate-x-0": !checked,
              },
            )}
          />
        </HeadlessSwitch>
      </div>
    </Field>
  );
}

export interface SwitchProps {
  label?: string;
  description?: string;
  disabled?: boolean;
  checked: boolean;
  loading?: boolean;
  switchPosition?: "left" | "right";
  onChange?: (checked: boolean) => void;
}
