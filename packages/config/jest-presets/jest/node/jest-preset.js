/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
	preset: 'ts-jest/presets/default-esm',
	moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  detectOpenHandles: true,
  roots: ["<rootDir>"],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
	// transform: {
		// // '^.+\\.tsx?$' to process ts/tsx with `ts-jest`
    // // '^.+\\.[tj]sx?$' to process js/ts with `ts-jest`
    // // '^.+\\.m?[tj]sx?$' to process js/ts/mjs/mts with `ts-jest`
    // '^.+\\.[tj]sx?$': [
    //   'ts-jest',
    //   {
    //     useESM: true,
    //   },
    // ],
	// },
	extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  modulePathIgnorePatterns: [
    '<rootDir>/test/__fixtures__',
    '<rootDir>/node_modules',
    '<rootDir>/dist',
    '<rootDir>/.git',
    '<rootDir>/.output',
    '<rootDir>/build',
  ],
};