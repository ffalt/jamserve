import { DBObjectType } from '../../types/enums.js';
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { State, StateQL } from '../state/state.js';
import { Artist, ArtistIndexQL, ArtistPageQL, ArtistQL } from './artist.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { Track, TrackQL } from '../track/track.js';
import { Album, AlbumQL } from '../album/album.js';
import { Root, RootQL } from '../root/root.js';
import { Folder, FolderQL } from '../folder/folder.js';
import { Series, SeriesQL } from '../series/series.js';
import { ArtistIndexArgsQL, ArtistsArgsQL } from './artist.args.js';
import { Genre, GenreQL } from '../genre/genre.js';

@Resolver(ArtistQL)
export class ArtistResolver {
	@Query(() => ArtistQL, { description: 'Get an Artist by Id' })
	async artist(@Arg('id', () => ID!) id: string, @Ctx() { orm }: Context): Promise<Artist> {
		return await orm.Artist.oneOrFailByID(id);
	}

	@Query(() => ArtistPageQL, { description: 'Search Artists' })
	async artists(@Args() { page, filter, order, list, seed }: ArtistsArgsQL, @Ctx() { orm, user }: Context): Promise<ArtistPageQL> {
		if (list) {
			return await orm.Artist.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Artist.searchFilter(filter, order, page, user);
	}

	@Query(() => ArtistIndexQL, { description: 'Get the Navigation Index for Albums' })
	async artistIndex(@Args() { filter }: ArtistIndexArgsQL, @Ctx() { orm, engine, user }: Context): Promise<ArtistIndexQL> {
		return await orm.Artist.indexFilter(filter, user, engine.settings.settings.index.ignoreArticles);
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() artist: Artist, @Ctx() { orm, user }: Context): Promise<State> {
		return await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
	}

	@FieldResolver(() => [TrackQL])
	async tracks(@GQLRoot() artist: Artist): Promise<Array<Track>> {
		return artist.tracks.getItems();
	}

	@FieldResolver(() => [GenreQL])
	async genres(@GQLRoot() artist: Artist): Promise<Array<Genre>> {
		return artist.genres.getItems();
	}

	@FieldResolver(() => Int)
	async tracksCount(@GQLRoot() artist: Artist): Promise<number> {
		return artist.tracks.count();
	}

	@FieldResolver(() => [TrackQL])
	async albumTracks(@GQLRoot() artist: Artist): Promise<Array<Track>> {
		return artist.albumTracks.getItems();
	}

	@FieldResolver(() => Int)
	async albumsTracksCount(@GQLRoot() artist: Artist): Promise<number> {
		return artist.albumTracks.count();
	}

	@FieldResolver(() => [AlbumQL])
	async albums(@GQLRoot() artist: Artist): Promise<Array<Album>> {
		return artist.albums.getItems();
	}

	@FieldResolver(() => Int)
	async albumsCount(@GQLRoot() artist: Artist): Promise<number> {
		return artist.albums.count();
	}

	@FieldResolver(() => Int)
	async genresCount(@GQLRoot() artist: Artist): Promise<number> {
		return artist.genres.count();
	}

	@FieldResolver(() => [RootQL])
	async roots(@GQLRoot() artist: Artist): Promise<Array<Root>> {
		return artist.roots.getItems();
	}

	@FieldResolver(() => Int)
	async rootsCount(@GQLRoot() artist: Artist): Promise<number> {
		return artist.roots.count();
	}

	@FieldResolver(() => [FolderQL])
	async folders(@GQLRoot() artist: Artist): Promise<Array<Folder>> {
		return artist.folders.getItems();
	}

	@FieldResolver(() => Int)
	async foldersCount(@GQLRoot() artist: Artist): Promise<number> {
		return artist.folders.count();
	}

	@FieldResolver(() => [SeriesQL])
	async series(@GQLRoot() artist: Artist): Promise<Array<Series>> {
		return artist.series.getItems();
	}

	@FieldResolver(() => Int)
	async seriesCount(@GQLRoot() artist: Artist): Promise<number> {
		return artist.series.count();
	}
}
