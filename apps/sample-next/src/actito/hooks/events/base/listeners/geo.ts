import { OnLocationUpdatedCallback, OnLocationUpdateErrorCallback } from "actito-web/geo";
import { TypedListener } from "@/actito/hooks/events/base";

export type ActitoGeoListener = LocationUpdatedListener | LocationUpdateErrorListener;

export type LocationUpdatedListener = TypedListener<"location_updated", OnLocationUpdatedCallback>;

export type LocationUpdateErrorListener = TypedListener<
  "location_update_error",
  OnLocationUpdateErrorCallback
>;
