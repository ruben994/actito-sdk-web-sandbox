export const ROOT_ELEMENT_IDENTIFIER = 'actito-in-app-messaging';

export function ensureCleanState() {
  const root = document.getElementById(ROOT_ELEMENT_IDENTIFIER);
  if (root) root.remove();
}
