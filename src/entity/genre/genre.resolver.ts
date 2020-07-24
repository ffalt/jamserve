import {Ctx, Query, Resolver} from 'type-graphql';
import {Genre, GenreIndexQL, GenreQL} from './genre';
import {Context} from '../../modules/server/middlewares/apollo.context';
import {GenreIndex} from './genre.model';

@Resolver(GenreQL)
export class GenreResolver {

	@Query(() => [GenreQL], {description: 'Get a list of genres found in the library'})
	async genres(@Ctx() {engine}: Context): Promise<Array<Genre>> {
		return engine.genreService.getGenres();
	}

	@Query(() => GenreIndexQL, {description: 'Get the Navigation Index for Genres'})
	async genresIndex(@Ctx() {engine}: Context): Promise<GenreIndex> {
		return await engine.genreService.index();
	}

}