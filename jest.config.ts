import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json', 'node'],
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  transformIgnorePatterns: ['/node_modules/(?!bcryptjs)/'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coverageReporters: ['json', 'lcov', 'text', 'clover'],
  coverageThreshold: {
    global: {
      branches: 65,
      functions: 90,
      lines: 90,
      statements: 90,
    },
  },
};

export default config;

