import type { ActitoUserInboxItem } from './actito-user-inbox-item';

/**
 * Represents the response returned when fetching a user's inbox.
 *
 * An {@link ActitoUserInboxResponse} contains the total number of inbox items,
 * the number of unread items, and the list of items themselves.
 */
export interface ActitoUserInboxResponse {
  /**
   * List of inbox items for the user.
   */
  readonly items: ActitoUserInboxItem[];

  /**
   * Total number of items in the user's inbox.
   */
  readonly count: number;

  /**
   * Number of unread items in the user's inbox.
   */
  readonly unread: number;
}
