import type {
  ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonHorizontalAlignment,
  ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonOptions,
  ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonVerticalAlignment,
} from '@actito/web-core';
import { createRootElement, removeRootElement } from './base';
import createDeniedBellIcon from '~/assets/bell-icon-denied.svg';
import createGrantedBellIcon from '~/assets/bell-icon-granted.svg';
import createBellIcon from '~/assets/bell-icon.svg';
import { getPushPermissionStatus } from '~/utils/push';

let permissionCheckTimer: number | undefined;

export function showFloatingButton({
  options: floatingButtonOptions,
  onButtonClicked,
}: ShowFloatingButtonOptions) {
  ensureCleanState();

  const root = createRootElement();
  root.classList.add('actito-push-floating-button');

  const floatingButton = root.appendChild(document.createElement('div'));
  floatingButton.id = 'actito-push-floating-button';
  floatingButton.setAttribute('data-permission-status', getPushPermissionStatus());
  floatingButton.classList.add(
    'actito__floating-button',
    FloatingButtonHorizontalAlignmentCssClasses[floatingButtonOptions.alignment.horizontal],
    FloatingButtonVerticalAlignmentCssClasses[floatingButtonOptions.alignment.vertical],
  );

  const iconContainer = floatingButton.appendChild(document.createElement('div'));
  iconContainer.classList.add('actito__floating-button-icon-container');
  iconContainer.replaceChildren(createCurrentBellIconElement());

  const tooltip = document.createElement('span');
  tooltip.classList.add('actito__floating-button-tooltip');
  tooltip.innerHTML = getCurrentTooltipText(floatingButtonOptions);
  floatingButton.appendChild(tooltip);

  floatingButton.addEventListener('click', (e) => {
    e.preventDefault();
    onButtonClicked();
  });

  permissionCheckTimer = window.setInterval(
    () => onPermissionStatusChanged(floatingButtonOptions),
    2000,
  );

  // Add the complete onboarding DOM to the page.
  document.body.appendChild(root);
}

export interface ShowFloatingButtonOptions {
  options: ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonOptions;
  onButtonClicked: () => void;
}

export function hideFloatingButton() {
  ensureCleanState();
}

function ensureCleanState() {
  removeRootElement();

  const timer = permissionCheckTimer;
  if (timer) window.clearInterval(timer);
  permissionCheckTimer = undefined;
}

function createCurrentBellIconElement(): HTMLElement {
  const status = getPushPermissionStatus();

  let icon: HTMLElement;

  switch (status) {
    case 'default':
      icon = createBellIcon();
      break;
    case 'granted':
      icon = createGrantedBellIcon();
      break;
    case 'denied':
      icon = createDeniedBellIcon();
      break;
    default:
      icon = createBellIcon();
  }

  icon.classList.add('actito__floating-button-icon');

  return icon;
}

function getCurrentTooltipText({
  permissionTexts,
}: ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonOptions): string {
  const status = getPushPermissionStatus();

  switch (status) {
    case 'default':
      return permissionTexts.default;
    case 'granted':
      return permissionTexts.granted;
    case 'denied':
      return permissionTexts.denied;
    default:
      return permissionTexts.default;
  }
}

function onPermissionStatusChanged(
  options: ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonOptions,
) {
  const floatingButton = document.getElementById('actito-push-floating-button');
  if (!floatingButton) return;

  const currentStatus = floatingButton.getAttribute('data-permission-status');
  const status = getPushPermissionStatus();

  if (status === currentStatus) return;

  const iconElements = floatingButton.getElementsByClassName(
    'actito__floating-button-icon-container',
  );

  for (let i = 0; i < iconElements.length; i += 1) {
    const element = iconElements.item(i);
    if (element) element.replaceChildren(createCurrentBellIconElement());
  }

  const tooltipElements = floatingButton.getElementsByClassName('actito__floating-button-tooltip');
  for (let i = 0; i < tooltipElements.length; i += 1) {
    const element = tooltipElements.item(i);
    if (element) element.innerHTML = getCurrentTooltipText(options);
  }

  floatingButton.setAttribute('data-permission-status', status);
}

const FloatingButtonHorizontalAlignmentCssClasses: Record<
  ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonHorizontalAlignment,
  string
> = {
  start: 'actito__floating-button__start',
  center: 'actito__floating-button__horizontal-center',
  end: 'actito__floating-button__end',
};

const FloatingButtonVerticalAlignmentCssClasses: Record<
  ActitoApplicationWebsitePushConfigLaunchConfigFloatingButtonVerticalAlignment,
  string
> = {
  top: 'actito__floating-button__top',
  center: 'actito__floating-vertical-center',
  bottom: 'actito__floating-button__bottom',
};
