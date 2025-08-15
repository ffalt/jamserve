import { Track, TrackHealth, TrackLyrics, TrackPage } from './track.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesTrackParameters, MediaHealthParameters, RawTagUpdateParameters, TrackFilterParameters, TrackFixParameters, TrackMoveParameters, TrackOrderParameters, TrackRenameParameters } from './track.parameters.js';
import { MediaIDTagRaw } from '../tag/tag.model.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';

@Controller('/track', { tags: ['Track'], roles: [UserRole.stream] })
export class TrackController {
	@Get(
		'/id',
		() => Track,
		{ description: 'Get a Track by Id', summary: 'Get Track' }
	)
	async id(
		@QueryParameter('id', { description: 'Track Id', isID: true }) id: string,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Track> {
		return engine.transform.track(
			orm, await orm.Track.oneOrFailByID(id),
			trackParameters, user
		);
	}

	@Get(
		'/search',
		() => TrackPage,
		{ description: 'Search Tracks' }
	)
	async search(
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() filter: TrackFilterParameters,
		@QueryParameters() order: TrackOrderParameters,
		@QueryParameters() list: ListParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<TrackPage> {
		if (list.list) {
			return await orm.Track.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.track(orm, o, trackParameters, user)
			);
		}
		return await orm.Track.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.track(orm, o, trackParameters, user)
		);
	}

	@Get(
		'/similar',
		() => TrackPage,
		{ description: 'Get similar Tracks by Track Id (External Service)', summary: 'Get similar Tracks' }
	)
	async similar(
		@QueryParameter('id', { description: 'Track Id', isID: true }) id: string,
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const track = await orm.Track.oneOrFailByID(id);
		const result = await engine.metadata.similarTracks.byTrack(orm, track, page);
		return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackParameters, user) };
	}

	@Get(
		'/lyrics',
		() => TrackLyrics,
		{ description: 'Get Lyrics for a Track by Id (External Service or Media File)', summary: 'Get Lyrics' }
	)
	async lyrics(
		@QueryParameter('id', { description: 'Track Id', isID: true }) id: string,
		@RestContext() { orm, engine }: Context
	): Promise<TrackLyrics> {
		const track = await orm.Track.oneOrFailByID(id);
		return await engine.metadata.lyricsByTrack(orm, track);
	}

	@Get(
		'/rawTag/get',
		() => [MediaIDTagRaw],
		{ description: 'Get Raw Tag (eg. id3/vorbis)', summary: 'Get Raw Tag' }
	)
	async rawTagGet(
		@QueryParameters() filter: TrackFilterParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Array<MediaIDTagRaw>> {
		const tracks = await orm.Track.findFilter(filter, [], {}, user);
		const result: Array<MediaIDTagRaw> = [];
		for (const track of tracks) {
			const raw = (await engine.track.getRawTag(track)) ?? {};
			result.push({ id: track.id, ...raw });
		}
		return result;
	}

	@Get(
		'/health',
		() => [TrackHealth],
		{ description: 'List of Tracks with Health Issues', roles: [UserRole.admin], summary: 'Get Health' }
	)
	async health(
		@QueryParameters() healthParameters: MediaHealthParameters,
		@QueryParameters() filter: TrackFilterParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Array<TrackHealth>> {
		const tracks = await orm.Track.findFilter(filter, [], {}, user);
		const list = await engine.track.health(tracks, healthParameters.healthMedia);
		const result: Array<TrackHealth> = [];
		for (const item of list) {
			result.push({
				track: await engine.transform.Track.trackBase(orm, item.track, trackParameters, user),
				health: item.health
			});
		}
		return result;
	}

	@Post(
		'/rename',
		() => AdminChangeQueueInfo,
		{ description: 'Rename a track', roles: [UserRole.admin], summary: 'Rename Track' }
	)
	async rename(
		@BodyParameters() parameters: TrackRenameParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const track = await orm.Track.oneOrFailByID(parameters.id);
		return await engine.io.track.rename(parameters.id, parameters.name, track.root.idOrFail());
	}

	@Post(
		'/move',
		() => AdminChangeQueueInfo,
		{ description: 'Move Tracks', roles: [UserRole.admin] }
	)
	async move(
		@BodyParameters() parameters: TrackMoveParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(parameters.folderID);
		return await engine.io.track.move(parameters.ids, parameters.folderID, folder.root.idOrFail());
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{ description: 'Remove a Track', roles: [UserRole.admin], summary: 'Remove Track' }
	)
	async remove(
		@BodyParameter('id') id: string,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const track = await orm.Track.oneOrFailByID(id);
		return await engine.io.track.remove(id, track.root.idOrFail());
	}

	@Post(
		'/fix',
		() => AdminChangeQueueInfo,
		{ description: 'Fix Track by Health Hint Id', roles: [UserRole.admin], summary: 'Fix Track' }
	)
	async fix(
		@BodyParameters() parameters: TrackFixParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const track = await orm.Track.oneOrFailByID(parameters.id);
		return await engine.io.track.fix(parameters.id, parameters.fixID, track.root.idOrFail());
	}

	@Post(
		'/rawTag/set',
		() => AdminChangeQueueInfo,
		{ description: 'Write a Raw Rag to a Track by Track Id', roles: [UserRole.admin], summary: 'Set Raw Tag' }
	)
	async rawTagSet(
		@BodyParameters() parameters: RawTagUpdateParameters,
		@RestContext() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const track = await orm.Track.oneOrFailByID(parameters.id);
		return await engine.io.track.writeTags(parameters.id, parameters.tag, track.root.idOrFail());
	}
}
