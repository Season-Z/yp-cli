module.exports = {
  env: {
    commonjs: true,
    es2021: true,
    node: true
  },
  extends: [
    'standard'
  ],
  parserOptions: {
    ecmaVersion: 12
  },
  rules: {
    'space-before-function-paren': 'off',
    'comma-dangle': 'off',
    camelcase: 'off',
    'no-throw-literal': 'off',
    'no-useless-catch': 'off'
  }
}
