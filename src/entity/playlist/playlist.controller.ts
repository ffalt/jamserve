import {Playlist, PlaylistIndex, PlaylistPage} from './playlist.model';
import {BodyParam, BodyParams, Controller, Ctx, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {BaseController} from '../base/base.controller';
import {PlaylistEntryPage} from '../playlistentry/playlist-entry.model';
import {IncludesTrackArgs} from '../track/track.args';
import {IncludesPlaylistArgs, PlaylistFilterArgs, PlaylistMutateArgs, PlaylistOrderArgs} from './playlist.args';
import {IncludesEpisodeArgs} from '../episode/episode.args';
import {ListArgs, PageArgs} from '../base/base.args';
import {InRequestScope, Inject} from 'typescript-ioc';
import {PlaylistService} from './playlist.service';
import {PlaylistEntryOrderArgs} from '../playlistentry/playlist-entry.args';
import {Context} from '../../modules/engine/rest/context';

@InRequestScope
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
		@Ctx() {orm, user}: Context
	): Promise<Playlist> {
		return this.transform.playlist(
			orm, await orm.Playlist.oneOrFailFilter({ids: [id]}, user),
			playlistArgs, trackArgs, episodeArgs, user
		);
	}

	@Get(
		'/index',
		() => PlaylistIndex,
		{description: 'Get the Navigation Index for Playlists', summary: 'Get Index'}
	)
	async index(
		@QueryParams() filter: PlaylistFilterArgs,
		@Ctx() {orm, user}: Context
	): Promise<PlaylistIndex> {
		const result = await orm.Playlist.indexFilter(filter, user);
		return this.transform.playlistIndex(orm, result);
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
		@Ctx() {orm, user}: Context
	): Promise<PlaylistPage> {
		if (list.list) {
			return await orm.Playlist.findListTransformFilter(list.list, filter, [order], page, user,
				o => this.transform.playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user)
			)
		}
		return await orm.Playlist.searchTransformFilter(
			filter, [order], page, user,
			o => this.transform.playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user)
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
		@Ctx() {orm, user}: Context
	): Promise<PlaylistEntryPage> {
		const playlistIDs = await orm.Playlist.findIDsFilter(filter, user);
		return await orm.PlaylistEntry.searchTransformFilter(
			{playlistIDs}, [order], page, user,
			o => this.transform.playlistEntry(orm, o, trackArgs, episodeArgs, user)
		);
	}

	@Post(
		'/create',
		() => Playlist,
		{description: 'Create a Playlist', summary: 'Create Playlist'}
	)
	async create(
		@BodyParams() args: PlaylistMutateArgs,
		@Ctx() {orm, user}: Context
	): Promise<Playlist> {
		const playlist = await this.playlistService.create(orm, args, user);
		return this.transform.playlist(orm, playlist, {}, {}, {}, user);
	}

	@Post(
		'/update',
		() => Playlist,
		{description: 'Update a Playlist', summary: 'Update Playlist'}
	)
	async update(
		@BodyParam('id', {description: 'Playlist Id', isID: true}) id: string,
		@BodyParams() args: PlaylistMutateArgs,
		@Ctx() {orm, user}: Context
	): Promise<Playlist> {
		const playlist = await orm.Playlist.oneOrFail({where: {id, user: user.id}});
		await this.playlistService.update(orm, args, playlist);
		return this.transform.playlist(orm, playlist, {}, {}, {}, user);
	}

	@Post(
		'/remove',
		{description: 'Remove a Playlist', summary: 'Remove Playlist'}
	)
	async remove(
		@BodyParam('id', {description: 'Playlist Id', isID: true}) id: string,
		@Ctx() {orm, user}: Context
	): Promise<void> {
		const playlist = await orm.Playlist.oneOrFail({where: {id, user: user.id}});
		await this.playlistService.remove(orm, playlist);
	}

}
