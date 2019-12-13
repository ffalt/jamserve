import {DBObjectType} from '../../db/db.types';
import {testService} from '../base/base.service.spec';
import {StateService} from './state.service';

describe('StateService', () => {
	let stateService: StateService;
	testService({mockData: false},
		async store => {
			stateService = new StateService(store.stateStore);
		},
		() => {
			it('should find or create empty states', async () => {
				let states = await stateService.findOrCreateMany(['trackID1', 'trackID2'], 'userID1', DBObjectType.track);
				expect(Object.keys(states).length).toBe(2);
				expect(states.trackID1).toBeDefined();
				expect(states.trackID2).toBeDefined();
				const list = Object.keys(states).map(key => states[key]);
				await stateService.stateStore.upsert(list);
				states = await stateService.findOrCreateMany(['trackID1', 'trackID2', 'trackID3'], 'userID1', DBObjectType.track);
				expect(Object.keys(states).length).toBe(3);
				expect(states.trackID1).toBeDefined();
				expect(states.trackID2).toBeDefined();
				expect(states.trackID3).toBeDefined();
				states = await stateService.findOrCreateMany([], 'userID1', DBObjectType.track);
				expect(Object.keys(states).length).toBe(0);
			});
			describe('fav state', () => {
				it('should not find non existing fav states', async () => {
					const favs = await stateService.getFavedDestIDs(DBObjectType.album, 'userID1');
					expect(favs.length).toBe(0);
				});
				it('should handle removing unnecessary fav toggle', async () => {
					await stateService.fav('albumID1', DBObjectType.album, 'userID1', true);
					const favs = await stateService.getFavedDestIDs(DBObjectType.album, 'userID1');
					expect(favs.length).toBe(0);
				});
				it('should fav', async () => {
					await stateService.fav('albumID1', DBObjectType.album, 'userID1', false);
					const favs = await stateService.getFavedDestIDs(DBObjectType.album, 'userID1');
					expect(favs.length).toBe(1);
				});
				it('should not double fav', async () => {
					await stateService.fav('albumID1', DBObjectType.album, 'userID1', false);
					let favs = await stateService.getFavedDestIDs(DBObjectType.album, 'userID1');
					expect(favs.length).toBe(1);
					await stateService.fav('albumID1', DBObjectType.album, 'userID1', false);
					favs = await stateService.getFavedDestIDs(DBObjectType.album, 'userID1');
					expect(favs.length).toBe(1);
				});
				it('sort favs by fav date', async () => {
					await stateService.fav('albumID1', DBObjectType.album, 'userID1', false);
					await stateService.fav('albumID2', DBObjectType.album, 'userID1', false);
					const favs = await stateService.getFavedDestIDs(DBObjectType.album, 'userID1');
					expect(favs.length).toBe(2);
					expect(favs[0]).toBe('albumID2');
					expect(favs[1]).toBe('albumID1');
					await stateService.fav('albumID2', DBObjectType.album, 'userID1', true);
				});
				it('should unfav', async () => {
					await stateService.fav('albumID1', DBObjectType.album, 'userID1', true);
					const favs = await stateService.getFavedDestIDs(DBObjectType.album, 'userID1');
					expect(favs.length).toBe(0);
				});
			});

			describe('rate state', () => {
				it('should not find non existing rate states', async () => {
					const rates = await stateService.getHighestRatedDestIDs(DBObjectType.album, 'userID1');
					expect(rates.length).toBe(0);
				});
				it('should rate', async () => {
					await stateService.rate('albumID1', DBObjectType.album, 'userID1', 1);
					const rates = await stateService.getHighestRatedDestIDs(DBObjectType.album, 'userID1');
					expect(rates.length).toBe(1);
				});
				it('should unrate', async () => {
					await stateService.rate('albumID1', DBObjectType.album, 'userID1', 0);
					const rates = await stateService.getHighestRatedDestIDs(DBObjectType.album, 'userID1');
					expect(rates.length).toBe(0);
				});
				it('should sort by highest rates', async () => {
					await stateService.rate('albumID1', DBObjectType.album, 'userID1', 1);
					await stateService.rate('albumID2', DBObjectType.album, 'userID1', 2);
					let rates = await stateService.getHighestRatedDestIDs(DBObjectType.album, 'userID1');
					expect(rates.length).toBe(2);
					expect(rates[0]).toBe('albumID2');
					expect(rates[1]).toBe('albumID1');
					await stateService.rate('albumID1', DBObjectType.album, 'userID1', 3);
					rates = await stateService.getHighestRatedDestIDs(DBObjectType.album, 'userID1');
					expect(rates.length).toBe(2);
					expect(rates[0]).toBe('albumID1');
					expect(rates[1]).toBe('albumID2');
				});
				it('should sort by avg highest rates', async () => {
					await stateService.rate('albumID1', DBObjectType.album, 'userID1', 1);
					await stateService.rate('albumID2', DBObjectType.album, 'userID1', 2);
					await stateService.rate('albumID1', DBObjectType.album, 'userID2', 5);
					await stateService.rate('albumID2', DBObjectType.album, 'userID2', 1);
					let rates = await stateService.getAvgHighestDestIDs(DBObjectType.album);
					expect(rates.length).toBe(2);
					expect(rates[0]).toBe('albumID1');
					expect(rates[1]).toBe('albumID2');
					await stateService.rate('albumID2', DBObjectType.album, 'userID2', 5);
					rates = await stateService.getAvgHighestDestIDs(DBObjectType.album);
					expect(rates.length).toBe(2);
					expect(rates[0]).toBe('albumID2');
					expect(rates[1]).toBe('albumID1');
				});
			});
			describe('played state', () => {
				it('should not find non existing play states', async () => {
					const played = await stateService.getRecentlyPlayedDestIDs(DBObjectType.album, 'userID1');
					expect(played.length).toBe(0);
				});
				it('should set play a state', async () => {
					await stateService.reportPlaying('albumID1', DBObjectType.album, 'userID1');
					const played = await stateService.getRecentlyPlayedDestIDs(DBObjectType.album, 'userID1');
					expect(played.length).toBe(1);
				});

				it('sort by play date', async () => {
					await stateService.reportPlaying('albumID2', DBObjectType.album, 'userID1');
					const played = await stateService.getRecentlyPlayedDestIDs(DBObjectType.album, 'userID1');
					expect(played.length).toBe(2);
					expect(played[0]).toBe('albumID2');
					expect(played[1]).toBe('albumID1');
				});

				it('sort by frequent play', async () => {
					await stateService.reportPlaying('albumID1', DBObjectType.album, 'userID3');
					await stateService.reportPlaying('albumID1', DBObjectType.album, 'userID3');
					await stateService.reportPlaying('albumID2', DBObjectType.album, 'userID3');
					let played = await stateService.getFrequentlyPlayedDestIDs(DBObjectType.album, 'userID3');
					expect(played.length).toBe(2);
					expect(played[0]).toBe('albumID1');
					expect(played[1]).toBe('albumID2');
					await stateService.reportPlaying('albumID2', DBObjectType.album, 'userID3');
					await stateService.reportPlaying('albumID2', DBObjectType.album, 'userID3');
					played = await stateService.getFrequentlyPlayedDestIDs(DBObjectType.album, 'userID3');
					expect(played.length).toBe(2);
					expect(played[0]).toBe('albumID2');
					expect(played[1]).toBe('albumID1');
				});
			});
		},
		async () => {
			// nope
		}
	);
});
