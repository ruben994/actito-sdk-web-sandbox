import { Logger } from "@actito/web-logger";

export const logger = new Logger("sample-next", {
  group: "sample",
  includeName: false,
  includeLogLevel: false,
});

logger.setLogLevel("debug");
