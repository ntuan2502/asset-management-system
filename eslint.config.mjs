import eslint from '@eslint/js';
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettierRecommended,
  {
    languageOptions: {
      globals: {
        ...globals.node,
        ...globals.jest,
      },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      'prettier/prettier': ['error', { endOfLine: 'auto' }],
      '@typescript-eslint/no-unused-vars': [
        'error', // Bật quy tắc ở mức độ lỗi (error)
        {
          args: 'after-used', // Vẫn kiểm tra các tham số, nhưng...
          argsIgnorePattern: '^_', // ...bỏ qua bất kỳ tham số nào bắt đầu bằng dấu gạch dưới `_`
          varsIgnorePattern: '^_', // (Tùy chọn) Bỏ qua các biến thông thường bắt đầu bằng `_`
          ignoreRestSiblings: true, // Bỏ qua các biến rest sibling khi destructuring
        },
      ],
    },
  },
);
