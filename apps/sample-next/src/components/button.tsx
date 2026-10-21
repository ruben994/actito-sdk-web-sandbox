import cx from "classnames";
import { Spinner } from "@/components/spinner";

export function Button({ text, disabled, loading, secondary, className, onClick }: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || loading}
      className={cx(
        "flex items-center justify-center gap-2 sm:w-auto cursor-pointer rounded-md px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-200 disabled:text-gray-400 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-600 disabled:cursor-not-allowed",
        {
          "bg-neutral-500 dark:bg-neutral-700 hover:bg-neutral-400 dark:hover:bg-neutral-600":
            secondary,
          "bg-indigo-600 hover:bg-indigo-500": !secondary,
        },
        className,
      )}
    >
      {loading && <Spinner />}
      {text}
    </button>
  );
}

export interface ButtonProps {
  text: string;
  disabled?: boolean;
  loading?: boolean;
  secondary?: boolean;
  className?: string;
  onClick: () => void;
}
