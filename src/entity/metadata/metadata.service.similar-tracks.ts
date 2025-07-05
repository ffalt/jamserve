import { shuffle } from '../../utils/random.js';
import { Album } from '../album/album.js';
import { Artist } from '../artist/artist.js';
import { Folder } from '../folder/folder.js';
import { Track } from '../track/track.js';
import { MetaDataService } from './metadata.service.js';
import { LastFM } from '../../modules/audio/clients/lastfm-rest-data.js';
import { PageResult } from '../base/base.js';
import { PageArgs } from '../base/base.args.js';
import { Orm } from '../../modules/engine/services/orm.service.js';

export interface Song {
	name: string;
	artist: string;
	mbid: string;
	url: string;
}

export class MetadataServiceSimilarTracks {
	constructor(private readonly service: MetaDataService) {
	}

	async findSongTrackIDs(orm: Orm, songs: Array<Song>): Promise<Array<string>> {
		const ids: Array<Song> = [];
		const vals: Array<Song> = [];
		songs.forEach(sim => {
			if (sim.mbid) {
				ids.push(sim);
			} else {
				vals.push(sim);
			}
		});
		const result = new Set<string>();
		const mbTrackIDs = ids.map(track => track.mbid || '-').filter(id => id !== '-');
		const list = await orm.Track.find({ where: { tag: { mbTrackID: mbTrackIDs } } });
		for (const sim of ids) {
			const t = list.find(async tr => (await tr.tag.get())?.mbTrackID === sim.mbid);
			if (!t) {
				vals.push(sim);
			} else {
				result.add(t.id);
			}
		}
		for (const sim of vals) {
			const id = await orm.Track.findOneID({ where: { name: sim.name, artist: { name: sim.artist } } });
			if (id) {
				result.add(id);
			}
		}
		return [...result];
	}

	private async getSimilarSongs(orm: Orm, similar: Array<LastFM.SimilarArtist>): Promise<Array<Song>> {
		let tracks: Array<Song> = [];
		for (const artist of similar) {
			let data: LastFM.Result | undefined;
			if (artist.mbid) {
				data = await this.service.lastFMTopTracksArtistID(orm, artist.mbid);
			} else if (artist.name) {
				data = await this.service.lastFMTopTracksArtist(orm, artist.name);
			}
			if (data?.toptracks?.track) {
				tracks = tracks.concat(data.toptracks.track.map(song => {
					return {
						name: song.name,
						artist: song.artist.name,
						mbid: song.mbid,
						url: song.url
					};
				}));
			}
		}
		return shuffle(tracks);
	}

	private async getSimilarArtistTracks(orm: Orm, similars: Array<LastFM.SimilarArtist>, page?: PageArgs): Promise<PageResult<Track>> {
		if (!similars || similars.length === 0) {
			return { items: [], ...(page || {}), total: 0 };
		}
		const songs = await this.getSimilarSongs(orm, similars);
		const ids = await this.findSongTrackIDs(orm, songs);
		return orm.Track.search({ where: { id: ids }, limit: page?.take, offset: page?.skip });
	}

	async byArtist(orm: Orm, artist: Artist, page?: PageArgs): Promise<PageResult<Track>> {
		const similar = await this.service.similarArtists.byArtistIdName(orm, artist.mbArtistID, artist.name);
		return this.getSimilarArtistTracks(orm, similar, page);
	}

	async byFolder(orm: Orm, folder: Folder, page?: PageArgs): Promise<PageResult<Track>> {
		const similar = await this.service.similarArtists.byArtistIdName(orm, folder.mbArtistID, folder.artist);
		return this.getSimilarArtistTracks(orm, similar, page);
	}

	async byAlbum(orm: Orm, album: Album, page?: PageArgs): Promise<PageResult<Track>> {
		const artist = await album.artist.get();
		const similar = await this.service.similarArtists.byArtistIdName(orm, album.mbArtistID, artist?.name);
		return this.getSimilarArtistTracks(orm, similar, page);
	}

	async byTrack(orm: Orm, track: Track, page?: PageArgs): Promise<PageResult<Track>> {
		let data: LastFM.Result | undefined;
		const tag = await track.tag.get();
		if (tag?.mbTrackID) {
			data = await this.service.lastFMSimilarTracks(orm, tag.mbTrackID);
		} else if (tag?.title && tag?.artist) {
			data = await this.service.lastFMSimilarTracksSearch(orm, tag.title, tag.artist);
		}
		let ids: Array<string> = [];
		if (data && data.similartracks && data.similartracks.track) {
			const songs = data.similartracks.track.map(t => {
				return {
					name: t.name,
					artist: t.artist.name,
					mbid: t.mbid,
					url: t.url
				};
			});
			ids = await this.findSongTrackIDs(orm, songs);
		}
		return orm.Track.search({ where: { id: ids }, limit: page?.take, offset: page?.skip });
	}
}
