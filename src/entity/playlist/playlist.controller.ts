import { Playlist, PlaylistIndex, PlaylistPage } from './playlist.model.js';
import { UserRole } from '../../types/enums.js';
import { PlaylistEntryPage } from '../playlistentry/playlist-entry.model.js';
import { IncludesTrackParameters } from '../track/track.parameters.js';
import { IncludesPlaylistParameters, PlaylistFilterParameters, PlaylistMutateParameters, PlaylistOrderParameters } from './playlist.parameters.js';
import { IncludesEpisodeParameters } from '../episode/episode.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { PlaylistEntryOrderParameters } from '../playlistentry/playlist-entry.parameters.js';
import { Context } from '../../modules/engine/rest/context.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { notFoundError } from '../../modules/deco/express/express-error.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';

@Controller('/playlist', { tags: ['Playlist'], roles: [UserRole.stream] })
export class PlaylistController {
	@Get('/id',
		() => Playlist,
		{ description: 'Get a Playlist by Id', summary: 'Get Playlist' }
	)
	async id(
		@QueryParameter('id', { description: 'Playlist Id', isID: true }) id: string,
		@QueryParameters() playlistParameters: IncludesPlaylistParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Playlist> {
		const list = await orm.Playlist.oneOrFail({ where: { id } });
		if (!list.isPublic && user.id !== list.user.id()) {
			throw notFoundError();
		}
		return engine.transform.playlist(
			orm, list,
			playlistParameters, trackParameters, episodeParameters, user
		);
	}

	@Get(
		'/index',
		() => PlaylistIndex,
		{ description: 'Get the Navigation Index for Playlists', summary: 'Get Index' }
	)
	async index(
		@QueryParameters() filter: PlaylistFilterParameters,
		@RestContext() { orm, engine, user }: Context
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
		@QueryParameters() page: PageParameters,
		@QueryParameters() playlistParameters: IncludesPlaylistParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@QueryParameters() filter: PlaylistFilterParameters,
		@QueryParameters() order: PlaylistOrderParameters,
		@QueryParameters() list: ListParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<PlaylistPage> {
		if (list.list) {
			return await orm.Playlist.findListTransformFilter(list.list, list.seed, filter, [order], page, user,
				o => engine.transform.playlist(orm, o, playlistParameters, trackParameters, episodeParameters, user)
			);
		}
		return await orm.Playlist.searchTransformFilter(
			filter, [order], page, user,
			o => engine.transform.playlist(orm, o, playlistParameters, trackParameters, episodeParameters, user)
		);
	}

	@Get(
		'/entries',
		() => PlaylistEntryPage,
		{ description: 'Get Media Entries [Track/Episode] of Playlists', summary: 'Get Entries' }
	)
	async entries(
		@QueryParameters() page: PageParameters,
		@QueryParameters() trackParameters: IncludesTrackParameters,
		@QueryParameters() episodeParameters: IncludesEpisodeParameters,
		@QueryParameters() filter: PlaylistFilterParameters,
		@QueryParameters() order: PlaylistEntryOrderParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<PlaylistEntryPage> {
		const playlistIDs = await orm.Playlist.findIDsFilter(filter, user);
		return await orm.PlaylistEntry.searchTransformFilter(
			{ playlistIDs }, [order], page, user,
			o => engine.transform.playlistEntry(orm, o, trackParameters, episodeParameters, user)
		);
	}

	@Post(
		'/create',
		() => Playlist,
		{ description: 'Create a Playlist', summary: 'Create Playlist' }
	)
	async create(
		@BodyParameters() parameters: PlaylistMutateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Playlist> {
		const playlist = await engine.playlist.create(orm, parameters, user);
		return engine.transform.playlist(orm, playlist, {}, {}, {}, user);
	}

	@Post(
		'/update',
		() => Playlist,
		{ description: 'Update a Playlist', summary: 'Update Playlist' }
	)
	async update(
		@BodyParameter('id', { description: 'Playlist Id', isID: true }) id: string,
		@BodyParameters() parameters: PlaylistMutateParameters,
		@RestContext() { orm, engine, user }: Context
	): Promise<Playlist> {
		const playlist = await orm.Playlist.oneOrFail({ where: { id, user: user.id } });
		await engine.playlist.update(orm, parameters, playlist);
		return engine.transform.playlist(orm, playlist, {}, {}, {}, user);
	}

	@Post(
		'/remove',
		{ description: 'Remove a Playlist', summary: 'Remove Playlist' }
	)
	async remove(
		@BodyParameter('id', { description: 'Playlist Id', isID: true }) id: string,
		@RestContext() { orm, engine, user }: Context
	): Promise<void> {
		const playlist = await orm.Playlist.oneOrFail({ where: { id, user: user.id } });
		await engine.playlist.remove(orm, playlist);
	}
}
