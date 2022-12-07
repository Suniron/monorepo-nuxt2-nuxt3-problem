/**
 * @type {import('@jest/types').Config.InitialOptions}
 */
module.exports = {
  preset: [['@babel/preset-env', { targets: { node: 'current' } }]],
  modulePaths: ['<rootDir>/node_modules/', '<rootDir>/tests/__mocks__/'],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/__mocks__/fileMock.js',
    '\\.(css|scss)$': 'identity-obj-proxy', // NOTE: https://jestjs.io/docs/en/webpack#mocking-css-modules
    '^meteor/(.*):(.*)$': '<rootDir>/tests/__mocks__/meteor/$1_$2',
    '^@(/.*)$': '<rootDir>/src$1',
  },
  unmockedModulePathPatterns: ['/^node_modules/'],
  collectCoverage: true,
  collectCoverageFrom: [
    '**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/vendor/**',
    '!**/test/**',
  ],
  coverageReporters: ['html'],
  testTimeout: 30000,
  clearMocks: true,
  setupFilesAfterEnv: ['<rootDir>/test/utils/beforeAndAfterAll.js'],
}
