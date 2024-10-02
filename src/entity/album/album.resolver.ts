import { DBObjectType } from '../../types/enums.js';
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { State, StateQL } from '../state/state.js';
import { Album, AlbumIndexQL, AlbumPageQL, AlbumQL } from './album.js';
import { Artist, ArtistQL } from '../artist/artist.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { Track, TrackQL } from '../track/track.js';
import { Root, RootQL } from '../root/root.js';
import { Folder, FolderQL } from '../folder/folder.js';
import { Series, SeriesQL } from '../series/series.js';
import { AlbumIndexArgsQL, AlbumsArgsQL } from './album.args.js';
import { Genre, GenreQL } from '../genre/genre.js';

@Resolver(AlbumQL)
export class AlbumResolver {
	@Query(() => AlbumQL, { description: 'Get an Album by Id' })
	async album(@Arg('id', () => ID!) id: string, @Ctx() { orm }: Context): Promise<Album> {
		return await orm.Album.oneOrFailByID(id);
	}

	@Query(() => AlbumPageQL, { description: 'Search albums' })
	async albums(@Args() { filter, page, order, list, seed }: AlbumsArgsQL, @Ctx() { orm, user }: Context): Promise<AlbumPageQL> {
		if (list) {
			return await orm.Album.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Album.searchFilter(filter, order, page, user);
	}

	@Query(() => AlbumIndexQL, { description: 'Get the Navigation Index for Albums' })
	async albumIndex(@Args() { filter }: AlbumIndexArgsQL, @Ctx() { orm }: Context): Promise<AlbumIndexQL> {
		return await orm.Album.indexFilter(filter);
	}

	@FieldResolver(() => ArtistQL)
	async artist(@GQLRoot() album: Album): Promise<Artist> {
		return album.artist.getOrFail();
	}

	@FieldResolver(() => [TrackQL])
	async tracks(@GQLRoot() album: Album): Promise<Array<Track>> {
		return album.tracks.getItems();
	}

	@FieldResolver(() => [GenreQL])
	async genres(@GQLRoot() album: Album): Promise<Array<Genre>> {
		return album.genres.getItems();
	}

	@FieldResolver(() => [RootQL])
	async roots(@GQLRoot() album: Album): Promise<Array<Root>> {
		return album.roots.getItems();
	}

	@FieldResolver(() => [FolderQL])
	async folders(@GQLRoot() album: Album): Promise<Array<Folder>> {
		return album.folders.getItems();
	}

	@FieldResolver(() => SeriesQL, { nullable: true })
	async series(@GQLRoot() album: Album): Promise<Series | undefined> {
		return album.series.get();
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() album: Album, @Ctx() { orm, user }: Context): Promise<State> {
		return await orm.State.findOrCreate(album.id, DBObjectType.album, user.id);
	}

	@FieldResolver(() => Int)
	async foldersCount(@GQLRoot() album: Album): Promise<number> {
		return album.folders.count();
	}

	@FieldResolver(() => Int)
	async tracksCount(@GQLRoot() album: Album): Promise<number> {
		return album.tracks.count();
	}

	@FieldResolver(() => Int)
	async rootsCount(@GQLRoot() album: Album): Promise<number> {
		return album.roots.count();
	}
}
