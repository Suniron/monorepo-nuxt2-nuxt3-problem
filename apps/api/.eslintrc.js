module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2019,
    sourceType: 'module',
  },
  parser: '@babel/eslint-parser',
  rules: {
    'prettier/prettier': 'error',
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-unused-vars': ['warn', { argsIgnorePattern: 'next', args: 'none' }],
  },
}
