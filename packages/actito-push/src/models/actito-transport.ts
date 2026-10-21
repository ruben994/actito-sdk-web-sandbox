/**
 * Identifies the transport mechanism used to deliver a notification.
 *
 * This value indicates the underlying push delivery service used by Actito.
 *
 * - `'Notificare'` - Temporary transport used for a registered device without
 * remote notifications enabled, before WebPush or Safari Website Push is available.
 * - `'WebPush'` - Website Push.
 * - `'WebsitePush'` - Safari Website Push.
 */
export type ActitoTransport = 'Notificare' | 'WebPush' | 'WebsitePush';
