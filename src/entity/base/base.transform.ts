import { InRequestScope } from 'typescript-ioc';
import { IndexResult, IndexResultGroup } from './base.js';
import { Orm } from '../../modules/engine/services/orm.service.js';
import { State as ORMState } from '../state/state.js';
import { State } from '../state/state.model.js';
import { DBObjectType } from '../../types/enums.js';
import { Tag as ORMTag } from '../tag/tag.js';
import { MediaInfo, MediaTag } from '../tag/tag.model.js';

@InRequestScope
export class BaseTransformService {
	protected async index<T, Y>(result: IndexResult<IndexResultGroup<T>>, mapItem: (item: T) => Promise<Y>): Promise<{
		lastModified: number;
		groups: Array<{ name: string; items: Array<Y> }>;
	}> {
		return {
			lastModified: Date.now(),
			groups: await Promise.all(result.groups.map(async group => {
				return {
					name: group.name,
					items: await Promise.all(group.items.map(async item => {
						return await mapItem(item);
					}))
				};
			}))
		};
	}

	async stateBase(orm: Orm, o: ORMState): Promise<State> {
		return {
			played: o.played,
			lastPlayed: o.lastPlayed ? o.lastPlayed.valueOf() : undefined,
			faved: o.faved ? o.faved.valueOf() : undefined,
			rated: o.rated
		};
	}

	async state(orm: Orm, id: string, type: DBObjectType, userID: string): Promise<State> {
		const state = await orm.State.findOrCreate(id, type, userID);
		return this.stateBase(orm, state);
	}

	async trackMedia(o: ORMTag | undefined, fileSize?: number): Promise<MediaInfo> {
		return {
			bitRate: o?.mediaBitRate,
			format: o?.mediaFormat,
			channels: o?.mediaChannels,
			sampleRate: o?.mediaSampleRate,
			size: fileSize
		};
	}

	async mediaTag(orm: Orm, o?: ORMTag): Promise<MediaTag> {
		if (!o) {
			return {};
		}
		return {
			title: o.title,
			album: o.album,
			artist: o.artist,
			genres: o.genres,
			year: o.year,
			trackNr: o.trackNr,
			disc: o.disc,
			discTotal: o.discTotal,
			mbTrackID: o.mbTrackID,
			mbRecordingID: o.mbRecordingID,
			mbReleaseTrackID: o.mbReleaseTrackID,
			mbReleaseGroupID: o.mbReleaseGroupID,
			mbReleaseID: o.mbReleaseID,
			mbArtistID: o.mbArtistID,
			mbAlbumArtistID: o.mbAlbumArtistID
		};
	}
}
