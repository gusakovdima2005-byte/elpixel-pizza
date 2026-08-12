import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import angularTemplatePlugin from '@angular-eslint/eslint-plugin-template';
import angularTemplateParser from '@angular-eslint/template-parser';

const baseRules = {
  'no-console': 'warn',

  'no-unused-vars': 'off',
  '@typescript-eslint/no-unused-vars': [
    'error',
    {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
      caughtErrorsIgnorePattern: '^_',
    },
  ],

  // Порядок: inject() → сигналы/свойства → constructor → public методы → private методы
      '@typescript-eslint/member-ordering': [
        'error',
        {
          classes: {
            memberTypes: [
              'field',
              'constructor',
              'method',
            ],
            order: 'as-written',
          },
        },
      ],

  '@typescript-eslint/explicit-member-accessibility': [
    'error',
    { accessibility: 'explicit', overrides: { constructors: 'no-public' } },
  ],

  '@typescript-eslint/no-empty-function': 'off',
  'prefer-const': 'error',
};

export default [
  // ---- Application .ts files (with type checking) ----
  {
    files: ['src/**/*.ts'],
    ignores: ['src/**/*.spec.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: baseRules,
  },

  // ---- Test .spec.ts files (with spec tsconfig) ----
  {
    files: ['src/**/*.spec.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: ['./tsconfig.json', './tsconfig.spec.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      ecmaVersion: 2022,
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      ...baseRules,
      'no-console': 'off',
    },
  },

  // ---- Angular component templates (.html) ----
  {
    files: ['**/*.html'],
    languageOptions: {
      parser: angularTemplateParser,
    },
    plugins: {
      '@angular-eslint/template': angularTemplatePlugin,
    },
    rules: {
      '@angular-eslint/template/no-call-expression': 'error',
      '@angular-eslint/template/prefer-control-flow': 'error',
      '@angular-eslint/template/alt-text': 'error',
      '@angular-eslint/template/click-events-have-key-events': 'warn',
    },
  },
];
