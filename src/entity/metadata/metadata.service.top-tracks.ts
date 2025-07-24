import { Track } from '../track/track.js';
import { MetaDataService } from './metadata.service.js';
import { Song } from './metadata.service.similar-tracks.js';
import { PageResult } from '../base/base.js';
import { PageArgs } from '../base/base.args.js';
import { Orm } from '../../modules/engine/services/orm.service.js';

export class MetadataServiceTopTracks {
	constructor(private readonly service: MetaDataService) {
	}

	async byArtistName(orm: Orm, artist: string, page?: PageArgs): Promise<PageResult<Track>> {
		const result = await this.service.lastFMTopTracksArtist(orm, artist);
		if (result?.toptracks?.track) {
			const songs: Array<Song> = result.toptracks.track.map(t => {
				return {
					name: t.name,
					artist: t.artist.name,
					mbid: t.mbid,
					url: t.url
				};
			});
			const ids = await this.service.similarTracks.findSongTrackIDs(orm, songs);
			return orm.Track.search({ where: { id: ids }, limit: page?.take, offset: page?.skip });
		}
		return { items: [], ...page, total: 0 };
	}
}
