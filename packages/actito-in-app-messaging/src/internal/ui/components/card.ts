import { createBackdrop, createButton, createCloseButton, createRoot } from '@actito/web-ui';
import { ActionType } from '~/internal/types/action-type';
import { ROOT_ELEMENT_IDENTIFIER } from '~/internal/ui/root';
import type { ActitoInAppMessage, ActitoInAppMessageAction } from '~/models/actito-in-app-message';

export function createCardComponent({
  message,
  dismiss,
  executeAction,
}: CreateCardComponentParams): HTMLElement {
  const root = createRoot(ROOT_ELEMENT_IDENTIFIER);
  root.appendChild(createBackdrop(() => dismiss()));
  root.appendChild(
    createCardElement(
      message,
      () => dismiss(),
      (type) => executeAction(type),
    ),
  );

  return root;
}

export interface CreateCardComponentParams {
  readonly message: ActitoInAppMessage;
  readonly dismiss: () => void;
  readonly executeAction: (type: ActionType) => void;
}

function createCardElement(
  message: ActitoInAppMessage,
  onCloseButtonClick: () => void,
  onActionClick: OnActionClick,
): HTMLElement {
  const container = document.createElement('div');
  container.classList.add('actito__iam-card');

  container.addEventListener('click', (e) => {
    // Prevent the backdrop from receiving events when content is clicked.
    e.preventDefault();
  });

  if (message.image) {
    container.appendChild(createHeaderElement(message, () => onCloseButtonClick()));
  } else {
    container.appendChild(
      createCloseButton({
        variant: message.image ? 'solid' : 'default',
        onClick: () => onCloseButtonClick(),
      }),
    );
  }

  container.appendChild(createContentElement(message));

  const actionsElement = createActionsElement(message, onActionClick);
  if (actionsElement) container.appendChild(actionsElement);

  return container;
}

function createHeaderElement(message: ActitoInAppMessage, dismiss: () => void): HTMLElement {
  const header = document.createElement('div');
  header.classList.add('actito__iam-card-header');

  if (message.image) {
    const element = header.appendChild(document.createElement('img'));
    element.classList.add('actito__iam-card-header-image');
    element.setAttribute('src', message.image);
  }

  header.appendChild(
    createCloseButton({
      variant: message.image ? 'solid' : 'default',
      onClick: () => dismiss(),
    }),
  );

  return header;
}

function createContentElement(message: ActitoInAppMessage): HTMLElement {
  const content = document.createElement('div');
  content.classList.add('actito__iam-card-content');

  if (message.title) {
    const element = content.appendChild(document.createElement('p'));
    element.classList.add('actito__iam-card-content-title');
    element.innerHTML = message.title;
  }

  if (message.message) {
    const element = content.appendChild(document.createElement('p'));
    element.classList.add('actito__iam-card-content-message');
    element.innerHTML = message.message;
  }

  return content;
}

function createActionsElement(
  message: ActitoInAppMessage,
  onActionClick: OnActionClick,
): HTMLElement | undefined {
  const primaryActionButton = createActionButton({
    action: message.primaryAction,
    actionType: ActionType.PRIMARY,
    onClick: () => onActionClick(ActionType.PRIMARY),
  });

  const secondaryActionButton = createActionButton({
    action: message.secondaryAction,
    actionType: ActionType.SECONDARY,
    onClick: () => onActionClick(ActionType.SECONDARY),
  });

  if (!primaryActionButton && !secondaryActionButton) return undefined;

  const container = document.createElement('div');
  container.classList.add('actito__iam-card-actions');

  if (primaryActionButton) container.appendChild(primaryActionButton);
  if (secondaryActionButton) container.appendChild(secondaryActionButton);

  return container;
}

function createActionButton({
  action,
  actionType,
  onClick,
}: {
  action: ActitoInAppMessageAction | undefined;
  actionType: ActionType;
  onClick: () => void;
}): HTMLElement | undefined {
  if (!action?.label || !action?.url) return undefined;

  const button = createButton({
    variant: action.destructive ? 'destructive' : actionType,
    text: action.label,
    onClick,
  });

  button.classList.add('actito__iam-card-action');
  button.setAttribute('data-action-type', actionType);

  return button;
}

type OnActionClick = (actionType: ActionType) => void;
