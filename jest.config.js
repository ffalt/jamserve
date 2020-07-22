module.exports = {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageDirectory: 'coverage',
	setupFilesAfterEnv: ["jest-expect-message"],
	testTimeout: 10000000,
	maxWorkers: 1,
	"roots": [
		"<rootDir>/src"
	],
	globals: {
		"ts-jest": {
			tsConfig: "tsconfig.jest.json",
			diagnostics: true,
			testEnvironment: "node"
		}
	}
};
