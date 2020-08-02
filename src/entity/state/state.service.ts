import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service';
import {User} from '../user/user';
import {State} from './state';
import {NotFoundError} from '../../modules/rest/builder';
import {StateHelper} from './state.helper';
import {DBObjectType} from '../../types/enums';

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

	async reportPlaying(orm: Orm, entries: Array<{ id?: string; type: DBObjectType }>, user: User) {
		const helper = new StateHelper(orm.em);
		for (const entry of entries) {
			if (entry.id) {
				await helper.reportPlaying(entry.id, entry.type, user);
			}
		}

	}
}
