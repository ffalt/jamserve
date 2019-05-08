import {expect, should} from 'chai';
import {describe, it} from 'mocha';
import {JamApi, JamRequest} from '../../api/jam/api';
import {JamParameters} from '../../model/jam-rest-params';
import {testController, validateJamResponse} from './controller.spec';
import {mockUserName} from '../user/user.mock';
import {User} from '../user/user.model';
import {DBObject} from './base.model';
import {SearchQuery} from './base.store';
import {BaseController} from './dbobject.controller';

export function testBaseController<OBJREQUEST extends JamParameters.ID | INCLUDE,
	OBJLISTREQUEST extends JamParameters.IDs | INCLUDE,
	INCLUDE,
	JAMQUERY extends SearchQuery,
	SEARCHQUERY extends JamParameters.SearchQuery | INCLUDE,
	DBOBJECT extends DBObject,
	RESULTOBJ extends { id: string }>(
	opts: {
		typeName: string
	},
	setup: (jam: JamApi, user: User) => Promise<BaseController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, SEARCHQUERY, DBOBJECT, RESULTOBJ>>,
	tests: () => void, cleanup ?: () => Promise<void>
): void {
	let jam: JamApi;
	let user: User;
	let objs: Array<DBOBJECT>;
	let controller: BaseController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, SEARCHQUERY, DBOBJECT, RESULTOBJ>;
	testController({},
		async (jamApi) => {
			jam = jamApi;
			user = await jamApi.engine.userService.getByName(mockUserName) as User;
			if (!user) {
				return Promise.reject(Error('Invalid Test Setup'));
			}
			controller = await setup(jam, user);
			objs = await controller.service.store.all();
			if (objs.length === 0) {
				return Promise.reject(Error('Invalid Test Setup, missing any object for ' + opts.typeName));
			}
		}, () => {
			it('should return error on invalid id parameter', async () => {
				const req = {query: {}, user};
				await controller.id(req as JamRequest<OBJREQUEST>).should.eventually.be.rejectedWith(Error);
				await controller.ids(req as JamRequest<OBJLISTREQUEST>).should.eventually.be.rejectedWith(Error);
			});
			it('should return 404 for invalid id', async () => {
				const req = {query: {id: 'invalid'}, user};
				await controller.id(req as JamRequest<OBJREQUEST>).should.eventually.be.rejectedWith(Error);
			});
			it('should ignore invalid ids', async () => {
				const req = {query: {ids: ['invalid']}, user};
				const list = await controller.ids(req as JamRequest<OBJLISTREQUEST>);
				should().exist(list);
				expect(list.length).to.equal(0, 'no items should be returned');
			});
			it('should return objects', async () => {
				for (const obj of objs) {
					const req = {query: {id: obj.id}, user};
					const result = await controller.id(req as JamRequest<OBJREQUEST>);
					should().exist(result);
					await validateJamResponse(opts.typeName, result);
				}
			});
			it('should return object state', async () => {
				for (const obj of objs) {
					const req: JamRequest<JamParameters.ID> = {query: {id: obj.id}, user};
					const result = await controller.state(req);
					should().exist(result);
					await validateJamResponse('Jam.State', result);
				}
			});
			it('should return object states', async () => {
				const req: JamRequest<JamParameters.IDs> = {query: {ids: objs.map(o => o.id)}, user};
				const result = await controller.states(req);
				should().exist(result);
				expect(Object.keys(result).length).to.equal(objs.length);
				await validateJamResponse('Jam.States', result);
			});
			it('should fav an object', async () => {
				for (const obj of objs) {
					const req: JamRequest<JamParameters.Fav> = {query: {id: obj.id}, user};
					const result = await controller.favUpdate(req);
					should().exist(result);
					expect(result.faved !== undefined && result.faved > 0).to.equal(true, 'Must have a fav timestamp');
					await validateJamResponse('Jam.State', result);
				}
			});
			it('should unfav an object', async () => {
				for (const obj of objs) {
					const req: JamRequest<JamParameters.Fav> = {query: {id: obj.id, remove: true}, user};
					const result = await controller.favUpdate(req);
					should().exist(result);
					expect(result.faved).to.equal(undefined, 'Must not have a fav timestamp');
					await validateJamResponse('Jam.State', result);
				}
			});
			it('should not rate with invalid parameters', async () => {
				await controller.rateUpdate({query: {id: objs[0].id, rating: -1}, user}).should.eventually.be.rejectedWith(Error);
				await controller.rateUpdate({query: {id: objs[0].id, rating: 5.1}, user}).should.eventually.be.rejectedWith(Error);
				await controller.rateUpdate({query: {id: objs[0].id, rating: 6}, user}).should.eventually.be.rejectedWith(Error);
			});
			it('should rate an object', async () => {
				for (const obj of objs) {
					const req: JamRequest<JamParameters.Rate> = {query: {id: obj.id, rating: 1}, user};
					const result = await controller.rateUpdate(req);
					should().exist(result);
					expect(result.rated).to.equal(1, 'Must have a rate value');
					await validateJamResponse('Jam.State', result);
				}
			});
			it('should unrate an object', async () => {
				for (const obj of objs) {
					const req: JamRequest<JamParameters.Rate> = {query: {id: obj.id, rating: 0}, user};
					const result = await controller.rateUpdate(req);
					should().exist(result);
					expect(result.rated).to.equal(undefined, 'Must not have a rating');
					await validateJamResponse('Jam.State', result);
				}
			});
			it('should get an image for an object', async () => {
				for (const obj of objs) {
					const req: JamRequest<JamParameters.Image> = {query: {id: obj.id}, user};
					const result = await controller.image(req);
					should().exist(result);
					should().exist(result.buffer || result.file);
				}
			});
			tests();
		}, async () => {
			if (cleanup) {
				await cleanup();
			}
		});
}
