export default {
	preset: "ts-jest",
	testEnvironment: "node",
	coverageDirectory: "coverage",
	testTimeout: 1_000_000,
	extensionsToTreatAsEsm: [".ts"],
	maxWorkers: 1,
	roots: [
		"<rootDir>/"
	],
	moduleNameMapper: {
		"^(\\.\\.?\\/.+)\\.jsx?$": "$1"
	},
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
