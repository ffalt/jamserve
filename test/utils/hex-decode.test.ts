import { describe, expect, test } from '@jest/globals';

import { hexDecode } from '../../src/utils/hex-decode.js';

describe('hexDecode', () => {
	test('should decode valid hex string', () => {
		// "sesame" = 736573616d65
		expect(hexDecode('736573616d65')).toBe('sesame');
	});

	test('should return empty string for odd-length hex', () => {
		expect(hexDecode('736573616d6')).toBe('');
	});

	test('should return empty string for empty input', () => {
		expect(hexDecode('')).toBe('');
	});

	test('should return empty string for non-hex characters', () => {
		expect(hexDecode('zzzzzz')).toBe('');
		expect(hexDecode('gh')).toBe('');
		expect(hexDecode('!!@@')).toBe('');
	});

	test('should accept uppercase hex characters', () => {
		expect(hexDecode('736573616D65')).toBe('sesame');
	});

	test('should accept mixed-case hex characters', () => {
		expect(hexDecode('736573616d65')).toBe('sesame');
	});
});

