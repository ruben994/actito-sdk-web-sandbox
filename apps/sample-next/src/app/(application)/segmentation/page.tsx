"use client";

import { useCallback, useEffect, useState } from "react";
import { TagIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { addTag, fetchTags, removeTag } from "actito-web/core";
import { useActitoState } from "@/actito/hooks/actito-state";
import { ActitoLaunchBlocker } from "@/components/actito/actito-launch-blocker";
import { Alert } from "@/components/alert";
import { Button } from "@/components/button";
import { InputField } from "@/components/input-field";
import { PageHeader } from "@/components/page-header";
import { ProgressIndicator } from "@/components/progress-indicator";
import { toast } from "@/components/toast";
import { Tooltip } from "@/components/tooltip";
import { logger } from "@/utils/logger";

export default function Segmentation() {
  const state = useActitoState();
  const [reloadTrigger, setReloadTrigger] = useState<number>(0);
  const [segmentationState, setSegmentationState] = useState<SegmentationState>({ status: "idle" });
  const [tag, setTag] = useState("");

  useEffect(
    function reloadDeviceTags() {
      if (state.status !== "launched") return;

      fetchTags()
        .then((tags) => {
          if (tags.length) {
            setSegmentationState({ status: "success", tags });
          } else {
            setSegmentationState({ status: "empty" });
          }
        })
        .catch((error) => {
          setSegmentationState({ status: "failure" });
          logger.error(`It was not possible to fetch the device tags: ${error}`);
        });
    },
    [state, reloadTrigger],
  );

  const createTagCallback = useCallback(async () => {
    try {
      setSegmentationState({ status: "loading" });
      await addTag(tag);
      setTag("");
      setReloadTrigger((prevState) => prevState + 1);
      toast({
        title: "The tag was created.",
        variant: "success",
      });
    } catch (error) {
      setSegmentationState({ status: "failure" });
      toast({
        title: "It was not possible to create a new tag.",
        description: `${error}`,
        variant: "error",
      });
      logger.error(`It was not possible to create a new tag: ${error}`);
    }
  }, [tag]);

  const removeTagCallback = useCallback(async (tag: string) => {
    try {
      setSegmentationState({ status: "loading" });
      await removeTag(tag);
      setReloadTrigger((prevState) => prevState + 1);
      toast({
        title: "The tag was removed.",
        variant: "success",
      });
    } catch (error) {
      setSegmentationState({ status: "failure" });
      toast({
        title: "It was not possible to remove the tag.",
        description: `${error}`,
        variant: "error",
      });
      logger.error(`It was not possible to remove the tag: ${error}`);
    }
  }, []);

  return (
    <>
      <PageHeader
        title="Segmentation"
        message="Segment your audience with a flexible tag structure."
      />

      <ActitoLaunchBlocker>
        <div className="md:max-w-2xl">
          <div className="flex flex-row gap-4 mb-10 items-end">
            <InputField
              className="grow"
              id="tag-input"
              label="Create a new tag"
              type="text"
              placeholder="e.g. tag_newsletter"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
            />

            <Button text="Create" onClick={createTagCallback} />
          </div>

          {segmentationState.status === "loading" && (
            <ProgressIndicator title="Loading..." message="Slower than a stormtrooper's aim." />
          )}

          {segmentationState.status === "empty" && (
            <Alert variant="info" message="There's nothing to see here. Move along now..." />
          )}

          {segmentationState.status === "failure" && (
            <Alert
              variant="error"
              message="Oops! The Force is not strong with this one. Check your console for more information."
            />
          )}

          {segmentationState.status === "success" && (
            <div className="flex flex-col gap-4">
              {segmentationState.tags.map((tag) => (
                <TagCard key={tag} tag={tag} onClick={() => removeTagCallback(tag)} />
              ))}
            </div>
          )}
        </div>
      </ActitoLaunchBlocker>
    </>
  );
}

type SegmentationState = IdleState | LoadingState | SuccessState | EmptyState | FailureState;

type State<T extends string> = { status: T };

type IdleState = State<"idle">;

type LoadingState = State<"loading">;

type SuccessState = State<"success"> & {
  tags: string[];
};

type EmptyState = State<"empty">;

type FailureState = State<"failure">;

function TagCard({ tag, onClick }: { tag: string; onClick: () => void }) {
  return (
    <div className="flex flex-row gap-4 items-center bg-white dark:bg-neutral-900 rounded shadow-md p-3">
      <div className="p-2.5 text-gray-400">
        <TagIcon className="h-6 w-6" />
      </div>

      <p className="grow text-lg font-medium text-gray-900 truncate dark:text-white">{tag}</p>

      <div className="mr-1.5">
        <Tooltip label="Remove">
          <button
            type="button"
            className="cursor-pointer hover:bg-neutral-100 hover:dark:bg-neutral-700 text-red-600 dark:text-red-400 rounded-md p-0.5"
          >
            <XMarkIcon className="w-6.5 h-6.5" onClick={onClick} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
