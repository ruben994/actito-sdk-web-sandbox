import { createBackdrop, createRoot } from '@actito/web-ui';
import { ActionType } from '~/internal/types/action-type';
import { ROOT_ELEMENT_IDENTIFIER } from '~/internal/ui/root';
import type { ActitoInAppMessage } from '~/models/actito-in-app-message';

export function createBannerComponent(params: CreateBannerComponentParams): HTMLElement {
  const { dismiss } = params;

  const root = createRoot(ROOT_ELEMENT_IDENTIFIER);
  root.appendChild(createBackdrop(() => dismiss()));
  root.appendChild(createBannerElement(params));

  return root;
}

export interface CreateBannerComponentParams {
  readonly message: ActitoInAppMessage;
  readonly dismiss: () => void;
  readonly executeAction: (type: ActionType) => void;
}

function createBannerElement({ message, executeAction }: CreateBannerComponentParams): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('actito__iam-banner');

  container.addEventListener('click', (e) => {
    // Prevent the backdrop from receiving events when content is clicked.
    e.preventDefault();

    // Execute the primary action.
    executeAction(ActionType.PRIMARY);
  });

  if (message.image) {
    const element = container.appendChild(document.createElement('img'));
    element.classList.add('actito__iam-banner-image');
    element.setAttribute('src', message.image);
  }

  const content = container.appendChild(document.createElement('div'));
  content.classList.add('actito__iam-banner-content');

  if (message.title) {
    const element = content.appendChild(document.createElement('p'));
    element.classList.add('actito__iam-banner-content-title');
    element.innerHTML = message.title;
  }

  if (message.message) {
    const element = content.appendChild(document.createElement('p'));
    element.classList.add('actito__iam-banner-content-message');
    element.innerHTML = message.message;
  }

  return container;
}
