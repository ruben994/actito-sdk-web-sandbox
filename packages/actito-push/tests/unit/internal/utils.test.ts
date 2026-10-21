import { describe, expect, test } from '@jest/globals';
import {
  arrayBufferToBase64,
  arrayBufferToBase64Url,
  base64UrlToUint8Array,
  uint8ArrayToBase64,
  uint8ArrayToBase64Url,
} from '~/internal/utils';

describe('test base64UrlToUint8Array', () => {
  test.each([
    ['SGVsbG8', new Uint8Array([72, 101, 108, 108, 111])],
    ['-_8', new Uint8Array([251, 255])],
    ['', new Uint8Array([])],
  ])("when the base 64 URL string is '%s', it should convert it to %p", (input, expectedOutput) => {
    expect(base64UrlToUint8Array(input)).toStrictEqual(expectedOutput);
  });

  test.each(['SGVsbG8 !@#', 'SGVsbG8=🙂', 'ãbçd==', 'a', 'abcde', 'SGV=sbG8', 'SGVsbG8==='])(
    "when the base64 string is invalid ('%s'), it should throw an error",
    (input) => expect(() => base64UrlToUint8Array(input)).toThrow(),
  );
});

describe('test arrayBufferToBase64Url', () => {
  test.each([
    [new Uint8Array([72, 101, 108, 108, 111]), 'SGVsbG8'],
    [new Uint8Array([251, 255]), '-_8'],
    [new Uint8Array([]), ''],
  ])("when the array buffer is %p, it should convert it to '%s'", (input, expectedOutput) => {
    expect(arrayBufferToBase64Url(input.buffer)).toBe(expectedOutput);
  });
});

describe('test arrayBufferToBase64', () => {
  test.each([
    [new Uint8Array([72, 101, 108, 108, 111]), 'SGVsbG8='],
    [new Uint8Array([251, 255]), '+/8='],
    [new Uint8Array([]), ''],
  ])("when the array buffer is %p, it should convert it to '%s'", (input, expectedOutput) => {
    expect(arrayBufferToBase64(input.buffer)).toBe(expectedOutput);
  });
});

describe('test uint8ArrayToBase64Url', () => {
  test.each([
    [new Uint8Array([72, 101, 108, 108, 111]), 'SGVsbG8'],
    [new Uint8Array([251, 255]), '-_8'],
    [new Uint8Array([]), ''],
  ])("when the Uint8Array is %p, it should convert it to '%s'", (input, expectedOutput) => {
    expect(uint8ArrayToBase64Url(input)).toBe(expectedOutput);
  });
});

describe('test uint8ArrayToBase64', () => {
  test.each([
    [new Uint8Array([72, 101, 108, 108, 111]), 'SGVsbG8='],
    [new Uint8Array([251, 255]), '+/8='],
    [new Uint8Array([]), ''],
  ])("when the Uint8Array is %p, it should convert it to '%s'", (input, expectedOutput) => {
    expect(uint8ArrayToBase64(input)).toBe(expectedOutput);
  });
});
