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

describe('MusicBrainz user agent', () => {
	const { userAgent } = ThirdPartyConfig.musicbrainz;

	// https://musicbrainz.org/doc/MusicBrainz_API/Rate_Limiting asks for "Application name/<version> ( contact-url )"
	test('follows the format the musicbrainz docs ask for', () => {
		expect(userAgent).toMatch(/^\S+\/\d+\.\d+\.\d+ \( https?:\/\/\S+ \)$/);
	});

	test('carries the current version', () => {
		expect(userAgent).toContain(`/${JAMSERVE_VERSION}`);
	});
});
