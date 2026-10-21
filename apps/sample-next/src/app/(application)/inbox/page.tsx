"use client";

import { useCallback, useEffect, useState } from "react";
import { EnvelopeOpenIcon, TrashIcon } from "@heroicons/react/24/solid";
import {
  clearInbox,
  fetchInbox,
  markAllInboxItemsAsRead,
  markInboxItemAsRead,
  openInboxItem,
  removeInboxItem,
  ActitoInboxItem,
} from "actito-web/inbox";
import { presentNotification } from "actito-web/push-ui";
import { useActitoState } from "@/actito/hooks/actito-state";
import { useOnInboxUpdated } from "@/actito/hooks/events/inbox/inbox-updated";
import { ActitoLaunchBlocker } from "@/components/actito/actito-launch-blocker";
import { Alert } from "@/components/alert";
import { InboxItem } from "@/components/inbox";
import { PageHeader, PageHeaderAction } from "@/components/page-header";
import { ProgressIndicator } from "@/components/progress-indicator";
import { toast } from "@/components/toast";
import { Tooltip } from "@/components/tooltip";
import { logger } from "@/utils/logger";

export default function Inbox() {
  const state = useActitoState();
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [inboxState, setInboxState] = useState<InboxState>({ status: "loading" });

  useEffect(
    function reloadInbox() {
      if (state.status !== "launched") return;

      fetchInbox()
        .then(({ items }) => setInboxState({ status: "loaded", items }))
        .catch((error) => setInboxState({ status: "load-failed", error }));
    },
    [state, reloadTrigger],
  );

  const forceInboxReload = useCallback(() => {
    setReloadTrigger((prevState) => prevState + 1);
  }, []);

  useOnInboxUpdated(() => forceInboxReload());

  const openItem = useCallback(
    (item: ActitoInboxItem) => {
      if (inboxState.status !== "loaded") return;

      setInboxState({ ...inboxState, status: "handling-item", handlingItemId: item.id });
      openInboxItem(item)
        .then((notification) => presentNotification(notification))
        .catch((error) => {
          toast({
            title: "It was not possible to open the inbox item.",
            description: `${error}`,
            variant: "error",
          });
          logger.error(`It was not possible to open the inbox item: ${error}`);
        })
        .finally(() => setInboxState({ ...inboxState, status: "loaded" }));
    },
    [inboxState],
  );

  const markAllItemsAsRead = useCallback(() => {
    if (inboxState.status !== "loaded") return;

    setInboxState({ ...inboxState, status: "marking-all-items-as-read" });
    markAllInboxItemsAsRead()
      .then(() => {
        forceInboxReload();
        toast({
          title: "Every inbox item was marked as read.",
          variant: "success",
        });
      })
      .catch((error) => {
        setInboxState({ ...inboxState, status: "loaded" });
        toast({
          title: "It was not possible to mark every inbox item as read.",
          description: `${error}`,
          variant: "error",
        });
        logger.error(`It was not possible to mark every inbox item as read: ${error}`);
      });
  }, [forceInboxReload, inboxState]);

  const markItemAsRead = useCallback(
    (item: ActitoInboxItem) => {
      if (inboxState.status !== "loaded") return;

      setInboxState({ ...inboxState, status: "handling-item", handlingItemId: item.id });
      markInboxItemAsRead(item)
        .then(() => {
          forceInboxReload();
          toast({
            title: "The item was marked as read.",
            variant: "success",
          });
        })
        .catch((error) => {
          setInboxState({ ...inboxState, status: "loaded" });
          toast({
            title: "It was not possible to mark the inbox item as read.",
            description: `${error}`,
            variant: "error",
          });
          logger.error(`It was not possible to mark the inbox item as read: ${error}`);
        });
    },
    [forceInboxReload, inboxState],
  );

  const removeAllItems = useCallback(() => {
    if (inboxState.status !== "loaded") return;

    setInboxState({ ...inboxState, status: "removing-all-items" });
    clearInbox()
      .then(() => {
        forceInboxReload();
        toast({
          title: "All items have been removed.",
          variant: "success",
        });
      })
      .catch((error) => {
        setInboxState({ ...inboxState, status: "loaded" });
        toast({
          title: "It was not possible to remove all inbox items.",
          description: `${error}`,
          variant: "error",
        });
        logger.error(`It was not possible to remove all inbox items: ${error}`);
      });
  }, [forceInboxReload, inboxState]);

  const removeItem = useCallback(
    (item: ActitoInboxItem) => {
      if (inboxState.status !== "loaded") return;

      setInboxState({ ...inboxState, status: "handling-item", handlingItemId: item.id });
      removeInboxItem(item)
        .then(() => {
          forceInboxReload();
          toast({
            title: "The item was removed.",
            variant: "success",
          });
        })
        .catch((error) => {
          setInboxState({ ...inboxState, status: "loaded" });
          toast({
            title: "It was not possible to remove the inbox item.",
            description: `${error}`,
            variant: "error",
          });
          logger.error(`It was not possible to remove the inbox item: ${error}`);
        });
    },
    [forceInboxReload, inboxState],
  );

  const areAllInboxItemsRead = useCallback(() => {
    if (inboxState.status === "load-failed" || inboxState.status === "loading") return false;

    return inboxState.items.every((item) => item.opened);
  }, [inboxState]);

  const isInboxEmpty = useCallback(() => {
    if (inboxState.status === "load-failed" || inboxState.status === "loading") return true;

    return inboxState.items.length === 0;
  }, [inboxState]);

  return (
    <>
      <PageHeader
        title="Inbox"
        message="Easily manage your messages, conversations, and notifications in one centralized hub."
        actions={
          <>
            {state.status === "launched" && !isInboxEmpty() && (
              <>
                <Tooltip
                  label="Mark all as read"
                  disabled={inboxState.status !== "loaded" || areAllInboxItemsRead()}
                  hideOnMobile
                >
                  <PageHeaderAction
                    label="Mark all as read"
                    loading={inboxState.status === "marking-all-items-as-read"}
                    disabled={inboxState.status !== "loaded" || areAllInboxItemsRead()}
                    icon={EnvelopeOpenIcon}
                    onClick={markAllItemsAsRead}
                  />
                </Tooltip>

                <Tooltip label="Remove all" disabled={inboxState.status !== "loaded"} hideOnMobile>
                  <PageHeaderAction
                    label="Remove all"
                    loading={inboxState.status === "removing-all-items"}
                    disabled={inboxState.status !== "loaded"}
                    icon={TrashIcon}
                    onClick={removeAllItems}
                  />
                </Tooltip>
              </>
            )}
          </>
        }
      />

      <ActitoLaunchBlocker>
        {inboxState.status === "loading" && (
          <ProgressIndicator title="Loading..." message="Slower than a stormtrooper's aim." />
        )}

        {inboxState.status !== "loading" && inboxState.status !== "load-failed" && (
          <div className="flex flex-col gap-8">
            {inboxState.items.length > 0 ? (
              inboxState.items.map((item) => (
                <InboxItem
                  key={item.id}
                  item={item}
                  inboxState={inboxState}
                  onOpen={() => openItem(item)}
                  onMarkAsRead={() => markItemAsRead(item)}
                  onRemove={() => removeItem(item)}
                />
              ))
            ) : (
              <Alert message="The inbox is empty." variant="info" />
            )}
          </div>
        )}

        {inboxState.status === "load-failed" && (
          <Alert
            variant="error"
            message="Oops! There was an error loading the inbox."
            action={{
              label: "Reload",
              onClick: () => {
                setInboxState({ status: "loading" });
                forceInboxReload();
              },
            }}
          />
        )}
      </ActitoLaunchBlocker>
    </>
  );
}

export type InboxState =
  | LoadingInboxState
  | HandlingItemInboxState
  | MarkingAllItemsAsReadInboxState
  | RemovingAllItemsInboxState
  | SuccessInboxState
  | FailureInboxState;

type State<T extends string> = { status: T };

type LoadingInboxState = State<"loading">;

type HandlingItemInboxState = State<"handling-item"> & {
  items: ActitoInboxItem[];
  handlingItemId: string;
};

type MarkingAllItemsAsReadInboxState = State<"marking-all-items-as-read"> & {
  items: ActitoInboxItem[];
};

type RemovingAllItemsInboxState = State<"removing-all-items"> & {
  items: ActitoInboxItem[];
};

type SuccessInboxState = State<"loaded"> & {
  items: ActitoInboxItem[];
};

type FailureInboxState = State<"load-failed"> & {
  error: Error;
};
