import {Root as GQLRoot, Arg, Args, Ctx, FieldResolver, ID, Query, Resolver} from 'type-graphql';
import {Artwork, ArtworkPageQL, ArtworkQL} from './artwork.js';
import {Context} from '../../modules/server/middlewares/apollo.context.js';
import {Folder, FolderQL} from '../folder/folder.js';
import {ArtworksArgsQL} from './artwork.args.js';

@Resolver(ArtworkQL)
export class ArtworkResolver {

	@Query(() => ArtworkQL, {description: 'Get an Artwork by Id'})
	async artwork(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Artwork> {
		return await orm.Artwork.oneOrFailByID(id);
	}

	@Query(() => ArtworkPageQL, {description: 'Search Artworks'})
	async artworks(@Args() {page, filter, order, list, seed}: ArtworksArgsQL, @Ctx() {orm, user}: Context): Promise<ArtworkPageQL> {
		if (list) {
			return await orm.Artwork.findListFilter(list, seed, filter, order, page, user);
		}
		return await orm.Artwork.searchFilter(filter, order, page, user);
	}

	@FieldResolver(() => FolderQL, {description: 'Get the Navigation Index for Albums'})
	async folder(@GQLRoot() artwork: Artwork): Promise<Folder> {
		return artwork.folder.getOrFail();
	}

}
