export default {
  preset: 'ts-jest',
  testEnvironment: 'jest-environment-jsdom',
  extensionsToTreatAsEsm: [],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.jest.json',
    },
  },
  moduleNameMapper: {
    '\\.(css|less|scss|sass)$': '<rootDir>/src/__mocks__/styleMock.js',
  },
  setupFilesAfterFramework: ['@testing-library/jest-dom'],
  setupFilesAfterFramework2: undefined,
  setupFiles: [],
  setupFilesAfterFramework3: undefined,
};
