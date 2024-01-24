import nock from 'nock';
import {Server} from '../modules/server/server';
import tmp from 'tmp';
import yauzl, {Entry, ZipFile} from 'yauzl';
import fse from 'fs-extra';
import supertest from 'supertest';
import {bindMockConfig, DBConfigs} from './mock/mock.config';
import {waitEngineStart} from './mock/mock.engine';
import {initTest} from './init';
import {Container, Snapshot} from 'typescript-ioc';
import DoneCallback = jest.DoneCallback;
import TestAgent from 'supertest/lib/agent';

initTest();

function downloadZip(req: TestAgent<supertest.Test>, url: string, done: (e?: Error) => void): void {
	req.get(url)
		.expect(200)
		.expect('Content-Type', /application\/zip/)
		.parse((res, fn) => {
			res.setEncoding('binary');
			let data = '';
			res.on('data', (chunk) => {
				data += chunk;
			});
			res.on('end', () => {
				fn(null, Buffer.from(data, 'binary'));
			});
		})
		.end((err, res) => {
			if (err) {
				return done(err);
			}
			let isClosedByError = false;
			yauzl.fromBuffer(res.body, (e: Error | null, zipfile: ZipFile | undefined) => {
				if (e) {
					return done(e);
				}
				if (!zipfile) {
					return done(Error('Invalid Zip Buffer'));
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
						done(Error(`Unexpected Zip Content ${entry.fileName}`));
					}
				});
			});
		});
}

function downloadJSON(req: TestAgent<supertest.Test>, url: string, done: (e?: Error) => void): void {
	req.get(url)
		.expect(200)
		.expect('Content-Type', /application\/json/)
		.end((err, res) => {
			if (err) {
				return done(err);
			}
			if (typeof res.body !== 'object') {
				return done(Error('Invalid JSON Response'));
			}
			done();
		});
}

function downloadContent(req: TestAgent<supertest.Test>, url: string, contentType: RegExp, done: (e?: Error) => void): void {
	req.get(url)
		.expect(200)
		.expect('Content-Type', contentType)
		.end((err, _) => {
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
		// dir.removeCallback();
		snapshot.restore();
	});

	describe('must download', () => {
		it('angular-client.zip', (done: DoneCallback) => {
			downloadZip(request, '/docs/angular-client.zip', done);
		});
		it('axios-client.zip', (done: DoneCallback) => {
			downloadZip(request, '/docs/axios-client.zip', done);
		});
		it('openapi.json', (done: DoneCallback) => {
			downloadJSON(request, '/docs/openapi.json', done);
		});
		it('schema.graphql', (done: DoneCallback) => {
			downloadContent(request, '/docs/schema.graphql', /application\/graphql/, done);
		});
	});
});
