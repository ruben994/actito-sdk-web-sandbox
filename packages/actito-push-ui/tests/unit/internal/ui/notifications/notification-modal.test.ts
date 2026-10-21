import * as originalActitoCoreModule from '@actito/web-core';
import type {
  ActitoInternalOptions,
  ActitoNotification,
  ActitoNotificationContent,
} from '@actito/web-core';
import { beforeAll, beforeEach, describe, expect, jest, test } from '@jest/globals';
import { DEFAULT_ACTITO_APPLICATION, DEFAULT_ACTITO_NOTIFICATION } from '../../../../stubs';

describe('createNotificationModal', () => {
  // MOCKS
  const mockDismiss = jest.fn();
  const mockPresentAction = jest.fn();
  const mockGetApplication = jest.fn();
  const mockCreateMapContent = jest.fn();

  jest.unstable_mockModule('@actito/web-core', () => ({
    ...originalActitoCoreModule,
    getOptions: (): Partial<ActitoInternalOptions> => ({
      hosts: {
        restApi: 'https://my-rest-api.com',
        cloudApi: '',
      },
    }),
    getApplication: mockGetApplication,
  }));

  jest.unstable_mockModule('~/internal/ui/notifications/content/map', () => ({
    createMapContent: mockCreateMapContent,
  }));

  // DEFAULT DATA

  beforeAll(() => {
    jest.resetModules();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetApplication.mockReturnValue(DEFAULT_ACTITO_APPLICATION);
  });

  test.each<[string, ActitoNotificationContent[], string]>([
    ['re.notifica.notification.Alert', [], '.actito__notification-alert'],
    [
      're.notifica.notification.Image',
      [{ type: 're.notifica.content.JPEG', data: 'https://example.com/1.jpeg' }],
      '.actito__notification-image-slider',
    ],
    [
      're.notifica.notification.URL',
      [
        {
          type: 're.notifica.content.URL',
          data: 'https://example.com/some-page',
        },
      ],
      '.actito__notification-url-iframe',
    ],
    [
      're.notifica.notification.URLResolver',
      [
        {
          type: 're.notifica.content.URL',
          data: 'https://example.com/some-page',
        },
      ],
      '.actito__notification-url-iframe',
    ],
    [
      're.notifica.notification.Video',
      [
        {
          type: 're.notifica.content.YouTube',
          data: 'dQw4w9WgXcQ',
        },
      ],
      '.actito__notification-video-iframe',
    ],
    [
      're.notifica.notification.WebView',
      [
        {
          type: 're.notifica.content.HTML',
          data: '<h1>Hello World</h1>',
        },
      ],
      '.actito__notification-webview-iframe',
    ],
  ])(
    "when a valid notification of type '%s' is provided, it should return a modal container with the expected content",
    async (inputNotificationType, inputNotificationContent, expectedContentCSSClass) => {
      mockGetApplication.mockReturnValue({ ...DEFAULT_ACTITO_APPLICATION, name: 'Example App' });

      const input = {
        notification: {
          ...DEFAULT_ACTITO_NOTIFICATION,
          type: inputNotificationType,
          content: inputNotificationContent,
        },
        dismiss: mockDismiss,
        presentAction: mockPresentAction,
      };

      const { createNotificationModal } =
        await import('~/internal/ui/notifications/notification-modal');

      const output = await createNotificationModal(input);

      // Check the main structure
      expect(output.id).toBe('actito-push-ui');
      expect(output.classList.contains('actito')).toBe(true);

      // Check if the backdrop was created
      expect(output.querySelector('.actito__backdrop')).toBeTruthy();

      // Check the modal base
      const outputModal = output.querySelector('.actito__modal');
      expect(outputModal).toBeTruthy();
      expect(outputModal?.classList.contains('actito__notification')).toBe(true);
      expect(outputModal?.getAttribute('data-notification-type')).toBe(input.notification.type);

      // Check the modal header
      const outputModalHeader = outputModal?.querySelector('.actito__modal-header');
      expect(outputModalHeader).toBeTruthy();

      // Check the modal header title
      const outputModalHeaderTitle = outputModalHeader?.querySelector(
        '.actito__modal-header-title',
      );
      expect(outputModalHeaderTitle?.innerHTML).toBe('Example App');

      // Check the modal content
      const outputModalContent = outputModal?.querySelector('.actito__modal-content');
      expect(outputModalContent).toBeTruthy();
      expect(outputModalContent?.querySelector(expectedContentCSSClass)).toBeTruthy();
    },
  );

  test("when a notification with type 're.notifica.notification.Map' is provided, it should return a modal container with the expected content", async () => {
    mockCreateMapContent.mockReturnValue(document.createElement('div'));

    const input = {
      notification: {
        ...DEFAULT_ACTITO_NOTIFICATION,
        type: 're.notifica.notification.Map',
        content: [{ type: 're.notifica.content.Marker', data: { latitude: 10, longitude: 20 } }],
      },
      dismiss: mockDismiss,
      presentAction: mockPresentAction,
    };

    const { createNotificationModal } =
      await import('~/internal/ui/notifications/notification-modal');

    const output = await createNotificationModal(input);

    expect(mockCreateMapContent).toHaveBeenCalledTimes(1);
    expect(mockCreateMapContent).toHaveBeenCalledWith(input.notification);
    expect(output.querySelector('.actito__modal')).toBeTruthy();
  });

  test('when the notification modal is created and the backdrop or close button is clicked, it should trigger the dismiss callback', async () => {
    const input = DEFAULT_ACTITO_NOTIFICATION;

    const { createNotificationModal } =
      await import('~/internal/ui/notifications/notification-modal');

    const output = await createNotificationModal({
      notification: input,
      dismiss: mockDismiss,
      presentAction: mockPresentAction,
    });

    // Click on the backdrop
    const outputBackdrop = output.querySelector('.actito__backdrop') as HTMLElement;
    outputBackdrop.click();
    expect(mockDismiss).toHaveBeenCalledTimes(1);

    // Click on the close button
    const outputCloseButton = output.querySelector('.actito__close-button') as HTMLElement;
    outputCloseButton.click();
    expect(mockDismiss).toHaveBeenCalledTimes(2);
  });

  test('when a valid notification is provided with actions, it should include a footer section with those actions and make them interactable on click', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Alert',
      actions: [
        {
          id: '1',
          label: 'Call',
          type: 're.notifica.action.Telephone',
          target: 'tel:0500666858',
          keyboard: false,
          camera: false,
        },
        {
          id: '2',
          label: 'Send email',
          type: 're.notifica.action.Mail',
          target: 'example@company.com',
          keyboard: false,
          camera: false,
        },
      ],
    };

    const { createNotificationModal } =
      await import('~/internal/ui/notifications/notification-modal');

    const output = await createNotificationModal({
      notification: input,
      dismiss: mockDismiss,
      presentAction: mockPresentAction,
    });

    // Check the footer
    const outputFooter = output.querySelector('.actito__modal-footer');
    expect(outputFooter).toBeTruthy();

    // Check the actions container
    const outputFooterActions = outputFooter?.querySelector('.actito__notification-actions');
    expect(outputFooterActions).toBeTruthy();

    // Check footer action buttons
    const outputFooterActionButtons = Array.from(outputFooter?.querySelectorAll('button') ?? []);

    expect(outputFooterActionButtons.length).toBe(2);
    expect(outputFooterActionButtons[0].classList.contains('actito__button--primary')).toBe(true);
    expect(outputFooterActionButtons[0].innerText).toBe(input.actions[0].label);
    expect(outputFooterActionButtons[1].classList.contains('actito__button--secondary')).toBe(true);
    expect(outputFooterActionButtons[1].innerText).toBe(input.actions[1].label);

    // Click on the first action
    (outputFooterActionButtons[0] as HTMLElement).click();
    expect(mockPresentAction).toHaveBeenCalledWith(input.actions[0]);

    // Click on the second action
    (outputFooterActionButtons[1] as HTMLElement).click();
    expect(mockPresentAction).toHaveBeenCalledWith(input.actions[1]);
  });

  test('when a valid notification is provided with 3 or more actions, it should apply an action list layout modifier', async () => {
    const input: ActitoNotification = {
      ...DEFAULT_ACTITO_NOTIFICATION,
      type: 're.notifica.notification.Alert',
      actions: [
        {
          id: '1',
          label: 'Action 1',
          type: 're.notifica.action.Telephone',
          target: 'tel:0500666858',
          keyboard: false,
          camera: false,
        },
        {
          id: '2',
          label: 'Action 2',
          type: 're.notifica.action.Mail',
          target: 'example@company.com',
          keyboard: false,
          camera: false,
        },
        {
          id: '3',
          label: 'Action 3',
          type: 're.notifica.action.SMS',
          target: '0500666858',
          keyboard: false,
          camera: false,
        },
      ],
    };

    const { createNotificationModal } =
      await import('~/internal/ui/notifications/notification-modal');

    const output = await createNotificationModal({
      notification: input,
      dismiss: mockDismiss,
      presentAction: mockPresentAction,
    });

    const outputActionsContainer = output.querySelector('.actito__notification-actions');
    expect(outputActionsContainer?.classList.contains('actito__notification-actions__list')).toBe(
      true,
    );
  });

  test.each([
    're.notifica.notification.InAppBrowser',
    're.notifica.notification.Rate',
    're.notifica.notification.Passbook',
    're.notifica.notification.URLScheme',
    're.notifica.notification.Store',
    're.notifica.notification.None',
  ])(
    'when a notification with an unsupported type is provided, it should throw an error',
    async (inputType) => {
      const inputNotification: ActitoNotification = {
        ...DEFAULT_ACTITO_NOTIFICATION,
        type: inputType,
      };

      const { createNotificationModal } =
        await import('~/internal/ui/notifications/notification-modal');

      await expect(
        createNotificationModal({
          notification: inputNotification,
          dismiss: mockDismiss,
          presentAction: mockPresentAction,
        }),
      ).rejects.toThrow(`Unsupported notification type: ${inputNotification.type}`);
    },
  );
});
