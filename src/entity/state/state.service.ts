import {Inject, Singleton} from 'typescript-ioc';
import {OrmService} from '../../modules/engine/services/orm.service';
import {Base} from '../base/base';
import {DBObjectType} from '../../types/enums';
import {BaseRepository} from '../base/base.repository';
import {User} from '../user/user';
import {State} from './state';
import {NotFoundError} from '../../modules/rest/builder';
import {StateHelper} from './state.helper';

@Singleton
export class StateService {
	@Inject
	private orm!: OrmService;

	async findInStateTypes(id: string): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		const repos: Array<BaseRepository<any, any, any>> = [
			this.orm.Album,
			this.orm.Artist,
			this.orm.Artwork,
			this.orm.Episode,
			this.orm.Folder,
			this.orm.Root,
			this.orm.Playlist,
			this.orm.Podcast,
			this.orm.Series,
			this.orm.Radio,
			this.orm.Track
		]
		for (const repo of repos) {
			const obj = await repo.findOne({id});
			if (obj) {
				return {obj: obj as any, objType: repo.objType};
			}
		}
	}

	async fav(
		id: string,
		remove: boolean | undefined,
		user: User
	): Promise<State> {
		const result = await this.findInStateTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		const helper = new StateHelper(this.orm.orm.em);
		return await helper.fav(result.obj.id, result.objType, user, !!remove);
	}

	async rate(
		id: string,
		rating: number,
		user: User
	): Promise<State> {
		const result = await this.findInStateTypes(id);
		if (!result) {
			return Promise.reject(NotFoundError());
		}
		const helper = new StateHelper(this.orm.orm.em);
		return await helper.rate(result.obj.id, result.objType, user, rating);
	}
}
