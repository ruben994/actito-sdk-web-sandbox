import type { ActitoDoNotDisturb } from './actito-do-not-disturb';

/**
 * Represents a device registered in Actito.
 *
 * An {@link ActitoDevice} is associated with a physical device and may be optionally
 * linked to a user. It contains timezone information, user-related metadata,
 * and optional configuration such as do-not-disturb settings.
 */
export interface ActitoDevice {
  /**
   * Unique identifier of the device.
   */
  readonly id: string;

  /**
   * Optional identifier of the user associated with the device.
   */
  readonly userId?: string;

  /**
   * Optional display name of the associated user.
   */
  readonly userName?: string;

  /**
   * Time zone offset of the device in hours relative to UTC.
   */
  readonly timeZoneOffset: number;

  /**
   * Optional {@link ActitoDoNotDisturb} configuration for the device.
   */
  readonly dnd?: ActitoDoNotDisturb;

  /**
   * Custom user data associated with the device.
   *
   * This map contains key–value pairs representing user attributes or profile
   * information linked to the device.
   */
  readonly userData: Record<string, string>;
}
