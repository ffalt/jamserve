import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {AlbumOrderFields, DBObjectType} from '../../types/enums';
import {Album} from './album';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';
import {AlbumFilterArgs, AlbumOrderArgs} from './album.args';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';

@Repository(Album)
export class AlbumRepository extends BaseRepository<Album, AlbumFilterArgs, AlbumOrderArgs> {
	objType = DBObjectType.album;
	indexProperty = 'name';

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: AlbumOrderArgs): void {
		switch (order?.orderBy) {
			case AlbumOrderFields.created:
				result.createdAt = direction;
				break;
			case AlbumOrderFields.updated:
				result.updatedAt = direction;
				break;
			case AlbumOrderFields.name:
				result.name = direction;
				break;
			case AlbumOrderFields.duration:
				result.duration = direction;
				break;
			case AlbumOrderFields.artist:
				result.artist = result.artist || {};
				(result.artist as QueryOrderMap).name = direction;
				break;
			case AlbumOrderFields.year:
				result.year = direction;
				break;
			case AlbumOrderFields.default:
				// order of setting properties matches order of sort queries. important!
				result.artist = result.artist || {};
				(result.artist as QueryOrderMap).name = direction;
				result.year = direction === QueryOrder.DESC ? QueryOrder.ASC : QueryOrder.DESC;
				result.name = direction;
				break;
		}
	}

	async buildFilter(filter?: AlbumFilterArgs, user?: User): Promise<QBFilterQuery<Album>> {
		return filter ? QHelper.buildQuery<Album>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{mbReleaseID: QHelper.inOrEqual(filter.mbReleaseIDs)},
				{mbArtistID: QHelper.inOrEqual(filter.mbArtistIDs)},
				{albumType: QHelper.inOrEqual(filter.albumTypes)},
				{createdAt: QHelper.gte(filter.since)},
				{roots: QHelper.foreignKeys(filter.rootIDs)},
				{artist: QHelper.foreignKey(filter.artistIDs)},
				{series: QHelper.foreignKey(filter.seriesIDs)},
				{tracks: QHelper.foreignKeys(filter.trackIDs)},
				{folders: QHelper.foreignKeys(filter.folderIDs)},
				{year: QHelper.lte(filter.toYear)},
				{year: QHelper.gte(filter.fromYear)},
				{
					artist: filter.artist ? {
						name: QHelper.eq(filter.artist)
					} : undefined
				},
				...QHelper.inStringArray('genres', filter.genres)
			]
		) : {};
	}

}
