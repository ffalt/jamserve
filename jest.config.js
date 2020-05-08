module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageDirectory: 'coverage',
	setupFilesAfterEnv: ["jest-expect-message"],
	transform: {
		'^.+\\.tsx?$': 'ts-jest',
	},
	"roots": [
		"<rootDir>/src"
	],
	globalSetup: '<rootDir>/jest.setup.js',
	globalTeardown: '<rootDir>/jest.teardown.js',
	modulePathIgnorePatterns: ['<rootDir>/node_modules/','<rootDir>/local/', '<rootDir>/coverage/', '<rootDir>/data', '<rootDir>/dist'],
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(test).[jt]s?(x)"],
	globals: {
		_testDatabases_: ['nedb', 'elastic']
	}
};
