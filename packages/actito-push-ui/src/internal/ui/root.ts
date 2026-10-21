export const ROOT_ELEMENT_IDENTIFIER = 'actito-push-ui';

export function ensureCleanState() {
  const root = document.getElementById(ROOT_ELEMENT_IDENTIFIER);
  if (root) root.remove();
}
