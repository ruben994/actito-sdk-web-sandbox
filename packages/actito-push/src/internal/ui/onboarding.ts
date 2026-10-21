import {
  getOptions,
  type ActitoApplication,
  type ActitoApplicationWebsitePushConfigLaunchConfigAutoOnboardingOptions,
} from '@actito/web-core';
import {
  createBackdrop,
  createDestructiveButton,
  createModal,
  createModalContent,
  createModalFooter,
  createPrimaryButton,
} from '@actito/web-ui';
import { createRootElement, removeRootElement } from './base';

export function showOnboarding({
  application,
  autoOnboardingOptions,
  onAcceptClicked,
  onCancelClicked,
}: ShowAutoBoardingOptions) {
  const options = getOptions();
  if (!options) return;

  ensureCleanState();

  const root = createRootElement();
  root.classList.add('actito-push-onboarding');

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  root.appendChild(createBackdrop(() => {}));

  const modal = root.appendChild(createModal({ alignment: 'top' }));
  modal.classList.add('actito__onboarding-modal');

  const content = modal.appendChild(createModalContent());
  content.classList.add('actito__onboarding-content');

  if (application.websitePushConfig?.icon) {
    const icon = content.appendChild(document.createElement('img'));
    icon.classList.add('actito__onboarding-icon');

    icon.setAttribute(
      'src',
      `${options.hosts.restApi}/upload${application.websitePushConfig.icon}`,
    );
  }

  const textContent = content.appendChild(document.createElement('div'));
  textContent.classList.add('actito__onboarding-text-content');

  const title = textContent.appendChild(document.createElement('p'));
  title.classList.add('actito__onboarding-title');
  title.innerHTML =
    application.websitePushConfig?.launchConfig?.applicationName ?? application.name;

  const text = textContent.appendChild(document.createElement('p'));
  text.classList.add('actito__onboarding-text');
  text.innerHTML = autoOnboardingOptions.message;

  const footer = modal.appendChild(createModalFooter());
  footer.classList.add('actito__onboarding-footer');

  const footerButtons = footer.appendChild(document.createElement('div'));
  footerButtons.classList.add('actito__onboarding-actions');

  const cancelButton = footerButtons.appendChild(
    createDestructiveButton({
      text: autoOnboardingOptions.cancelButton,
      onClick: () => {
        ensureCleanState();
        onCancelClicked();
      },
    }),
  );
  cancelButton.classList.add('actito__onboarding-cancel-button');

  const acceptButton = footerButtons.appendChild(
    createPrimaryButton({
      text: autoOnboardingOptions.acceptButton,
      onClick: () => {
        ensureCleanState();
        onAcceptClicked();
      },
    }),
  );
  acceptButton.classList.add('actito__onboarding-accept-button');

  // Add the complete onboarding DOM to the page.
  document.body.appendChild(root);
}

export interface ShowAutoBoardingOptions {
  application: ActitoApplication;
  autoOnboardingOptions: ActitoApplicationWebsitePushConfigLaunchConfigAutoOnboardingOptions;
  onAcceptClicked: () => void;
  onCancelClicked: () => void;
}

export function hideOnboarding() {
  ensureCleanState();
}

function ensureCleanState() {
  removeRootElement();
}
