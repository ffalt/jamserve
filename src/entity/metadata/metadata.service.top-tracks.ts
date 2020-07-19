import {Track} from '../track/track';
import {MetaDataService} from './metadata.service';
import {Song} from './metadata.service.similar-tracks';
import {PageResult} from '../base/base';
import {PageArgs} from '../base/base.args';

export class MetadataServiceTopTracks {
	constructor(private service: MetaDataService) {

	}

	async byArtistName(artist: string, page?: PageArgs): Promise<PageResult<Track>> {
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
			const ids = await this.service.similarTracks.findSongTrackIDs(songs);
			return this.service.orm.Track.search(ids, undefined, page);
		}
		return {items: [], ...(page||{}), total: 0};
	}

}
