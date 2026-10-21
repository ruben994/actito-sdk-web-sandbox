import { TS_EXT_TO_TREAT_AS_ESM, ESM_TS_TRANSFORM_PATTERN, pathsToModuleNameMapper } from 'ts-jest';
import { URL, fileURLToPath } from 'url';

const GLOBAL_SETUP_FILE = fileURLToPath(new URL('./jest.setup.js', import.meta.url));

/**
 * Generates a standardized Jest configuration object for a module.
 *
 * @param {Record<string, string[]>} tsconfigPaths - The path mappings (aliases) extracted from `tsconfig.json`.
 * @param {Record<string, string | [string, Record<string, any>]>} transform - A map from regular expressions to paths to transformers.
 * @param {string[]} setupFilesAfterEnv - Additional package-specific Jest setup files to execute after the environment is loaded.
 * @return {Object} A Jest configuration object.
 */
export function configureJest(tsconfigPaths, transform = {}, setupFilesAfterEnv = []) {
  return {
    extensionsToTreatAsEsm: [...TS_EXT_TO_TREAT_AS_ESM],
    transform: {
      [ESM_TS_TRANSFORM_PATTERN]: [
        'ts-jest',
        {
          useESM: true,
        },
      ],
      ...transform,
    },
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: [GLOBAL_SETUP_FILE, ...setupFilesAfterEnv],
    moduleNameMapper: pathsToModuleNameMapper(tsconfigPaths, {
      prefix: '<rootDir>/',
    }),
    roots: ['<rootDir>/src', '<rootDir>/tests'],
  };
}
