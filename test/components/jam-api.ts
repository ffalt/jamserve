import supertest from 'supertest';
import {expect, should, use} from 'chai';
import {it} from 'mocha';
import {mockupAdmin} from './mockups';
import {ite} from './contexts';
import {Server} from '../../src/api/server';
import {validate} from '../../src/utils/validate-json';
import {APIVERSION} from '../../src/api/jam/api';
import {JamParameters} from '../../src/model/jam-rest-params-0.1.0';
import * as JamResponseSchema from '../../src/model/jam-rest-data-0.1.0.schema.json';

export function shouldBehaveLikeAJamApi() {
	let server: Server;
	let api: supertest.SuperTest<supertest.Test>;
	ite('should add a user to engine', async function() {
		const id = await this.engine.userService.createUser(mockupAdmin);
		should().exist(id);
	});
	ite('should auth the user by name', async function() {
		const user = await this.engine.userService.auth(mockupAdmin.name, mockupAdmin.pass);
		should().exist(user);
		expect(user).to.deep.equal(mockupAdmin);
	});
	ite('create', function() {
		server = new Server(this.engine);
		api = supertest(server.app);
	});

	function apicall(url: string): supertest.Test {
		return api
			.get('/api/v1/' + url)
			.set('Accept', 'application/json')
			.expect('Content-Type', /json/)
			.expect(async res => {
				const result = await validate(res.body, JamResponseSchema);
				should().not.exist(result.errors[0], JSON.stringify(result.errors[0]));
			});
	}

	function apipost(url: string, body: any): supertest.Test {
		return api
			.post('/api/v1/' + url)
			.set('Accept', 'application/json')
			.send(body)
			.expect('Content-Type', /json/)
			.expect(async res => {
				const result = await validate(res.body, JamResponseSchema);
				should().not.exist(result.errors[0], JSON.stringify(result.errors[0]));
			});
	}

	function apipostfail(url: string, body?: any): supertest.Test {
		return api
			.post('/api/v1/' + url)
			.set('Accept', 'application/json')
			.send(body || {})
			.expect('Content-Type', /json/)
			.expect(res => {
				should().exist(res.body.error);
			});
	}

	ite('should start', async function() {
		await server.start();
	});
	ite('should ping', function(done) {
		apicall('ping').expect(200, {version: APIVERSION}, done);
	});
	ite('should get session info', function(done) {
		apicall('session').expect(200, {version: APIVERSION, allowedCookieDomains: this.engine.config.server.session.allowedCookieDomains}, done);
	});
	ite('should logout', function(done) {
		apipost('logout', {}).expect(200, done);
	});
	ite('should fail login', function(done) {
		const param: JamParameters.Login = {username: mockupAdmin.name, password: 'sjdfhgksdfjhksdfsfsd', client: 'jamtest'};
		apipostfail('login', param).expect(401, done);
	});
	ite('should login', function(done) {
		const param: JamParameters.Login = {username: mockupAdmin.name, password: mockupAdmin.pass, client: 'jamtest'};
		apipost('login', param).expect(200, done);
	});

	ite('should stop', async function() {
		await server.stop();
	});
}
