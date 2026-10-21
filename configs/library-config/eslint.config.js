import eslint from '@eslint/js';
import { globalIgnores } from 'eslint/config';
import eslintImport from 'eslint-plugin-import';
import eslintPrettierRecommended from 'eslint-plugin-prettier/recommended';
import tseslint from 'typescript-eslint';

export default tseslint.config([
  eslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
  eslintPrettierRecommended,

  {
    files: ['**/*.{ts,tsx}'],
    extends: [eslintImport.flatConfigs.recommended, eslintImport.flatConfigs.typescript],
    settings: {
      'import/resolver': { typescript: { project: './tsconfig.json' } },
    },
    rules: {
      'import/prefer-default-export': 'off', // prefer named to default exports
      'import/order': [
        'error',
        {
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
    },
  },

  globalIgnores(['**/dist/']),
]);
