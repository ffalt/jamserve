import {IApiBinaryResult} from '../../typings';
import {TrackStore} from '../track/track.store';
import {FolderService} from '../folder/folder.service';
import {Artist} from './artist.model';
import {FolderType} from '../../types';
import {ArtistStore} from './artist.store';
import {Folder} from '../folder/folder.model';

export class ArtistService {


	constructor(public artistStore: ArtistStore, private trackStore: TrackStore, private folderService: FolderService) {

	}


	async getArtistFolder(artist: Artist): Promise<Folder | undefined> {
		if (artist.trackIDs.length === 0) {
			return;
		}
		const track = await this.trackStore.byId(artist.trackIDs[0]);
		if (!track) {
			return;
		}
		const folders = await this.folderService.collectFolderPath(track.parentID);
		if (folders.length === 0) {
			return;
		}
		let folder = folders.find(f => f.tag.type === FolderType.artist);
		if (!folder) {
			folder = folders[folders.length - 1];
		}
		return folder;
	}

	async getArtistImage(artist: Artist, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		const folder = await this.getArtistFolder(artist);
		if (folder) {
			return this.folderService.getFolderImage(folder, size, format);
		}
	}

}
