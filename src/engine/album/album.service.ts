import {AlbumType, FolderTypesAlbum} from '../../model/jam-types';
import {ApiBinaryResult} from '../../typings';
import {BaseListService} from '../base/dbobject-list.service';
import {Folder} from '../folder/folder.model';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {TrackService} from '../track/track.service';
import {Album} from './album.model';
import {AlbumStore, SearchQueryAlbum} from './album.store';

export class AlbumService extends BaseListService<Album, SearchQueryAlbum> {

	constructor(public albumStore: AlbumStore, private trackService: TrackService, private folderService: FolderService, stateService: StateService) {
		super(albumStore, stateService);
	}

	defaultSort(items: Array<Album>): Array<Album> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	async getAlbumFolder(album: Album): Promise<Folder | undefined> {
		if (album.folderIDs.length === 0) {
			return;
		}
		if (album.folderIDs.length === 1) {
			return this.folderService.folderStore.byId(album.folderIDs[0]);
		}

		const cachedFolders: Array<Folder> = [];

		const tryFolderID: (folderID: string) => Promise<Folder | undefined> = async folderID => {
			let folders = await this.folderService.collectFolderPath(folderID, cachedFolders);
			if (folders.length === 0) {
				return;
			}
			folders = folders.sort((a, b) => b.tag.level - a.tag.level);
			let folder = folders[0];
			for (const f of folders) {
				if (FolderTypesAlbum.includes(f.tag.type)) {
					folder = f;
				} else {
					break;
				}
			}
			if (folder && (FolderTypesAlbum.includes(folder.tag.type))) {
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

	async getAlbumTrackImage(album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (album.trackIDs.length > 0) {
			const track = await this.trackService.trackStore.byId(album.trackIDs[0]);
			if (track) {
				return this.trackService.getTrackImage(track, size, format);
			}
		}
	}

	async getAlbumFolderImage(album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		const folder = await this.getAlbumFolder(album);
		if (folder) {
			const result = this.folderService.getFolderImage(folder, size, format);
			if (result) {
				return result;
			}
		}
	}

	async getAlbumImage(album: Album, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		let result: ApiBinaryResult | undefined;
		if (album.albumType === AlbumType.series && album.trackIDs.length === 1) {
			result = await this.getAlbumTrackImage(album, size, format);
		}
		if (!result) {
			result = await this.getAlbumFolderImage(album, size, format);
		}
		if (!result) {
			result = await this.getAlbumTrackImage(album, size, format);
		}
		return result;
	}
}
