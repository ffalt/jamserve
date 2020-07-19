import {DBObjectType} from '../../types/enums';
import {Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {State, StateQL} from '../state/state';
import {Artist, ArtistIndexQL, ArtistPageQL, ArtistQL} from './artist';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {Track, TrackQL} from '../track/track';
import {Album, AlbumQL} from '../album/album';
import {Root, RootQL} from '../root/root';
import {Folder, FolderQL} from '../folder/folder';
import {Series, SeriesQL} from '../series/series';
import {ArtistIndexArgsQL, ArtistsArgsQL} from './artist.args';

@Resolver(ArtistQL)
export class ArtistResolver {
	@Query(() => ArtistQL, {description: 'Get an Artist by Id'})
	async artist(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Artist> {
		return await orm.Artist.oneOrFail(id)
	}

	@Query(() => ArtistPageQL, {description: 'Search Artists'})
	async artists(@Args() {page, filter, order, list}: ArtistsArgsQL, @Ctx() {orm, user}: Context): Promise<ArtistPageQL> {
		if (list) {
			return await orm.Artist.findListFilter(list, filter, order, page, user);
		}
		return await orm.Artist.searchFilter(filter, order, page, user);
	}

	@Query(() => ArtistIndexQL, {description: 'Get the Navigation Index for Albums'})
	async artistIndex(@Args() {filter}: ArtistIndexArgsQL, @Ctx() {orm}: Context): Promise<ArtistIndexQL> {
		return await orm.Artist.indexFilter(filter);
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() artist: Artist, @Ctx() {orm, user}: Context): Promise<State> {
		return await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
	}

	@FieldResolver(() => [TrackQL])
	async tracks(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Track>> {
		await orm.Artist.populate(artist, 'tracks');
		return artist.tracks.getItems();
	}

	@FieldResolver(() => Int)
	async tracksCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		await orm.Artist.populate(artist, 'tracks');
		return artist.tracks.length;
	}

	@FieldResolver(() => [TrackQL])
	async albumTracks(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Track>> {
		await orm.Artist.populate(artist, 'albumTracks');
		return artist.albumTracks.getItems();
	}

	@FieldResolver(() => Int)
	async albumsTracksCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		await orm.Artist.populate(artist, 'albumTracks');
		return artist.albumTracks.length;
	}

	@FieldResolver(() => [AlbumQL])
	async albums(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Album>> {
		await orm.Artist.populate(artist, 'albums');
		return artist.albums.getItems();
	}

	@FieldResolver(() => Int)
	async albumsCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		await orm.Artist.populate(artist, 'albums');
		return artist.albums.length;
	}

	@FieldResolver(() => [RootQL])
	async roots(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Root>> {
		await orm.Artist.populate(artist, 'roots');
		return artist.roots.getItems();
	}

	@FieldResolver(() => Int)
	async rootsCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		await orm.Artist.populate(artist, 'roots');
		return artist.roots.length;
	}

	@FieldResolver(() => [FolderQL])
	async folders(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Folder>> {
		await orm.Artist.populate(artist, 'folders');
		return artist.folders.getItems();
	}

	@FieldResolver(() => Int)
	async foldersCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		await orm.Artist.populate(artist, 'folders');
		return artist.folders.length;
	}

	@FieldResolver(() => [SeriesQL])
	async series(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Series>> {
		await orm.Artist.populate(artist, 'series');
		return artist.series.getItems();
	}

	@FieldResolver(() => Int)
	async seriesCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		await orm.Artist.populate(artist, 'series');
		return artist.series.length;
	}
}
