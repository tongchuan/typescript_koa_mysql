export default {
  testEnvironment: 'jsdom',
  preset: 'ts-jest/presets/default-esm',
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { 
      useESM: true,
      tsconfig: './tsconfig.app.json'
    }],
    '^.+\\.(js|jsx)$': 'babel-jest',
  },
  moduleNameMapping: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  setupFilesAfterEnv: ['<rootDir>/test/jest-setup.js'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/types/**/*',
  ],
  testMatch: [
    '<rootDir>/test/**/*.(spec|test).{ts,tsx}',
    '<rootDir>/src/**/__tests__/**/*.{ts,tsx}',
    '<rootDir>/src/**/*.(spec|test).{ts,tsx}',
  ],
  moduleDirectories: [
    'node_modules',
    '<rootDir>/src',
  ],
};