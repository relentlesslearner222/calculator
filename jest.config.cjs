module.exports = {
  testEnvironment: 'jest-environment-jsdom',
  setupFilesAfterFramework: [],
  setupFilesAfterFramework: [],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  testMatch: ['**/__tests__/**/*.{js,jsx}', '**/*.test.{js,jsx}'],
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/main.jsx', '!src/styles/TokensReference.jsx'],
};
