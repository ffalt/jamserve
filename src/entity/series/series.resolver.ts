import { DBObjectType } from '../../types/enums.js';
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { State, StateQL } from '../state/state.js';
import { Series, SeriesIndexQL, SeriesPageQL, SeriesQL } from './series.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { SeriesArgsQL, SeriesIndexArgsQL } from './series.args.js';
import { Album, AlbumQL } from '../album/album.js';
import { Track, TrackQL } from '../track/track.js';
import { Folder, FolderQL } from '../folder/folder.js';
import { Root, RootQL } from '../root/root.js';
import { Artist, ArtistQL } from '../artist/artist.js';

@Resolver(SeriesQL)
export class SeriesResolver {
	@Query(() => SeriesQL, { description: 'Get a Series by Id' })
	async series(@Arg('id', () => ID!) id: string, @Ctx() { orm }: Context): Promise<Series> {
		return await orm.Series.oneOrFailByID(id);
	}

	@Query(() => SeriesPageQL, { description: 'Search Series' })
	async serieses(@Args() { page, filter, order, list, seed }: SeriesArgsQL, @Ctx() { orm, user }: Context): Promise<SeriesPageQL> {
		if (list) {
			return await orm.Series.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Series.searchFilter(filter, order, page, user);
	}

	@Query(() => SeriesIndexQL, { description: 'Get the Navigation Index for Series' })
	async seriesIndex(@Args() { filter }: SeriesIndexArgsQL, @Ctx() { orm, user }: Context): Promise<SeriesIndexQL> {
		return await orm.Series.indexFilter(filter, user);
	}

	@FieldResolver(() => [RootQL])
	async roots(@GQLRoot() series: Series): Promise<Array<Root>> {
		return series.roots.getItems();
	}

	@FieldResolver(() => Int)
	async rootsCount(@GQLRoot() series: Series): Promise<number> {
		return series.roots.count();
	}

	@FieldResolver(() => [FolderQL])
	async folders(@GQLRoot() series: Series): Promise<Array<Folder>> {
		return series.folders.getItems();
	}

	@FieldResolver(() => Int)
	async foldersCount(@GQLRoot() series: Series): Promise<number> {
		return series.folders.count();
	}

	@FieldResolver(() => [TrackQL])
	async tracks(@GQLRoot() series: Series): Promise<Array<Track>> {
		return series.tracks.getItems();
	}

	@FieldResolver(() => Int)
	async tracksCount(@GQLRoot() series: Series): Promise<number> {
		return series.tracks.count();
	}

	@FieldResolver(() => [AlbumQL])
	async albums(@GQLRoot() series: Series): Promise<Array<Album>> {
		return series.albums.getItems();
	}

	@FieldResolver(() => Int)
	async albumsCount(@GQLRoot() series: Series): Promise<number> {
		return series.albums.count();
	}

	@FieldResolver(() => Int)
	async genresCount(@GQLRoot() series: Series): Promise<number> {
		return series.genres.count();
	}

	@FieldResolver(() => ArtistQL, { nullable: true })
	async artist(@GQLRoot() series: Series): Promise<Artist | undefined> {
		return series.artist.get();
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() series: Series, @Ctx() { orm, user }: Context): Promise<State> {
		return await orm.State.findOrCreate(series.id, DBObjectType.series, user.id);
	}
}
