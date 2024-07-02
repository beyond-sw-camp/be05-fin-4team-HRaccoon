require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  env: { browser: true, es2020: true },
  root: true,
  extends: ['plugin:vue/vue3-essential', 'eslint:recommended', '@vue/eslint-config-prettier/skip-formatting'],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  rules: {
    "no-unused-vars": "off",
    "vue/no-multiple-template-root": "off",
    "vue/valid-template-root": "off",
    "prettier/prettier": [
      "error",
      {
        endOfLine: 'auto',
      },
    ],
  },
}
