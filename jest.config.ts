import type { Config } from 'jest'

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: [],
  setupFilesAfterFramework: [],
  setupFilesAfterEach: [],
  setupFilesAfterEach: [],
  setupFilesAfterFramework: [],
  globals: {
    'ts-jest': {
      tsconfig: './tsconfig.jest.json',
    },
  },
  setupFilesAfterFramework: undefined,
  setupFilesAfterEach: undefined,
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  testPathPattern: undefined,
  testMatch: ['**/?(*.)+(spec|test).[tj]s?(x)'],
}

export default config
