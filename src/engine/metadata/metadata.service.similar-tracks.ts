import {LastFM} from '../../model/lastfm-rest-data';
import {shuffle} from '../../utils/random';
import {Album} from '../album/album.model';
import {Artist} from '../artist/artist.model';
import {Folder} from '../folder/folder.model';
import {Track} from '../track/track.model';
import {TrackStore} from '../track/track.store';
import {MetaDataService} from './metadata.service';
import SimilarArtist = LastFM.SimilarArtist;

export interface Song {
	name: string;
	artist: string;
	mbid: string;
	url: string;
}

export class MetadataServiceSimilarTracks {
	constructor(private service: MetaDataService, private trackStore: TrackStore) {

	}

	async findSongTracks(songs: Array<Song>): Promise<Array<Track>> {
		const ids: Array<Song> = [];
		const vals: Array<Song> = [];
		const result: Array<Track> = [];
		songs.forEach(sim => {
			if (sim.mbid) {
				ids.push(sim);
			} else {
				vals.push(sim);
			}
		});
		const mbTrackIDs = ids.map(track => track.mbid || '-').filter(id => id !== '-');
		const list = await this.trackStore.search({mbTrackIDs});
		ids.forEach(sim => {
			const t = list.items.find(tr => tr.tag.mbTrackID === sim.mbid);
			if (!t) {
				vals.push(sim);
			} else {
				result.push(t);
			}
		});
		for (const sim of vals) {
			const track = await this.trackStore.searchOne({title: sim.name, artist: sim.artist});
			if (track) {
				result.push(track);
			}
		}
		return result;
	}

	private async getSimilarSongs(similar: Array<SimilarArtist>): Promise<Array<Song>> {
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

	private async getSimilarArtistTracks(similars: Array<SimilarArtist>): Promise<Array<Track>> {
		if (!similars || similars.length === 0) {
			return [];
		}
		const songs = await this.getSimilarSongs(similars);
		return this.findSongTracks(songs);
	}

	async byAlbum(album: Album): Promise<Array<Track>> {
		const similar = await this.service.similarArtists.byArtistIdName(album.mbArtistID, album.artist);
		return this.getSimilarArtistTracks(similar);
	}

	async byArtist(artist: Artist): Promise<Array<Track>> {
		const similar = await this.service.similarArtists.byArtistIdName(artist.mbArtistID, artist.name);
		return this.getSimilarArtistTracks(similar);
	}

	async byFolder(folder: Folder): Promise<Array<Track>> {
		const similar = await this.service.similarArtists.byArtistIdName(folder.tag.mbArtistID, folder.tag.artist);
		return this.getSimilarArtistTracks(similar);
	}

	async byTrack(track: Track): Promise<Array<Track>> {
		if (track.tag.mbTrackID) {
			const data = await this.service.lastFMSimilarTracks(track.tag.mbTrackID);
			if (data && data.similartracks && data.similartracks.track) {
				const songs = data.similartracks.track.map(t => {
					return {
						name: t.name,
						artist: t.artist.name,
						mbid: t.mbid,
						url: t.url
					};
				});
				return this.findSongTracks(songs);
			}
		}
		return [];
	}

}
