import {Album} from './album.model';
import {IApiBinaryResult} from '../../typings';
import {TrackStore} from '../track/track.store';
import {AlbumStore} from './album.store';
import {FolderService} from '../folder/folder.service';
import {FolderTypesAlbum} from '../../types';
import {Folder} from '../folder/folder.model';

export class AlbumService {

	constructor(public albumStore: AlbumStore, private trackStore: TrackStore, private folderService: FolderService) {

	}

	async getAlbumImage(album: Album, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		const folder = await this.getAlbumFolder(album);
		if (folder) {
			return this.folderService.getFolderImage(folder, size, format);
		}
	}

	async getAlbumFolder(album: Album): Promise<Folder | undefined> {
		if (album.trackIDs.length === 0) {
			return;
		}
		const track = await this.trackStore.byId(album.trackIDs[0]);
		if (!track) {
			return;
		}
		let folders = await this.folderService.collectFolderPath(track.parentID);
		if (folders.length === 0) {
			return;
		}
		folders = folders.sort((a, b) => b.tag.level - a.tag.level);
		let folder = folders[0];
		for (const f of folders) {
			if (FolderTypesAlbum.indexOf(f.tag.type) >= 0) {
				folder = f;
			} else {
				break;
			}
		}
		return folder;
	}

}
