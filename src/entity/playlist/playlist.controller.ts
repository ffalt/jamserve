import {Playlist, PlaylistIndex, PlaylistPage} from './playlist.model';
import {User} from '../user/user';
import {BodyParam, BodyParams, Controller, CurrentUser, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {PlaylistEntryPage} from '../playlistentry/playlist-entry.model';
import {IncludesTrackArgs} from '../track/track.args';
import {IncludesPlaylistArgs, PlaylistFilterArgs, PlaylistMutateArgs, PlaylistOrderArgs} from './playlist.args';
import {IncludesEpisodeArgs} from '../episode/episode.args';
import {ListArgs, PageArgs} from '../base/base.args';
import {Inject} from 'typescript-ioc';
import {PlaylistService} from './playlist.service';
import {PlaylistEntryOrderArgs} from '../playlistentry/playlist-entry.args';

@Controller('/playlist', {tags: ['Playlist'], roles: [UserRole.stream]})
export class PlaylistController extends BaseController {
	@Inject
	playlistService!: PlaylistService;

	@Get('/id',
		() => Playlist,
		{description: 'Get a Playlist by Id', summary: 'Get Playlist'}
	)
	async id(
		@QueryParam('id', {description: 'Playlist Id', isID: true}) id: string,
		@QueryParams() playlistArgs: IncludesPlaylistArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@CurrentUser() user: User
	): Promise<Playlist> {
		return this.transform.playlist(
			await this.orm.Playlist.oneOrFailFilter({ids: [id]}, user),
			playlistArgs, trackArgs, episodeArgs, user
		);
	}

	@Get(
		'/index',
		() => PlaylistIndex,
		{description: 'Get the Navigation Index for Playlists', summary: 'Get Index'}
	)
	async index(@QueryParams() filter: PlaylistFilterArgs, @CurrentUser() user: User): Promise<PlaylistIndex> {
		const result = await this.orm.Playlist.indexFilter(filter, user);
		return this.transform.playlistIndex(result);
	}

	@Get(
		'/search',
		() => PlaylistPage,
		{description: 'Search Playlists'}
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() playlistArgs: IncludesPlaylistArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@QueryParams() filter: PlaylistFilterArgs,
		@QueryParams() order: PlaylistOrderArgs,
		@QueryParams() list: ListArgs,
		@CurrentUser() user: User
	): Promise<PlaylistPage> {
		if (list.list) {
			return await this.orm.Playlist.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.playlist(o, playlistArgs, trackArgs, episodeArgs, user)
			)
		}
		return await this.orm.Playlist.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.playlist(o, playlistArgs, trackArgs, episodeArgs, user)
		);
	}

	@Get(
		'/entries',
		() => PlaylistEntryPage,
		{description: 'Get Media Entries [Track/Episode] of Playlists', summary: 'Get Entries'}
	)
	async entries(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@QueryParams() filter: PlaylistFilterArgs,
		@QueryParams() order: PlaylistEntryOrderArgs,
		@CurrentUser() user: User
	): Promise<PlaylistEntryPage> {
		const playlistIDs = await this.orm.Playlist.findIDsFilter(filter, user);
		return await this.orm.PlaylistEntry.searchTransformFilter(
			{playlistIDs}, [order], page, user,
			o => this.transform.playlistEntry(o, trackArgs, episodeArgs, user)
		);
	}

	@Post(
		'/create',
		() => Playlist,
		{description: 'Create a Playlist', summary: 'Create Playlist'}
	)
	async create(
		@BodyParams() args: PlaylistMutateArgs,
		@CurrentUser() user: User
	): Promise<Playlist> {
		const playlist = await this.playlistService.create(args, user);
		return this.transform.playlist(playlist, {}, {}, {}, user);
	}

	@Post(
		'/update',
		() => Playlist,
		{description: 'Update a Playlist', summary: 'Update Playlist'}
	)
	async update(
		@BodyParam('id', {description: 'Playlist Id', isID: true}) id: string,
		@BodyParams() args: PlaylistMutateArgs,
		@CurrentUser() user: User
	): Promise<Playlist> {
		const playlist = await this.orm.Playlist.oneOrFail({id, user: user.id});
		await this.playlistService.update(args, playlist);
		return this.transform.playlist(playlist, {}, {}, {}, user);
	}

	@Post(
		'/remove',
		{description: 'Remove a Playlist', summary: 'Remove Playlist'}
	)
	async remove(
		@BodyParam('id', {description: 'Playlist Id', isID: true}) id: string,
		@CurrentUser() user: User
	): Promise<void> {
		const playlist = await this.orm.Playlist.oneOrFail({id, user: user.id});
		await this.playlistService.remove(playlist);
	}

}
