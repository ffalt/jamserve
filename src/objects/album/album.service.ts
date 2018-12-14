import {Album} from './album.model';
import {IApiBinaryResult} from '../../typings';
import {TrackStore} from '../track/track.store';
import {AlbumStore} from './album.store';
import {FolderService} from '../folder/folder.service';

export class AlbumService {


	constructor(public albumStore: AlbumStore, private trackStore: TrackStore, private folderService: FolderService) {

	}

	async getAlbumImage(album: Album, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (album.trackIDs.length === 0) {
			return;
		}
		const track = await this.trackStore.byId(album.trackIDs[0]);
		if (!track) {
			return;
		}
		const folder = await this.folderService.folderStore.byId(track.parentID);
		if (!folder) {
			return;
		}
		return this.folderService.getFolderImage(folder, size, format);
	}

}
