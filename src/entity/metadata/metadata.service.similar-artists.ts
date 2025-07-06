import { MetaDataService } from './metadata.service.js';
import { Folder } from '../folder/folder.js';
import { LastFM } from '../../modules/audio/clients/lastfm-rest-data.js';
import { FolderType, LastFMLookupType } from '../../types/enums.js';
import { Artist } from '../artist/artist.js';
import { PageResult } from '../base/base.js';
import { PageArgs } from '../base/base.args.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import SimilarArtist = LastFM.SimilarArtist;

export class MetadataServiceSimilarArtists {
	constructor(private readonly service: MetaDataService) {

	}

	private async getLastFMSimilarArtists(orm: Orm, mbArtistID: string): Promise<Array<SimilarArtist>> {
		const lastfm = await this.service.lastFMLookup(orm, LastFMLookupType.artist, mbArtistID);
		if (lastfm?.artist?.similar?.artist) {
			return lastfm.artist.similar.artist;
		}
		return [];
	}

	private async findSimilarArtistFolders(orm: Orm, similarArtists: Array<SimilarArtist>, page?: PageArgs): Promise<PageResult<Folder>> {
		const names: Array<string> = [];
		similarArtists.forEach(a => {
			if (a.name) {
				names.push(a.name);
			}
		});
		return await orm.Folder.search({ where: { folderType: FolderType.artist, artist: names }, limit: page?.take, offset: page?.skip });
	}

	private async findSimilarArtists(orm: Orm, similarArtists: Array<SimilarArtist>, page?: PageArgs): Promise<PageResult<Artist>> {
		const names: Array<string> = [];
		similarArtists.forEach(a => {
			if (a.name) {
				names.push(a.name);
			}
		});
		return await orm.Artist.search({ where: { name: names }, limit: page?.take, offset: page?.skip });
	}

	async byArtistIdName(orm: Orm, mbArtistID?: string, artist?: string): Promise<Array<SimilarArtist>> {
		let similar: Array<SimilarArtist> = [];
		if (mbArtistID) {
			similar = await this.getLastFMSimilarArtists(orm, mbArtistID);
		} else if (artist) {
			const a = await this.service.lastFMArtistSearch(orm, artist);
			if (a?.artist) {
				similar = await this.getLastFMSimilarArtists(orm, a.artist.mbid);
			}
		}
		return similar;
	}

	async byArtist(orm: Orm, artist: Artist, page?: PageArgs): Promise<PageResult<Artist>> {
		const similar = await this.byArtistIdName(orm, artist.mbArtistID, artist.name);
		if (similar && similar.length > 0) {
			return this.findSimilarArtists(orm, similar, page);
		}
		return { items: [], ...(page || {}), total: 0 };
	}

	async byFolder(orm: Orm, folder: Folder, page?: PageArgs): Promise<PageResult<Folder>> {
		const similar = await this.byArtistIdName(orm, folder.mbArtistID, folder.artist);
		if (similar && similar.length > 0) {
			return this.findSimilarArtistFolders(orm, similar, page);
		}
		return { items: [], ...(page || {}), total: 0 };
	}
}
