/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^@sourdough/calc/(.*)$': '<rootDir>/../packages/calc/src/$1',
  },
  // Only test pure-logic files (no React Native components / JSX).
  // The tests of ../packages/calc (the calculation engines, data and models)
  // run here too, since that package has no npm dependencies of its own.
  roots: ['<rootDir>', '<rootDir>/../packages/calc'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', { tsconfig: 'tsconfig.jest.json' }],
  },
  // Load the expo-modules-core mock (harmless today, needed the moment a
  // test touches a module that imports expo packages)
  setupFiles: ['<rootDir>/jest.setup.js'],
};
