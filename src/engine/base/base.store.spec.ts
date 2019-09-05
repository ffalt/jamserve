import {testDatabases, TestDB} from '../../db/db.mock';
import {DBObject} from './base.model';
import {BaseStore, SearchQuery} from './base.store';

export function testStore(setup: (db: TestDB) => BaseStore<DBObject, SearchQuery>, generateMockObjects: () => Array<DBObject>, generateMatchingQueries: (obj: any) => Array<SearchQuery>, tests: () => void): void {

	let store: BaseStore<DBObject, SearchQuery>;

	testDatabases(async (testDB) => {
		store = setup(testDB);
	}, async () => {

	}, () => {

		const ids: Array<string> = [];

		it('should add the obj', async () => {
			const objs = generateMockObjects();
			await store.upsert([objs[0]]);
			const r = await store.count();
			expect(r).toBe(1);
			const all = await store.all();
			expect(all.length).toBe(1);
			const id2 = all[0].id;
			ids.push(id2);
			const rest = objs.slice(1);
			for (const obj of rest) {
				const id = await store.add(obj);
				ids.push(id);
			}
			const r3 = await store.count();
			expect(r3).toBe(objs.length);
		});

		it('should find & compare the obj', async () => {
			const objs = generateMockObjects();
			let index = 0;
			for (const id of ids) {
				const result = await store.byId(id);
				expect(result).toBeTruthy();
				objs[index].id = id;
				expect(result).toEqual(objs[index]);
				const results = await store.byIds([id]);
				expect(results.length).toBe(1);
				index++;
			}
		});

		it('should query & find the obj', async () => {
			const objs = generateMockObjects();
			let index = 0;
			for (const obj of objs) {
				const id = ids[index];
				objs[index].id = id;
				const matches = generateMatchingQueries(obj);
				for (const match of matches) {
					let o = await store.searchOne(match);
					expect(o).toBeTruthy();
					// should().exist(o, 'Match did not match anything ' + JSON.stringify(match));
					const list = await store.search(match);
					expect(list.items.length > 0).toBe(true); // 'Match did not match anything ' + JSON.stringify(match));
					o = list.items.find(ob => ob.id === id);
					expect(o).toBeTruthy();
					// should().exist(o, 'Match did not match the right item ' + JSON.stringify(match));
					const tid = await store.searchIDs(match);
					expect(tid.length > 0).toBe(true);
					expect(tid.includes(id)).toBe(true);
					const nr = await store.searchCount(match);
					expect(nr > 0).toBe(true);
				}
				index++;
			}
		});

		it('should remove the obj', async () => {
			const r = await store.removeByQuery({id: ids[0]});
			expect(r).toBe(1); // 'Removed more or none items by query');
			const rest = ids.slice(1);
			for (const id of rest) {
				await store.remove(id);
				const nope = await store.byId(id);
				expect(nope).toBeUndefined();
			}
		});

		tests();
	});

}
