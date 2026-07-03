import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  setupFilesAfterFramework: ['./jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
        esModuleInterop: true,
        module: 'commonjs',
        moduleResolution: 'node',
        paths: {
          '@/*': ['src/*'],
        },
        baseUrl: '.',
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
      },
    }],
  },
  setupFilesAfterFramework: ['./jest.setup.ts'],
};

export default config;
