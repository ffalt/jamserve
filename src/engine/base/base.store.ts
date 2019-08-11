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
	protected group: DatabaseIndex<T>;
	type: DBObjectType;

	protected constructor(type: DBObjectType, db: Database) {
		this.group = db.getDBIndex<T>(type);
		this.type = type;
	}

	protected abstract transformQuery(query: X): DatabaseQuery;

	async getNewId(): Promise<string> {
		return this.group.getNewId();
	}

	async add(item: T): Promise<string> {
		return this.group.add(item);
	}

	async bulk(items: Array<T>): Promise<void> {
		return this.group.bulk(items);
	}

	async replace(item: T): Promise<void> {
		return this.group.replace(item.id, item);
	}

	async remove(idOrIds: string | Array<string>): Promise<void> {
		return this.group.remove(idOrIds);
	}

	async replaceMany(items: Array<T>): Promise<void> {
		for (const item of items) {
			await this.group.replace(item.id, item);
		}
	}

	async byId(id: string): Promise<T | undefined> {
		return this.group.byId(id);
	}

	async byIds(ids: Array<string>): Promise<Array<T>> {
		return this.group.byIds(ids);
	}

	async random(): Promise<T | undefined> {
		return this.group.queryOne({all: true});
	}

	async all(): Promise<Array<T>> {
		return (await this.group.query({all: true})).items;
	}

	async allIds(): Promise<Array<string>> {
		return this.group.queryIds({all: true});
	}

	async count(): Promise<number> {
		return this.group.count({all: true});
	}

	async iterate(onItems: (items: Array<T>) => Promise<void>): Promise<void> {
		await this.group.iterate({all: true}, onItems);
	}

	async upsert(items: Array<T>): Promise<void> {
		for (const item of items) {
			await this.group.upsert(item.id, item);
		}
	}

	async removeByQuery(query: X): Promise<number> {
		return this.group.removeByQuery(this.transformQuery(query));
	}

	async searchIDs(query: X): Promise<Array<string>> {
		return this.group.queryIds(this.transformQuery(query));
	}

	async search(query: X): Promise<ListResult<T>> {
		return this.group.query(this.transformQuery(query));
	}

	async searchOne(query: X): Promise<T | undefined> {
		return this.group.queryOne(this.transformQuery(query));
	}

	async searchCount(query: X): Promise<number> {
		return this.group.count(this.transformQuery(query));
	}

	async searchDistinct(query: X, field: string): Promise<Array<string>> {
		return this.group.distinct(this.transformQuery(query), field);
	}

}
