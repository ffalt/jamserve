import {BaseRepository} from '../base/base.repository';
import {AlbumOrderFields, DBObjectType} from '../../types/enums';
import {Album} from './album';
import {OrderHelper} from '../base/base';
import {AlbumFilterArgs, AlbumOrderArgs} from './album.args';
import {User} from '../user/user';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';
import Sequelize from 'sequelize';

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
			case AlbumOrderFields.albumType:
				return [['albumType', direction]];
			case AlbumOrderFields.artist:
				return [['artistORM', 'name', direction]];
			case AlbumOrderFields.year:
				return [['year', direction]];
			case AlbumOrderFields.seriesNr: {
				switch (this.em.dialect) {
					case 'sqlite': {
						return [[Sequelize.literal(`substr('0000000000'||\`Album\`.\`seriesNr\`, -10, 10)`), direction]];
					}
					case 'postgres': {
						return [[Sequelize.literal(`LPAD("Album"."seriesNr"::text, 10, '0')`), direction]];
					}
					default: {
						throw new Error(`Implement LPAD request for dialect ${this.em.dialect}`);
					}
				}
			}
			case AlbumOrderFields.default:
				// order of setting properties matches order of sort queries. important!
				return [
					['artistORM', 'name', direction],
					['albumType', direction],
					['year', direction === 'ASC' ? 'DESC' : 'ASC'],
					['name', direction]
				];
		}
		return [];
	}

	async buildFilter(filter?: AlbumFilterArgs, _?: User): Promise<FindOptions<Album>> {
		if (!filter) {
			return {};
		}
		const result = QHelper.buildQuery<Album>([
				{id: filter.ids},
				{name: QHelper.like(filter.query, this.em.dialect)},
				{name: QHelper.eq(filter.name)},
				{mbReleaseID: QHelper.inOrEqual(filter.mbReleaseIDs)},
				{mbArtistID: QHelper.inOrEqual(filter.mbArtistIDs)},
				{mbArtistID: QHelper.neq(filter.notMbArtistID)},
				{albumType: QHelper.inOrEqual(filter.albumTypes)},
				{createdAt: QHelper.gte(filter.since)},
				{artist: QHelper.inOrEqual(filter.artistIDs)},
				{year: QHelper.lte(filter.toYear)},
				{year: QHelper.gte(filter.fromYear)},
				...QHelper.inStringArray('genres', filter.genres)
			]
		);
		result.include = QHelper.includeQueries([
			{tracks: [{id: QHelper.inOrEqual(filter.trackIDs)}]},
			{series: [{id: QHelper.inOrEqual(filter.seriesIDs)}]},
			{artist: [{name: QHelper.eq(filter.artist)}]},
			{folders: [{id: QHelper.inOrEqual(filter.folderIDs)}]},
			{roots: [{id: QHelper.inOrEqual(filter.rootIDs)}]}
		]);
		return result;
	}

}
