import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { Artwork } from './artwork.js';
import { Folder } from '../folder/folder.js';
import { FolderRepository } from '../folder/folder.repository.js';
import { User } from '../user/user.js';
import { ArtworkFilterParameters, ArtworkOrderParameters } from './artwork.parameters.js';
import { QHelper } from '../../modules/orm/index.js';
import { FindOptions, OrderItem } from 'sequelize';

export class ArtworkRepository extends BaseRepository<Artwork, ArtworkFilterParameters, ArtworkOrderParameters> {
	objType = DBObjectType.artwork;

	buildOrder(order?: ArtworkOrderParameters): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: ArtworkFilterParameters, _?: User): Promise<FindOptions<Artwork>> {
		if (!filter) {
			return {};
		}
		let folderIDs: Array<string> = [];
		if (filter.childOfID) {
			const folderRepo = this.em.getRepository<Folder, FolderRepository>(Folder);
			const folder = await folderRepo.oneOrFailByID(filter.childOfID);
			folderIDs = [...folderIDs, ...await folderRepo.findAllDescendantsIds(folder)];
			folderIDs.push(filter.childOfID);
		}
		if (filter.folderIDs) {
			folderIDs = [...folderIDs, ...filter.folderIDs];
		}
		return QHelper.buildQuery<Artwork>([
			{ id: filter.ids },
			{ name: QHelper.like(filter.query, this.em.dialect) },
			{ name: QHelper.eq(filter.name) },
			{ format: QHelper.inOrEqual(filter.formats) },
			{ createdAt: QHelper.gte(filter.since) },
			{ folder: QHelper.inOrEqual(folderIDs) },
			{ createdAt: QHelper.gte(filter.since) },
			{ fileSize: QHelper.gte(filter.sizeFrom) },
			{ fileSize: QHelper.lte(filter.sizeTo) },
			{ width: QHelper.gte(filter.widthFrom) },
			{ width: QHelper.lte(filter.widthTo) },
			{ height: QHelper.gte(filter.heightFrom) },
			{ height: QHelper.lte(filter.heightTo) },
			...QHelper.inStringArray('types', filter.types)
		]
		);
	}
}
