import {Track, TrackHealth, TrackLyrics, TrackPage} from './track.model';
import {User} from '../user/user';
import {BodyParam, BodyParams, Controller, CurrentUser, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {IncludesTrackArgs, MediaHealthArgs, RawTagUpdateArgs, TrackFilterArgs, TrackFixArgs, TrackMoveArgs, TrackOrderArgs, TrackRenameArgs} from './track.args';
import {Inject} from 'typescript-ioc';
import {TrackService} from './track.service';
import {MediaIDTagRaw} from '../tag/tag.model';
import {ListArgs, PageArgs} from '../base/base.args';
import {AdminChangeQueueInfo} from '../admin/admin';
import {IoService} from '../../modules/engine/services/io.service';

@Controller('/track', {tags: ['Track'], roles: [UserRole.stream]})
export class TrackController extends BaseController {
	@Inject
	private trackService!: TrackService;
	@Inject
	private ioService!: IoService;

	@Get(
		'/id',
		() => Track,
		{description: 'Get a Track by Id', summary: 'Get Track'}
	)
	async id(
		@QueryParam('id', {description: 'Track Id', isID: true}) id: string,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@CurrentUser() user: User
	): Promise<Track> {
		return this.transform.track(
			await this.orm.Track.oneOrFail(id),
			trackArgs, user
		);
	}

	@Get(
		'/search',
		() => TrackPage,
		{description: 'Search Tracks'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() filter: TrackFilterArgs,
		@QueryParams() order: TrackOrderArgs,
		@QueryParams() list: ListArgs,
		@CurrentUser() user: User
	): Promise<TrackPage> {
		if (list.list) {
			return await this.orm.Track.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.track(o, trackArgs, user)
			);
		}
		return await this.orm.Track.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.track(o, trackArgs, user)
		);
	}

	@Get(
		'/similar',
		() => TrackPage,
		{description: 'Get similar Tracks by Track Id (External Service)', summary: 'Get similar Tracks'}
	)
	async similar(
		@QueryParam('id', {description: 'Track Id', isID: true}) id: string,
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@CurrentUser() user: User
	): Promise<TrackPage> {
		const track = await this.orm.Track.oneOrFail(id);
		const result = await this.metadata.similarTracks.byTrack(track, page);
		return {...result, items: await Promise.all(result.items.map(o => this.transform.trackBase(o, trackArgs, user)))};
	}

	@Get(
		'/lyrics',
		() => TrackLyrics,
		{description: 'Get Lyrics for a Track by Id (External Service or Media File)', summary: 'Get Lyrics'}
	)
	async lyrics(@QueryParam('id', {description: 'Track Id', isID: true}) id: string): Promise<TrackLyrics> {
		const track = await this.orm.Track.oneOrFail(id);
		return this.metadata.lyricsByTrack(track);
	}

	@Get(
		'/rawTag/get',
		() => [MediaIDTagRaw],
		{description: 'Get Raw Tag (eg. id3/vorbis)', summary: 'Get Raw Tag'}
	)
	async rawTagGet(
		@QueryParams() filter: TrackFilterArgs,
		@CurrentUser() user: User
	): Promise<Array<MediaIDTagRaw>> {
		const tracks = await this.orm.Track.findFilter(filter, undefined, user);
		const result: Array<MediaIDTagRaw> = [];
		for (const track of tracks) {
			const raw = await this.trackService.getRawTag(track) || {};
			result.push({id: track.id, ...raw})
		}
		return result;
	}

	@Get(
		'/health',
		() => [TrackHealth],
		{description: 'List of Tracks with Health Issues', roles: [UserRole.admin], summary: 'Get Health'}
	)
	async health(
		@QueryParams() mediaHealthArgs: MediaHealthArgs,
		@QueryParams() filter: TrackFilterArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@CurrentUser() user: User
	): Promise<Array<TrackHealth>> {
		const tracks = await this.orm.Track.findFilter(filter, undefined, user)
		const list = await this.trackService.health(tracks, mediaHealthArgs.healthMedia);
		const result: Array<TrackHealth> = [];
		for (const item of list) {
			result.push({
				track: await this.transform.trackBase(item.track, trackArgs, user),
				health: item.health
			});
		}
		return result;
	}

	@Post(
		'/rename',
		() => AdminChangeQueueInfo,
		{description: 'Rename a track', roles: [UserRole.admin], summary: 'Rename Track'}
	)
	async rename(@BodyParams() args: TrackRenameArgs): Promise<AdminChangeQueueInfo> {
		const track = await this.orm.Track.oneOrFail(args.id);
		return await this.ioService.renameTrack(args.id, args.name, track.root.id);
	}

	@Post(
		'/move',
		() => AdminChangeQueueInfo,
		{description: 'Move Tracks', roles: [UserRole.admin]}
	)
	async move(@BodyParams() args: TrackMoveArgs): Promise<AdminChangeQueueInfo> {
		const folder = await this.orm.Folder.oneOrFail(args.folderID);
		return await this.ioService.moveTracks(args.ids, args.folderID, folder.root.id);
	}

	@Post(
		'/remove',
		() => AdminChangeQueueInfo,
		{description: 'Remove a Track', roles: [UserRole.admin], summary: 'Remove Track'}
	)
	async remove(@BodyParam('id') id: string): Promise<AdminChangeQueueInfo> {
		const track = await this.orm.Track.oneOrFail(id);
		return await this.ioService.removeTrack(id, track.root.id);
	}

	@Post(
		'/fix',
		() => AdminChangeQueueInfo,
		{description: 'Fix Track by Health Hint Id', roles: [UserRole.admin], summary: 'Fix Track'}
	)
	async fix(@BodyParams() args: TrackFixArgs): Promise<AdminChangeQueueInfo> {
		const track = await this.orm.Track.oneOrFail(args.id);
		return await this.ioService.fixTrack(args.id, args.fixID, track.root.id);
	}

	@Post(
		'/rawTag/set',
		() => AdminChangeQueueInfo,
		{description: 'Write a Raw Rag to a Track by Track Id', roles: [UserRole.admin], summary: 'Set Raw Tag'}
	)
	async rawTagSet(@BodyParams() args: RawTagUpdateArgs): Promise<AdminChangeQueueInfo> {
		const track = await this.orm.Track.oneOrFail(args.id);
		return await this.ioService.writeRawTag(args.id, args.tag, track.root.id);
	}
}
