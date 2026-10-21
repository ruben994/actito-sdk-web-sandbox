/**
 * Represents a geographic location captured from a device.
 *
 * An {@link ActitoLocation} contains latitude, longitude, altitude, movement, and
 * accuracy information, along with a timestamp indicating when the location was
 * recorded.
 */
export interface ActitoLocation {
  /**
   * Latitude of the location in decimal degrees.
   */
  readonly latitude: number;

  /**
   * Longitude of the location in decimal degrees.
   */
  readonly longitude: number;

  /**
   * Optional altitude of the location in meters above sea level.
   */
  readonly altitude?: number;

  /**
   * Optional direction of travel in degrees relative to true north.
   *
   * This value represents the device's course of movement.
   */
  readonly course?: number;

  /**
   * Optional speed of the device in meters per second.
   */
  readonly speed?: number;

  /**
   * Optional horizontal accuracy of the location measurement in meters.
   */
  readonly horizontalAccuracy?: number;

  /**
   * Optional vertical accuracy of the location measurement in meters.
   */
  readonly verticalAccuracy?: number;

  /**
   * Timestamp indicating when the location was recorded.
   */
  readonly timestamp: number;
}
