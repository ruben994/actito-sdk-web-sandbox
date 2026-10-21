import { createRoot } from '@actito/web-ui';

export const ROOT_DOM_IDENTIFIER = 'actito-push';

export function createRootElement(): HTMLElement {
  return createRoot(ROOT_DOM_IDENTIFIER);
}

export function removeRootElement() {
  const root = document.getElementById(ROOT_DOM_IDENTIFIER);
  if (root) root.remove();
}
