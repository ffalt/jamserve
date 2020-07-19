import {Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType, FolderOrderFields} from '../../types/enums';
import {Folder} from './folder';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';
import {QueryOrder, QueryOrderMap} from 'mikro-orm/dist/query';
import {FolderFilterArgs, FolderOrderArgs} from './folder.args';
import {User} from '../user/user';

@Repository(Folder)
export class FolderRepository extends BaseRepository<Folder, FolderFilterArgs, FolderOrderArgs> {
	objType = DBObjectType.folder;
	indexProperty = 'title';

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: FolderOrderArgs): void {
		switch (order?.orderBy) {
			case FolderOrderFields.created:
				result.createdAt = direction;
				break;
			case FolderOrderFields.updated:
				result.updatedAt = direction;
				break;
			case FolderOrderFields.year:
				result.year = direction;
				break;
			case FolderOrderFields.default:
			case FolderOrderFields.name:
				result.path = direction;
				break;
		}
	}

	async buildFilter(filter?: FolderFilterArgs, user?: User): Promise<QBFilterQuery<Folder>> {
		let parentIDs: Array<string> = [];
		if (filter?.childOfID) {
			const folder = await this.oneOrFail({id: filter.childOfID});
			parentIDs = parentIDs.concat(await this.findAllDescendantsIds(folder));
			if (parentIDs.length === 0) {
				parentIDs.push('__non_existing_');
			}
		}
		if (filter?.parentIDs) {
			parentIDs = parentIDs.concat(filter?.parentIDs);
		}
		return filter ? QHelper.buildQuery<Folder>(
			[
				{id: filter.ids},
				{title: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{album: QHelper.eq(filter.album)},
				{artist: QHelper.eq(filter.artist)},
				{artistSort: QHelper.eq(filter.artistSort)},
				{title: QHelper.eq(filter.title)},
				{createdAt: QHelper.gte(filter.since)},
				{parent: QHelper.foreignKey(parentIDs.length > 0 ? parentIDs : undefined)},
				{level: QHelper.eq(filter.level)},
				// {totalTrackCount: QHelper.eq(filter.totalTrackCount)},
				{albumType: QHelper.inOrEqual(filter.albumTypes)},
				{folderType: QHelper.inOrEqual(filter.folderTypes)},
				{mbReleaseID: QHelper.inOrEqual(filter.mbReleaseIDs)},
				{mbReleaseGroupID: QHelper.inOrEqual(filter.mbReleaseGroupIDs)},
				{mbAlbumType: QHelper.inOrEqual(filter.mbAlbumTypes)},
				{mbArtistID: QHelper.inOrEqual(filter.mbArtistIDs)},
				{year: QHelper.lte(filter.toYear)},
				{year: QHelper.gte(filter.fromYear)},
				{root: QHelper.foreignKey(filter.rootIDs)},
				{artworks: QHelper.foreignKeys(filter.artworksIDs)},
				{tracks: QHelper.foreignKeys(filter.trackIDs)},
				{series: QHelper.foreignKeys(filter.seriesIDs)},
				{albums: QHelper.foreignKeys(filter.albumIDs)},
				{artists: QHelper.foreignKeys(filter.artistIDs)},
				{createdAt: QHelper.gte(filter.since)},
				...QHelper.inStringArray('genres', filter.genres)
			]
		) : {};
	}

	async findAllDescendants(folder: Folder): Promise<Array<Folder>> {
		return this.find({path: {$like: `%${folder.path}%`}});
	}

	async findAllDescendantsIds(folder: Folder): Promise<Array<string>> {
		return this.findIDs({path: {$like: `%${folder.path}%`}});
	}

}
