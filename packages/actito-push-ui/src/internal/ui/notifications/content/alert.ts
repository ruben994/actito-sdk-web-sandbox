import type { ActitoNotification } from '@actito/web-core';

export async function createAlertContent(notification: ActitoNotification): Promise<HTMLElement> {
  const container = document.createElement('div');
  container.classList.add('actito__notification-alert');

  const attachment = createAttachmentSection(notification);
  if (attachment) container.appendChild(attachment);

  if (notification.title) {
    const title = container.appendChild(document.createElement('p'));
    title.classList.add('actito__notification-alert-title');
    title.innerHTML = notification.title;
  }

  if (notification.subtitle) {
    const subtitle = container.appendChild(document.createElement('p'));
    subtitle.classList.add('actito__notification-content-subtitle');
    subtitle.innerHTML = notification.subtitle;
  }

  const message = container.appendChild(document.createElement('p'));
  message.classList.add('actito__notification-alert-message');
  message.innerHTML = notification.message;

  return container;
}

function createAttachmentSection(notification: ActitoNotification): HTMLElement | undefined {
  const attachment = notification.attachments.find(({ mimeType }) => /image/.test(mimeType));
  if (!attachment?.uri) return undefined;

  const element = document.createElement('img');
  element.classList.add('actito__notification-alert-attachment');
  element.setAttribute('src', attachment.uri);

  return element;
}
