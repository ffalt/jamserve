import {GenreService} from './genre.service';
import {Inject} from 'typescript-ioc';
import {GenreIndex, GenrePage} from './genre.model';
import {Controller, Get, QueryParams} from '../../modules/rest/decorators';
import {UserRole} from '../../types/enums';
import {PageArgs} from '../base/base.args';
import {paginate} from '../base/base.utils';
import {GenreFilterArgs} from './genre.args';

@Controller('/genre', {tags: ['Genres'], roles: [UserRole.stream]})
export class GenreController {
	@Inject
	private genreService!: GenreService;

	@Get('/list',
		() => GenrePage,
		{description: 'Get a list of genres found in the library', summary: 'Get Genres'}
	)
	async list(
		@QueryParams() page: PageArgs,
		@QueryParams() filter: GenreFilterArgs
	): Promise<GenrePage> {
		const genres = await this.genreService.getGenres(filter.rootID);
		return paginate(genres, page);
	}

	@Get(
		'/index',
		() => GenreIndex,
		{description: 'Get the Navigation Index for Genres', summary: 'Get Genre Index'}
	)
	async index(): Promise<GenreIndex> {
		return await this.genreService.index();
	}

}
