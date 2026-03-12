export default {
	preset: "ts-jest",
	testEnvironment: "node",
	setupFilesAfterEnv: ["<rootDir>/test/jest.setup.ts"],
	coverageDirectory: "coverage",
	coverageProvider: "v8",
	testTimeout: 1_000_000,
	extensionsToTreatAsEsm: [".ts"],
	maxWorkers: 1,
	roots: [
		"<rootDir>/"
	],
	moduleNameMapper: {
		"^(\\.\\.?\\/.+)\\.jsx?$": "$1"
	},
	collectCoverageFrom: [
		"src/**/*.ts",
		"!src/**/*.d.ts",
		"!src/index.ts",
		"!src/version.ts"
	],
	coveragePathIgnorePatterns: [
		"/node_modules/",
		"/test/"
	],
	testPathIgnorePatterns: [
		"/node_modules/",
		"/dist/"
	],
	transform: {
		"^.+\\.tsx?$": ["ts-jest",
			{
				useESM: true,
				tsconfig: "tsconfig.jest.json",
				diagnostics: true,
				testEnvironment: "node"
			}]
	}
};
