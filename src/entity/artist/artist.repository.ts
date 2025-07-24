import { BaseRepository } from '../base/base.repository.js';
import { ArtistOrderFields, DBObjectType } from '../../types/enums.js';
import { Artist } from './artist.js';
import { OrderHelper } from '../base/base.js';
import { ArtistFilterArgs, ArtistOrderArgs } from './artist.args.js';
import { User } from '../user/user.js';
import { FindOptions, OrderItem, QHelper } from '../../modules/orm/index.js';

export class ArtistRepository extends BaseRepository<Artist, ArtistFilterArgs, ArtistOrderArgs> {
	objType = DBObjectType.artist;
	indexProperty = 'nameSort';

	buildOrder(order?: ArtistOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case ArtistOrderFields.created: {
				return [['createdAt', direction]];
			}
			case ArtistOrderFields.updated: {
				return [['updatedAt', direction]];
			}
			case ArtistOrderFields.name: {
				return [['name', direction]];
			}
			case ArtistOrderFields.default:
			case ArtistOrderFields.nameSort: {
				return [['nameSort', direction]];
			}
		}
		return [];
	}

	async buildFilter(filter?: ArtistFilterArgs, _?: User): Promise<FindOptions<Artist>> {
		if (!filter) {
			return {};
		}
		const result = QHelper.buildQuery<Artist>(
			[
				{ id: filter.ids },
				{ name: QHelper.like(filter.query, this.em.dialect) },
				{ slug: QHelper.eq(filter.slug) },
				{ name: QHelper.eq(filter.name) },
				{ mbArtistID: QHelper.inOrEqual(filter.mbArtistIDs) },
				{ mbArtistID: QHelper.neq(filter.notMbArtistID) },
				{ createdAt: QHelper.gte(filter.since) },
				...QHelper.inStringArray('albumTypes', filter.albumTypes)
			]
		);
		result.include = QHelper.includeQueries([
			{ genres: [{ name: QHelper.inOrEqual(filter.genres) }] },
			{ genres: [{ id: QHelper.inOrEqual(filter.genreIDs) }] },
			{ tracks: [{ id: QHelper.inOrEqual(filter.trackIDs) }] },
			{ albumTracks: [{ id: QHelper.inOrEqual(filter.albumTrackIDs) }] },
			{ series: [{ id: QHelper.inOrEqual(filter.seriesIDs) }] },
			{ albums: [{ id: QHelper.inOrEqual(filter.albumIDs) }] },
			{ folders: [{ id: QHelper.inOrEqual(filter.folderIDs) }] },
			{ roots: [{ id: QHelper.inOrEqual(filter.rootIDs) }] }
		]);
		return result;
	}
}
