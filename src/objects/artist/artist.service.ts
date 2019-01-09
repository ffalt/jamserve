import {IApiBinaryResult} from '../../typings';
import {TrackStore} from '../track/track.store';
import {FolderService} from '../folder/folder.service';
import {Artist} from './artist.model';
import {FolderType} from '../../model/jam-types';
import {ArtistStore, SearchQueryArtist} from './artist.store';
import {Folder} from '../folder/folder.model';
import {BaseListService} from '../base/base.list.service';
import {StateService} from '../state/state.service';
import {cVariousArtist} from '../../engine/scan/scan.service';

export class ArtistService extends BaseListService<Artist, SearchQueryArtist> {


	constructor(public artistStore: ArtistStore, private trackStore: TrackStore, private folderService: FolderService, stateService: StateService) {
		super(artistStore, stateService);
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
		if (artist.name === cVariousArtist) {
			return this.folderService.imageModule.paint(cVariousArtist, size, format);
		}
		const folder = await this.getArtistFolder(artist);
		if (folder) {
			if (!folder.tag.image && artist.info && artist.info.artist.image && artist.info.artist.image.large) {
				await this.folderService.downloadFolderImage(folder, artist.info.artist.image.large);
			}
			return this.folderService.getFolderImage(folder, size, format);
		}
	}

}
