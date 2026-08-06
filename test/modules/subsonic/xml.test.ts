import { describe, expect, test } from '@jest/globals';
import { xml } from '../../../src/modules/subsonic/xml.js';

describe('subsonic xml', () => {
	test('escapes attribute values', () => {
		const result = xml({ 'subsonic-response': { genre: [{ value: 'Rock', songCount: 1, name: 'a"b<c' }] } });
		expect(result).toContain('name="a&quot;b&lt;c"');
	});

	test('escapes element text content', () => {
		const result = xml({ 'subsonic-response': { line: [{ value: '</line><script>alert(1)</script>' }] } });
		expect(result).not.toContain('<script>');
		expect(result).toContain('<line>&lt;/line&gt;&lt;script&gt;alert(1)&lt;/script&gt;</line>');
	});

	test('converts non-string text content', () => {
		const result = xml({ 'subsonic-response': { line: [{ value: 42 }] } });
		expect(result).toContain('<line>42</line>');
	});

	test('emits empty element for missing text content', () => {
		const result = xml({ 'subsonic-response': { line: [{ value: undefined, start: 0 }] } });
		expect(result).toContain('<line start="0" />');
	});
});
