"use client";

import React from "react";
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import cx from "classnames";
import { toast as sonnerToast } from "sonner";

export function toast(toast: Omit<ToastProps, "id">) {
  return sonnerToast.custom((id) => (
    <Toast id={id} title={toast.title} description={toast.description} variant={toast.variant} />
  ));
}

function Toast({ title, description, variant }: ToastProps) {
  return (
    <div
      className={cx(
        "flex rounded-lg shadow-lg ring-1 ring-black/5 w-full md:max-w-[364px] items-center p-4",
        ToastBackgroundColor[variant],
      )}
    >
      <div className="flex flex-1 items-center justify-center gap-3">
        <ToastIcon variant={variant} />

        <div className="w-full">
          <p className={cx("text-sm font-medium", ToastTitleColor[variant])}>{title}</p>

          {description && (
            <p className={cx("text-sm mt-1", ToastDescriptionColor[variant])}>{description}</p>
          )}
        </div>
      </div>
    </div>
  );
}

interface ToastProps {
  id: string | number;
  title: string;
  description?: string;
  variant: ToastVariant;
}

export type ToastVariant = "success" | "error" | "warning";

const ToastBackgroundColor: Record<ToastVariant, string> = {
  success: "bg-green-600 dark:bg-green-800",
  warning: "bg-yellow-100 dark:bg-yellow-700",
  error: "bg-red-600 dark:bg-red-800",
};

const ToastTitleColor: Record<ToastVariant, string> = {
  success: "text-green-100 dark:text-green-200",
  warning: "text-yellow-700 dark:text-yellow-100",
  error: "text-red-100 dark:text-red-200",
};

const ToastDescriptionColor: Record<ToastVariant, string> = {
  success: "text-green-200 dark:text-green-300",
  warning: "text-yellow-600 dark:text-yellow-200",
  error: "text-red-200 dark:text-red-300",
};

function ToastIcon({ variant }: ToastIconProps) {
  switch (variant) {
    case "success":
      return <CheckCircleIcon className="h-7.5 w-7.5 text-green-100 dark:text-green-200" />;
    case "warning":
      return (
        <ExclamationTriangleIcon className="w-7.5 h-7.5 text-yellow-700 dark:text-yellow-100" />
      );
    case "error":
      return <XCircleIcon className="w-7.5 h-7.5 text-red-100 dark:text-red-200" />;
  }
}

interface ToastIconProps {
  variant: ToastVariant;
}
