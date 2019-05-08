import {should} from 'chai';
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
	let controller: BaseController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, SEARCHQUERY, DBOBJECT, RESULTOBJ>;
	testController({},
		async (jamApi) => {
			jam = jamApi;
			user = await jamApi.engine.userService.getByName(mockUserName) as User;
			if (!user) {
				return Promise.reject(Error('Invalid Test Setup'));
			}
			controller = await setup(jam, user);
		}, () => {
			it('should return 404', async () => {
				const req = {query: {id: 'invalid'}, user};
				await controller.id(req as JamRequest<OBJREQUEST>).should.eventually.be.rejectedWith(Error);
			});
			it('should return objects', async () => {
				const objs = await controller.service.store.all();
				if (objs.length === 0) {
					return Promise.reject(Error('Invalid Test Setup, missing any object for ' + opts.typeName));
				}
				for (const obj of objs) {
					const req = {query: {id: obj.id}, user};
					const result = await controller.id(req as JamRequest<OBJREQUEST>);
					should().exist(result);
					await validateJamResponse(opts.typeName, result);
				}
			});
			tests();
		}, async () => {
			if (cleanup) {
				await cleanup();
			}
		});
}
