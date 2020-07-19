import {DBObjectType} from '../../types/enums';
import {Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {State, StateQL} from '../state/state';
import {Folder, FolderIndexQL, FolderPageQL, FolderQL} from './folder';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {Series, SeriesQL} from '../series/series';
import {Artist, ArtistQL} from '../artist/artist';
import {Album, AlbumQL} from '../album/album';
import {Track, TrackQL} from '../track/track';
import {Artwork, ArtworkQL} from '../artwork/artwork';
import {FolderIndexArgs, FoldersArgs} from './folder.args';

@Resolver(FolderQL)
export class FolderResolver {
	@Query(() => FolderQL, {description: 'Get a Folder by Id'})
	async folder(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Folder> {
		return await orm.Folder.oneOrFail(id)
	}

	@Query(() => FolderPageQL, {description: 'Search Folders'})
	async folders(@Args() {page, filter, order, list}: FoldersArgs, @Ctx() {orm, user}: Context): Promise<FolderPageQL> {
		if (list) {
			return await orm.Folder.findListFilter(list, filter, order, page, user);
		}
		return await orm.Folder.searchFilter(filter, order, page, user);
	}

	@Query(() => FolderIndexQL, {description: 'Get the Navigation Index for Folders'})
	async folderIndex(@Args() {filter}: FolderIndexArgs, @Ctx() {orm, user}: Context): Promise<FolderIndexQL> {
		return await orm.Folder.indexFilter(filter, user);
	}

	@FieldResolver(() => [FolderQL])
	async children(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<Array<Folder>> {
		await orm.Folder.populate(folder, 'children');
		return folder.children.getItems();
	}

	@FieldResolver(() => Int)
	async childrenCount(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<number> {
		await orm.Folder.populate(folder, 'children');
		return folder.children.length;
	}

	@FieldResolver(() => [SeriesQL], {nullable: true})
	async series(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<Array<Series>> {
		await orm.Folder.populate(folder, 'series');
		return folder.series.getItems();
	}

	@FieldResolver(() => Int)
	async seriesCount(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<number> {
		await orm.Folder.populate(folder, 'series');
		return folder.series.length;
	}

	@FieldResolver(() => [ArtistQL], {nullable: true})
	async artists(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<Array<Artist>> {
		await orm.Folder.populate(folder, 'artists');
		return folder.artists.getItems();
	}

	@FieldResolver(() => Int)
	async artistsCount(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<number> {
		await orm.Folder.populate(folder, 'artists');
		return folder.artists.length;
	}

	@FieldResolver(() => [AlbumQL], {nullable: true})
	async albums(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<Array<Album>> {
		await orm.Folder.populate(folder, 'albums');
		return folder.albums.getItems();
	}

	@FieldResolver(() => Int)
	async albumsCount(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<number> {
		await orm.Folder.populate(folder, 'albums');
		return folder.albums.length;
	}

	@FieldResolver(() => [TrackQL], {nullable: true})
	async tracks(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<Array<Track>> {
		await orm.Folder.populate(folder, 'tracks');
		return folder.tracks.getItems();
	}

	@FieldResolver(() => Int)
	async tracksCount(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<number> {
		await orm.Folder.populate(folder, 'tracks');
		return folder.tracks.length;
	}

	@FieldResolver(() => [ArtworkQL], {nullable: true})
	async artworks(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<Array<Artwork>> {
		await orm.Folder.populate(folder, 'artworks');
		return folder.artworks.getItems();
	}

	@FieldResolver(() => Int)
	async artworksCount(@GQLRoot() folder: Folder, @Ctx() {orm}: Context): Promise<number> {
		await orm.Folder.populate(folder, 'artworks');
		return folder.artworks.length;
	}

	@FieldResolver(() => StateQL)
	async state(@GQLRoot() folder: Folder, @Ctx() {orm, user}: Context): Promise<State> {
		return await orm.State.findOrCreate(folder.id, DBObjectType.folder, user.id);
	}
}
