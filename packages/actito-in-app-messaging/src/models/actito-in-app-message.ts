/**
 * Represents an in-app message delivered by Actito.
 *
 * An {@link ActitoInAppMessage} defines content that can be displayed directly within
 * the application. Messages may include text, images, and actions for user interaction.
 */
export interface ActitoInAppMessage {
  /**
   * Unique identifier of the in-app message.
   */
  readonly id: string;

  /**
   * Human-readable name of the message.
   */
  readonly name: string;

  /**
   * Type of the message.
   *
   * Supported message types:
   *
   * - `re.notifica.inappmessage.Banner`
   * - `re.notifica.inappmessage.Card`
   * - `re.notifica.inappmessage.Fullscreen`
   */
  readonly type: string;

  /**
   * List of contexts where the message should be displayed.
   *
   * Supported contexts:
   *
   * - `launch` — displayed when the application is launched
   * - `foreground` — displayed while the application is in the foreground
   */
  readonly context: string[];

  /**
   * Optional title of the message.
   */
  readonly title?: string;

  /**
   * Optional body text of the message.
   */
  readonly message?: string;

  /**
   * Optional portrait image URL associated with the message.
   */
  readonly image?: string;

  /**
   * Optional landscape image URL associated with the message.
   */
  readonly landscapeImage?: string;

  /**
   * Delay before displaying the message, in seconds.
   */
  readonly delaySeconds: number;

  /**
   * Optional primary action associated with the message.
   */
  readonly primaryAction?: ActitoInAppMessageAction;

  /**
   * Optional secondary action associated with the message.
   */
  readonly secondaryAction?: ActitoInAppMessageAction;
}

/**
 * Represents an action associated with an in-app message.
 *
 * An {@link ActitoInAppMessageAction} defines a user interaction option for an in-app
 * message, such as opening a URL or performing an operation.
 */
export interface ActitoInAppMessageAction {
  /**
   * Optional label displayed for the action.
   */
  readonly label?: string;

  /**
   * Indicates whether the action is destructive.
   */
  readonly destructive: boolean;

  /**
   * Optional target URL triggered by the action.
   */
  readonly url?: string;
}
