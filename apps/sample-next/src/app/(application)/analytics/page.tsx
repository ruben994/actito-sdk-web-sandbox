"use client";

import { useCallback, useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/solid";
import { logCustom } from "actito-web/core";
import cx from "classnames";
import { ActitoLaunchBlocker } from "@/components/actito/actito-launch-blocker";
import { Button } from "@/components/button";
import { InputField } from "@/components/input-field";
import { PageHeader } from "@/components/page-header";
import { Switch } from "@/components/switch";
import { toast } from "@/components/toast";
import { Tooltip } from "@/components/tooltip";
import { logger } from "@/utils/logger";

export default function Analytics() {
  const [eventName, setEventName] = useState<string>("");
  const [stringAttributes, setStringAttributes] = useState<StringAttribute[]>([]);
  const [jsonAttributes, setJsonAttributes] = useState<string>("");
  const [advancedMode, setAdvancedMode] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const addAttribute = useCallback(() => {
    const newAttributes = [...stringAttributes];
    newAttributes.push({ key: "", value: "" });
    setStringAttributes(newAttributes);
  }, [stringAttributes]);

  const removeAttribute = useCallback((index: number) => {
    setStringAttributes((prev) => {
      const next = [...prev];
      next.splice(index, 1);
      return next;
    });
  }, []);

  const handleAttributeChange = useCallback(
    (index: number, key: string, value: string) => {
      const newAttributes = [...stringAttributes];
      newAttributes[index] = { key: key, value: value };
      setStringAttributes(newAttributes);
    },
    [stringAttributes],
  );

  const logCustomEvent = useCallback(async () => {
    let data;

    if (!advancedMode) {
      data = Object.fromEntries(stringAttributes.map((item) => [item.key, item.value]));
    }

    if (advancedMode && jsonAttributes) {
      try {
        data = JSON.parse(jsonAttributes);

        if (!(typeof data === "object" && data !== null && !Array.isArray(data))) {
          toast({
            title: "It was not possible to log the custom event.",
            description: "The attributes should be composed of key/value pairs.",
            variant: "error",
          });
          return;
        }
      } catch {
        toast({
          title: "It was not possible to log the custom event.",
          description: "The attributes JSON is not valid.",
          variant: "error",
        });
        return;
      }
    }

    try {
      setLoading(true);
      await logCustom(eventName, data);

      toast({
        title: "The custom event was logged successfully.",
        variant: "success",
      });
    } catch (error) {
      toast({
        title: "It was not possible to log the custom event.",
        description: `${error}`,
        variant: "error",
      });
      logger.error(`It was not possible to log the custom event: ${error}`);
    } finally {
      setLoading(false);
    }
  }, [eventName, stringAttributes, jsonAttributes, advancedMode]);

  return (
    <>
      <PageHeader
        title="Analytics"
        message="Easily create custom events. These events do not only provide insights for your business, they also can transform the way you automate your transactional messages."
      />

      <ActitoLaunchBlocker>
        <div className="flex flex-col items-start gap-6 md:max-w-2xl">
          <InputField
            id="event-name"
            label="Event name"
            placeholder="Type a name"
            value={eventName}
            className="w-full"
            onChange={(e) => setEventName(e.target.value)}
          />

          <div className="w-full">
            <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-200">
              Attributes
            </label>

            {advancedMode ? (
              <textarea
                id="event-json-attributes"
                placeholder="Write your JSON here"
                value={jsonAttributes}
                className="w-full h-40 min-h-10.5 mt-2 border-2 sm:text-sm border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-gray-900 dark:text-gray-200 placeholder:text-gray-400 dark:placeholder:text-neutral-500"
                onChange={(e) => setJsonAttributes(e.target.value)}
              />
            ) : (
              <>
                {stringAttributes.length === 0 ? (
                  <div className="h-30 w-full flex items-center justify-center border-2 bg-white dark:bg-neutral-900 border-neutral-300 dark:border-neutral-800 mt-2">
                    <span className="text-sm font-medium dark:text-neutral-200">
                      No attributes added yet.&nbsp;
                      <button
                        type="button"
                        onClick={addAttribute}
                        className="text-indigo-600 dark:text-indigo-400  underline underline-offset-4 cursor-pointer"
                      >
                        Add one?
                      </button>
                    </span>
                  </div>
                ) : (
                  <div className="relative w-full">
                    <div className="w-full border-2 bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 mt-2">
                      {stringAttributes.map((attribute, i) => (
                        <div
                          key={i}
                          className={cx(
                            "flex flex-row relative gap-4 w-full  border-b-neutral-200 dark:border-b-neutral-800 py-3 px-4 pb-5",
                            {
                              "border-b-2": i != stringAttributes.length - 1,
                            },
                          )}
                        >
                          <InputField
                            id={`event-basic-attribute-key-${i}`}
                            label="Key"
                            placeholder="Type a key"
                            value={attribute.key}
                            className="w-full"
                            onChange={(e) =>
                              handleAttributeChange(i, e.target.value, attribute.value)
                            }
                          />
                          <InputField
                            id={`event-basic-attribute-value-${i}`}
                            label="Value"
                            placeholder="Type a value"
                            value={attribute.value}
                            className="w-full"
                            onChange={(e) =>
                              handleAttributeChange(i, attribute.key, e.target.value)
                            }
                          />
                          <div className="absolute right-2 top-2 ">
                            <Tooltip label="Remove">
                              <button
                                type="button"
                                className="cursor-pointer hover:bg-neutral-100 hover:dark:bg-neutral-700 text-red-600 dark:text-red-400 rounded-md p-0.5"
                              >
                                <XMarkIcon
                                  className="w-5.5 h-5.5"
                                  onClick={() => removeAttribute(i)}
                                />
                              </button>
                            </Tooltip>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="relative w-max left-full -translate-x-full mt-4">
                      <Button
                        text="Add another attribute"
                        secondary={true}
                        onClick={addAttribute}
                      />
                    </div>
                  </div>
                )}
              </>
            )}
          </div>

          <Switch
            label="Advanced mode"
            checked={advancedMode}
            switchPosition="left"
            onChange={() => setAdvancedMode(!advancedMode)}
          />

          <div className="mt-4">
            <Button text="Log custom event" loading={loading} onClick={() => logCustomEvent()} />
          </div>
        </div>
      </ActitoLaunchBlocker>
    </>
  );
}

type StringAttribute = {
  key: string;
  value: string;
};
