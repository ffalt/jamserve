import {FolderTypesAlbum} from '../../model/jam-types';
import {ApiBinaryResult} from '../../typings';
import {BaseListService} from '../base/dbobject-list.service';
import {Folder} from '../folder/folder.model';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';
import {Album} from './album.model';
import {AlbumStore, SearchQueryAlbum} from './album.store';

export class AlbumService extends BaseListService<Album, SearchQueryAlbum> {

	constructor(public albumStore: AlbumStore, private trackStore: TrackStore, private folderService: FolderService, stateService: StateService) {
		super(albumStore, stateService);
	}

	async getAlbumFolder(album: Album): Promise<Folder | undefined> {
		if (album.folderIDs.length === 0) {
			return;
		}
		if (album.folderIDs.length === 1) {
			return this.folderService.folderStore.byId(album.folderIDs[0]);
		}

		const cachedFolders: Array<Folder> = [];

		const tryFolderID: (folderID: string) => Promise<Folder | undefined> = async (folderID) => {
			let folders = await this.folderService.collectFolderPath(folderID, cachedFolders);
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
			if (folder && (FolderTypesAlbum.indexOf(folder.tag.type) >= 0)) {
				return folder;
			}
		};
		for (const folderID of album.folderIDs) {
			const folder = await tryFolderID(folderID);
			if (folder) {
				return folder;
			}
		}
	}

	async getAlbumImage(album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folder = await this.getAlbumFolder(album);
		if (folder) {
			return this.folderService.getFolderImage(folder, size, format);
		}
	}
}
