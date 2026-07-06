module.exports = {
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.[jt]sx?$': 'babel-jest',
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  setupFilesAfterFramework: [],
  setupFilesAfterFramework: [],
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  collectCoverageFrom: ['src/**/*.{js,jsx}', '!src/main.jsx', '!src/setupTests.js'],
};
