import {Album} from './album.model';
import {IApiBinaryResult} from '../../typings';
import {TrackStore} from '../track/track.store';
import {AlbumStore} from './album.store';
import {FolderService} from '../folder/folder.service';
import {FolderTypesAlbum} from '../../types';

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
		const folders = await this.folderService.collectFolderPath(track.parentID);
		if (folders.length === 0) {
			return;
		}
		let folder = folders[0];
		for (const f of folders) {
			if (FolderTypesAlbum.indexOf(f.tag.type) >= 0) {
				folder = f;
			} else {
				break;
			}
		}
		return this.folderService.getFolderImage(folder, size, format);
	}

}
