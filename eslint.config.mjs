import js from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import ts from 'typescript-eslint';
import jest from 'eslint-plugin-jest';
import unicorn from 'eslint-plugin-unicorn';

export default ts.config(
	js.configs.recommended,
	...ts.configs.recommended,
	...ts.configs.stylistic,
	unicorn.configs.recommended,
	stylistic.configs.customize({
		indent: 'tab',
		quotes: 'single',
		braceStyle: '1tbs',
		semi: true,
		arrowParens: false,
		commaDangle: 'never',
		jsx: false
	}),
	{
		plugins: {
			'@stylistic': stylistic
		}
	},
	{
		files: ['src/test/**'],
		...jest.configs['flat/recommended'],
		rules: {
			...jest.configs['flat/recommended'].rules,
			'jest/expect-expect': 'off',
			'jest/no-done-callback': 'off',
			'@typescript-eslint/no-inferrable-types': 'off',
			'unicorn/no-await-expression-member': 'off',
			'unicorn/consistent-function-scoping': 'off',
			'unicorn/prefer-string-raw': 'off',
			'unicorn/no-null': 'off'
		}
	},
	{
		files: ['**/*.ts'],
		rules: {
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-useless-promise-resolve-reject': 'off',
			'unicorn/empty-brace-spaces': 'off',
			'unicorn/filename-case': 'off',
			'unicorn/no-null': 'off',
			'unicorn/no-array-reduce': 'off',
			'unicorn/throw-new-error': 'off',
			'unicorn/no-process-exit': 'off',
			'unicorn/no-useless-undefined': 'off',
			'unicorn/prefer-top-level-await': 'off',

			'@stylistic/semi': 'error',
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/operator-linebreak': ['error', 'after'],
			'@stylistic/arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],

			'@typescript-eslint/no-inferrable-types': 'off',
			'@typescript-eslint/array-type': ['error', { default: 'generic' }],
			'@typescript-eslint/no-explicit-any': 'off',
			'@typescript-eslint/no-unsafe-function-type': 'off',
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					// "args": "all",
					argsIgnorePattern: '^_',
					// "caughtErrors": "all",
					caughtErrorsIgnorePattern: '^_',
					// "destructuredArrayIgnorePattern": "^_",
					varsIgnorePattern: '^_'
					// "ignoreRestSiblings": true
				}
			]
		},
		ignores: ['src/test/']
	},
	{
		ignores: [
			'**/coverage/',
			'**/data/',
			'**/deploy/',
			'**/dist/',
			'**/local/',
			'**/static/'
		]
	}
);
