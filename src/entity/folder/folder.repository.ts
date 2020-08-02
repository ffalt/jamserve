import {BaseRepository} from '../base/base.repository';
import {DBObjectType, FolderOrderFields} from '../../types/enums';
import {Folder} from './folder';
import {OrderHelper} from '../base/base';
import {FolderFilterArgs, FolderOrderArgs} from './folder.args';
import {User} from '../user/user';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

export class FolderRepository extends BaseRepository<Folder, FolderFilterArgs, FolderOrderArgs> {
	objType = DBObjectType.folder;
	indexProperty = 'title';

	buildOrder(order?: FolderOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case FolderOrderFields.created:
				return [['createdAt', direction]];
			case FolderOrderFields.updated:
				return [['updatedAt', direction]];
			case FolderOrderFields.year:
				return [['year', direction]];
			case FolderOrderFields.level:
				return [['level', direction]];
			case FolderOrderFields.title:
				return [
					['title', direction],
					['path', direction]
				];
			case FolderOrderFields.default:
			case FolderOrderFields.name:
				return [['path', direction]];
		}
		return [];
	}

	async buildFilter(filter?: FolderFilterArgs, user?: User): Promise<FindOptions<Folder>> {
		if (!filter) {
			return {};
		}
		let parentIDs: Array<string> = [];
		if (filter.childOfID) {
			const folder = await this.oneOrFailByID(filter.childOfID);
			parentIDs = parentIDs.concat(await this.findAllDescendantsIds(folder));
			if (parentIDs.length === 0) {
				parentIDs.push('__non_existing_');
			}
		}
		if (filter.parentIDs) {
			parentIDs = parentIDs.concat(filter?.parentIDs);
		}
		const result = QHelper.buildQuery<Folder>(
			[
				{id: filter.ids},
				{title: QHelper.like(filter.query)},
				{name: QHelper.eq(filter.name)},
				{album: QHelper.eq(filter.album)},
				{artist: QHelper.eq(filter.artist)},
				{artistSort: QHelper.eq(filter.artistSort)},
				{title: QHelper.eq(filter.title)},
				{createdAt: QHelper.gte(filter.since)},
				{parent: QHelper.inOrEqual(parentIDs.length > 0 ? parentIDs : undefined)},
				{level: QHelper.eq(filter.level)},
				{albumType: QHelper.inOrEqual(filter.albumTypes)},
				{folderType: QHelper.inOrEqual(filter.folderTypes)},
				{mbReleaseID: QHelper.inOrEqual(filter.mbReleaseIDs)},
				{mbReleaseGroupID: QHelper.inOrEqual(filter.mbReleaseGroupIDs)},
				{mbAlbumType: QHelper.inOrEqual(filter.mbAlbumTypes)},
				{mbArtistID: QHelper.inOrEqual(filter.mbArtistIDs)},
				{year: QHelper.lte(filter.toYear)},
				{year: QHelper.gte(filter.fromYear)},
				{root: QHelper.inOrEqual(filter.rootIDs)},
				{createdAt: QHelper.gte(filter.since)},
				...QHelper.inStringArray('genres', filter.genres)
			]
		);
		result.include = QHelper.includeQueries<Folder>([
			{tracks: [{id: QHelper.inOrEqual(filter.trackIDs)}]},
			{artworks: [{id: QHelper.inOrEqual(filter.artworksIDs)}]},
			{series: [{id: QHelper.inOrEqual(filter.seriesIDs)}]},
			{albums: [{id: QHelper.inOrEqual(filter.albumIDs)}]},
			{artists: [{id: QHelper.inOrEqual(filter.artistIDs)}]}
		]);
		return result;
	}

	async findAllDescendants(folder: Folder): Promise<Array<Folder>> {
		const options = QHelper.buildQuery<Folder>([{path: QHelper.like(folder.path)}]);
		return this.find(options);
	}

	async findAllDescendantsIds(folder: Folder): Promise<Array<string>> {
		const options = QHelper.buildQuery<Folder>([{path: QHelper.like(folder.path)}]);
		return this.findIDs(options);
	}

}
