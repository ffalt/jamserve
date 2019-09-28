import {FolderType, MUSICBRAINZ_VARIOUS_ARTISTS_ID} from '../../model/jam-types';
import {ApiBinaryResult} from '../../typings';
import {BaseListService} from '../base/dbobject-list.service';
import {Folder} from '../folder/folder.model';
import {FolderService} from '../folder/folder.service';
import {StateService} from '../state/state.service';
import {TrackStore} from '../track/track.store';
import {Artist} from './artist.model';
import {ArtistStore, SearchQueryArtist} from './artist.store';
import {slugify} from '../../utils/slug';

export class ArtistService extends BaseListService<Artist, SearchQueryArtist> {

	constructor(public artistStore: ArtistStore, private trackStore: TrackStore, private folderService: FolderService, stateService: StateService) {
		super(artistStore, stateService);
	}

	defaultSort(items: Array<Artist>): Array<Artist> {
		return items.sort((a, b) => a.name.localeCompare(b.name));
	}

	canHaveArtistImage(artist: Artist): boolean {
		return (artist.albumTypes.length > 0 && artist.mbArtistID !== MUSICBRAINZ_VARIOUS_ARTISTS_ID);
	}

	async getArtistFolder(artist: Artist): Promise<Folder | undefined> {
		if (artist.folderIDs.length === 0) {
			return;
		}
		const cachedFolders: Array<Folder> = [];
		const tryFolderID: (folderID: string) => Promise<Folder | undefined> = async folderID => {
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

	async getArtistImage(artist: Artist, size?: number, format?: string): Promise<ApiBinaryResult | undefined> {
		if (this.canHaveArtistImage(artist)) {
			const folder = await this.getArtistFolder(artist);
			if (folder) {
				return this.folderService.getFolderImage(folder, size, format);
			}
		}
		return this.folderService.imageModule.paint(artist.name, size, format);
	}

}
