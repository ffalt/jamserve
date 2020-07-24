import {DBObjectType} from '../../types/enums';
import {Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {State, StateQL} from '../state/state';
import {Album, AlbumIndexQL, AlbumPageQL, AlbumQL} from './album';
import {Artist, ArtistQL} from '../artist/artist';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {Track, TrackQL} from '../track/track';
import {Root, RootQL} from '../root/root';
import {Folder, FolderQL} from '../folder/folder';
import {Series, SeriesQL} from '../series/series';
import {AlbumIndexArgsQL, AlbumsArgsQL} from './album.args';

@Resolver(AlbumQL)
export class AlbumResolver {
	@Query(() => AlbumQL, {description: 'Get an Album by Id'})
	async album(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Album> {
		return await orm.Album.oneOrFail(id);
	}

	@Query(() => AlbumPageQL, {description: 'Search albums'})
	async albums(@Args() {filter, page, order, list}: AlbumsArgsQL, @Ctx() {orm, user}: Context): Promise<AlbumPageQL> {
		if (list) {
			return await orm.Album.findListFilter(list, filter, order, page, user);
		}
		return await orm.Album.searchFilter(filter, order, page, user);
	}

	@Query(() => AlbumIndexQL, {description: 'Get the Navigation Index for Albums'})
	async albumIndex(@Args() {filter}: AlbumIndexArgsQL, @Ctx() {orm}: Context): Promise<AlbumIndexQL> {
		return await orm.Album.indexFilter(filter);
	}

	@FieldResolver(() => ArtistQL)
	async artist(@GQLRoot() album: Album, @Ctx() {orm}: Context): Promise<Artist> {
		await orm.Album.populate(album, 'artist');
		return album.artist;
	}

	@FieldResolver(() => [TrackQL])
	async tracks(@GQLRoot() album: Album, @Ctx() {orm}: Context): Promise<Array<Track>> {
		await orm.Album.populate(album, 'tracks');
		return album.tracks.getItems();
	}

	@FieldResolver(() => [RootQL])
	async roots(@GQLRoot() album: Album, @Ctx() {orm}: Context): Promise<Array<Root>> {
		await orm.Album.populate(album, 'roots');
		return album.roots.getItems();
	}

	@FieldResolver(() => [FolderQL])
	async folders(@GQLRoot() album: Album, @Ctx() {orm}: Context): Promise<Array<Folder>> {
		await orm.Album.populate(album, 'folders');
		return album.folders.getItems();
	}

	@FieldResolver(() => SeriesQL, {nullable: true})
	async series(@GQLRoot() album: Album, @Ctx() {orm}: Context): Promise<Series | undefined> {
		await orm.Album.populate(album, 'series');
		return album.series;
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() album: Album, @Ctx() {orm, user}: Context): Promise<State> {
		return await orm.State.findOrCreate(album.id, DBObjectType.album, user.id);
	}

	@FieldResolver(() => Int)
	async foldersCount(@GQLRoot() album: Album, @Ctx() {orm}: Context): Promise<number> {
		await orm.Album.populate(album, 'folders');
		return album.folders.length;
	}

	@FieldResolver(() => Int)
	async tracksCount(@GQLRoot() album: Album, @Ctx() {orm}: Context): Promise<number> {
		await orm.Album.populate(album, 'tracks');
		return album.tracks.length;
	}

	@FieldResolver(() => Int)
	async rootsCount(@GQLRoot() album: Album, @Ctx() {orm}: Context): Promise<number> {
		await orm.Album.populate(album, 'roots');
		return album.roots.length;
	}
}