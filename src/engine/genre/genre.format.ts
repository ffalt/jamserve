import {Jam} from '../../model/jam-rest-data';
import {Genre} from './genre.model';

export function formatGenre(genre: Genre): Jam.Genre {
	return {
		name: genre.name,
		trackCount: genre.trackCount,
		albumCount: genre.albumCount,
		artistCount: genre.artistCount
	};
}
