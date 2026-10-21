import { classNames } from "@/utils/css";

export function Spinner({ className }: SpinnerProps) {
  return (
    <span
      className={classNames(
        "inline-block h-4 w-4 bg-current animate-spin [mask:url('/assets/circular-spinner.svg')_no-repeat_center/contain] [-webkit-mask:url('/assets/circular-spinner.svg')_no-repeat_center/contain]",
        className ?? "",
      )}
    />
  );
}

export interface SpinnerProps {
  className?: string;
}
