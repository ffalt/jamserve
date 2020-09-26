import {InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service';
import {Genre as ORMGenre} from './genre';
import {IncludesGenreArgs} from './genre.args';
import {User} from '../user/user';
import {Genre, GenreBase, GenreIndex} from './genre.model';
import {DBObjectType} from '../../types/enums';
import {IndexResult, IndexResultGroup} from '../base/base';
import {BaseTransformService} from '../base/base.transform';

@InRequestScope
export class GenreTransformService extends BaseTransformService {

	async genreBases(orm: Orm, list: Array<ORMGenre>, genreArgs: IncludesGenreArgs, user: User): Promise<Array<GenreBase>> {
		return await Promise.all(list.map(g => this.genreBase(orm, g, {}, user)));
	}

	async genreBase(orm: Orm, o: ORMGenre, genreArgs: IncludesGenreArgs, user: User): Promise<GenreBase> {
		return {
			id: o.id,
			name: o.name,
			created: o.createdAt.valueOf(),
			state: genreArgs.genreState ? await this.state(orm, o.id, DBObjectType.genre, user.id) : undefined
		};
	}

	async genre(orm: Orm, o: ORMGenre, genreArgs: IncludesGenreArgs, user: User): Promise<Genre> {
		return {
			...(await this.genreBase(orm, o, genreArgs, user)),
			albumCount: await o.albums.count(),
			trackCount: await o.tracks.count(),
			artistCount: await o.artists.count(),
			folderCount: await o.folders.count()
		};
	}

	async genreIndex(orm: Orm, result: IndexResult<IndexResultGroup<ORMGenre>>): Promise<GenreIndex> {
		return this.index(result, async (item) => {
			return {
				id: item.id,
				name: item.name,
				albumCount: await item.albums.count(),
				trackCount: await item.tracks.count(),
				artistCount: await item.artists.count(),
				folderCount: await item.folders.count()
			};
		});
	}

}
