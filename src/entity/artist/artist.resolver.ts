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
		return await orm.Artist.oneOrFailByID(id);
	}

	@Query(() => ArtistPageQL, {description: 'Search Artists'})
	async artists(@Args() {page, filter, order, list}: ArtistsArgsQL, @Ctx() {orm, user}: Context): Promise<ArtistPageQL> {
		if (list) {
			return await orm.Artist.findListFilter(list, filter, order, page, user);
		}
		return await orm.Artist.searchFilter(filter, order, page, user);
	}

	@Query(() => ArtistIndexQL, {description: 'Get the Navigation Index for Albums'})
	async artistIndex(@Args() {filter}: ArtistIndexArgsQL, @Ctx() {orm, engine, user}: Context): Promise<ArtistIndexQL> {
		return await orm.Artist.indexFilter(filter, user, engine.settings.settings.index.ignoreArticles);
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() artist: Artist, @Ctx() {orm, user}: Context): Promise<State> {
		return await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
	}

	@FieldResolver(() => [TrackQL])
	async tracks(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Track>> {
		return artist.tracks.getItems();
	}

	@FieldResolver(() => Int)
	async tracksCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		return artist.tracks.count();
	}

	@FieldResolver(() => [TrackQL])
	async albumTracks(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Track>> {
		return artist.albumTracks.getItems();
	}

	@FieldResolver(() => Int)
	async albumsTracksCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		return artist.albumTracks.count();
	}

	@FieldResolver(() => [AlbumQL])
	async albums(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Album>> {
		return artist.albums.getItems();
	}

	@FieldResolver(() => Int)
	async albumsCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		return artist.albums.count();
	}

	@FieldResolver(() => [RootQL])
	async roots(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Root>> {
		return artist.roots.getItems();
	}

	@FieldResolver(() => Int)
	async rootsCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		return artist.roots.count();
	}

	@FieldResolver(() => [FolderQL])
	async folders(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Folder>> {
		return artist.folders.getItems();
	}

	@FieldResolver(() => Int)
	async foldersCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		return artist.folders.count();
	}

	@FieldResolver(() => [SeriesQL])
	async series(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<Array<Series>> {
		return artist.series.getItems();
	}

	@FieldResolver(() => Int)
	async seriesCount(@GQLRoot() artist: Artist, @Ctx() {orm}: Context): Promise<number> {
		return artist.series.count();
	}
}
