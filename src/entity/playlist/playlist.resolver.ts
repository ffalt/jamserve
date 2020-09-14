import {Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {State, StateQL} from '../state/state';
import {DBObjectType} from '../../types/enums';
import {Playlist, PlaylistIndexQL, PlaylistPageQL, PlaylistQL} from './playlist';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {PlaylistEntry, PlaylistEntryQL} from '../playlistentry/playlist-entry';
import {PlaylistIndexArgs, PlaylistsArgs} from './playlist.args';

@Resolver(PlaylistQL)
export class PlaylistResolver {

	@Query(() => PlaylistQL, {description: 'Get a Playlist by Id'})
	async playlist(@Arg('id', () => ID!) id: string, @Ctx() {orm, user}: Context): Promise<Playlist> {
		return await orm.Playlist.oneOrFail({where: {id, user: user.id, isPublic: true}});
	}

	@Query(() => PlaylistPageQL, {description: 'Search Playlists'})
	async playlists(@Args() {page, filter, order, list, seed}: PlaylistsArgs, @Ctx() {orm, user}: Context): Promise<PlaylistPageQL> {
		if (list) {
			return await orm.Playlist.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Playlist.searchFilter(filter, order, page, user);
	}

	@Query(() => PlaylistIndexQL, {description: 'Get the Navigation Index for Playlists'})
	async playlistIndex(@Args() {filter}: PlaylistIndexArgs, @Ctx() {orm, user}: Context): Promise<PlaylistIndexQL> {
		return await orm.Playlist.indexFilter(filter, user);
	}

	@FieldResolver(() => [PlaylistEntryQL])
	async entries(@GQLRoot() playlist: Playlist): Promise<Array<PlaylistEntry>> {
		return playlist.entries.getItems();
	}

	@FieldResolver(() => Int)
	async entriesCount(@GQLRoot() playlist: Playlist): Promise<number> {
		return playlist.entries.count();
	}

	@FieldResolver(() => ID)
	userID(@GQLRoot() playlist: Playlist): string {
		return playlist.user.idOrFail();
	}

	@FieldResolver(() => String)
	async userName(@GQLRoot() playlist: Playlist): Promise<string> {
		return (await playlist.user.getOrFail()).name;
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() playlist: Playlist, @Ctx() {orm, user}: Context): Promise<State> {
		return await orm.State.findOrCreate(playlist.id, DBObjectType.playlist, user.id);
	}
}
