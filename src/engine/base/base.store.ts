import {Database, DatabaseIndex, DatabaseQuery} from '../../db/db.model';
import {DBObjectType} from '../../db/db.types';
import {DBObject} from './base.model';
import {ListResult} from './list-result';

export interface SearchQuery {
	id?: string;
	ids?: Array<string>;
	query?: string;
	offset?: number;
	amount?: number;
	sorts?: Array<SearchQuerySort<any>>;
}

export interface SearchQuerySort<T> {
	field: T;
	descending: boolean;
}

export abstract class BaseStore<T extends DBObject, X extends SearchQuery> {
	protected client: DatabaseIndex<T>;

	protected constructor(public type: DBObjectType, db: Database) {
		this.client = db.getDBIndex<T>(type);
	}

	protected abstract transformQuery(query: X): DatabaseQuery;

	async exists(id: string): Promise<boolean> {
		try {
			const session = await this.byId(id);
			return !!session;
		} catch (e) {
			return false;
		}
	}

	async clear(): Promise<void> {
		const ids = await this.allIds();
		await this.remove(ids);
	}

	async getNewId(): Promise<string> {
		return this.client.getNewId();
	}

	async add(item: T): Promise<string> {
		return this.client.add(item);
	}

	async bulk(items: Array<T>): Promise<void> {
		return this.client.bulk(items);
	}

	async replace(item: T): Promise<void> {
		return this.client.replace(item.id, item);
	}

	async remove(idOrIds: string | Array<string>): Promise<number> {
		return this.client.remove(idOrIds);
	}

	async replaceMany(items: Array<T>): Promise<void> {
		for (const item of items) {
			await this.client.replace(item.id, item);
		}
	}

	async byId(id: string): Promise<T | undefined> {
		return this.client.byId(id);
	}

	async byIds(ids: Array<string>): Promise<Array<T>> {
		return this.client.byIds(ids);
	}

	async random(): Promise<T | undefined> {
		return this.client.queryOne({all: true});
	}

	async all(): Promise<Array<T>> {
		return (await this.client.query({all: true})).items;
	}

	async allIds(): Promise<Array<string>> {
		return this.client.queryIds({all: true});
	}

	async count(): Promise<number> {
		return this.client.count({all: true});
	}

	async iterate(onItems: (items: Array<T>) => Promise<void>): Promise<void> {
		await this.client.iterate({all: true}, onItems);
	}

	async upsert(items: Array<T>): Promise<void> {
		for (const item of items) {
			await this.client.upsert(item.id, item);
		}
	}

	async removeByQuery(query: X): Promise<number> {
		return this.client.removeByQuery(this.transformQuery(query));
	}

	async searchIDs(query: X): Promise<Array<string>> {
		return this.client.queryIds(this.transformQuery(query));
	}

	async search(query: X): Promise<ListResult<T>> {
		return this.client.query(this.transformQuery(query));
	}

	async searchOne(query: X): Promise<T | undefined> {
		return this.client.queryOne(this.transformQuery(query));
	}

	async searchCount(query: X): Promise<number> {
		return this.client.count(this.transformQuery(query));
	}

	async searchDistinct(query: X, field: string): Promise<Array<string>> {
		return this.client.distinct(this.transformQuery(query), field);
	}

}
