import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType} from '../../types/enums';
import {Artwork} from './artwork';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';
import {Folder} from '../folder/folder';
import {FolderRepository} from '../folder/folder.repository';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';
import {ArtworkFilterArgs, ArtworkOrderArgs} from './artwork.args';

@Repository(Artwork)
export class ArtworkRepository extends BaseRepository<Artwork, ArtworkFilterArgs, ArtworkOrderArgs> {
	objType = DBObjectType.artwork;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: ArtworkOrderArgs) {
		this.applyDefaultOrderByEntry(result, direction, order?.orderBy);
	}

	async buildFilter(filter?: ArtworkFilterArgs, user?: User): Promise<QBFilterQuery<Artwork>> {
		let folderIDs: Array<string> = [];
		if (filter?.childOfID) {
			const folderRepo = this.em.getRepository(Folder) as FolderRepository;
			const folder = await folderRepo.oneOrFail({id: filter.childOfID});
			folderIDs = folderIDs.concat(await folderRepo.findAllDescendantsIds(folder));
			folderIDs.push(filter.childOfID);
		}
		if (filter?.folderIDs) {
			folderIDs = folderIDs.concat(filter.folderIDs);
		}
		return filter ? QHelper.buildQuery<Artwork>(
			[
				{id: filter.ids},
				{name: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{format: QHelper.inOrEqual(filter.formats)},
				{createdAt: QHelper.gte(filter.since)},
				{folder: QHelper.foreignKeys(folderIDs)},
				{createdAt: QHelper.gte(filter.since)},
				{fileSize: QHelper.gte(filter.sizeFrom)},
				{fileSize: QHelper.lte(filter.sizeTo)},
				{width: QHelper.gte(filter.widthFrom)},
				{width: QHelper.lte(filter.widthTo)},
				{height: QHelper.gte(filter.heightFrom)},
				{height: QHelper.lte(filter.heightTo)},
				...QHelper.inStringArray('types', filter.types)
			]
		) : {};
	}

}
