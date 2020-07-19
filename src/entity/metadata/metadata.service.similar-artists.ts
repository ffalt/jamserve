import {MetaDataService} from './metadata.service';
import {Folder} from '../folder/folder';
import {LastFM} from '../../modules/audio/clients/lastfm-rest-data';
import {FolderType, LastFMLookupType} from '../../types/enums';
import {Artist} from '../artist/artist';
import {PageResult} from '../base/base';
import {PageArgs} from '../base/base.args';
import SimilarArtist = LastFM.SimilarArtist;

export class MetadataServiceSimilarArtists {
	constructor(private service: MetaDataService) {

	}

	private async getLastFMSimilarArtists(mbArtistID: string): Promise<Array<SimilarArtist>> {
		const lastfm = await this.service.lastFMLookup(LastFMLookupType.artist, mbArtistID);
		if (lastfm && lastfm.artist && lastfm.artist.similar && lastfm.artist.similar.artist) {
			return lastfm.artist.similar.artist;
		}
		return [];
	}

	private async findSimilarArtistFolders(similarArtists: Array<SimilarArtist>, page?: PageArgs): Promise<PageResult<Folder>> {
		const names: Array<string> = [];
		similarArtists.forEach(a => {
			if (a.name) {
				names.push(a.name);
			}
		});
		return await this.service.orm.Folder.search({folderType: {$in: [FolderType.artist]}, artist: {$in: names}}, undefined, page);
	}

	private async findSimilarArtists(similarArtists: Array<SimilarArtist>, page?: PageArgs): Promise<PageResult<Artist>> {
		const names: Array<string> = [];
		similarArtists.forEach(a => {
			if (a.name) {
				names.push(a.name);
			}
		});
		return await this.service.orm.Artist.search({name: {$in: names}}, undefined, page);
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

	async byArtist(artist: Artist, page?: PageArgs): Promise<PageResult<Artist>> {
		const similar = await this.byArtistIdName(artist.mbArtistID, artist.name);
		if (similar && similar.length > 0) {
			return this.findSimilarArtists(similar, page);
		}
		return {items: [], ...(page || {}), total: 0};
	}

	async byFolder(folder: Folder, page?: PageArgs): Promise<PageResult<Folder>> {
		const similar = await this.byArtistIdName(folder.mbArtistID, folder.artist);
		if (similar && similar.length > 0) {
			return this.findSimilarArtistFolders(similar, page);
		}
		return {items: [], ...(page || {}), total: 0};
	}

}
