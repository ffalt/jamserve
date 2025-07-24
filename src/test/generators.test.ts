import nock from 'nock';
import { Server } from '../modules/server/server.js';
import tmp from 'tmp';
import yauzl, { Entry, ZipFile } from 'yauzl';
import fse from 'fs-extra';
import supertest from 'supertest';
import { bindMockConfig, DBConfigs } from './mock/mock.config.js';
import { waitEngineStart } from './mock/mock.engine.js';
import { initTest } from './init.js';
import { Container, Snapshot } from 'typescript-ioc';
import TestAgent from 'supertest/lib/agent.js';
import { describe, it, beforeAll, afterAll } from '@jest/globals';

initTest();

function downloadZip(req: TestAgent<supertest.Test>, url: string, done: (e?: Error) => void): void {
	req.get(url)
		.expect(200)
		.expect('Content-Type', /application\/zip/)
		.parse((res, fn) => {
			res.setEncoding('binary');
			let data = '';
			res.on('data', chunk => data += chunk);
			res.on('end', () => {
				fn(null, Buffer.from(data, 'binary'));
			});
		})
		.end((err: Error | undefined, res: { body: Buffer }) => {
			if (err) {
				return done(err);
			}
			if (res.body === null) {
				return done(new Error('Invalid Body response'));
			}
			let isClosedByError = false;
			yauzl.fromBuffer(res.body, (e: Error | null, zipfile: ZipFile | undefined) => {
				if (e) {
					return done(e);
				}
				if (!zipfile) {
					return done(new Error('Invalid Zip Buffer'));
				}
				zipfile.on('error', (ze: Error) => {
					isClosedByError = true;
					done(ze);
				});
				zipfile.on('end', () => {
					if (isClosedByError) {
						return;
					}
					done();
				});
				zipfile.on('entry', (entry: Entry) => {
					if (isClosedByError) {
						return;
					}
					const errorMessage = yauzl.validateFileName(entry.fileName);
					if (errorMessage) {
						isClosedByError = true;
						done(new Error(`Unexpected Zip Content ${entry.fileName}`));
					}
				});
			});
		});
}

function downloadJSON(req: TestAgent<supertest.Test>, url: string, done: (e?: Error) => void): void {
	req.get(url)
		.expect(200)
		.expect('Content-Type', /application\/json/)
		.end((err: Error | undefined, res: { body: any }) => {
			if (err) {
				return done(err);
			}
			if (typeof res.body !== 'object') {
				return done(new Error('Invalid JSON Response'));
			}
			done();
		});
}

function downloadContent(req: TestAgent<supertest.Test>, url: string, contentType: RegExp, done: (e?: Error) => void): void {
	req.get(url)
		.expect(200)
		.expect('Content-Type', contentType)
		.end((err: Error | undefined) => {
			if (err) {
				return done(err);
			}
			done();
		});
}

describe('Generators', () => {
	let server: Server;
	let dir: tmp.DirResult;
	let request: TestAgent<supertest.Test>;
	let snapshot: Snapshot;

	beforeAll(async () => {
		nock.cleanAll();
		snapshot = Container.snapshot();
		dir = tmp.dirSync();
		server = Container.get(Server);
		bindMockConfig(dir.name, DBConfigs[0], false);
		await server.init();
		await server.engine.init();
		await server.engine.orm.drop();
		await server.engine.start();
		await server.start();
		await waitEngineStart(server.engine);
		request = supertest(`http://${server.configService.env.host}:${server.configService.env.port}`);
	});
	afterAll(async () => {
		await server.engine.stop();
		await server.stop();
		await fse.remove(dir.name);
		snapshot.restore();
	});

	describe('must download', () => {
		it('angular-client.zip', done => {
			downloadZip(request, '/docs/angular-client.zip', done);
		});
		it('axios-client.zip', done => {
			downloadZip(request, '/docs/axios-client.zip', done);
		});
		it('openapi.json', done => {
			downloadJSON(request, '/docs/openapi.json', done);
		});
		it('schema.graphql', done => {
			downloadContent(request, '/docs/schema.graphql', /application\/graphql/, done);
		});
	});
});
