/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  detectOpenHandles: true,
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',
    '<rootDir>/node_modules',
    '<rootDir>/dist',
    '<rootDir>/.git',
    '<rootDir>/.output',
    '<rootDir>/build',
  ],
  // TODO: enable when typing is fixed in all the project
  // preset: 'ts-jest/presets/default-esm',
  roots: ['<rootDir>'],
  setupFilesAfterEnv: ['<rootDir>/__tests__/utils/setupTests.ts'],
  testMatch: [
    '**/__tests__/**/*test.ts',
  ],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      diagnostics: false,
    }],
  },

}
