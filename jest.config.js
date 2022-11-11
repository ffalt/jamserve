export default {
	preset: 'ts-jest',
	testEnvironment: 'node',
	coverageDirectory: 'coverage',
	testTimeout: 1000000,
	extensionsToTreatAsEsm: ['.ts'],
	maxWorkers: 1,
	"roots": [
		"<rootDir>/src"
	],
	transform: {
		"^.+\\.tsx?$": [`ts-jest`,
			{
				useESM: true,
				tsconfig: "tsconfig.jest.json",
				diagnostics: true,
				testEnvironment: "node"
			}]
	}
};
