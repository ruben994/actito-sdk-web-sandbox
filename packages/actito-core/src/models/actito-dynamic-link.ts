/**
 * Represents a dynamic link configuration in Actito.
 *
 * A dynamic link defines a target destination that can be resolved or interpreted,
 * such as a deep link, in-app route, or external URL.
 */
export interface ActitoDynamicLink {
  /**
   * The target destination of the dynamic link.
   */
  readonly target: string;
}
