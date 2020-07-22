import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service';
import {User} from '../user/user';
import {State} from './state';
import {NotFoundError} from '../../modules/rest/builder';
import {StateHelper} from './state.helper';

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
}
