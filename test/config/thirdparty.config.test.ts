import { describe, expect, test } from '@jest/globals';
import { LRCLIB_APP_NAME, ThirdPartyConfig } from '../../src/config/thirdparty.config.js';
import { JAMSERVE_VERSION } from '../../src/version.js';

describe('LRCLib user agent', () => {
	const { userAgent } = ThirdPartyConfig.lrclib;

	test('names the app it is registered as', () => {
		expect(userAgent.startsWith(`${LRCLIB_APP_NAME} v`)).toBe(true);
	});

	test('follows the format the lrclib docs ask for', () => {
		expect(userAgent).toMatch(/^\S+ v\d+\.\d+\.\d+ \(https?:\/\/\S+\)$/);
	});

	test('carries the current version', () => {
		expect(userAgent).toContain(`v${JAMSERVE_VERSION}`);
	});
});
