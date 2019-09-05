import {testService} from '../base/base.service.spec';
import {GenreService} from './genre.service';

describe('GenreService', () => {
	let genreService: GenreService;
	testService({mockData: true},
		async (store, imageModuleTest) => {
			genreService = new GenreService(store.trackStore);
		},
		() => {
			it('should return genres', async () => {
				const genres = await genreService.getGenres();
				expect(genres.length > 0).toBe(true);
			});
			it('should not return genres on invalid root id', async () => {
				const genres = await genreService.getGenres('invalidRootID1');
				expect(genres.length).toBe(0);
			});
		}
	);
});
