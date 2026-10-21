import { describe, expect, test } from '@jest/globals';
import { createRoot } from '~/root';

describe('test createRoot', () => {
  test('it should create a DIV element with the provided id as expected', () => {
    const input = 'test-id';
    const output = createRoot(input);

    const outputClassList = Array.from(output.classList);

    expect(output).toBeInstanceOf(HTMLDivElement);
    expect(output.id).toBe(input);
    expect(outputClassList).toEqual(['actito']);
  });
});
