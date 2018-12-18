import {IApiBinaryResult} from '../../typings';
import {PreTranscoder, Transcoder} from '../audio/transcoder';
import {fileSuffix} from '../../utils/fs-utils';
import {DBObjectType} from '../../types';
import path from 'path';
import {GenericError} from '../../api/jam/error';
import {NowPlayingService} from '../nowplaying/nowplaying.service';
import {User} from '../../objects/user/user.model';
import {Track, TrackMedia} from '../../objects/track/track.model';
import {Episode} from '../../objects/episode/episode.model';
import {DBObject} from '../../objects/base/base.model';

export class StreamService {

	constructor(private nowPlayingService: NowPlayingService) {

	}

	async getObjStream(o: DBObject, format: string | undefined, maxBitRate: number | undefined, user: User): Promise<IApiBinaryResult> {

		async function stream(filename: string, media: TrackMedia): Promise<IApiBinaryResult> {
			let f = format || 'mp3';
			if (f[0] === '.') {
				f = f.slice(1);
			}
			const bitRate = maxBitRate || 0;
			if (f !== 'raw' && Transcoder.needsTranscoding(media.format || fileSuffix(filename), f, bitRate)) {
				if (!Transcoder.validTranscoding(media, f)) {
					return Promise.reject(Error('Unsupported transcoding format'));
				}
				return {pipe: new PreTranscoder(filename, f, bitRate)};
				// return {pipe: new Transcoder(filename, f, bitRate, media.duration)};
			} else {
				return {file: {filename, name: o.id + '.' + f}};
			}
		}

		switch (o.type) {
			case DBObjectType.track:
				const track: Track = <Track>o;
				this.nowPlayingService.reportTrack(track, user); // do not wait
				return stream(path.join(track.path, track.name), track.media);
			case DBObjectType.episode:
				const episode: Episode = <Episode>o;
				if (episode.path && episode.media) {
					this.nowPlayingService.reportEpisode(episode, user); // do not wait
					return stream(episode.path, episode.media);
				} else {
					return Promise.reject(GenericError('Podcast episode not ready'));
				}
		}
		return Promise.reject(Error('Invalid Object Type for Streaming'));
	}

}
