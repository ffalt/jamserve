import express from 'express';
import fse from 'fs-extra';
import path from 'node:path';
import supertest from 'supertest';
import nock from 'nock';
import { describe, expect, beforeAll, beforeEach, afterAll, it } from '@jest/globals';
import { staticMiddleware } from '../../../src/modules/server/middlewares/static.middleware.js';
import { ConfigService } from '../../../src/modules/engine/services/config.service.js';

const frontendPath = path.resolve('./local/__tests__/static-middleware/');

function buildConfigService(): ConfigService {
	return {
		env: {
			domain: 'http://localhost:4040',
			paths: { frontend: frontendPath }
		},
		rateLimits: {
			frontend: { windowMs: 60_000, limit: 1000 }
		}
	} as unknown as ConfigService;
}

describe('staticMiddleware', () => {
	let app: express.Application;

	beforeAll(async () => {
		await fse.ensureDir(path.join(frontendPath, 'media'));
		await fse.ensureDir(path.join(frontendPath, 'assets'));
		await fse.writeFile(path.join(frontendPath, 'index.html'), '<html lang="en"><body>jam</body></html>');
		await fse.writeFile(path.join(frontendPath, 'main-ABCD1234.js'), 'console.log(1);');
		await fse.writeFile(path.join(frontendPath, 'chunk-B-f4KAvw.js'), 'console.log(2);');
		await fse.writeFile(path.join(frontendPath, 'chunk-CB4rKAk-.js'), 'console.log(3);');
		await fse.writeFile(path.join(frontendPath, 'media/roboto-ABCD1234.woff2'), 'font');
		await fse.writeFile(path.join(frontendPath, '3rdpartylicenses.txt'), 'licenses');
		await fse.writeFile(path.join(frontendPath, 'assets/manifest-ABCD1234.json'), '{}');
		app = express();
		app.use(staticMiddleware(buildConfigService()));
	});

	beforeEach(() => {
		nock.enableNetConnect(/(localhost|0\.0\.0\.0|127\.0\.0\.1)/);
	});

	afterAll(async () => {
		await fse.remove(frontendPath);
	});

	it('caches content hashed bundles as immutable', async () => {
		const result = await supertest(app).get('/main-ABCD1234.js').expect(200);
		expect(result.headers['cache-control']).toBe('public, max-age=31536000, immutable');
	});

	it('caches bundles whose hash contains a hyphen as immutable', async () => {
		for (const url of ['/chunk-B-f4KAvw.js', '/chunk-CB4rKAk-.js']) {
			const result = await supertest(app).get(url).expect(200);
			expect(result.headers['cache-control']).toBe('public, max-age=31536000, immutable');
		}
	});

	it('caches content hashed media as immutable', async () => {
		const result = await supertest(app).get('/media/roboto-ABCD1234.woff2').expect(200);
		expect(result.headers['cache-control']).toBe('public, max-age=31536000, immutable');
	});

	it('revalidates files without a content hash', async () => {
		const result = await supertest(app).get('/3rdpartylicenses.txt').expect(200);
		expect(result.headers['cache-control']).toBe('no-cache');
	});

	it('revalidates files below assets even when they look content hashed', async () => {
		const result = await supertest(app).get('/assets/manifest-ABCD1234.json').expect(200);
		expect(result.headers['cache-control']).toBe('no-cache');
	});

	it('revalidates the index', async () => {
		for (const url of ['/', '/index.html']) {
			const result = await supertest(app).get(url).expect(200);
			expect(result.headers['cache-control']).toBe('no-cache');
		}
	});

	it('revalidates the generated frontend config', async () => {
		const result = await supertest(app).get('/assets/config/config.js').expect(200);
		expect(result.headers['cache-control']).toBe('no-cache');
		expect(result.text).toContain('document.jamberry_config');
	});

	it('sends a content security policy that reports violations and forbids inline scripts', async () => {
		const result = await supertest(app).get('/index.html').expect(200);
		expect(result.headers['content-security-policy']).toBe(
			`default-src 'self';base-uri 'self';font-src 'self' data:;form-action 'self';frame-ancestors 'none';` +
			`img-src 'self' data: blob: https:;object-src 'none';script-src 'self';script-src-attr 'none';` +
			`style-src 'self' 'unsafe-inline';upgrade-insecure-requests;report-uri /csp/report-violation;` +
			`media-src 'self' data: blob: https:;connect-src 'self' https: wss:`
		);
	});

	it('serves the index for unknown routes without an extension', async () => {
		const result = await supertest(app).get('/playlists/some-id').expect(200);
		expect(result.text).toContain('jam');
	});

	it('responds with not found for unknown files with an extension', async () => {
		await supertest(app).get('/assets/missing.png').expect(404);
	});

	it('responds with not found when html is not accepted', async () => {
		await supertest(app).get('/playlists/some-id').set('Accept', 'application/json').expect(404);
	});
});
