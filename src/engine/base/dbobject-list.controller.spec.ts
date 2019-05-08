import {should} from 'chai';
import {describe, it} from 'mocha';
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
	testBaseController<OBJREQUEST, OBJLISTREQUEST, INCLUDE, JAMQUERY, SEARCHQUERY, DBOBJECT, RESULTOBJ>(opts,
		async (jamApi, jamUser) => {
			user = jamUser;
			controller = await setup(jamApi, jamUser);
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
					await validateJamResponse(opts.typeName, result, true);
				}
			});
			tests();
		}, async () => {
			if (cleanup) {
				await cleanup();
			}
		});
}
