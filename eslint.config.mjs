import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
		eslint.configs.recommended,
		...tseslint.configs.recommended,
		{
			files: ["**/*.test.ts","**/mock.*.ts"],
			rules: {
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-unused-vars": "off"
			}
		},
		{
			files: ["**/*.ts"],
			rules: {
				"@typescript-eslint/no-explicit-any": "off",
				"@typescript-eslint/no-unsafe-function-type": "off",
				"@typescript-eslint/no-unused-vars": [
					"error",
					{
						// "args": "all",
						"argsIgnorePattern": "^_",
						// "caughtErrors": "all",
						"caughtErrorsIgnorePattern": "^_",
						// "destructuredArrayIgnorePattern": "^_",
						"varsIgnorePattern": "^_",
						// "ignoreRestSiblings": true
					}
				]
			}
		},
		{
			ignores: [
				"**/coverage/",
				"**/data/",
				"**/deploy/",
				"**/dist/",
				"**/local/",
				"**/static/"
			]
		}
);
