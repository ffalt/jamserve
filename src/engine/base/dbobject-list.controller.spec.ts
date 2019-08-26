import {should} from 'chai';
import {it} from 'mocha';

import {JamApi, JamRequest} from '../../api/jam/api';
import {JamParameters} from '../../model/jam-rest-params';
import {User} from '../user/user.model';
import {DBObject} from './base.model';
import {SearchQuery} from './base.store';
import {validateJamResponse} from './controller.spec';
import {BaseListController} from './dbobject-list.controller';
import {testBaseController} from './dbobject.controller.spec';

export function testBaseListController<OBJREQUEST extends JamParameters.ID | INCLUDE,
	OBJLISTREQUEST extends JamParameters.IDs | INCLUDE,
	INCLUDE,
	JAMQUERY extends SearchQuery,
	SEARCHQUERY extends JamParameters.SearchQuery | INCLUDE,
	DBOBJECT extends DBObject,
	RESULTOBJ extends { id: string },
	LISTQUERY extends JamParameters.List | INCLUDE | SEARCHQUERY>(
	opts: {
		typeName: string
	},
	setup: (jam: JamApi, user: User) => Promise<BaseListController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, SEARCHQUERY, DBOBJECT, RESULTOBJ, LISTQUERY>>,
	tests: () => void, cleanup ?: () => Promise<void>
): void {
	let controller: BaseListController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, SEARCHQUERY, DBOBJECT, RESULTOBJ, LISTQUERY>;
	let user: User;
	let objs: Array<DBOBJECT>;
	testBaseController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, SEARCHQUERY, DBOBJECT, RESULTOBJ>(opts,
		async (jamApi, jamUser) => {
			user = jamUser;
			controller = await setup(jamApi, jamUser);
			objs = await controller.service.store.all();
			if (objs.length === 0) {
				return Promise.reject(Error('Invalid Test Setup, missing any object for ' + opts.typeName));
			}
			return controller;
		},
		() => {
			it('should return invalid list error', async () => {
				const req = {query: {list: 'invalid'}, user};
				await controller.list(req as JamRequest<LISTQUERY>).should.eventually.be.rejectedWith(Error);
			});
			it('should return lists', async () => {
				const lists = ['random', 'highest', 'avghighest', 'frequent', 'faved', 'recent'];
				for (const listId of lists) {
					const req = {query: {list: listId}, user};
					const result = await controller.list(req as JamRequest<LISTQUERY>);
					should().exist(result);
					await validateJamResponse(opts.typeName, result.items, true);
				}
			});
			it('should not (prepare) download an object with unsupported format', async () => {
				const req = {query: {id: objs[0].id, format: 'rar'}, user};
				await controller.download(req as JamRequest<JamParameters.Download>).should.eventually.be.rejectedWith(Error);
			});
			it('should (prepare) download an object', async () => {
				for (const format of [undefined, '', 'zip', 'tar']) {
					for (const obj of objs) {
						const req = {query: {id: obj.id, format}, user};
						const result = await controller.download(req as JamRequest<JamParameters.Download>);
						should().exist(result);
						should().exist(result.pipe);
					}
				}
			});
			tests();
		}, async () => {
			if (cleanup) {
				await cleanup();
			}
		});
}
