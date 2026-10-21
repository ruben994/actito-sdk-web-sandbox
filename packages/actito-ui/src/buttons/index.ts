import createCloseIcon from '../assets/close-icon.svg';

export function createPrimaryButton(params: InvariantButtonParams): ButtonElement {
  return createButton({
    variant: 'primary',
    ...params,
  });
}

export function createSecondaryButton(params: InvariantButtonParams): ButtonElement {
  return createButton({
    variant: 'secondary',
    ...params,
  });
}

export function createDestructiveButton(params: InvariantButtonParams): ButtonElement {
  return createButton({
    variant: 'destructive',
    ...params,
  });
}

export function createButton({ variant, text, onClick }: ButtonParams): HTMLButtonElement {
  const button = document.createElement('button');
  button.classList.add('actito__button', ButtonVariantCssClassMap[variant]);
  button.innerText = text;

  button.addEventListener('click', (e) => {
    e.preventDefault();
    onClick();
  });

  return button;
}

export type ButtonElement = HTMLElement;
export type ButtonVariant = 'primary' | 'secondary' | 'destructive';

export interface ButtonParams {
  readonly variant: ButtonVariant;
  readonly text: string;
  readonly onClick: () => void;
}

export type InvariantButtonParams = Omit<ButtonParams, 'variant'>;

const ButtonVariantCssClassMap: Record<ButtonVariant, string> = {
  primary: 'actito__button--primary',
  secondary: 'actito__button--secondary',
  destructive: 'actito__button--destructive',
};

export function createCloseButton({ variant, onClick }: CloseButtonParams): ButtonElement {
  const closeIcon = createCloseIcon();
  closeIcon.classList.add('actito__close-button-icon');

  const button = document.createElement('button');
  button.classList.add('actito__close-button');
  if (variant === 'solid') button.classList.add('actito__close-button--solid');
  button.appendChild(closeIcon);

  button.addEventListener('click', (e) => {
    e.preventDefault();
    onClick();
  });

  return button;
}

export type CloseButtonVariant = 'default' | 'solid';

interface CloseButtonParams {
  readonly variant?: CloseButtonVariant;
  readonly onClick: () => void;
}
