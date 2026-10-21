/**
 * Defines a do-not-disturb time window for an Actito device.
 *
 * During this period, notifications or communications may be suppressed.
 */
export interface ActitoDoNotDisturb {
  /**
   * Start time of the do-not-disturb period.
   */
  readonly start: string;

  /**
   * End time of the do-not-disturb period.
   */
  readonly end: string;
}
