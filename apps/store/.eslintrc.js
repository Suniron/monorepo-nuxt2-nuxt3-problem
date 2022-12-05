module.exports = {
  env: {
    es6: true,
    node: true,
    jest: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:prettier/recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  plugins: ['prettier', '@typescript-eslint'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },

  parserOptions: {
    sourceType: 'module',
    ecmaVersion: 'latest',
  },
  parser: '@typescript-eslint/parser',
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: 'next', args: 'none' }],
  },
  ignorePatterns: ['node_modules', 'coverage', 'out'],
}
