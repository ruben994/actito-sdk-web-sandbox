import { ComponentType, PropsWithoutRef, ReactNode, SVGProps } from "react";
import { Spinner } from "@/components/spinner";

export function PageHeader({ title, message, actions }: PageHeaderProps) {
  return (
    <div className="mb-10 flex flex-col gap-x-8 gap-y-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="mt-2 text-2xl font-bold text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight dark:text-white">
          {title}
        </h2>

        <span className="mt-1 sm:mt-0 text-sm text-gray-500 dark:text-gray-300">{message}</span>
      </div>

      {actions && <div className="flex shrink-0 flex-wrap gap-3">{actions}</div>}
    </div>
  );
}

export interface PageHeaderProps {
  title: string;
  message: string;
  actions?: ReactNode;
}

export function PageHeaderAction({
  label,
  disabled,
  loading,
  icon: Icon,
  onClick,
}: PageHeaderActionProps) {
  return (
    <button
      type="button"
      className="inline-flex items-center rounded-md p-3 bg-indigo-100 text-indigo-600 shadow-sm hover:not-disabled:bg-indigo-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 not-disabled:cursor-pointer disabled:pointer-events-none disabled:opacity-50 transition"
      onClick={onClick}
      disabled={disabled || loading}
    >
      {loading && <Spinner className="mr-2 w-5 h-5" />}
      <Icon className="h-5 w-5" aria-hidden="true" />
      <span className="ml-2 sm:hidden">{label}</span>
    </button>
  );
}

export interface PageHeaderActionProps {
  label: string;
  disabled?: boolean;
  loading?: boolean;
  icon: ComponentType<PropsWithoutRef<SVGProps<SVGSVGElement>>>;
  onClick: () => void;
}
