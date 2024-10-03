import { InRequestScope } from 'typescript-ioc';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { User } from '../user/user.js';
import { State } from './state.js';
import { StateHelper } from './state.helper.js';
import { DBObjectType } from '../../types/enums.js';
import {NotFoundError} from '../../modules/deco/express/express-error.js';

@InRequestScope
export class StateService {
	async fav(
		orm: Orm,
		id: string,
		remove: boolean | undefined,
		user: User
	): Promise<State> {
		const result = await orm.findInStateTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		const helper = new StateHelper(orm.em);
		return await helper.fav(result.obj.id, result.objType, user, !!remove);
	}

	async rate(
		orm: Orm,
		id: string,
		rating: number,
		user: User
	): Promise<State> {
		const result = await orm.findInStateTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		const helper = new StateHelper(orm.em);
		return await helper.rate(result.obj.id, result.objType, user, rating);
	}

	async reportPlaying(orm: Orm, entries: Array<{ id?: string; type: DBObjectType }>, user: User): Promise<void> {
		const helper = new StateHelper(orm.em);
		for (const entry of entries) {
			if (entry.id) {
				await helper.reportPlaying(entry.id, entry.type, user);
			}
		}
	}
}
