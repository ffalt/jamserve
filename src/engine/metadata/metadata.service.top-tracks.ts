import {Track} from '../track/track.model';
import {MetaDataService} from './metadata.service';
import {Song} from './metadata.service.similar-tracks';

export class MetadataServiceTopTracks {
	constructor(private service: MetaDataService) {

	}

	async byArtistName(artist: string): Promise<Array<Track>> {
		const result = await this.service.lastFMTopTracksArtist(artist);
		if (result && result.toptracks && result.toptracks.track) {
			const songs: Array<Song> = result.toptracks.track.map(t => {
				return {
					name: t.name,
					artist: t.artist.name,
					mbid: t.mbid,
					url: t.url
				};
			});
			return this.service.similarTracks.findSongTracks(songs);
		}
		return [];
	}

}
