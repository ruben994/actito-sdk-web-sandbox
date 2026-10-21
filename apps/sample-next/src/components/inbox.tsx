import { XMarkIcon, EnvelopeOpenIcon } from "@heroicons/react/24/solid";
import { ActitoNotificationAttachment } from "actito-web/core";
import { ActitoInboxItem } from "actito-web/inbox";
import cx from "classnames";
import { formatDistanceToNow, parseISO } from "date-fns";
import Image from "next/image";
import { InboxState } from "@/app/(application)/inbox/page";
import { Spinner } from "@/components/spinner";
import { Tooltip } from "@/components/tooltip";

export function InboxItem({ item, inboxState, onOpen, onMarkAsRead, onRemove }: InboxItemProps) {
  return (
    <div
      className={cx("bg-white dark:bg-neutral-900 rounded shadow-md md:max-w-2xl p-3 relative", {
        "cursor-pointer": inboxState.status === "loaded",
      })}
      onClick={onOpen}
    >
      <div
        className={cx("flex items-center space-x-4 transition", {
          "opacity-40":
            (inboxState.status === "handling-item" && inboxState.handlingItemId === item.id) ||
            inboxState.status === "marking-all-items-as-read" ||
            inboxState.status === "removing-all-items",
        })}
      >
        <InboxItemImage attachment={item.notification.attachments[0]} />

        <div className="flex-1 min-w-0">
          {item.notification.title && (
            <p className="text-lg font-medium text-gray-900 truncate dark:text-white">
              {item.notification.title}
            </p>
          )}

          {item.notification.subtitle && (
            <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
              {item.notification.subtitle}
            </p>
          )}

          <p className="text-sm text-gray-500 truncate dark:text-gray-200">
            {item.notification.message}
          </p>

          <p className="text-xs text-gray-500 truncate dark:text-gray-200">
            {item.notification.type}
          </p>
        </div>

        <div className="flex flex-col items-end justify-between h-24 space-y-1 relative">
          <div className="flex items-center justify-center gap-0.5">
            <InboxItemMarkAsReadButton
              disabled={inboxState.status !== "loaded"}
              markedAsRead={item.opened}
              onClick={onMarkAsRead}
            />
            <InboxItemRemoveButton disabled={inboxState.status !== "loaded"} onClick={onRemove} />
          </div>

          {!item.opened && <div className="mb-2.5 mr-1.5 w-2 h-2 rounded-full bg-blue-500" />}

          <div className="mr-1.5 text-sm text-gray-900 dark:text-white">
            {formatDistanceToNow(parseISO(item.time), { addSuffix: true })}
          </div>
        </div>
      </div>
      {inboxState.status === "handling-item" && inboxState.handlingItemId === item.id && (
        <Spinner className="w-5.5 h-5.5 text-neutral-600 dark:text-neutral-400 absolute top-4 right-20" />
      )}
    </div>
  );
}

export interface InboxItemProps {
  item: ActitoInboxItem;
  inboxState: InboxState;
  disabled?: boolean;
  loading?: boolean;
  onOpen: () => void;
  onMarkAsRead: () => void;
  onRemove: () => void;
}

function InboxItemImage({ attachment }: InboxItemImageProps) {
  return (
    <div className="shrink-0">
      {attachment && (
        <Image
          width={128}
          height={96}
          className="w-32 h-24 rounded object-cover"
          src={attachment.uri}
          alt="Notification attachment"
          priority
        />
      )}

      {!attachment && <div className="w-32 h-24 rounded bg-gray-200 dark:bg-neutral-800" />}
    </div>
  );
}

interface InboxItemImageProps {
  attachment?: ActitoNotificationAttachment;
}

function InboxItemRemoveButton({ disabled, onClick }: InboxItemRemoveButtonProps) {
  return (
    <Tooltip label="Remove" disabled={disabled}>
      <button
        className="flex items-center justify-center w-7 h-7 rounded-md text-red-600 dark:text-red-400 hover:not-disabled:bg-neutral-100 dark:hover:not-disabled:bg-neutral-700"
        disabled={disabled}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <XMarkIcon className="h-6.5 w-6.5" />
      </button>
    </Tooltip>
  );
}

interface InboxItemRemoveButtonProps {
  disabled?: boolean;
  onClick: () => void;
}

function InboxItemMarkAsReadButton({
  disabled,
  markedAsRead,
  onClick,
}: InboxItemMarkAsReadButtonProps) {
  return (
    <Tooltip label="Mark as read" disabled={disabled || markedAsRead}>
      <button
        className={cx(
          "flex items-center justify-center w-7 h-7 rounded-md hover:not-disabled:bg-neutral-100 dark:hover:not-disabled:bg-neutral-700",
          {
            "text-neutral-300 dark:text-neutral-600": markedAsRead,
            "text-neutral-500 dark:text-neutral-300": !markedAsRead,
          },
        )}
        disabled={disabled || markedAsRead}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <EnvelopeOpenIcon className="h-5 w-5" />
      </button>
    </Tooltip>
  );
}

interface InboxItemMarkAsReadButtonProps {
  disabled?: boolean;
  markedAsRead: boolean;
  onClick: () => void;
}
