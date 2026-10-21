import type { ActitoNotification } from '@actito/web-core';

export async function createImageContent(notification: ActitoNotification): Promise<HTMLElement> {
  const allowedContentTypes = [
    're.notifica.content.JPEG',
    're.notifica.content.JPG',
    're.notifica.content.PNG',
    're.notifica.content.GIF',
  ];

  const content = notification.content.filter(({ type }) => allowedContentTypes.includes(type));
  if (!content.length) throw new Error(`Invalid content for notification '${notification.type}'.`);

  const slider = document.createElement('div');
  slider.classList.add('actito__notification-image-slider');

  content.forEach((element) => {
    const item = document.createElement('div');
    item.classList.add('actito__notification-image-slider-item');
    slider.appendChild(item);

    const image = document.createElement('img');
    image.classList.add('actito__notification-image-slider-image');
    image.setAttribute('src', element.data);
    item.appendChild(image);
  });

  return slider;
}
