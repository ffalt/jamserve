import {JamParameters} from '../../model/jam-rest-params';
import {Jam} from '../../model/jam-rest-data';
import {JamRequest} from '../../api/jam/api';
import {formatGenre} from './genre.format';
import {GenreService} from './genre.service';

export class GenreController {

	constructor(private genreService: GenreService) {

	}

	async list(req: JamRequest<JamParameters.Genres>): Promise<Array<Jam.Genre>> {
		const genres = await this.genreService.getGenres(req.query.rootID);
		return genres.map(genre => formatGenre(genre));
	}

}
