import {shuffle} from '../../utils/random';
import {Album} from '../album/album';
import {Artist} from '../artist/artist';
import {Folder} from '../folder/folder';
import {Track} from '../track/track';
import {MetaDataService} from './metadata.service';
import {LastFM} from '../../modules/audio/clients/lastfm-rest-data';
import {PageResult} from '../base/base';
import {PageArgs} from '../base/base.args';

export interface Song {
	name: string;
	artist: string;
	mbid: string;
	url: string;
}

export class MetadataServiceSimilarTracks {
	constructor(private service: MetaDataService) {
	}

	async findSongTrackIDs(songs: Array<Song>): Promise<Array<string>> {
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
		const list = await this.service.orm.Track.find({tag: {mbTrackID: {$in: mbTrackIDs}}});
		ids.forEach(sim => {
			const t = list.find(tr => tr.tag?.mbTrackID === sim.mbid);
			if (!t) {
				vals.push(sim);
			} else {
				result.add(t.id);
			}
		});
		for (const sim of vals) {
			const id = await this.service.orm.Track.findOneID({name: {$eq: sim.name}, artist: {name: {$eq: sim.artist}}});
			if (id) {
				result.add(id);
			}
		}
		return [...result];
	}

	private async getSimilarSongs(similar: Array<LastFM.SimilarArtist>): Promise<Array<Song>> {
		let tracks: Array<Song> = [];
		for (const artist of similar) {
			let data: LastFM.Result | undefined;
			if (artist.mbid) {
				data = await this.service.lastFMTopTracksArtistID(artist.mbid);
			} else if (artist.name) {
				data = await this.service.lastFMTopTracksArtist(artist.name);
			}
			if (data && data.toptracks && data.toptracks.track) {
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

	private async getSimilarArtistTracks(similars: Array<LastFM.SimilarArtist>, page?: PageArgs): Promise<PageResult<Track>> {
		if (!similars || similars.length === 0) {
			return {items: [], ...(page || {}), total: 0};
		}
		const songs = await this.getSimilarSongs(similars);
		const ids = await this.findSongTrackIDs(songs);
		return this.service.orm.Track.search({id: ids}, undefined, page);
	}

	async byArtist(artist: Artist, page?: PageArgs): Promise<PageResult<Track>> {
		const similar = await this.service.similarArtists.byArtistIdName(artist.mbArtistID, artist.name);
		return this.getSimilarArtistTracks(similar, page);
	}

	async byFolder(folder: Folder, page?: PageArgs): Promise<PageResult<Track>> {
		const similar = await this.service.similarArtists.byArtistIdName(folder.mbArtistID, folder.artist);
		return this.getSimilarArtistTracks(similar, page);
	}

	async byAlbum(album: Album, page?: PageArgs): Promise<PageResult<Track>> {
		const similar = await this.service.similarArtists.byArtistIdName(album.mbArtistID, album.artist.name);
		return this.getSimilarArtistTracks(similar, page);
	}

	async byTrack(track: Track, page?: PageArgs): Promise<PageResult<Track>> {
		let data: LastFM.Result | undefined;
		if (track.tag?.mbTrackID) {
			data = await this.service.lastFMSimilarTracks(track.tag.mbTrackID);
		} else if (track.tag?.title && track.tag?.artist) {
			data = await this.service.lastFMSimilarTracksSearch(track.tag.title, track.tag.artist);
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
			ids = await this.findSongTrackIDs(songs);
		}
		return this.service.orm.Track.search({id: ids}, undefined, page);
	}

}
