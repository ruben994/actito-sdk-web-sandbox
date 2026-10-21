import { useState } from "react";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { getApplication, ActitoApplication } from "actito-web/core";
import { useOnReady } from "@/actito/hooks/events/core/ready";
import { Tooltip } from "@/components/tooltip";

export function ApplicationInfo() {
  const [application, setApplication] = useState<ActitoApplication>();

  useOnReady(() => {
    setApplication(getApplication());
  });

  if (!application) return;

  return (
    <div>
      <Tooltip
        label={
          <span>
            <b>Application:</b> {application.name} ({application.id})
          </span>
        }
        position="left"
        delayOnShow={false}
        className="max-w-50 sm:max-w-max"
      >
        <div className="relative rounded-full overflow-hidden w-6 h-6">
          <InformationCircleIcon className="absolute left-1/2 top-1/2 -translate-1/2 w-8 h-8 text-indigo-600 dark:text-indigo-500 bg-white" />
        </div>
      </Tooltip>
    </div>
  );
}
