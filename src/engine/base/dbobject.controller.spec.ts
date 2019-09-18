import {JamApi, JamRequest} from '../../api/jam/api';
import {Errors} from '../../api/jam/error';
import {JamParameters} from '../../model/jam-rest-params';
import {User} from '../user/user.model';
import {DBObject} from './base.model';
import {SearchQuery} from './base.store';
import {testController, validateJamResponse} from './controller.spec';
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
		skipBaseTests?: boolean
	},
	setup: (jam: JamApi, user: User) => Promise<BaseController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, SEARCHQUERY, DBOBJECT, RESULTOBJ>>,
	tests: () => void, cleanup ?: () => Promise<void>
): void {
	let jam: JamApi;
	let user: User;
	let objs: Array<DBOBJECT>;
	let controller: BaseController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, SEARCHQUERY, DBOBJECT, RESULTOBJ>;
	testController({},
		async (jamApi, jamUser) => {
			jam = jamApi;
			user = jamUser;
			controller = await setup(jam, user);
			objs = await controller.service.store.all();
			if (objs.length === 0) {
				return Promise.reject(Error('Invalid Test Setup, missing any object for ' + opts.typeName));
			}
		}, () => {
			if (opts.skipBaseTests) {
				return tests();
			}
			describe('.id', () => {
				it('should return error on invalid id parameter', async () => {
					const req = {query: {}, user};
					await expect(controller.id(req as JamRequest<OBJREQUEST>)).rejects.toThrow(Errors.invalidParameter);
					await expect(controller.ids(req as JamRequest<OBJLISTREQUEST>)).rejects.toThrow(Errors.invalidParameter);
				});
				it('should return 404 for invalid id', async () => {
					const req = {query: {id: 'invalid'}, user};
					await expect(controller.id(req as JamRequest<OBJREQUEST>)).rejects.toThrow(Errors.itemNotFound);
				});
				it('should ignore invalid ids', async () => {
					const req = {query: {ids: ['invalid']}, user};
					const list = await controller.ids(req as JamRequest<OBJLISTREQUEST>);
					expect(list).toBeTruthy();
					expect(list.length).toBe(0); // 'no items should be returned'
				});
				it('should return objects', async () => {
					for (const obj of objs) {
						const req = {query: {id: obj.id}, user};
						const result = await controller.id(req as JamRequest<OBJREQUEST>);
						expect(result).toBeTruthy();
						await validateJamResponse(opts.typeName, result);
					}
				});
			});
			describe('.state', () => {
				it('should return object state', async () => {
					for (const obj of objs) {
						const req: JamRequest<JamParameters.ID> = {query: {id: obj.id}, user};
						const result = await controller.state(req);
						expect(result).toBeTruthy();
						await validateJamResponse('Jam.State', result);
					}
				});
				it('should return object states', async () => {
					const req: JamRequest<JamParameters.IDs> = {query: {ids: objs.map(o => o.id)}, user};
					const result = await controller.states(req);
					expect(result).toBeTruthy();
					expect(Object.keys(result).length).toBe(objs.length);
					await validateJamResponse('Jam.States', result);
				});
			});
			describe('.favUpdate', () => {
				it('should fav an object', async () => {
					for (const obj of objs) {
						const req: JamRequest<JamParameters.Fav> = {query: {id: obj.id}, user};
						const result = await controller.favUpdate(req);
						expect(result).toBeTruthy();
						expect(result.faved !== undefined && result.faved > 0).toBe(true); // 'Must have a fav timestamp');
						await validateJamResponse('Jam.State', result);
					}
				});
				it('should unfav an object', async () => {
					for (const obj of objs) {
						const req: JamRequest<JamParameters.Fav> = {query: {id: obj.id, remove: true}, user};
						const result = await controller.favUpdate(req);
						expect(result).toBeTruthy();
						expect(result.faved).toBeUndefined(); // 'Must not have a fav timestamp'
						await validateJamResponse('Jam.State', result);
					}
				});
			});
			describe('.rateUpdate', () => {
				it('should not rate with invalid parameters', async () => {
					await expect(controller.rateUpdate({query: {id: objs[0].id, rating: -1}, user})).rejects.toThrow(Errors.invalidParameter);
					await expect(controller.rateUpdate({query: {id: objs[0].id, rating: 5.1}, user})).rejects.toThrow(Errors.invalidParameter);
					await expect(controller.rateUpdate({query: {id: objs[0].id, rating: 6}, user})).rejects.toThrow(Errors.invalidParameter);
				});
				it('should rate an object', async () => {
					for (const obj of objs) {
						const req: JamRequest<JamParameters.Rate> = {query: {id: obj.id, rating: 1}, user};
						const result = await controller.rateUpdate(req);
						expect(result).toBeTruthy();
						expect(result.rated).toBe(1); // 'Must have a rate value');
						await validateJamResponse('Jam.State', result);
					}
				});
				it('should unrate an object', async () => {
					for (const obj of objs) {
						const req: JamRequest<JamParameters.Rate> = {query: {id: obj.id, rating: 0}, user};
						const result = await controller.rateUpdate(req);
						expect(result).toBeTruthy();
						expect(result.rated).toBeUndefined(); // 'Must not have a rating');
						await validateJamResponse('Jam.State', result);
					}
				});
			});
			describe('.search', () => {
				it('should search for an object', async () => {
					for (const obj of objs) {
						const req = {query: {id: obj.id}, user};
						const result = await controller.search(req as JamRequest<SEARCHQUERY>);
						expect(result).toBeTruthy();
						expect(result.items).toBeTruthy();
						expect(result.items.length).toBe(1); // 'Must find one object')
						await validateJamResponse(opts.typeName, result.items, true);
					}
				});
			});
			describe('.image', () => {
				it('should get an image for an object', async () => {
					for (const obj of objs) {
						const req: JamRequest<JamParameters.Image> = {query: {id: obj.id}, user};
						const result = await controller.image(req);
						expect(result).toBeTruthy();
						expect(result.buffer || result.file).toBeTruthy();
					}
				});
			});
			tests();
		}, async () => {
			if (cleanup) {
				await cleanup();
			}
		});
}
