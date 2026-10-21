import cx from "classnames";

export function Skeleton({ className }: SkeletonProps) {
  return <div data-slot="skeleton" className={cx("bg-muted animate-pulse", className)} />;
}

export interface SkeletonProps {
  className?: string;
}
