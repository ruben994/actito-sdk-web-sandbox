import { useState } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { getBadge } from "actito-web/inbox";
import Link from "next/link";
import { useOnReady } from "@/actito/hooks/events/core/ready";
import { useOnBadgeUpdated } from "@/actito/hooks/events/inbox/badge-updated";
import { Tooltip } from "@/components/tooltip";

export function InboxBell() {
  const [badge, setBadge] = useState<number>(0);

  useOnReady(() => setBadge(getBadge()));
  useOnBadgeUpdated((badge) => setBadge(badge));

  return (
    <Tooltip label="Inbox" position="bottom" className="-mt-2">
      <Link
        href="/inbox"
        className="group p-2.5 text-gray-400 hover:text-gray-500 dark:text-gray-200 dark:hover:text-gray-500"
      >
        <span className="sr-only">View notifications</span>
        <div className="relative">
          <BellIcon className="h-6 w-6" aria-hidden="true" />

          {!!badge && badge > 0 && (
            <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-indigo-400 rounded-full transform -translate-x-1/4 group-hover:bg-indigo-600" />
          )}
        </div>
      </Link>
    </Tooltip>
  );
}
