import {Inject, InRequestScope} from 'typescript-ioc';
import {Orm} from '../../modules/engine/services/orm.service.js';
import {User} from '../user/user.js';
import {DBObjectType, JamObjectType} from '../../types/enums.js';
import {BaseTransformService} from '../base/base.transform.js';
import {Track as ORMTrack} from './track.js';
import {IncludesTrackArgs} from './track.args.js';
import {TrackBase} from './track.model.js';
import {TrackService} from './track.service.js';
import {GenreTransformService} from '../genre/genre.transform.js';

@InRequestScope
export class TrackTransformService extends BaseTransformService {
	@Inject
	public trackService!: TrackService;
	@Inject
	public Genre!: GenreTransformService;

	async trackBases(orm: Orm, list: Array<ORMTrack>, trackArgs: IncludesTrackArgs, user: User): Promise<Array<TrackBase>> {
		return await Promise.all(list.map(t => this.trackBase(orm, t, trackArgs, user)));
	}

	async trackBase(orm: Orm, o: ORMTrack, trackArgs: IncludesTrackArgs, user: User): Promise<TrackBase> {
		const tag = await o.tag.get();
		return {
			id: o.id,
			name: o.fileName || o.name,
			objType: JamObjectType.track,
			created: o.createdAt.valueOf(),
			duration: tag?.mediaDuration ?? 0,
			parentID: o.folder.idOrFail(),
			artistID: o.artist.id(),
			albumArtistID: o.albumArtist.id(),
			albumID: o.album.id(),
			seriesID: o.series.id(),
			genres: trackArgs.trackIncGenres ? await this.Genre.genreBases(orm, await o.genres.getItems(), {}, user) : undefined,
			tag: trackArgs.trackIncTag ? await this.mediaTag(orm, tag) : undefined,
			media: trackArgs.trackIncMedia ? await this.trackMedia(tag, o.fileSize) : undefined,
			tagRaw: trackArgs.trackIncRawTag ? await this.trackService.getRawTag(o) : undefined,
			state: trackArgs.trackIncState ? await this.state(orm, o.id, DBObjectType.track, user.id) : undefined
		};
	}

}
