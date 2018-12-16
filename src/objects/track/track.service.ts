import {Track} from './track.model';
import {IApiBinaryResult} from '../../typings';
import {TrackStore} from './track.store';
import {FolderService} from '../folder/folder.service';
import {Folder} from '../folder/folder.model';

export class TrackService {

	constructor(public trackStore: TrackStore, private folderService: FolderService) {

	}

	async getTrackFolder(track: Track): Promise<Folder | undefined> {
		return await this.folderService.folderStore.byId(track.parentID);
	}

	async getTrackImage(track: Track, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		const folder = await this.getTrackFolder(track);
		if (folder) {
			return this.folderService.getFolderImage(folder, size, format);
		}
	}

}
