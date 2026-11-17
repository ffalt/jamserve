import { describe, expect, test } from '@jest/globals';
import http from 'node:http';
import { filteringAgent } from '../../src/utils/filtering-agent.js';

function url(protocol: string, host: string): URL {
	return new URL(`${protocol}//${host}/a`);
}

function closeServer(server: http.Server): Promise<void> {
	return new Promise<void>(resolve => {
		server.close(() => {
			resolve();
		});
	});
}

describe('filteringAgent', () => {
	test('picks the https agent for https urls', () => {
		expect(filteringAgent(url('https:', 'example.com')).protocol).toBe('https:');
	});

	test('picks the http agent for http urls', () => {
		expect(filteringAgent(url('http:', 'example.com')).protocol).toBe('http:');
	});

	test('reuses one agent per protocol instead of building one per request', () => {
		expect(filteringAgent(url('https:', 'example.com'))).toBe(filteringAgent(url('https:', 'other.example.com')));
		expect(filteringAgent(url('http:', 'example.com'))).toBe(filteringAgent(url('http:', 'other.example.com')));
	});

	test('keeps connections alive', () => {
		expect(filteringAgent(url('https:', 'example.com')).keepAlive).toBe(true);
		expect(filteringAgent(url('http:', 'example.com')).keepAlive).toBe(true);
	});

	test('still refuses private ip addresses', async () => {
		const server = http.createServer((_request, response) => {
			response.end('ok');
		});
		await new Promise<void>(resolve => {
			server.listen(0, '127.0.0.1', resolve);
		});
		const address = server.address();
		const port = typeof address === 'object' && address ? address.port : 0;
		const target = url('http:', `127.0.0.1:${port}`);
		try {
			const error = await new Promise<Error>(resolve => {
				const request = http.get({ hostname: target.hostname, port: target.port, path: '/', agent: filteringAgent(target) }, response => {
					response.resume();
					resolve(new Error('expected the request to be refused'));
				});
				request.on('error', resolve);
			});
			expect(error.message).toContain('127.0.0.1');
		} finally {
			await closeServer(server);
		}
	});
});
