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

//
// import js from "@eslint/js";
// import ts from 'typescript-eslint';
// import jest from 'eslint-plugin-jest';
// import globals from "globals";
//
// export default [
// 	js.configs.recommended, // Recommended config applied to all files
// 	// ...ts.configs.recommended,
// 	// jest.configs['flat/recommended'],
// 	{
// 		ignores: [
// 			"**/node_modules/",
// 			"**/temp/",
// 			"**/*.json",
// 		],
// 	}
// 	// {
// 	// 	languageOptions: {
// 	// 		globals: {
// 	// 			...globals.jest,
// 	// 			...globals.node,
// 	// 		},
// 	//
// 	// 		// parser: tsParser,
// 	// 		ecmaVersion: 2020,
// 	// 		sourceType: "module",
// 	//
// 	// 		parserOptions: {
// 	// 			project: "./tsconfig.eslint.json",
// 	// 			tsconfigRootDir: ".",
// 	// 		},
// 	// 	},
//
// 		// rules: {
// 		// 	"@typescript-eslint/no-unused-vars": ["error", {
// 		// 		args: "none",
// 		// 	}],
// 		//
// 		// 	"@typescript-eslint/ban-types": "off",
// 		// 	"@typescript-eslint/no-inferrable-types": "off",
// 		// 	"@typescript-eslint/no-explicit-any": "off",
// 		// 	"@typescript-eslint/no-non-null-assertion": "off",
// 		//
// 		// 	"@typescript-eslint/member-delimiter-style": ["error", {
// 		// 		multiline: {
// 		// 			delimiter: "semi",
// 		// 			requireLast: true,
// 		// 		},
// 		//
// 		// 		singleline: {
// 		// 			delimiter: "semi",
// 		// 			requireLast: false,
// 		// 		},
// 		// 	}],
// 		//
// 		// 	semi: "warn",
// 		// },
// 	// }
//
// 	];
// //
// //
// // import typescriptEslint from "@typescript-eslint/eslint-plugin";
// // import globals from "globals";
// // import tsParser from "@typescript-eslint/parser";
// // import path from "node:path";
// // import {fileURLToPath} from "node:url";
// // import js from "@eslint/js";
// // import {FlatCompat} from "@eslint/eslintrc";
// //
// // const __filename = fileURLToPath(import.meta.url);
// // const __dirname = path.dirname(__filename);
// // const compat = new FlatCompat({
// // 	baseDirectory: __dirname,
// // 	recommendedConfig: js.configs.recommended,
// // 	allConfig: js.configs.all
// // });
// //
// // export default [{
// // 	ignores: [
// // 		"**/node_modules/",
// // 		"**/data/",
// // 		"**/coverage/",
// // 		"**/dist/",
// // 		"**/local/",
// // 		"**/static/",
// // 		"**/temp/",
// // 		"**/*.json",
// // 	],
// // }, ...compat.extends(
// // 		"eslint:recommended",
// // 		"plugin:@typescript-eslint/eslint-recommended",
// // 		"plugin:@typescript-eslint/recommended",
// // ), {
// // 	plugins: {
// // 		"@typescript-eslint": typescriptEslint,
// // 	},
// //
// // 	languageOptions: {
// // 		globals: {
// // 			...globals.jest,
// // 			...globals.node,
// // 		},
// //
// // 		parser: tsParser,
// // 		ecmaVersion: 2020,
// // 		sourceType: "module",
// //
// // 		parserOptions: {
// // 			project: "./tsconfig.eslint.json",
// // 			tsconfigRootDir: "/Users/ffalt/Projekte/public/jam/jamserve",
// // 		},
// // 	},
// //
// // 	rules: {
// // 		"@typescript-eslint/no-unused-vars": ["error", {
// // 			args: "none",
// // 		}],
// //
// // 		"@typescript-eslint/ban-types": "off",
// // 		"@typescript-eslint/no-inferrable-types": "off",
// // 		"@typescript-eslint/no-explicit-any": "off",
// // 		"@typescript-eslint/no-non-null-assertion": "off",
// //
// // 		"@typescript-eslint/member-delimiter-style": ["error", {
// // 			multiline: {
// // 				delimiter: "semi",
// // 				requireLast: true,
// // 			},
// //
// // 			singleline: {
// // 				delimiter: "semi",
// // 				requireLast: false,
// // 			},
// // 		}],
// //
// // 		semi: "warn",
// // 	},
// // }];
