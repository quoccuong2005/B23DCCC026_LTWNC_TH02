import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx'],
  setupFilesAfterEnv: ['<rootDir>/src/test/setup.ts'],
  moduleNameMapper: {
    '\\.(css|less|scss)$': '<rootDir>/src/test/styleMock.ts',
  },
  collectCoverageFrom: ['src/features/**/*.{ts,tsx}', '!src/features/**/*.d.ts'],
  coverageThreshold: {
    global: { statements: 0 },
    'src/features/': {
      statements: 70,
    },
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.test.json' }],
  },
};

export default config;
