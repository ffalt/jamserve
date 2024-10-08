import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, GenreOrderFields } from '../../types/enums.js';
import { OrderHelper } from '../base/base.js';
import { User } from '../user/user.js';
import { FindOptions, OrderItem, QHelper } from '../../modules/orm/index.js';
import { Genre } from './genre.js';
import { GenreFilterArgs, GenreOrderArgs } from './genre.args.js';

export class GenreRepository extends BaseRepository<Genre, GenreFilterArgs, GenreOrderArgs> {
	objType = DBObjectType.genre;
	indexProperty = 'name';

	buildOrder(order?: GenreOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case GenreOrderFields.created:
				return [['createdAt', direction]];
			case GenreOrderFields.updated:
				return [['updatedAt', direction]];
			case GenreOrderFields.name:
			case GenreOrderFields.default:
				return [['name', direction]];
		}
		return [];
	}

	async buildFilter(filter?: GenreFilterArgs, _?: User): Promise<FindOptions<Genre>> {
		if (!filter) {
			return {};
		}
		const result = QHelper.buildQuery<Genre>(
			[
				{ id: filter.ids },
				{ name: QHelper.like(filter.query, this.em.dialect) },
				{ name: QHelper.eq(filter.name) }
			]
		);
		result.include = QHelper.includeQueries([
			{ tracks: [{ id: QHelper.inOrEqual(filter.trackIDs) }] }
		// 	{albumTracks: [{id: QHelper.inOrEqual(filter.albumTrackIDs)}]},
		// 	{series: [{id: QHelper.inOrEqual(filter.seriesIDs)}]},
		// 	{albums: [{id: QHelper.inOrEqual(filter.albumIDs)}]},
		// 	{folders: [{id: QHelper.inOrEqual(filter.folderIDs)}]},
		// 	{roots: [{id: QHelper.inOrEqual(filter.rootIDs)}]}
		]);
		return result;
	}
}
