module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parserOptions: { ecmaVersion: 2020, sourceType: 'module', ecmaFeatures: { jsx: true } },
  settings: { react: { version: '18.2' } },
  rules: {
    'react/prop-types': 'off',
  },
};
