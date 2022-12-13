/** @type {import('eslint').Linter.Config} */
const config = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['turbo', '@antfu'],
  plugins: ['sort-keys-fix'],
  rules: {
    'no-console': 'warn',
    'sort-keys-fix/sort-keys-fix': 'error',
  },
}

module.exports = config
