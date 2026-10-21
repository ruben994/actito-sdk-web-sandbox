"use client";

import { useOnDeviceRegistered } from "@/actito/hooks/events/core/device-registered";
import { useOnReady } from "@/actito/hooks/events/core/ready";
import { useOnUnlaunched } from "@/actito/hooks/events/core/unlaunched";
import { useOnLocationUpdateError } from "@/actito/hooks/events/geo/location-update-error";
import { useOnLocationUpdated } from "@/actito/hooks/events/geo/location-updated";
import { useOnMessageActionExecuted } from "@/actito/hooks/events/in-app-messaging/message-action-executed";
import { useOnMessageActionFailedToExecute } from "@/actito/hooks/events/in-app-messaging/message-action-failed-to-execute";
import { useOnMessageFailedToPresent } from "@/actito/hooks/events/in-app-messaging/message-failed-to-present";
import { useOnMessageFinishedPresenting } from "@/actito/hooks/events/in-app-messaging/message-finished-presenting";
import { useOnMessagePresented } from "@/actito/hooks/events/in-app-messaging/message-presented";
import { useOnBadgeUpdated } from "@/actito/hooks/events/inbox/badge-updated";
import { useOnInboxUpdated } from "@/actito/hooks/events/inbox/inbox-updated";
import { useOnNotificationActionOpened } from "@/actito/hooks/events/push/notification-action-opened";
import { useOnNotificationOpened } from "@/actito/hooks/events/push/notification-opened";
import { useOnNotificationReceived } from "@/actito/hooks/events/push/notification-received";
import { useOnSystemNotificationReceived } from "@/actito/hooks/events/push/system-notification-received";
import { useOnUnknownNotificationReceived } from "@/actito/hooks/events/push/unknown-notification-received";
import { useOnNotificationActionExecuted } from "@/actito/hooks/events/push-ui/notification-action-executed";
import { useOnNotificationActionFailedToExecute } from "@/actito/hooks/events/push-ui/notification-action-failed-to-execute";
import { useOnNotificationActionWillExecute } from "@/actito/hooks/events/push-ui/notification-action-will-execute";
import { useOnNotificationCustomActionReceived } from "@/actito/hooks/events/push-ui/notification-custom-action-received";
import { useOnNotificationFailedToPresent } from "@/actito/hooks/events/push-ui/notification-failed-to-present";
import { useOnNotificationFinishedPresenting } from "@/actito/hooks/events/push-ui/notification-finished-presenting";
import { useOnNotificationPresented } from "@/actito/hooks/events/push-ui/notification-presented";
import { useOnNotificationWillPresent } from "@/actito/hooks/events/push-ui/notification-will-present";
import { logger } from "@/utils/logger";

export function ActitoEventLogger() {
  /**
   * Core events
   */
  useOnReady((application) => {
    logger.debug(`actito is ready`);
    logger.debug(application);
  });

  useOnUnlaunched(() => {
    logger.debug("unlaunched");
  });

  useOnDeviceRegistered((device) => {
    logger.debug("device registered");
    logger.debug(device);
  });

  /**
   * Geo events
   */
  useOnLocationUpdated((location) => {
    logger.debug("location updated");
    logger.debug(location);
  });

  useOnLocationUpdateError((error) => {
    logger.debug("location update error");
    logger.debug(error);
  });

  /**
   * In-app messaging events
   */
  useOnMessagePresented((message) => {
    logger.debug("message presented");
    logger.debug(message);
  });

  useOnMessageFinishedPresenting((message) => {
    logger.debug("message finished presenting");
    logger.debug(message);
  });

  useOnMessageFailedToPresent((message) => {
    logger.debug("message failed to present");
    logger.debug(message);
  });

  useOnMessageActionExecuted((message, action) => {
    logger.debug("message action executed");
    logger.debug({ message, action });
  });

  useOnMessageActionFailedToExecute((message, action) => {
    logger.debug("message action failed to execute");
    logger.debug({ message, action });
  });

  /**
   * Inbox events
   */
  useOnInboxUpdated(() => {
    logger.debug("inbox updated");
  });

  useOnBadgeUpdated((badge) => {
    logger.debug(`badge updated = ${badge}`);
  });

  /**
   * Push events
   */
  useOnNotificationReceived((notification, deliveryMechanism) => {
    logger.debug("notification received");
    logger.debug({ notification, deliveryMechanism });
  });

  useOnSystemNotificationReceived((notification) => {
    logger.debug("system notification received");
    logger.debug(notification);
  });

  useOnUnknownNotificationReceived((notification) => {
    logger.debug("unknown notification received");
    logger.debug(notification);
  });

  useOnNotificationOpened((notification) => {
    logger.debug("notification opened");
    logger.debug(notification);
  });

  useOnNotificationActionOpened((notification, action) => {
    logger.debug("notification opened");
    logger.debug({ notification, action });
  });

  /**
   * Push UI events
   */
  useOnNotificationWillPresent((notification) => {
    logger.debug("notification will present");
    logger.debug(notification);
  });

  useOnNotificationPresented((notification) => {
    logger.debug("notification presented");
    logger.debug(notification);
  });

  useOnNotificationFinishedPresenting((notification) => {
    logger.debug("notification finished presenting");
    logger.debug(notification);
  });

  useOnNotificationFailedToPresent((notification) => {
    logger.debug("notification failed to present");
    logger.debug(notification);
  });

  useOnNotificationActionWillExecute((notification, action) => {
    logger.debug("notification action will execute");
    logger.debug({ notification, action });
  });

  useOnNotificationActionExecuted((notification, action) => {
    logger.debug("notification action executed");
    logger.debug({ notification, action });
  });

  useOnNotificationActionFailedToExecute((notification, action) => {
    logger.debug("notification action failed to execute");
    logger.debug({ notification, action });
  });

  useOnNotificationCustomActionReceived((notification, action, target) => {
    logger.debug("notification custom action received");
    logger.debug({ notification, action, target });
  });

  return null;
}
