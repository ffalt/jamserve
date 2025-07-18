import eslint from '@eslint/js';
import stylistic from '@stylistic/eslint-plugin';
import tseslint from 'typescript-eslint';
import jest from 'eslint-plugin-jest';

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
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
			'jest/no-done-callback': 'off'
		}
	},
	{
		files: ['**/*.ts'],
		rules: {
			'@stylistic/semi': 'error',
			'@stylistic/indent': ['error', 'tab'],
			'@stylistic/operator-linebreak': ['error', 'after'],
			'@stylistic/arrow-parens': ['error', 'as-needed', { requireForBlockBody: false }],
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
