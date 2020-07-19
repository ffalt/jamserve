import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {ArtistOrderFields, DBObjectType} from '../../types/enums';
import {Artist} from './artist';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';
import {ArtistFilterArgs, ArtistOrderArgs} from './artist.args';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';

@Repository(Artist)
export class ArtistRepository extends BaseRepository<Artist, ArtistFilterArgs, ArtistOrderArgs> {
	objType = DBObjectType.artist;
	indexProperty = 'nameSort';

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: ArtistOrderArgs) {
		switch (order?.orderBy) {
			case ArtistOrderFields.created:
				result.createdAt = direction;
				break;
			case ArtistOrderFields.updated:
				result.updatedAt = direction;
				break;
			case ArtistOrderFields.name:
				result.name = direction;
				break;
			case ArtistOrderFields.default:
			case ArtistOrderFields.nameSort:
				result.nameSort = direction;
				break;
		}
	}

	async buildFilter(filter?: ArtistFilterArgs, user?: User): Promise<QBFilterQuery<Artist>> {
		return filter ? QHelper.buildQuery<Artist>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{slug: QHelper.eq(filter.slug)},
				{name: QHelper.eq(filter.name)},
				{mbArtistID: QHelper.inOrEqual(filter.mbArtistIDs)},
				{createdAt: QHelper.gte(filter.since)},
				{roots: QHelper.foreignKeys(filter.rootIDs)},
				{folders: QHelper.foreignKeys(filter.folderIDs)},
				{albums: QHelper.foreignKeys(filter.albumIDs)},
				{series: QHelper.foreignKey(filter.seriesIDs)},
				{tracks: QHelper.foreignKeys(filter.trackIDs)},
				{albumTracks: QHelper.foreignKeys(filter.albumTrackIDs)},
				...QHelper.inStringArray('genres', filter.genres),
				...QHelper.inStringArray('albumTypes', filter.albumTypes)
			]
		) : {};
	}
}
