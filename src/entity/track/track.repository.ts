import {QueryOrder, Repository} from 'mikro-orm';
import {BaseRepository} from '../base/base.repository';
import {DBObjectType, TrackOrderFields} from '../../types/enums';
import {Track} from './track';
import {QBFilterQuery} from 'mikro-orm/dist/typings';
import {QHelper} from '../base/base';
import {Folder} from '../folder/folder';
import {FolderRepository} from '../folder/folder.repository';
import {TrackFilterArgs, TrackOrderArgs} from './track.args';
import {QueryOrderMap} from 'mikro-orm/dist/query';
import {User} from '../user/user';

@Repository(Track)
export class TrackRepository extends BaseRepository<Track, TrackFilterArgs, TrackOrderArgs> {
	objType = DBObjectType.track;

	applyOrderByEntry(result: QueryOrderMap, direction: QueryOrder, order?: TrackOrderArgs) {
		switch (order?.orderBy) {
			case TrackOrderFields.created:
				result.createdAt = direction;
				break;
			case TrackOrderFields.updated:
				result.updatedAt = direction;
				break;
			case TrackOrderFields.parent:
				result.path = direction;
				break;
			case TrackOrderFields.trackNr:
				result.tag = result.tag || {};
				(result.tag as QueryOrderMap).trackNr = direction;
				break;
			case TrackOrderFields.discNr:
				result.tag = result.tag || {};
				(result.tag as QueryOrderMap).disc = direction;
				break;
			case TrackOrderFields.title:
				result.tag = result.tag || {};
				(result.tag as QueryOrderMap).title = direction;
				break;
			case TrackOrderFields.default:
				// order of setting properties matches order of sort queries. important!
				result.path = direction;
				result.tag = result.tag || {};
				(result.tag as QueryOrderMap).disc = direction;
				(result.tag as QueryOrderMap).trackNr = direction;
				break;
		}
	}

	async buildFilter(filter: TrackFilterArgs, user?: User): Promise<QBFilterQuery<Track>> {
		if (!filter) {
			return {};
		}
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
		return QHelper.buildQuery<Track>(
			[
				{id: filter.ids},
				{tag: QHelper.foreignLike('title', filter.query)},
				{tag: QHelper.foreignEQ('title', filter.name)},
				{createdAt: QHelper.gte(filter.since)},
				{series: QHelper.foreignKey(filter.seriesIDs)},
				{album: QHelper.foreignKey(filter.albumIDs)},
				{artist: QHelper.foreignKey(filter.artistIDs)},
				{albumArtist: QHelper.foreignKey(filter.albumArtistIDs)},
				{root: QHelper.foreignKey(filter.rootIDs)},
				{folder: QHelper.foreignKey(folderIDs.length > 0 ? folderIDs : undefined)},
				{bookmarks: QHelper.foreignKeys(filter.bookmarkIDs)},
				{artist: QHelper.foreignValue('name', filter.artist ? [filter.artist] : undefined)},
				{album: QHelper.foreignValue('name', filter.album ? [filter.album] : undefined)},
				...QHelper.foreignStringArray('tag', 'genres', filter.genres),
				{tag: QHelper.foreignLTE('year', filter.toYear)},
				{tag: QHelper.foreignGTE('year', filter.fromYear)}
			]
		);
	}

}
