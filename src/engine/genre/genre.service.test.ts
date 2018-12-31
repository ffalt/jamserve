import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../../objects/base/base.service.spec';
import {GenreService} from './genre.service';

describe('GenreService', () => {
	let genreService: GenreService;
	testService({mockData: true},
		(store, imageModuleTest) => {
			genreService = new GenreService(store.trackStore);
		},
		() => {
			it('should return genres', async () => {
				const genres = await genreService.getGenres();
				expect(genres.length > 0).to.be.equal(true);
			});
			it('should not return genres on invalid root id', async () => {
				const genres = await genreService.getGenres('invalidRootID1');
				expect(genres.length).to.be.equal(0);
			});
		}
	);
});
