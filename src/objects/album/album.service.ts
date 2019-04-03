import {Album} from './album.model';
import {IApiBinaryResult} from '../../typings';
import {TrackStore} from '../track/track.store';
import {AlbumStore, SearchQueryAlbum} from './album.store';
import {FolderService} from '../folder/folder.service';
import {FolderTypesAlbum} from '../../model/jam-types';
import {Folder} from '../folder/folder.model';
import {BaseListService} from '../base/base.list.service';
import {StateService} from '../state/state.service';

export class AlbumService extends BaseListService<Album, SearchQueryAlbum> {

	constructor(public albumStore: AlbumStore, private trackStore: TrackStore, private folderService: FolderService, stateService: StateService) {
		super(albumStore, stateService);
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

	async getAlbumImage(album: Album, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		const folder = await this.getAlbumFolder(album);
		if (folder) {
			return this.folderService.getFolderImage(folder, size, format);
		}
	}
}
