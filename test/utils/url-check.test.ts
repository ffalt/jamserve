import dns from 'node:dns/promises';
import { describe, expect, it, jest, afterEach } from '@jest/globals';
import { validateExternalUrl } from '../../src/utils/url-check.js';

describe('validateExternalUrl', () => {
	afterEach(() => {
		jest.restoreAllMocks();
	});

	it.each([
		'',
		' '.repeat(3),
		'not-a-url'
	])('rejects invalid url input: %p', async input => {
		await expect(validateExternalUrl(input)).rejects.toThrow('Invalid URL');
	});

	it.each([
		'ftp://example.com/file',
		'file:///etc/passwd',
		'javascript:alert(1)'
	])('rejects blocked scheme: %p', async input => {
		await expect(validateExternalUrl(input)).rejects.toThrow(/Blocked URL scheme:/);
	});

	it('allows public IPv6 literals in URLs', async () => {
		const lookupSpy = jest.spyOn(dns, 'lookup');

		await expect(validateExternalUrl('https://[2606:4700:4700::1111]/')).resolves.toBeUndefined();
		expect(lookupSpy).not.toHaveBeenCalled();
	});

	it('blocks loopback IPv6 literals in URLs', async () => {
		const lookupSpy = jest.spyOn(dns, 'lookup');

		await expect(validateExternalUrl('https://[::1]/')).rejects.toThrow('URL targets a blocked network address');
		expect(lookupSpy).not.toHaveBeenCalled();
	});

	it('blocks private IPv4 literals in URLs', async () => {
		const lookupSpy = jest.spyOn(dns, 'lookup');

		await expect(validateExternalUrl('https://127.0.0.1/')).rejects.toThrow('URL targets a blocked network address');
		expect(lookupSpy).not.toHaveBeenCalled();
	});

	it('allows public IPv4 literals in URLs', async () => {
		const lookupSpy = jest.spyOn(dns, 'lookup');

		await expect(validateExternalUrl('https://93.184.216.34/')).resolves.toBeUndefined();
		expect(lookupSpy).not.toHaveBeenCalled();
	});

	it('blocks unique-local IPv6 literals in URLs', async () => {
		const lookupSpy = jest.spyOn(dns, 'lookup');

		await expect(validateExternalUrl('https://[fd00::1]/')).rejects.toThrow('URL targets a blocked network address');
		expect(lookupSpy).not.toHaveBeenCalled();
	});

	it('rejects when hostname lookup fails', async () => {
		jest.spyOn(dns, 'lookup').mockRejectedValue(new Error('dns failure'));

		await expect(validateExternalUrl('https://example.invalid/')).rejects.toThrow('Failed to resolve hostname: example.invalid');
	});
});
