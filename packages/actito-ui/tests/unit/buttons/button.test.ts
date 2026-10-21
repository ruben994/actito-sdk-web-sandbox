import { describe, expect, jest, test } from '@jest/globals';
import {
  type ButtonVariant,
  type CloseButtonVariant,
  createButton,
  createCloseButton,
  createDestructiveButton,
  createPrimaryButton,
  createSecondaryButton,
} from '~/buttons';

describe('test createButton', () => {
  test('it should generate a HTMLButtonElement with the provided text', async () => {
    const inputText = 'Click here';

    const button = createButton({ variant: 'primary', text: inputText, onClick: jest.fn() });

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button.innerText).toBe(inputText);
  });

  test.each<ButtonVariant>(['primary', 'secondary', 'destructive'])(
    "when the provided variant is '%s', it should use the expected CSS classes",
    async (inputVariant) => {
      const button = createButton({ variant: inputVariant, text: 'test', onClick: jest.fn() });

      const expectedCSSClass = `actito__button--${inputVariant}`;

      expect(button.classList.contains(expectedCSSClass)).toBe(true);
    },
  );

  test('when the button is clicked, it should do a preventDefault and call the provided onClick function', async () => {
    const mockOnClick = jest.fn();

    const button = createButton({ variant: 'primary', text: 'Click here', onClick: mockOnClick });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');

    button.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(mockOnClick).toHaveBeenCalled();
  });
});

describe('test createPrimaryButton', () => {
  test('it should generate a primary button with the provided text and the expected CSS classes', () => {
    const inputText = 'Click here';

    const button = createPrimaryButton({ text: inputText, onClick: jest.fn() });

    const expectedCSSClass = 'actito__button--primary';

    expect(button.classList.contains(expectedCSSClass)).toBe(true);
    expect(button.innerText).toBe(inputText);
  });
});

describe('test createSecondaryButton', () => {
  test('it should generate a secondary button with the provided text and the expected CSS classes', () => {
    const inputText = 'Click here';
    const button = createSecondaryButton({ text: inputText, onClick: jest.fn() });

    const expectedCSSClass = 'actito__button--secondary';

    expect(button.classList.contains(expectedCSSClass)).toBe(true);
    expect(button.innerText).toBe(inputText);
  });
});

describe('test createDestructiveButton', () => {
  test('it should generate a destructive button with the provided text and the expected CSS classes', () => {
    const inputText = 'Click here';
    const button = createDestructiveButton({ text: inputText, onClick: jest.fn() });

    const expectedCSSClass = 'actito__button--destructive';

    expect(button.classList.contains(expectedCSSClass)).toBe(true);
    expect(button.innerText).toBe(inputText);
  });
});

describe('test createCloseButton', () => {
  test('it should generate a HTMLButtonElement with a close icon and the expected CSS classes', async () => {
    const button = createCloseButton({ onClick: jest.fn() });

    const icon = button.querySelector('.actito__close-button-icon');

    expect(button).toBeInstanceOf(HTMLButtonElement);
    expect(button.classList.contains('actito__close-button')).toBe(true);
    expect(icon).toBeTruthy();
  });

  test.each<[CloseButtonVariant | undefined, string[]]>([
    [undefined, ['actito__close-button']],
    ['default', ['actito__close-button']],
    ['solid', ['actito__close-button', 'actito__close-button--solid']],
  ])(
    "when the provided variant is '%s', it should use the expected CSS classes",
    async (inputVariant, expectedCSSClasses) => {
      const button = createCloseButton({ variant: inputVariant, onClick: jest.fn() });

      const hasAllClasses = expectedCSSClasses.every((className) =>
        button.classList.contains(className),
      );

      expect(hasAllClasses).toBe(true);
    },
  );

  test('when the close button is clicked, it should do a preventDefault and call the provided onClick function', async () => {
    const mockOnClick = jest.fn();

    const button = createCloseButton({ onClick: mockOnClick });

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });
    const preventDefaultSpy = jest.spyOn(clickEvent, 'preventDefault');

    button.dispatchEvent(clickEvent);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
