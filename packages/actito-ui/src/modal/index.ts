import { createCloseButton } from '../buttons';

export function createModal(params?: ModalParams): HTMLElement {
  const modal = document.createElement('div');
  modal.classList.add('actito__modal');
  if (params?.alignment === 'top') modal.classList.add('actito__modal--top');

  modal.addEventListener('click', (e) => {
    // Prevent the backdrop from receiving events when content is clicked.
    e.preventDefault();
  });

  return modal;
}

export interface ModalParams {
  alignment?: 'top' | 'center';
}

export function createModalHeader({
  icon,
  title,
  onCloseButtonClicked,
}: ModalHeaderParams): HTMLElement {
  const headerElement = document.createElement('div');
  headerElement.classList.add('actito__modal-header');

  if (icon) {
    const iconElement = document.createElement('img');
    iconElement.classList.add('actito__modal-header-icon');
    iconElement.setAttribute('src', icon);
    headerElement.appendChild(iconElement);
  }

  const titleElement = document.createElement('p');
  titleElement.classList.add('actito__modal-header-title');
  titleElement.innerHTML = title ?? '';
  headerElement.appendChild(titleElement);

  headerElement.appendChild(createCloseButton({ onClick: onCloseButtonClicked }));

  return headerElement;
}

export interface ModalHeaderParams {
  icon?: string;
  title?: string;
  onCloseButtonClicked: OnModalCloseButtonClicked;
}

export type OnModalCloseButtonClicked = () => void;

export function createModalContent(): HTMLElement {
  const content = document.createElement('div');
  content.classList.add('actito__modal-content');

  return content;
}

export function createModalFooter(): HTMLElement {
  const footer = document.createElement('div');
  footer.classList.add('actito__modal-footer');

  return footer;
}
