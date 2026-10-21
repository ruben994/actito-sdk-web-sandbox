import { useState } from "react";
import { getBadge } from "@actito/web-inbox";
import { useOnReady } from "@/actito/hooks/events/core/ready";
import { useOnBadgeUpdated } from "@/actito/hooks/events/inbox/badge-updated";

export function InboxBadge() {
  const [inboxBadge, setInboxBadge] = useState<number>(0);

  useOnReady(() => setInboxBadge(getBadge()));
  useOnBadgeUpdated((badge) => setInboxBadge(badge));

  if (inboxBadge === 0) return;

  return (
    <p className="flex items-center justify-center bg-indigo-400 text-white text-sm rounded-full px-1.5">
      {inboxBadge}
    </p>
  );
}
