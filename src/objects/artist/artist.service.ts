import {IApiBinaryResult} from '../../typings';
import {TrackStore} from '../track/track.store';
import {FolderService} from '../folder/folder.service';
import {Artist} from './artist.model';
import {FolderType, MusicBrainz_VARIOUS_ARTISTS_NAME} from '../../model/jam-types';
import {ArtistStore, SearchQueryArtist} from './artist.store';
import {Folder} from '../folder/folder.model';
import {BaseListService} from '../base/base.list.service';
import {StateService} from '../state/state.service';
import {slugify} from '../../engine/scan/scan.utils';

export class ArtistService extends BaseListService<Artist, SearchQueryArtist> {


	constructor(public artistStore: ArtistStore, private trackStore: TrackStore, private folderService: FolderService, stateService: StateService) {
		super(artistStore, stateService);
	}

	async getArtistFolder(artist: Artist): Promise<Folder | undefined> {
		if (artist.folderIDs.length === 0) {
			return;
		}
		const cachedFolders: Array<Folder> = [];
		const tryFolderID: (folderID: string) => Promise<Folder | undefined> = async (folderID) => {
			const folders = await this.folderService.collectFolderPath(folderID, cachedFolders);
			if (folders.length === 0) {
				return;
			}
			return folders.find(f => f.tag.type === FolderType.artist);
		};
		for (const folderID of artist.folderIDs) {
			const folder = await tryFolderID(folderID);
			if (folder && (
				(folder.tag.mbArtistID && folder.tag.mbArtistID === artist.mbArtistID) || (folder.tag.artist && slugify(folder.tag.artist) === artist.slug))
			) {
				return folder;
			}
		}
	}

	async getArtistImage(artist: Artist, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (artist.name === MusicBrainz_VARIOUS_ARTISTS_NAME) {
			return this.folderService.imageModule.paint(MusicBrainz_VARIOUS_ARTISTS_NAME, size, format);
		}
		const folder = await this.getArtistFolder(artist);
		if (folder) {
			return this.folderService.getFolderImage(folder, size, format);
		}
		return this.folderService.imageModule.paint(artist.name, size, format);
	}

}
