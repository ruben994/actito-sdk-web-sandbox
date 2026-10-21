import { ComponentType, PropsWithChildren, PropsWithoutRef, SVGProps } from "react";
import { Spinner } from "@/components/spinner";

export function Card({ children, loading }: CardProps) {
  return (
    <div className="bg-white rounded-lg shadow dark:bg-neutral-900 overflow-hidden relative">
      {loading && (
        <Spinner className="text-neutral-600 dark:text-neutral-300 absolute w-8 h-8 top-5 right-6" />
      )}
      {children}
    </div>
  );
}

interface CardProps extends PropsWithChildren {
  loading?: boolean;
}

export function CardHeader({ title, icon: Icon }: CardHeaderProps) {
  return (
    <div className="p-6 border-b border-gray-200 dark:border-none dark:bg-neutral-800 flex items-center gap-3">
      {Icon && <Icon className="h-6 w-6 text-gray-400 dark:text-gray-200" />}
      <h5 className="text-base font-semibold leading-6 text-gray-900 dark:text-gray-200">
        {title}
      </h5>
    </div>
  );
}

interface CardHeaderProps {
  title: string;
  icon?: ComponentType<PropsWithoutRef<SVGProps<SVGSVGElement>>>;
}

export function CardContent({ children }: PropsWithChildren) {
  return <div className="flex grow flex-col gap-6 p-6">{children}</div>;
}

export function CardActions({ children }: PropsWithChildren) {
  return (
    <div className="flex shrink-0 flex-row justify-between sm:justify-end gap-6 p-6 border-t border-gray-200 dark:border-none">
      {children}
    </div>
  );
}
