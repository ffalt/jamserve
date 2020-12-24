import {Arg, Args, Ctx, FieldResolver, ID, Query, Resolver, Root as GQLRoot} from 'type-graphql';
import {Root, RootPageQL, RootQL, RootStatusQL} from './root';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {RootStatus} from '../../modules/engine/services/io/io.types';
import {RootsArgs} from './root.args';
import {Track, TrackQL} from '../track/track';
import {Folder, FolderQL} from '../folder/folder';
import {Album, AlbumQL} from '../album/album';
import {Series, SeriesQL} from '../series/series';
import {Artist, ArtistQL} from '../artist/artist';

@Resolver(RootQL)
export class RootResolver {

	@Query(() => RootQL, {description: 'Get a Root by Id'})
	async root(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Root> {
		return await orm.Root.oneOrFailByID(id);
	}

	@Query(() => RootPageQL, {description: 'Search Roots'})
	async roots(@Args() {page, filter, order, list, seed}: RootsArgs, @Ctx() {orm, user}: Context): Promise<RootPageQL> {
		if (list) {
			return await orm.Root.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Root.searchFilter(filter, order, page, user);
	}

	@FieldResolver(() => RootStatusQL)
	async status(@GQLRoot() root: Root, @Ctx() {engine}: Context): Promise<RootStatus> {
		return engine.io.getRootStatus(root.id);
	}

	@FieldResolver(() => [TrackQL])
	async tracks(@GQLRoot() root: Root): Promise<Array<Track>> {
		return root.tracks.getItems();
	}

	@FieldResolver(() => [FolderQL])
	async folders(@GQLRoot() root: Root): Promise<Array<Folder>> {
		return root.folders.getItems();
	}

	@FieldResolver(() => [AlbumQL])
	async albums(@GQLRoot() root: Root): Promise<Array<Album>> {
		return root.albums.getItems();
	}

	@FieldResolver(() => [SeriesQL])
	async series(@GQLRoot() root: Root): Promise<Array<Series>> {
		return root.series.getItems();
	}

	@FieldResolver(() => [ArtistQL])
	async artists(@GQLRoot() root: Root): Promise<Array<Artist>> {
		return root.artists.getItems();
	}
}


@Resolver(RootStatusQL)
export class RootStatusResolver {
	@FieldResolver(() => RootStatusQL)
	lastScan(@GQLRoot() status: RootStatus): Date {
		return new Date(status.lastScan);
	}
}

