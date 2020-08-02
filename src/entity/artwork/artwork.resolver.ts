import {Arg, Args, Ctx, FieldResolver, ID, Query, Resolver} from 'type-graphql';
import {Artwork, ArtworkPageQL, ArtworkQL} from './artwork';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {Folder, FolderQL} from '../folder/folder';
import {Root as GQLRoot} from 'type-graphql/dist/decorators/Root';
import {ArtworksArgsQL} from './artwork.args';

@Resolver(ArtworkQL)
export class ArtworkResolver {

	@Query(() => ArtworkQL, {description: 'Get an Artwork by Id'})
	async artwork(@Arg('id', () => ID!) id: string, @Ctx() {orm}: Context): Promise<Artwork> {
		return await orm.Artwork.oneOrFailByID(id);
	}

	@Query(() => ArtworkPageQL, {description: 'Search Artworks'})
	async artworks(@Args() {page, filter, order, list}: ArtworksArgsQL, @Ctx() {orm, user}: Context): Promise<ArtworkPageQL> {
		if (list) {
			return await orm.Artwork.findListFilter(list, filter, order, page, user);
		}
		return await orm.Artwork.searchFilter(filter, order, page, user);
	}

	@FieldResolver(() => FolderQL, {description: 'Get the Navigation Index for Albums'})
	async folder(@GQLRoot() artwork: Artwork): Promise<Folder> {
		return artwork.folder.getOrFail();
	}

}
