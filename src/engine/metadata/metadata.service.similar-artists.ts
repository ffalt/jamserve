import {FolderType, LastFMLookupType} from '../../model/jam-types';
import {LastFM} from '../../model/lastfm-rest-data';
import {logger} from '../../utils/logger';
import {Artist} from '../artist/artist.model';
import {ArtistStore} from '../artist/artist.store';
import {Folder} from '../folder/folder.model';
import {FolderStore} from '../folder/folder.store';
import {MetaDataService} from './metadata.service';
import SimilarArtist = LastFM.SimilarArtist;

const log = logger('Metadata');

export class MetadataServiceSimilarArtists {
	constructor(private service: MetaDataService, private folderStore: FolderStore, private artistStore: ArtistStore) {

	}

	private async getLastFMSimilarArtists(mbArtistID: string): Promise<Array<SimilarArtist>> {
		const lastfm = await this.service.lastFMLookup(LastFMLookupType.artist, mbArtistID);
		if (lastfm && lastfm.artist && lastfm.artist.similar && lastfm.artist.similar.artist) {
			return lastfm.artist.similar.artist;
		}
		return [];
	}

	private async findSimilarArtistFolders(similarArtists: Array<SimilarArtist>): Promise<Array<Folder>> {
		const names: Array<string> = [];
		similarArtists.forEach(a => {
			if (a.name) {
				names.push(a.name);
			}
		});
		return (await this.folderStore.search({types: [FolderType.artist], artists: names})).items;
	}

	private async findSimilarArtists(similarArtists: Array<SimilarArtist>): Promise<Array<Artist>> {
		const names: Array<string> = [];
		similarArtists.forEach(a => {
			if (a.name) {
				names.push(a.name);
			}
		});
		return (await this.artistStore.search({names})).items;
	}

	async byArtistIdName(mbArtistID?: string, artist?: string): Promise<Array<SimilarArtist>> {
		let similar: Array<SimilarArtist> = [];
		if (mbArtistID) {
			similar = await this.getLastFMSimilarArtists(mbArtistID);
		} else if (artist) {
			const a = await this.service.lastFMArtistSearch(artist);
			if (a && a.artist) {
				similar = await this.getLastFMSimilarArtists(a.artist.mbid);
			}
		}
		return similar;
	}

	async byArtist(artist: Artist): Promise<Array<Artist>> {
		try {
			const similar = await this.byArtistIdName(artist.mbArtistID, artist.name);
			if (similar && similar.length > 0) {
				return this.findSimilarArtists(similar);
			}
		} catch (e) {
			log.error(e);
		}
		return [];
	}

	async byFolder(folder: Folder): Promise<Array<Folder>> {
		try {
			const similar = await this.byArtistIdName(folder.tag.mbArtistID, folder.tag.artist);
			if (similar && similar.length > 0) {
				return this.findSimilarArtistFolders(similar);
			}
		} catch (e) {
			log.error(e);
		}
		return [];
	}

}
