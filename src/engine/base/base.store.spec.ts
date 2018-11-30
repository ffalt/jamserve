import {DBObject} from './base.model';
import {BaseStore, SearchQuery} from './base.store';
import {it} from 'mocha';
import {expect, should} from 'chai';

interface DBObjStoreThis extends Mocha.Context {
	store: BaseStore<DBObject, SearchQuery>;

	generateMockObjects(): Array<DBObject>;

	generateMatchingQueries(obj: DBObject): Array<SearchQuery>;
}

type DBObjStoreFunc = (this: DBObjStoreThis, done: Mocha.Done) => void;

interface DBObjStoreFuncTestFunction extends Mocha.TestFunction {
	(fn: DBObjStoreFunc): Mocha.Test;

	(title: string, fn: DBObjStoreFunc): Mocha.Test;
}

export const dbObjStore: DBObjStoreFuncTestFunction = <DBObjStoreFuncTestFunction>it;

export function shouldBehaveLikeADBObjectStore() {

	const ids: Array<string> = [];

	dbObjStore('should add the obj', async function() {
		const objs = this.generateMockObjects();
		await this.store.upsert([objs[0]]);
		const r = await this.store.count();
		expect(r).to.equal(1);
		const all = await this.store.all();
		expect(all.length).to.equal(1);
		const id2 = all[0].id;
		ids.push(id2);
		const rest = objs.slice(1);
		for (const obj of rest) {
			const id = await this.store.add(obj);
			ids.push(id);
		}
		const r3 = await this.store.count();
		expect(r3).to.equal(objs.length);
	});

	dbObjStore('should find & compare the obj', async function() {
		const objs = this.generateMockObjects();
		let index = 0;
		for (const id of ids) {
			const result = await this.store.byId(id);
			should().exist(result);
			objs[index].id = id;
			expect(result).to.deep.equal(objs[index]);
			const results = await this.store.byIds([id]);
			expect(results.length).to.equal(1);
			index++;
		}
	});

	dbObjStore('should query & find the obj', async function() {
		const objs = this.generateMockObjects();
		let index = 0;
		for (const obj of objs) {
			const id = ids[index];
			objs[index].id = id;
			const matches = this.generateMatchingQueries(obj);
			for (const match of matches) {
				let o = await this.store.searchOne(match);
				should().exist(o, 'Match did not match anything ' + JSON.stringify(match));
				const list = await this.store.search(match);
				expect(list.length > 0).to.equal(true, 'Match did not match anything ' + JSON.stringify(match));
				o = list.find(ob => ob.id === id);
				should().exist(o, 'Match did not match the right item ' + JSON.stringify(match));
				const tid = await this.store.searchIDs(match);
				expect(tid.length > 0).to.equal(true);
				expect(tid.indexOf(id) >= 0).to.equal(true);
				const nr = await this.store.searchCount(match);
				expect(nr > 0).to.equal(true);
			}
			index++;
		}
	});

	dbObjStore('should remove the obj', async function() {
		const r = await this.store.removeByQuery({id: ids[0]});
		expect(r).to.deep.equal(1, 'Removed more or none items by query');
		const rest = ids.slice(1);
		for (const id of rest) {
			await this.store.remove(id);
			const nope = await this.store.byId(id);
			should().not.exist(nope);
		}
	});

}
