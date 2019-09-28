import {Jam} from '../../model/jam-rest-data';
import {LastFMLookupType, MusicBrainzLookupType, MusicBrainzSearchType} from '../../model/jam-types';
import {logger} from '../../utils/logger';
import {Album} from '../album/album.model';
import {Artist} from '../artist/artist.model';
import {Folder} from '../folder/folder.model';
import {MetaDataFormat} from './metadata.format';
import {MetaDataService} from './metadata.service';

const log = logger('Metadata');

export class MetadataServiceExtendedInfo {
	constructor(private service: MetaDataService) {

	}

	private async getWikiDataExtendedInfo(id: string, lang: string): Promise<Jam.ExtendedInfo | undefined> {
		const wiki = await this.service.wikidataSummary(id, lang);
		if (wiki && wiki.summary) {
			return MetaDataFormat.formatWikipediaExtendedInfo(wiki.summary.url, wiki.summary.summary);
		}
	}

	private async getMusicBrainzIDWikipediaArtistInfo(mbArtistID: string): Promise<Jam.ExtendedInfo | undefined> {
		const result = await this.service.musicbrainzLookup(MusicBrainzLookupType.artist, mbArtistID);
		if (result && result.artist && result.artist.relations) {
			let rel = result.artist.relations.find(r => r.type === 'wikidata');
			if (rel && rel.url && rel.url.resource) {
				const list = rel.url.resource.split('/');
				const id = list[list.length - 1];
				const res = this.getWikiDataExtendedInfo(id, 'en');
				if (res) {
					return res;
				}
			}
			rel = result.artist.relations.find(r => r.type === 'wikipedia');
			if (rel && rel.url && rel.url.resource) {
				const list = rel.url.resource.split('/');
				const title = list[list.length - 1];
				const lang = list[2].split('.')[0];
				const wiki = await this.service.wikipediaSummary(title, lang);
				if (wiki && wiki.summary) {
					return MetaDataFormat.formatWikipediaExtendedInfo(wiki.summary.url, wiki.summary.summary);
				}
			}
		}
	}

	private async getMusicBrainzIDWikipediaAlbumInfo(mbReleaseID: string): Promise<Jam.ExtendedInfo | undefined> {
		const lookup = await this.service.musicbrainzLookup(MusicBrainzLookupType.release, mbReleaseID);
		if (lookup && lookup.release && lookup.release.relations) {
			const rel = lookup.release.relations.find(r => r.type === 'wikidata');
			if (rel && rel.url && rel.url.resource) {
				const list = rel.url.resource.split('/');
				const id = list[list.length - 1];
				return this.getWikiDataExtendedInfo(id, 'en');
			}
		}
	}

	private async getLastFMArtistInfo(mbArtistID: string): Promise<Jam.ExtendedInfo | undefined> {
		const lookup = await this.service.lastFMLookup(LastFMLookupType.artist, mbArtistID);
		if (lookup && lookup.artist && lookup.artist.bio && lookup.artist.bio.content) {
			return MetaDataFormat.formatLastFMExtendedInfo(lookup.artist.url, lookup.artist.bio.content);
		}
	}

	private async getLastFMAlbumInfo(mbReleaseID: string): Promise<Jam.ExtendedInfo | undefined> {
		const lookup = await this.service.lastFMLookup(LastFMLookupType.album, mbReleaseID);
		if (lookup && lookup.album && lookup.album.wiki && lookup.album.wiki.content) {
			return MetaDataFormat.formatLastFMExtendedInfo(lookup.album.url, lookup.album.wiki.content);
		}
	}

	private async getArtistInfoByMusicBrainzID(mbArtistID: string): Promise<Jam.ExtendedInfo | undefined> {
		const info = await this.getMusicBrainzIDWikipediaArtistInfo(mbArtistID);
		if (info) {
			return info;
		}
		return this.getLastFMArtistInfo(mbArtistID);
	}

	private async getAlbumInfoByMusicBrainzID(mbReleaseID: string): Promise<Jam.ExtendedInfo | undefined> {
		const info = await this.getMusicBrainzIDWikipediaAlbumInfo(mbReleaseID);
		if (info) {
			return info;
		}
		return this.getLastFMAlbumInfo(mbReleaseID);
	}

	private async getArtistInfoByName(artistName: string): Promise<Jam.ExtendedInfo | undefined> {
		const res = await this.service.musicbrainzSearch(MusicBrainzSearchType.artist, {artist: artistName});
		let result: Jam.ExtendedInfo | undefined;
		if (res && res.artists && res.artists.length === 1) {
			result = await this.getArtistInfoByMusicBrainzID(res.artists[0].id);
		}
		if (!result) {
			const lastfm = await this.service.lastFMArtistSearch(artistName);
			if (lastfm && lastfm.artist && lastfm.artist.mbid) {
				result = await this.getArtistInfoByMusicBrainzID(lastfm.artist.mbid);
			}
		}
		return result;
	}

	private async getAlbumInfoByName(albumName: string, artistName: string): Promise<Jam.ExtendedInfo | undefined> {
		const res = await this.service.musicbrainzSearch(MusicBrainzSearchType.release, {release: albumName, artist: artistName});
		let result: Jam.ExtendedInfo | undefined;
		if (res && res.releases && res.releases.length > 1) {
			result = await this.getAlbumInfoByMusicBrainzID(res.releases[0].id);
		}
		if (!result) {
			const lastfm = await this.service.lastFMAlbumSearch(albumName, artistName);
			if (lastfm && lastfm.album && lastfm.album.mbid) {
				result = await this.getAlbumInfoByMusicBrainzID(lastfm.album.mbid);
			}
		}
		return result;
	}

	async byArtist(artist: Artist): Promise<Jam.ExtendedInfo | undefined> {
		try {
			let result: Jam.ExtendedInfo | undefined;
			if (artist.mbArtistID) {
				result = await this.getArtistInfoByMusicBrainzID(artist.mbArtistID);
			}
			if (!result && artist.name) {
				result = await this.getArtistInfoByName(artist.name);
			}
			return result;
		} catch (e) {
			log.error(e);
		}
	}

	async byAlbum(album: Album): Promise<Jam.ExtendedInfo | undefined> {
		try {
			if (album.mbAlbumID) {
				const info = await this.getAlbumInfoByMusicBrainzID(album.mbAlbumID);
				if (info) {
					return info;
				}
			}
			if (album.name && album.artist) {
				const info = await this.getAlbumInfoByName(album.name, album.artist);
				if (info) {
					return info;
				}
			}
		} catch (e) {
			log.error(e);
		}
	}

	async byFolderArtist(folder: Folder): Promise<Jam.ExtendedInfo | undefined> {
		try {
			if (folder.tag.mbArtistID) {
				const info = await this.getArtistInfoByMusicBrainzID(folder.tag.mbArtistID);
				if (info) {
					return info;
				}
			}
			if (folder.tag.artist) {
				const info = await this.getArtistInfoByName(folder.tag.artist);
				if (info) {
					return info;
				}
			}
		} catch (e) {
			log.error(e);
		}
	}

	async byFolderAlbum(folder: Folder): Promise<Jam.ExtendedInfo | undefined> {
		try {
			if (folder.tag.mbAlbumID) {
				const info = await this.getAlbumInfoByMusicBrainzID(folder.tag.mbAlbumID);
				if (info) {
					return info;
				}
			}
			if (folder.tag.album && folder.tag.artist) {
				const info = await this.getAlbumInfoByName(folder.tag.album, folder.tag.artist);
				if (info) {
					return info;
				}
			}
		} catch (e) {
			log.error(e);
		}
	}

}
