import {BaseRepository} from '../base/base.repository';
import {AlbumOrderFields, DBObjectType} from '../../types/enums';
import {Album} from './album';
import {OrderHelper} from '../base/base';
import {AlbumFilterArgs, AlbumOrderArgs} from './album.args';
import {User} from '../user/user';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

export class AlbumRepository extends BaseRepository<Album, AlbumFilterArgs, AlbumOrderArgs> {
	objType = DBObjectType.album;
	indexProperty = 'name';

	buildOrder(order?: AlbumOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case AlbumOrderFields.created:
				return [['createdAt', direction]];
			case AlbumOrderFields.updated:
				return [['updatedAt', direction]];
			case AlbumOrderFields.name:
				return [['name', direction]];
			case AlbumOrderFields.duration:
				return [['duration', direction]];
			case AlbumOrderFields.artist:
				return [['artistORM', 'name', direction]];
			case AlbumOrderFields.year:
				return [['year', direction]];
			case AlbumOrderFields.default:
				// order of setting properties matches order of sort queries. important!
				return [
					['artistORM', 'name', direction],
					['year', direction === 'ASC' ? 'DESC' : 'ASC'],
					['name', direction]
				];
		}
		return [];
	}

	async buildFilter(filter?: AlbumFilterArgs, user?: User): Promise<FindOptions<Album>> {
		if (!filter) {
			return {};
		}
		const result = QHelper.buildQuery<Album>([
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{mbReleaseID: QHelper.inOrEqual(filter.mbReleaseIDs)},
				{mbArtistID: QHelper.inOrEqual(filter.mbArtistIDs)},
				{albumType: QHelper.inOrEqual(filter.albumTypes)},
				{createdAt: QHelper.gte(filter.since)},
				{artist: QHelper.inOrEqual(filter.artistIDs)},
				{year: QHelper.lte(filter.toYear)},
				{year: QHelper.gte(filter.fromYear)},
				...QHelper.inStringArray('genres', filter.genres)
			]
		);
		result.include = QHelper.includeQueries<Album>([
			{tracks: [{id: QHelper.inOrEqual(filter.trackIDs)}]},
			{series: [{id: QHelper.inOrEqual(filter.seriesIDs)}]},
			{artist: [{name: QHelper.eq(filter.artist)}]},
			{folders: [{id: QHelper.inOrEqual(filter.folderIDs)}]},
			{roots: [{id: QHelper.inOrEqual(filter.rootIDs)}]}
		]);
		return result;
	}

}
