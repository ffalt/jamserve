import {Jam} from '../../model/jam-rest-data-0.1.0';
import {Genre} from './genre.model';

export function formatGenre(genre: Genre): Jam.Genre {
	return {
		name: genre.name,
		trackCount: genre.trackCount,
		albumCount: genre.albumCount,
		artistCount: genre.artistCount
	};
}
