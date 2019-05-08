import {assert, expect, should, use} from 'chai';
import {after, before, beforeEach, describe, it} from 'mocha';
import {testService} from '../base/base.service.spec';
//
// describe('StatsService', () => {
// 	let genreService: StatsService;
// 	testService({mockData: true},
// 		async (store, imageModuleTest) => {
// 			genreService = new StatsService(store.trackStore);
// 		},
// 		() => {
// 			it('should return genres', async () => {
// 				const genres = await genreService.getGenres();
// 				expect(genres.length > 0).to.be.equal(true);
// 			});
// 			it('should not return genres on invalid root id', async () => {
// 				const genres = await genreService.getGenres('invalidRootID1');
// 				expect(genres.length).to.be.equal(0);
// 			});
// 		}
// 	);
// });
