module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageDirectory: 'coverage',
	modulePathIgnorePatterns: ['<rootDir>/local/', '<rootDir>/coverage/', '<rootDir>/data', '<rootDir>/dist'],
	testMatch: ["**/__tests__/**/*.[jt]s?(x)", "**/?(*.)+(test).[jt]s?(x)"],
	globals: {
		_testDatabases_: ['nedb'] //, 'elastic']
	}
};
