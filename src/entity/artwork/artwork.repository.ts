import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Artwork} from './artwork';
import {Folder} from '../folder/folder';
import {FolderRepository} from '../folder/folder.repository';
import {User} from '../user/user';
import {ArtworkFilterArgs, ArtworkOrderArgs} from './artwork.args';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

export class ArtworkRepository extends BaseRepository<Artwork, ArtworkFilterArgs, ArtworkOrderArgs> {
	objType = DBObjectType.artwork;

	buildOrder(order?: ArtworkOrderArgs): Array<OrderItem> {
		return this.buildDefaultOrder(order);
	}

	async buildFilter(filter?: ArtworkFilterArgs, _?: User): Promise<FindOptions<Artwork>> {
		if (!filter) {
			return {};
		}
		let folderIDs: Array<string> = [];
		if (filter?.childOfID) {
			const folderRepo = this.em.getRepository<Folder, FolderRepository>(Folder);
			const folder = await folderRepo.oneOrFailByID(filter.childOfID);
			folderIDs = folderIDs.concat(await folderRepo.findAllDescendantsIds(folder));
			folderIDs.push(filter.childOfID);
		}
		if (filter?.folderIDs) {
			folderIDs = folderIDs.concat(filter.folderIDs);
		}
		return QHelper.buildQuery<Artwork>([
				{id: filter.ids},
				{name: QHelper.like(filter.query, this.em.dialect)},
				{name: QHelper.eq(filter.name)},
				{format: QHelper.inOrEqual(filter.formats)},
				{createdAt: QHelper.gte(filter.since)},
				{folder: QHelper.inOrEqual(folderIDs)},
				{createdAt: QHelper.gte(filter.since)},
				{fileSize: QHelper.gte(filter.sizeFrom)},
				{fileSize: QHelper.lte(filter.sizeTo)},
				{width: QHelper.gte(filter.widthFrom)},
				{width: QHelper.lte(filter.widthTo)},
				{height: QHelper.gte(filter.heightFrom)},
				{height: QHelper.lte(filter.heightTo)},
				...QHelper.inStringArray('types', filter.types)
			]
		);
	}

}
