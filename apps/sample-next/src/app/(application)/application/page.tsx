"use client";

import { useEffect, useState } from "react";
import { getApplication, ActitoApplication } from "actito-web/core";
import { ActitoLaunchBlocker } from "@/components/actito/actito-launch-blocker";
import { Alert } from "@/components/alert";
import { PageHeader } from "@/components/page-header";

export default function Application() {
  const [application, setApplication] = useState<ActitoApplication>();

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setApplication(getApplication());
  }, []);

  return (
    <>
      <PageHeader
        title="Actito application"
        message="Inspect the cached application in your local storage."
      />

      <ActitoLaunchBlocker>
        <div className="md:max-w-2xl flex flex-col gap-4">
          {!application && (
            <Alert variant="warning" message="There is no cached application at the moment." />
          )}

          {application && (
            <pre className="bg-gray-200 dark:bg-neutral-800 text-gray-800 dark:text-gray-200 rounded p-4 overflow-scroll">
              {JSON.stringify(application, null, 2)}
            </pre>
          )}
        </div>
      </ActitoLaunchBlocker>
    </>
  );
}
