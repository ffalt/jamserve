import {JamRequest} from '../../api/jam/api';
import {Jam} from '../../model/jam-rest-data';
import {JamParameters} from '../../model/jam-rest-params';
import {paginate} from '../../utils/paginate';
import {ListResult} from '../base/list-result';
import {formatGenre} from './genre.format';
import {GenreService} from './genre.service';

export class GenreController {

	constructor(private genreService: GenreService) {
	}

	async list(req: JamRequest<JamParameters.Genres>): Promise<ListResult<Jam.Genre>> {
		const genres = await this.genreService.getGenres(req.query.rootID);
		const list = paginate(genres, req.query.amount, req.query.offset);
		return {
			total: list.total,
			amount: list.amount,
			offset: list.offset,
			items: list.items.map(genre => formatGenre(genre))
		};
	}

}
