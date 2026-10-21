import type { ActitoNotification } from '@actito/web-core';

/**
 * Represents an item in the Actito user inbox.
 *
 * An {@link ActitoUserInboxItem} contains a notification and metadata about its
 * read state within the inbox. Inbox items can optionally have an expiration date.
 */
export interface ActitoUserInboxItem {
  /**
   * Unique identifier of the inbox item.
   */
  readonly id: string;

  /**
   * Notification associated with this inbox item.
   */
  readonly notification: ActitoNotification;

  /**
   * Timestamp indicating when the item was received.
   */
  readonly time: string;

  /**
   * Indicates whether the item has been opened by the user.
   */
  readonly opened: boolean;

  /**
   * Optional expiration timestamp of the item.
   */
  readonly expires?: string;
}
