import { describe, expect, test } from '@jest/globals';
import { ensureHostHttpPrefix } from '~/internal/utils';

describe('test ensureHostHttpPrefix', () => {
  test.each(['http://', 'https://'])(
    "when the host starts with '%s', it returns the original host",
    (host: string) => {
      const input = `${host}my-domain.com`;
      const expectedOutput = `${host}my-domain.com`;

      expect(ensureHostHttpPrefix(input)).toBe(expectedOutput);
    },
  );

  test.each(['my-domain.com', 'localhost:3000'])(
    "when the host does not start with 'http://' or 'https://' (%s), it adds the 'https://' prefix to the host and returns it",
    (input: string) => {
      const expectedOutput = `https://${input}`;

      expect(ensureHostHttpPrefix(input)).toBe(expectedOutput);
    },
  );
});
