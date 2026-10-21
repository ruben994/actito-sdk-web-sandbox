import { beforeEach, describe, expect, jest, test } from '@jest/globals';
import { createBackdrop } from '~/backdrop';

describe('createBackdrop', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('it should generate a DIV element with the expected CSS class', () => {
    const backdrop = createBackdrop(jest.fn());

    expect(backdrop).toBeInstanceOf(HTMLDivElement);
    expect(backdrop.classList.contains('actito__backdrop')).toBe(true);
  });

  test('it should call the onClick callback when the backdrop itself is clicked', () => {
    const backdrop = createBackdrop(mockOnClick);

    backdrop.click();

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('it should not call the onClick callback if the event was already canceled (defaultPrevented)', () => {
    const backdrop = createBackdrop(mockOnClick);

    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    clickEvent.preventDefault();

    backdrop.dispatchEvent(clickEvent);

    expect(mockOnClick).not.toHaveBeenCalled();
  });
});
