/**
 * Represents a notification delivered by Actito.
 *
 * An {@link ActitoNotification} contains the payload of a notification, including
 * its content, actions, attachments, and additional metadata.
 * Notifications may be partial, meaning that only a subset of fields is provided
 * and additional data may need to be fetched.
 */
export interface ActitoNotification {
  /**
   * Unique identifier of the notification.
   */
  readonly id: string;

  /**
   * Indicates whether this notification is partial.
   *
   * When `true`, the notification does not contain the full payload.
   */
  readonly partial: boolean;

  /**
   * Type of the notification.
   *
   * This value is defined by Actito and is used to distinguish different
   * notification behaviors.
   *
   * Supported notification types:
   *
   * - `re.notifica.notification.None`
   * - `re.notifica.notification.Alert`
   * - `re.notifica.notification.InAppBrowser`
   * - `re.notifica.notification.WebView`
   * - `re.notifica.notification.URL`
   * - `re.notifica.notification.URLResolver`
   * - `re.notifica.notification.URLScheme`
   * - `re.notifica.notification.Image`
   * - `re.notifica.notification.Video`
   * - `re.notifica.notification.Map`
   * - `re.notifica.notification.Rate`
   * - `re.notifica.notification.Passbook`
   * - `re.notifica.notification.Store`
   */
  readonly type: string;

  /**
   * Timestamp indicating when the notification was generated.
   */
  readonly time: string;

  /**
   * Optional title displayed in the notification.
   */
  readonly title?: string;

  /**
   * Optional subtitle displayed in the notification.
   */
  readonly subtitle?: string;

  /**
   * Main message body of the notification.
   */
  readonly message: string;

  /**
   * Structured content elements associated with the notification.
   */
  readonly content: ActitoNotificationContent[];

  /**
   * List of actions that can be performed from the notification.
   */
  readonly actions: ActitoNotificationAction[];

  /**
   * List of attachments included with the notification.
   */
  readonly attachments: ActitoNotificationAttachment[];

  /**
   * Collection of key-value pairs used to add extra information to the notification.
   */
  readonly extra: ActitoNotificationExtra;
}

/**
 * Represents a structured content element within a notification.
 */
export interface ActitoNotificationContent {
  /**
   * The content type identifier. These types include:
   *
   * Supported content types:
   *
   * - `re.notifica.content.Text`
   * - `re.notifica.content.HTML`
   * - `re.notifica.content.URL`
   * - `re.notifica.content.GIF`
   * - `re.notifica.content.JPEG`
   * - `re.notifica.content.PNG`
   * - `re.notifica.content.Marker`
   * - `re.notifica.content.PKPass`
   * - `re.notifica.content.Pass`
   * - `re.notifica.content.YouTube`
   * - `re.notifica.content.Vimeo`
   * - `re.notifica.content.HTML5Video`
   * - `re.notifica.content.GooglePlayDetails`
   * - `re.notifica.content.GooglePlayDeveloper`
   * - `re.notifica.content.GooglePlaySearch`
   * - `re.notifica.content.GooglePlayCollection`
   * - `re.notifica.content.AppGalleryDetails`
   * - `re.notifica.content.AppGallerySearch`
   * - `re.notifica.content.AppStore`
   */
  readonly type: string;

  /**
   * The content payload.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  readonly data: any;
}

/**
 * Represents an action that can be triggered from a notification.
 */
export interface ActitoNotificationAction {
  /**
   * The ID of the action.
   */
  readonly id: string;

  /**
   * Type of the action.
   *
   * Supported action types:
   *
   * - `re.notifica.action.App`
   * - `re.notifica.action.Browser`
   * - `re.notifica.action.Callback`
   * - `re.notifica.action.Custom`
   * - `re.notifica.action.Mail`
   * - `re.notifica.action.SMS`
   * - `re.notifica.action.Telephone`
   * - `re.notifica.action.InAppBrowser`
   */
  readonly type: string;

  /**
   * User-visible label of the action.
   */
  readonly label: string;

  /**
   * Optional target associated with the action.
   */
  readonly target?: string;

  /**
   * Whether the action requires keyboard input.
   */
  readonly keyboard: boolean;

  /**
   * Whether the action requires camera input.
   */
  readonly camera: boolean;
}

/**
 * Represents an attachment included with a notification.
 */
export interface ActitoNotificationAttachment {
  /**
   * MIME type of the attachment.
   */
  readonly mimeType: string;

  /**
   * URI pointing to the attachment resource.
   */
  readonly uri: string;
}

/**
 * Represents extra data included in a notification.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ActitoNotificationExtra = Record<string, any>;
