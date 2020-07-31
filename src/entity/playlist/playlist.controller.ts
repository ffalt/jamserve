import {Playlist, PlaylistIndex, PlaylistPage} from './playlist.model';
import {BodyParam, BodyParams, Controller, Ctx, Get, Post, QueryParam, QueryParams} from '../../modules/rest';
import {UserRole} from '../../types/enums';
import {PlaylistEntryPage} from '../playlistentry/playlist-entry.model';
import {IncludesTrackArgs} from '../track/track.args';
import {IncludesPlaylistArgs, PlaylistFilterArgs, PlaylistMutateArgs, PlaylistOrderArgs} from './playlist.args';
import {IncludesEpisodeArgs} from '../episode/episode.args';
import {ListArgs, PageArgs} from '../base/base.args';
import {PlaylistEntryOrderArgs} from '../playlistentry/playlist-entry.args';
import {Context} from '../../modules/engine/rest/context';

@Controller('/playlist', {tags: ['Playlist'], roles: [UserRole.stream]})
export class PlaylistController {
	@Get('/id',
		() => Playlist,
		{description: 'Get a Playlist by Id', summary: 'Get Playlist'}
	)
	async id(
		@QueryParam('id', {description: 'Playlist Id', isID: true}) id: string,
		@QueryParams() playlistArgs: IncludesPlaylistArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Playlist> {
		return engine.transform.playlist(
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
		@Ctx() {orm, engine, user}: Context
	): Promise<PlaylistIndex> {
		const result = await orm.Playlist.indexFilter(filter, user);
		return engine.transform.playlistIndex(orm, result);
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
		@Ctx() {orm, engine, user}: Context
	): Promise<PlaylistPage> {
		if (list.list) {
			return await orm.Playlist.findListTransformFilter(list.list, filter, [order], page, user,
				o => engine.transform.playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user)
			)
		}
		return await orm.Playlist.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user)
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
		@Ctx() {orm, engine, user}: Context
	): Promise<PlaylistEntryPage> {
		const playlistIDs = await orm.Playlist.findIDsFilter(filter, user);
		return await orm.PlaylistEntry.searchTransformFilter(
			{playlistIDs}, [order], page, user,
			o => engine.transform.playlistEntry(orm, o, trackArgs, episodeArgs, user)
		);
	}

	@Post(
		'/create',
		() => Playlist,
		{description: 'Create a Playlist', summary: 'Create Playlist'}
	)
	async create(
		@BodyParams() args: PlaylistMutateArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Playlist> {
		const playlist = await engine.playlist.create(orm, args, user);
		return engine.transform.playlist(orm, playlist, {}, {}, {}, user);
	}

	@Post(
		'/update',
		() => Playlist,
		{description: 'Update a Playlist', summary: 'Update Playlist'}
	)
	async update(
		@BodyParam('id', {description: 'Playlist Id', isID: true}) id: string,
		@BodyParams() args: PlaylistMutateArgs,
		@Ctx() {orm, engine, user}: Context
	): Promise<Playlist> {
		const playlist = await orm.Playlist.oneOrFail({where: {id, user: user.id}});
		await engine.playlist.update(orm, args, playlist);
		return engine.transform.playlist(orm, playlist, {}, {}, {}, user);
	}

	@Post(
		'/remove',
		{description: 'Remove a Playlist', summary: 'Remove Playlist'}
	)
	async remove(
		@BodyParam('id', {description: 'Playlist Id', isID: true}) id: string,
		@Ctx() {orm, engine, user}: Context
	): Promise<void> {
		const playlist = await orm.Playlist.oneOrFail({where: {id, user: user.id}});
		await engine.playlist.remove(orm, playlist);
	}

}
