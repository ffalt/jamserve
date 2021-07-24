export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageDirectory: 'coverage',
	setupFilesAfterEnv: ["jest-expect-message"],
	testTimeout: 1000000,
	extensionsToTreatAsEsm: ['.ts'],
	maxWorkers: 1,
	"roots": [
		"<rootDir>/src"
	],
	globals: {
		"ts-jest": {
			useESM: true,
			tsconfig: "tsconfig.jest.json",
			diagnostics: true,
			testEnvironment: "node"
		}
	}
};
