import { describe, expect, test } from '@jest/globals';
import { getEmailUrl, getSmsUrl, getTelephoneUrl } from '~/internal/utils';

describe('test getEmailUrl', () => {
  test("when an email is provided, it returns an email URL with the prefix 'mailto:'", () => {
    const input = 'user123@email.com';
    const expectedOutput = 'mailto:user123@email.com';

    expect(getEmailUrl(input)).toBe(expectedOutput);
  });

  test("when an email URL already containing the prefix 'mailto:' is provided, it returns the same value", () => {
    const input = 'mailto:user123@email.com';
    const expectedOutput = 'mailto:user123@email.com';

    expect(getEmailUrl(input)).toBe(expectedOutput);
  });
});

describe('test getSmsUrl', () => {
  test("when a phone number is provided, it returns a SMS URL with the prefix 'sms:'", () => {
    const input = '+31612345678';
    const expectedOutput = 'sms:+31612345678';

    expect(getSmsUrl(input)).toBe(expectedOutput);
  });

  test("when a SMS URL already containing the prefix 'sms:' is provided, it returns the same value", () => {
    const input = 'sms:+31612345678';
    const expectedOutput = 'sms:+31612345678';

    expect(getSmsUrl(input)).toBe(expectedOutput);
  });
});

describe('test getTelephoneUrl', () => {
  test("when a phone number is provided, it returns a Telephone URL with the prefix 'tel:'", () => {
    const input = '+31612345678';
    const expectedOutput = 'tel:+31612345678';

    expect(getTelephoneUrl(input)).toBe(expectedOutput);
  });

  test("when a Telephone URL already containing the prefix 'tel:' is provided, it returns the same value", () => {
    const input = 'tel:+31612345678';
    const expectedOutput = 'tel:+31612345678';

    expect(getTelephoneUrl(input)).toBe(expectedOutput);
  });
});
