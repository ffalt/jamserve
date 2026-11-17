import { Arg, Args, Authorized, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { Root, RootPageQL, RootQL, RootStatusQL } from './root.js';
import { Context } from '../../modules/server/middlewares/apollo.context.js';
import { RootStatus } from '../../modules/engine/services/io/io.types.js';
import { RootsParameters } from './root.parameters.js';
import { Track, TrackQL } from '../track/track.js';
import { Folder, FolderQL } from '../folder/folder.js';
import { Album, AlbumQL } from '../album/album.js';
import { Series, SeriesQL } from '../series/series.js';
import { Artist, ArtistQL } from '../artist/artist.js';
import { AdminChangeQueueInfo, AdminChangeQueueInfoQL } from '../admin/admin.js';
import { UserRole } from '../../types/enums.js';

@Resolver(RootQL)
export class RootResolver {
	@Query(() => RootQL, { description: 'Get a Root by Id' })
	async root(@Arg('id', () => ID!) id: string, @Ctx() { orm }: Context): Promise<Root> {
		return await orm.Root.oneOrFailByID(id);
	}

	@Query(() => RootPageQL, { description: 'Search Roots' })
	async roots(@Args() { page, filter, order, list, seed }: RootsParameters, @Ctx() { orm, user }: Context): Promise<RootPageQL> {
		if (list) {
			return await orm.Root.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Root.searchFilter(filter, order, page, user);
	}

	@Authorized(UserRole.admin)
	@Mutation(() => AdminChangeQueueInfoQL, { description: 'Check & update a root folder for file system changes, with "withMetadata" also rebuild all its metadata' })
	async rootRefresh(
		@Arg('id', () => ID, { nullable: true, description: 'Root Id to refresh (empty for refreshing all)' }) id: string | undefined,
		@Arg('withMetadata', () => Boolean, { nullable: true, description: 'Also rebuild all metadata (Artists/Albums/...), re-reading the tags of all tracks' }) withMetadata: boolean | undefined,
		@Ctx() { orm, engine }: Context
	): Promise<AdminChangeQueueInfo> {
		if (id) {
			return await (withMetadata ? engine.io.root.refreshMeta(id) : engine.io.root.refresh(id));
		}
		const result = await (withMetadata ? engine.io.root.refreshAllMeta(orm) : engine.io.root.refreshAll(orm));
		return result.at(-1) ?? { id: '' };
	}

	@FieldResolver(() => RootStatusQL)
	async status(@GQLRoot() root: Root, @Ctx() { engine }: Context): Promise<RootStatus> {
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
