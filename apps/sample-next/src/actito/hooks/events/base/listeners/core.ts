import {
  OnDeviceRegisteredCallback,
  OnReadyCallback,
  OnUnlaunchedCallback,
} from "actito-web/core";
import { TypedListener } from "@/actito/hooks/events/base";

export type ActitoCoreListener = ReadyListener | UnlaunchedListener | DeviceRegisteredListener;

export type ReadyListener = TypedListener<"ready", OnReadyCallback>;

export type UnlaunchedListener = TypedListener<"unlaunched", OnUnlaunchedCallback>;

export type DeviceRegisteredListener = TypedListener<
  "device_registered",
  OnDeviceRegisteredCallback
>;
