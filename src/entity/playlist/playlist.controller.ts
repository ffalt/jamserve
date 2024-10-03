import { Playlist, PlaylistIndex, PlaylistPage } from './playlist.model.js';
import { UserRole } from '../../types/enums.js';
import { PlaylistEntryPage } from '../playlistentry/playlist-entry.model.js';
import { IncludesTrackArgs } from '../track/track.args.js';
import { IncludesPlaylistArgs, PlaylistFilterArgs, PlaylistMutateArgs, PlaylistOrderArgs } from './playlist.args.js';
import { IncludesEpisodeArgs } from '../episode/episode.args.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { PlaylistEntryOrderArgs } from '../playlistentry/playlist-entry.args.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { NotFoundError } from '../../modules/deco/express/express-error.js';
import { Post } from '../../modules/rest/decorators/Post.js';
import { BodyParams } from '../../modules/rest/decorators/BodyParams.js';
import { BodyParam } from '../../modules/rest/decorators/BodyParam.js';

@Controller('/playlist', { tags: ['Playlist'], roles: [UserRole.stream] })
export class PlaylistController {
	@Get('/id',
		() => Playlist,
		{ description: 'Get a Playlist by Id', summary: 'Get Playlist' }
	)
	async id(
		@QueryParam('id', { description: 'Playlist Id', isID: true }) id: string,
		@QueryParams() playlistArgs: IncludesPlaylistArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Playlist> {
		const list = await orm.Playlist.oneOrFail({ where: { id } });
		if (!list.isPublic && user.id !== list.user.id()) {
			throw NotFoundError();
		}
		return engine.transform.playlist(
			orm, list,
			playlistArgs, trackArgs, episodeArgs, user
		);
	}

	@Get(
		'/index',
		() => PlaylistIndex,
		{ description: 'Get the Navigation Index for Playlists', summary: 'Get Index' }
	)
	async index(
		@QueryParams() filter: PlaylistFilterArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<PlaylistIndex> {
		const result = await orm.Playlist.indexFilter(filter, user);
		return engine.transform.Playlist.playlistIndex(orm, result);
	}

	@Get(
		'/search',
		() => PlaylistPage,
		{ description: 'Search Playlists' }
	)
	async search(
		@QueryParams() page: PageArgs,
		@QueryParams() playlistArgs: IncludesPlaylistArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@QueryParams() filter: PlaylistFilterArgs,
		@QueryParams() order: PlaylistOrderArgs,
		@QueryParams() list: ListArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<PlaylistPage> {
		if (list.list) {
			return await orm.Playlist.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user)
			);
		}
		return await orm.Playlist.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user)
		);
	}

	@Get(
		'/entries',
		() => PlaylistEntryPage,
		{ description: 'Get Media Entries [Track/Episode] of Playlists', summary: 'Get Entries' }
	)
	async entries(
		@QueryParams() page: PageArgs,
		@QueryParams() trackArgs: IncludesTrackArgs,
		@QueryParams() episodeArgs: IncludesEpisodeArgs,
		@QueryParams() filter: PlaylistFilterArgs,
		@QueryParams() order: PlaylistEntryOrderArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<PlaylistEntryPage> {
		const playlistIDs = await orm.Playlist.findIDsFilter(filter, user);
		return await orm.PlaylistEntry.searchTransformFilter(
			{ playlistIDs }, [order], page, user,
			o => engine.transform.playlistEntry(orm, o, trackArgs, episodeArgs, user)
		);
	}

	@Post(
		'/create',
		() => Playlist,
		{ description: 'Create a Playlist', summary: 'Create Playlist' }
	)
	async create(
		@BodyParams() args: PlaylistMutateArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Playlist> {
		const playlist = await engine.playlist.create(orm, args, user);
		return engine.transform.playlist(orm, playlist, {}, {}, {}, user);
	}

	@Post(
		'/update',
		() => Playlist,
		{ description: 'Update a Playlist', summary: 'Update Playlist' }
	)
	async update(
		@BodyParam('id', { description: 'Playlist Id', isID: true }) id: string,
		@BodyParams() args: PlaylistMutateArgs,
		@Ctx() { orm, engine, user }: Context
	): Promise<Playlist> {
		const playlist = await orm.Playlist.oneOrFail({ where: { id, user: user.id } });
		await engine.playlist.update(orm, args, playlist);
		return engine.transform.playlist(orm, playlist, {}, {}, {}, user);
	}

	@Post(
		'/remove',
		{ description: 'Remove a Playlist', summary: 'Remove Playlist' }
	)
	async remove(
		@BodyParam('id', { description: 'Playlist Id', isID: true }) id: string,
		@Ctx() { orm, engine, user }: Context
	): Promise<void> {
		const playlist = await orm.Playlist.oneOrFail({ where: { id, user: user.id } });
		await engine.playlist.remove(orm, playlist);
	}
}
