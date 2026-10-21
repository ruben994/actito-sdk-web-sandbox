import { PropsWithChildren, ReactNode } from "react";
import cx from "classnames";

export function Tooltip({
  label,
  disabled,
  position = "top",
  delayOnShow = true,
  hideOnMobile = false,
  className,
  children,
}: TooltipProps) {
  return (
    <div className="group relative flex flex-col z-50">
      {children}

      {!disabled && (
        <div
          className={cx(
            `pointer-events-none absolute opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-active:opacity-100 group-focus:opacity-100`,
            {
              "bottom-full mb-2 left-1/2 -translate-x-1/2": position === "top",
              "top-full mt-2 left-1/2 -translate-x-1/2": position === "bottom",
              "right-full mr-2 top-1/2 -translate-y-1/2": position === "left",
              "group-hover:delay-500": delayOnShow,
              "hidden sm:block": hideOnMobile,
            },
          )}
        >
          <div
            className={`w-max relative items-center rounded bg-white dark:bg-neutral-700 text-neutral-900 dark:text-white p-2 text-center text-xs shadow-md shadow-neutral-300 dark:shadow-none ${className}`}
          >
            {label}
            <div
              className={cx("absolute border-4 border-transparent", {
                "top-full left-1/2 -translate-x-1/2 border-t-white dark:border-t-neutral-700":
                  position === "top",
                "bottom-full left-1/2 -translate-x-1/2 border-b-white dark:border-b-neutral-700":
                  position === "bottom",
                "left-full top-1/2 -translate-y-1/2 border-l-white dark:border-l-neutral-700":
                  position === "left",
              })}
            ></div>
          </div>
        </div>
      )}
    </div>
  );
}

interface TooltipProps extends PropsWithChildren {
  label: string | ReactNode;
  disabled?: boolean;
  position?: "top" | "bottom" | "left";
  delayOnShow?: boolean;
  hideOnMobile?: boolean;
  className?: string;
}
