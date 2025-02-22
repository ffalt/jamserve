import { Track, TrackHealth, TrackLyrics, TrackPage } from './track.model.js';
import { UserRole } from '../../types/enums.js';
import { IncludesTrackArgs, MediaHealthArgs, RawTagUpdateArgs, TrackFilterArgs, TrackFixArgs, TrackMoveArgs, TrackOrderArgs, TrackRenameArgs } from './track.args.js';
import { MediaIDTagRaw } from '../tag/tag.model.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { AdminChangeQueueInfo } from '../admin/admin.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { Post } from '../../modules/rest/decorators/Post.js';
import { BodyParams } from '../../modules/rest/decorators/BodyParams.js';
import { BodyParam } from '../../modules/rest/decorators/BodyParam.js';

@Controller('/track', { tags: ['Track'], roles: [UserRole.stream] })
export class TrackController {
	@Get(
		'/id',
		() => Track,
		{ description: 'Get a Track by Id', summary: 'Get Track' }
	)
	async id(
		@QueryParam('id', { description: 'Track Id', isID: true }) id: string,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Track> {
		return engine.transform.track(
			orm, await orm.Track.oneOrFailByID(id),
			trackArgs, user
		);
	}

	@Get(
		'/search',
		() => TrackPage,
		{ description: 'Search Tracks' }
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() filter: TrackFilterArgs,
		@QueryParams() order: TrackOrderArgs,
		@QueryParams() list: ListArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<TrackPage> {
		if (list.list) {
			return await orm.Track.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.track(orm, o, trackArgs, user)
			);
		}
		return await orm.Track.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.track(orm, o, trackArgs, user)
		);
	}

	@Get(
		'/similar',
		() => TrackPage,
		{ description: 'Get similar Tracks by Track Id (External Service)', summary: 'Get similar Tracks' }
	)
	async similar(
		@QueryParam('id', { description: 'Track Id', isID: true }) id: string,
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<TrackPage> {
		const track = await orm.Track.oneOrFailByID(id);
		const result = await engine.metadata.similarTracks.byTrack(orm, track, page);
		return { ...result, items: await engine.transform.Track.trackBases(orm, result.items, trackArgs, user) };
	}

	@Get(
		'/lyrics',
		() => TrackLyrics,
		{ description: 'Get Lyrics for a Track by Id (External Service or Media File)', summary: 'Get Lyrics' }
	)
	async lyrics(
		@QueryParam('id', { description: 'Track Id', isID: true }) id: string,
		@Ctx() { orm, engine }: Context
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
		@QueryParams() filter: TrackFilterArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Array<MediaIDTagRaw>> {
		const tracks = await orm.Track.findFilter(filter, [], {}, user);
		const result: Array<MediaIDTagRaw> = [];
		for (const track of tracks) {
			const raw = await engine.track.getRawTag(track) || {};
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
		@QueryParams() mediaHealthArgs: MediaHealthArgs,
		@QueryParams() filter: TrackFilterArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Array<TrackHealth>> {
		const tracks = await orm.Track.findFilter(filter, [], {}, user);
		const list = await engine.track.health(tracks, mediaHealthArgs.healthMedia);
		const result: Array<TrackHealth> = [];
		for (const item of list) {
			result.push({
				track: await engine.transform.Track.trackBase(orm, item.track, trackArgs, user),
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
		@BodyParams() args: TrackRenameArgs,
		@Ctx() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const track = await orm.Track.oneOrFailByID(args.id);
		return await engine.io.track.rename(args.id, args.name, track.root.idOrFail());
	}

	@Post(
		'/move',
		() => AdminChangeQueueInfo,
		{ description: 'Move Tracks', roles: [UserRole.admin] }
	)
	async move(
		@BodyParams() args: TrackMoveArgs,
		@Ctx() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const folder = await orm.Folder.oneOrFailByID(args.folderID);
		return await engine.io.track.move(args.ids, args.folderID, folder.root.idOrFail());
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{ description: 'Remove a Track', roles: [UserRole.admin], summary: 'Remove Track' }
	)
	async remove(
		@BodyParam('id') id: string,
		@Ctx() { orm, engine }: Context
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
		@BodyParams() args: TrackFixArgs,
		@Ctx() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const track = await orm.Track.oneOrFailByID(args.id);
		return await engine.io.track.fix(args.id, args.fixID, track.root.idOrFail());
	}

	@Post(
		'/rawTag/set',
		() => AdminChangeQueueInfo,
		{ description: 'Write a Raw Rag to a Track by Track Id', roles: [UserRole.admin], summary: 'Set Raw Tag' }
	)
	async rawTagSet(
		@BodyParams() args: RawTagUpdateArgs,
		@Ctx() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		const track = await orm.Track.oneOrFailByID(args.id);
		return await engine.io.track.writeTags(args.id, args.tag, track.root.idOrFail());
	}
}
