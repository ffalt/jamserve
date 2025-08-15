import { describe, expect, test } from '@jest/globals';
import { extractParameters } from '../../../../src/modules/deco/helpers/extract-property-name.js';

describe('$args', () => {
	test('should extract parameters from simple function', () => {
		function testFunction(_parameter1: string, _parameter2: number) {
			console.log('test');
		}

		const result = extractParameters(testFunction);
		expect(result).toEqual(['_parameter1', '_parameter2']);
	});

	test('should handle function with no parameters', () => {
		function emptyFunction() {
			console.log('test');
		}

		const result = extractParameters(emptyFunction);
		expect(result).toEqual([]);
	});

	test('should handle function with default values', () => {
		function defaultParametersFunction(_parameter1 = 'default', _parameter2 = 42) {
			console.log('test');
		}

		const result = extractParameters(defaultParametersFunction);
		expect(result).toEqual(['_parameter1', '_parameter2']);
	});

	test('should handle function with single-line comments', () => {
		function commentedFunction(
			// This is a comment
			_parameter1: string,
			_parameter2: number // Another comment
		) {
			console.log('test');
		}

		const result = extractParameters(commentedFunction);
		expect(result).toEqual(['_parameter1', '_parameter2']);
	});

	test('should handle function with multi-line comments', () => {
		function multiCommentFunction(
			/* First parameter */
			_parameter1: string,
			/* Second
			 * parameter
			 */
			_parameter2: number
		) {
			console.log('test');
		}

		const result = extractParameters(multiCommentFunction);
		expect(result).toEqual(['_parameter1', '_parameter2']);
	});

	test('should handle arrow functions', () => {
		const arrowFunction = (_parameter1: string, _parameter2: number) => {
			console.log('test');
		};
		const result = extractParameters(arrowFunction);
		expect(result).toEqual(['_parameter1', '_parameter2']);
	});

	test('should handle function with complex type annotations', () => {
		function complexFunction(
			_parameter1: Array<string>,
			_parameter2: { key: string },
			_parameter3?: string | number
		) {
			console.log('test');
		}

		const result = extractParameters(complexFunction);
		expect(result).toEqual(['_parameter1', '_parameter2', '_parameter3']);
	});
});
