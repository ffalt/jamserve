import { Root as GQLRoot, Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver } from 'type-graphql';
import { Genre, GenreIndexQL, GenrePageQL, GenreQL } from './genre.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { GenreIndexArgsQL, GenresArgsQL } from './genre.args.js';
import { AlbumPageQL } from '../album/album.js';
import { TrackPageQL } from '../track/track.js';
import { ArtistPageQL } from '../artist/artist.js';
import { TrackPageArgsQL } from '../track/track.args.js';
import { AlbumPageArgsQL } from '../album/album.args.js';
import { ArtistPageArgsQL } from '../artist/artist.args.js';

@Resolver(GenreQL)
export class GenreResolver {
	@Query(() => GenreQL, { description: 'Get an Genre by Id' })
	async genre(@Arg('id', () => ID!) id: string, @Ctx() { orm }: Context): Promise<Genre> {
		return await orm.Genre.oneOrFailByID(id);
	}

	@Query(() => GenrePageQL, { description: 'Search Genres' })
	async genres(@Args() { filter, page, order, list, seed }: GenresArgsQL, @Ctx() { user, orm }: Context): Promise<GenrePageQL> {
		if (list) {
			return await orm.Genre.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Genre.searchFilter(filter, order, page, user);
	}

	@Query(() => GenreIndexQL, { description: 'Get the Navigation Index for Genres' })
	async genreIndex(@Args() { filter }: GenreIndexArgsQL, @Ctx() { orm }: Context): Promise<GenreIndexQL> {
		return await orm.Genre.indexFilter(filter);
	}

	@FieldResolver(() => Int)
	async albumCount(@GQLRoot() genre: Genre): Promise<number> {
		return genre.albums.count();
	}

	@FieldResolver(() => Int)
	async artistCount(@GQLRoot() genre: Genre): Promise<number> {
		return genre.artists.count();
	}

	@FieldResolver(() => Int)
	async folderCount(@GQLRoot() genre: Genre): Promise<number> {
		return genre.folders.count();
	}

	@FieldResolver(() => Int)
	async trackCount(@GQLRoot() genre: Genre): Promise<number> {
		return genre.tracks.count();
	}

	@FieldResolver(() => TrackPageQL)
	async tracks(@GQLRoot() genre: Genre, @Ctx() { orm, user }: Context, @Args() { filter, order, page }: TrackPageArgsQL): Promise<TrackPageQL> {
		return orm.Track.searchFilter({ ...filter, genreIDs: [genre.id] }, order, page, user);
	}

	@FieldResolver(() => AlbumPageQL)
	async albums(@GQLRoot() genre: Genre, @Ctx() { orm, user }: Context, @Args() { filter, order, page }: AlbumPageArgsQL): Promise<AlbumPageQL> {
		return orm.Album.searchFilter({ ...filter, genreIDs: [genre.id] }, order, page, user);
	}

	@FieldResolver(() => ArtistPageQL)
	async artists(@GQLRoot() genre: Genre, @Ctx() { orm, user }: Context, @Args() { filter, order, page }: ArtistPageArgsQL): Promise<ArtistPageQL> {
		return orm.Artist.searchFilter({ ...filter, genreIDs: [genre.id] }, order, page, user);
	}
}
