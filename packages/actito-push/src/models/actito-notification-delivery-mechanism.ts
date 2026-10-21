/**
 * Indicates the delivery mechanism of a notification.
 *
 * This enum is used to describe how a notification was delivered
 * to the device.
 *
 * - `'standard'`  - The notification is displayed normally to the user, with
 * alerts, sounds, or badges as configured.
 * - `'silent'` - The notification is delivered silently without alerting the user.
 */
export type ActitoNotificationDeliveryMechanism = 'standard' | 'silent';
