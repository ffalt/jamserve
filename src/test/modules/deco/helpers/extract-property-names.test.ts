import { describe, expect, test } from '@jest/globals';
import { $args } from '../../../../modules/deco/helpers/extract-property-name.js';

describe('$args', () => {
	test('should extract parameters from simple function', () => {
		function testFunc(_param1: string, _param2: number) {
		}

		const result = $args(testFunc);
		expect(result).toEqual(['_param1', '_param2']);
	});

	test('should handle function with no parameters', () => {
		function emptyFunc() {
		}

		const result = $args(emptyFunc);
		expect(result).toEqual([]);
	});

	test('should handle function with default values', () => {
		function defaultParamsFunc(_param1 = 'default', _param2 = 42) {
		}

		const result = $args(defaultParamsFunc);
		expect(result).toEqual(['_param1', '_param2']);
	});

	test('should handle function with single-line comments', () => {
		function commentedFunc(
			// This is a comment
			_param1: string,
			_param2: number // Another comment
		) {
		}

		const result = $args(commentedFunc);
		expect(result).toEqual(['_param1', '_param2']);
	});

	test('should handle function with multi-line comments', () => {
		function multiCommentFunc(
			/* First parameter */
			_param1: string,
			/* Second
			 * parameter
			 */
			_param2: number
		) {
		}

		const result = $args(multiCommentFunc);
		expect(result).toEqual(['_param1', '_param2']);
	});

	test('should handle arrow functions', () => {
		const arrowFunc = (_param1: string, _param2: number) => {
		};
		const result = $args(arrowFunc);
		expect(result).toEqual(['_param1', '_param2']);
	});

	test('should handle function with complex type annotations', () => {
		function complexFunc(
			_param1: Array<string>,
			_param2: { key: string },
			_param3: string | number
		) {
		}

		const result = $args(complexFunc);
		expect(result).toEqual(['_param1', '_param2', '_param3']);
	});
});
