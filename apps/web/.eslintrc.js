module.exports = {
  root: true,
  env: {
    browser: true,
    node: true
  },
  parserOptions: {
    parser: 'babel-eslint'
  },
  extends: [
    '@nuxtjs',
    'prettier',
    'prettier/vue',
    'plugin:prettier/recommended',
    'plugin:nuxt/recommended'
  ],
  plugins: ['prettier'],
  // add your custom rules here
  rules: {
    // Causing false error https://github.com/vuejs/eslint-plugin-vue/issues/1355
    'vue/comment-directive': 0,
    // Binding attributes with v-bind sometimes is required to be last to override previous props
    'vue/attributes-order': 0,
    // Allow console log for now
    'no-console': 0,
    // Allow usage of v-html
    'vue/no-v-html': 0,
    // Allow Object.hasOwnProperty
    'no-prototype-builtins': 0
  }
}
