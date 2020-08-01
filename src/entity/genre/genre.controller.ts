import {GenreIndex, GenrePage} from './genre.model';
import {Controller, Ctx, Get, QueryParams} from '../../modules/rest/decorators';
import {UserRole} from '../../types/enums';
import {PageArgs} from '../base/base.args';
import {paginate} from '../base/base.utils';
import {GenreFilterArgs} from './genre.args';
import {Context} from '../../modules/engine/rest/context';

@Controller('/genre', {tags: ['Genres'], roles: [UserRole.stream]})
export class GenreController {

	@Get('/list',
		() => GenrePage,
		{description: 'Get a list of genres found in the library', summary: 'Get Genres'}
	)
	async list(
		@QueryParams() page: PageArgs,
		@QueryParams() filter: GenreFilterArgs,
		@Ctx() {orm, engine}: Context
	): Promise<GenrePage> {
		const genres = await engine.genre.getGenres(orm, filter.rootID);
		return paginate(genres, page);
	}

	@Get(
		'/index',
		() => GenreIndex,
		{description: 'Get the Navigation Index for Genres', summary: 'Get Genre Index'}
	)
	async index(@Ctx() {orm, engine}: Context): Promise<GenreIndex> {
		return await engine.genre.index(orm);
	}

}
