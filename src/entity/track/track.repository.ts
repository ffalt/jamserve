import {BaseRepository} from '../base/base.repository';
import {DBObjectType, TrackOrderFields} from '../../types/enums';
import {Track} from './track';
import {OrderHelper} from '../base/base';
import {Folder} from '../folder/folder';
import {FolderRepository} from '../folder/folder.repository';
import {TrackFilterArgs, TrackOrderArgs} from './track.args';
import {User} from '../user/user';
import {FindOptions, OrderItem, QHelper} from '../../modules/orm';

export class TrackRepository extends BaseRepository<Track, TrackFilterArgs, TrackOrderArgs> {
	objType = DBObjectType.track;

	buildOrder(order?: TrackOrderArgs): Array<OrderItem> {
		const direction = OrderHelper.direction(order);
		switch (order?.orderBy) {
			case TrackOrderFields.created:
				return [['createdAt', direction]];
			case TrackOrderFields.updated:
				return [['updatedAt', direction]];
			case TrackOrderFields.parent:
				return [['path', direction]];
			case TrackOrderFields.filename:
				return [
					['path', direction],
					['fileName', direction]
				];
			case TrackOrderFields.album:
				return [['albumORM', 'name', direction]];
			case TrackOrderFields.trackNr:
				return [['tagORM', 'trackNr', direction]];
			case TrackOrderFields.discNr:
				return [['tagORM', 'disc', direction]];
			case TrackOrderFields.seriesNr:
				return [['tagORM', 'seriesNr', direction]];
			case TrackOrderFields.title:
				return [['tagORM', 'title', direction]];
			case TrackOrderFields.default:
				return [
					['tagORM', 'disc', direction],
					['path', OrderHelper.inverse(direction)],
					['tagORM', 'trackNr', direction],
					['tagORM', 'title', direction]
				];
		}
		return [];
	}

	async buildFilter(filter?: TrackFilterArgs, _?: User): Promise<FindOptions<Track>> {
		if (!filter) {
			return {};
		}
		let folderIDs: Array<string> = [];
		if (filter?.childOfID) {
			const folderRepo = this.em.getRepository(Folder) as FolderRepository;
			const folder = await folderRepo.oneOrFailByID(filter.childOfID);
			folderIDs = folderIDs.concat(await folderRepo.findAllDescendantsIds(folder));
			folderIDs.push(filter.childOfID);
		}
		if (filter?.folderIDs) {
			folderIDs = folderIDs.concat(filter.folderIDs);
		}
		const result = QHelper.buildQuery<Track>(
			[
				{id: filter.ids},
				{createdAt: QHelper.gte(filter.since)},
				{series: QHelper.inOrEqual(filter.seriesIDs)},
				{album: QHelper.inOrEqual(filter.albumIDs)},
				{artist: QHelper.inOrEqual(filter.artistIDs)},
				{albumArtist: QHelper.inOrEqual(filter.albumArtistIDs)},
				{root: QHelper.inOrEqual(filter.rootIDs)},
				{folder: QHelper.inOrEqual(folderIDs.length > 0 ? folderIDs : undefined)}
			]
		);
		result.include = QHelper.includeQueries([
			{bookmarks: [{id: QHelper.inOrEqual(filter.bookmarkIDs)}]},
			{artist: [{name: QHelper.eq(filter.artist)}]},
			{album: [{name: QHelper.eq(filter.album)}]},
			{
				tag: [
					...QHelper.inStringArray('genres', filter.genres),
					{title: QHelper.like(filter.name, this.em.dialect)},
					{title: QHelper.eq(filter.query)},
					{year: QHelper.lte(filter.toYear)},
					{year: QHelper.gte(filter.fromYear)}
				]
			}
		]);
		return result;
	}

}
