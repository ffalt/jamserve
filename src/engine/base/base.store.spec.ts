import {DBObject} from './base.model';
import {BaseStore, SearchQuery} from './base.store';
import {it} from 'mocha';
import {expect, should} from 'chai';

interface DBObjStoreThis extends Mocha.Context {
	obj: DBObject;
	store: BaseStore<DBObject, SearchQuery>;

	generateMatchingQueries(obj: DBObject): Array<SearchQuery>;
}

type DBObjStoreFunc = (this: DBObjStoreThis, done: Mocha.Done) => void;

interface DBObjStoreFuncTestFunction extends Mocha.TestFunction {
	(fn: DBObjStoreFunc): Mocha.Test;

	(title: string, fn: DBObjStoreFunc): Mocha.Test;
}

export const dbObjStore: DBObjStoreFuncTestFunction = <DBObjStoreFuncTestFunction>it;

export function shouldBehaveLikeADBObjectStore() {

	let id: string;
	let result: DBObject | undefined;

	dbObjStore('should add the obj', async function() {
		id = await this.store.add(this.obj);
	});

	dbObjStore('should find the obj', async function() {
		result = await this.store.byId(id);
		should().exist(result);
	});

	dbObjStore('should compare the obj', async function() {
		this.obj.id = id;
		expect(result).to.deep.equal(this.obj);
	});

	dbObjStore('should query & find the obj', async function() {
		this.obj.id = id;
		const matches = this.generateMatchingQueries(this.obj);
		for (const match of matches) {
			const o = await this.store.searchOne(match);
			should().exist(o, 'Match did not match ' + JSON.stringify(match));
			expect(result).to.deep.equal(o);
		}
	});

	dbObjStore('should remove the obj', async function() {
		await this.store.remove(id);
		const nope = await this.store.byId(id);
		should().not.exist(nope);
	});

}
