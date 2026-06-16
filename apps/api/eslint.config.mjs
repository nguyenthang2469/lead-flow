// @ts-check
import tseslint from 'typescript-eslint';
import sharedConfig from '@repo/eslint-config/node.mjs';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs', 'prettier.config.cjs'],
  },
  ...sharedConfig,
  {
    rules: {
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      '@typescript-eslint/no-unused-vars': 'warn',
    },
  },
  {
    files: ['test/**/*.ts'],
    rules: {
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
    },
  }
);
