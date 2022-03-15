module.exports = {
  root: true,
  extends: ['@antfu/eslint-config', 'plugin:prettier/recommended', 'prettier'],
  rules: {
    'node/no-callback-literal': 'off',
    // prettier
    'prettier/prettier': 'error',
  },
}
