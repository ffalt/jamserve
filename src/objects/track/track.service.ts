import {Track} from './track.model';
import {IApiBinaryResult} from '../../typings';
import {TrackStore} from './track.store';
import {FolderService} from '../folder/folder.service';

export class TrackService {

	constructor(private trackStore: TrackStore, private folderService: FolderService) {

	}

	async getTrackImage(track: Track, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		const folder = await this.folderService.folderStore.byId(track.parentID);
		if (!folder) {
			return;
		}
		return this.folderService.getFolderImage(folder, size, format);
	}

}
