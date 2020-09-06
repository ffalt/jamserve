module.exports = {
	root: true,
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		'plugin:@typescript-eslint/recommended'  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
	],
	parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
	plugins: ["@typescript-eslint"],
	parserOptions: {
		ecmaVersion: 2020,  // Allows for the parsing of modern ECMAScript features
		sourceType: 'module',  // Allows for the use of imports
		project: "./tsconfig.eslint.json",
		tsconfigRootDir: __dirname
	},
	env: {
		jest: true,
		es2020: true,
		node: true
	},
	rules: {
		"@typescript-eslint/no-unused-vars": ["error", {"args": "none"}],
		"@typescript-eslint/no-var-requires": 2,
		"@typescript-eslint/ban-types": "off",
		"@typescript-eslint/no-inferrable-types": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"@typescript-eslint/no-non-null-assertion": "off",
		"@typescript-eslint/explicit-module-boundary-types": "off",
		"@typescript-eslint/explicit-function-return-type": "off",
		"@typescript-eslint/member-delimiter-style": [
			"error",
			{
				"multiline": {
					"delimiter": "semi",
					"requireLast": true
				},
				"singleline": {
					"delimiter": "semi",
					"requireLast": false
				}
			}
		],
		"semi": "warn"
	}
};
