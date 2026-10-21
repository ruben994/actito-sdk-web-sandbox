import type { ActitoNotification } from '@actito/web-core';
import { sanitizeContentUrl } from '~/internal/utils/notification-content';

export async function createUrlContent(notification: ActitoNotification): Promise<HTMLElement> {
  const content = notification.content.find(({ type }) => type === 're.notifica.content.URL');
  if (!content) throw new Error(`Invalid content for notification '${notification.type}'.`);

  const url = sanitizeContentUrl(content);

  const iframe = document.createElement('iframe');
  iframe.classList.add('actito__notification-url-iframe');
  iframe.setAttribute('src', url);

  return iframe;
}
