import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import {
  createModal,
  createModalContent,
  createModalFooter,
  createModalHeader,
  type ModalHeaderParams,
  type ModalParams,
} from '~/modal';

describe('test createModal', () => {
  test('should create a modal DIV with the expected CSS classes', () => {
    const output = createModal();

    expect(output).toBeInstanceOf(HTMLDivElement);
    expect(output.classList.contains('actito__modal')).toBe(true);
    expect(output.classList.contains('actito__modal--top')).toBe(false);
  });

  test.each<[ModalParams['alignment'] | undefined, string[]]>([
    [undefined, ['actito__modal']],
    ['center', ['actito__modal']],
    ['top', ['actito__modal', 'actito__modal--top']],
  ])(
    'when the provided alignment is %o, it should use the expected CSS classes',
    async (inputAlignment, expectedCSSClasses) => {
      const input: ModalParams = {
        alignment: inputAlignment,
      };
      const output = createModal(input);

      const outputClassList = Array.from(output.classList);
      const onlyHasExpectedCSSClasses = outputClassList.every((className) =>
        expectedCSSClasses.includes(className),
      );

      expect(onlyHasExpectedCSSClasses).toBe(true);
    },
  );

  test('when the modal is clicked, it should call e.preventDefault() to stop event propagation', () => {
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');

    const output = createModal();
    output.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
  });
});

describe('test createModalHeader', () => {
  // MOCKS
  jest.unstable_mockModule('~/assets/close-icon.svg', () => {
    return {
      default: () => document.createElement('div'),
    };
  });
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('it should create a modal header that has a title and a close button by default', () => {
    const input: ModalHeaderParams = {
      title: 'Test Title',
      onCloseButtonClicked: mockOnClose,
    };

    const output = createModalHeader(input);

    // Check main container
    expect(output.classList.contains('actito__modal-header')).toBe(true);

    // Check title
    const outputTitle = output.querySelector('.actito__modal-header-title');
    expect(outputTitle).toBeTruthy();
    expect(outputTitle?.innerHTML).toBe('Test Title');

    // Check close button
    const outputCloseButton = output.querySelector('.actito__close-button');
    expect(outputCloseButton).toBeTruthy();
  });

  test('when a title is not provided, it should render an empty title', () => {
    const output = createModalHeader({
      onCloseButtonClicked: mockOnClose,
    });
    const outputTitle = output.querySelector('.actito__modal-header-title');

    expect(outputTitle?.innerHTML).toBe('');
  });

  test('when an icon is provided, it should include that icon as expected', () => {
    const input: ModalHeaderParams = {
      icon: 'https://example.com/icon.png',
      title: 'Modal with icon',
      onCloseButtonClicked: mockOnClose,
    };

    const output = createModalHeader(input);

    const outputIcon = output.querySelector('.actito__modal-header-icon');
    expect(outputIcon).toBeTruthy();
    expect(outputIcon?.getAttribute('src')).toBe('https://example.com/icon.png');
  });

  test('when an icon is not provided, it is not included', () => {
    const input: ModalHeaderParams = {
      icon: undefined,
      onCloseButtonClicked: mockOnClose,
    };

    const output = createModalHeader(input);

    expect(output.querySelector('.actito__modal-header-icon')).toBeNull();
  });

  test('when the close button is clicked, it should trigger the provided onCloseButtonClicked callback', () => {
    const input: ModalHeaderParams = {
      onCloseButtonClicked: mockOnClose,
    };

    const output = createModalHeader(input);

    const outputCloseButton = output.querySelector('.actito__close-button') as HTMLButtonElement;
    expect(outputCloseButton).toBeTruthy();
    outputCloseButton.click();
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});

describe('test createModalContent', () => {
  test('it should create a content DIV with the expected CSS class', () => {
    const output = createModalContent();

    expect(output).toBeInstanceOf(HTMLDivElement);
    expect(output.classList.contains('actito__modal-content')).toBe(true);
  });
});

describe('test createModalFooter', () => {
  test('it should create a footer DIV with the expected CSS class', () => {
    const output = createModalFooter();

    expect(output).toBeInstanceOf(HTMLDivElement);
    expect(output.classList.contains('actito__modal-footer')).toBe(true);
  });
});
