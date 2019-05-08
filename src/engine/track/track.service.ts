import {ApiBinaryResult} from '../../typings';
import {BaseListService} from '../base/dbobject-list.service';
import {Folder} from '../folder/folder.model';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {Track} from './track.model';
import {SearchQueryTrack, TrackStore} from './track.store';

export class TrackService extends BaseListService<Track, SearchQueryTrack> {

	constructor(public trackStore: TrackStore, private folderService: FolderService, stateService: StateService) {
		super(trackStore, stateService);
	}

	async getTrackFolder(track: Track): Promise<Folder | undefined> {
		return this.folderService.folderStore.byId(track.parentID);
	}

	async getTrackImage(track: Track, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folder = await this.getTrackFolder(track);
		if (folder) {
			return this.folderService.getFolderImage(folder, size, format);
		}
	}

}
