import {DatabaseQuerySortType, DBObjectType} from '../../types';
import {DBObject} from './base.model';
import {Database, DatabaseIndex, DatabaseQuery, DatabaseQuerySort} from '../../db/db.model';

export interface SearchQuery {
	query?: string;
	offset?: number;
	amount?: number;
	sorts?: Array<SearchQuerySort>;
}

export interface SearchQuerySort {
	field: string;
	descending: boolean;
}

export abstract class BaseStore<T extends DBObject, X extends SearchQuery> {
	protected group: DatabaseIndex<T>;
	type: DBObjectType | undefined;

	protected constructor(type: DBObjectType | undefined, db: Database) {
		this.group = db.getDBIndex<T>(type);
		this.type = type;
	}

	protected abstract transformQuery(query: X): DatabaseQuery;

	async add(item: T): Promise<string> {
		return await this.group.add(item);
	}

	async replace(item: T): Promise<void> {
		return await this.group.replace(item.id, item);
	}

	async remove(idOrIds: string | Array<string>): Promise<void> {
		return await this.group.remove(idOrIds);
	}

	async replaceMany(items: Array<T>): Promise<void> {
		for (const item of items) {
			await this.group.replace(item.id, item);
		}
	}

	async byId(id: string): Promise<T | undefined> {
		return await this.group.byId(id);
	}

	async byIds(ids: Array<string>): Promise<Array<T>> {
		return await this.group.byIds(ids);
	}

	async all(): Promise<Array<T>> {
		return await this.group.query({all: true});
	}

	async async(): Promise<Array<string>> {
		return await this.group.queryIds({all: true});
	}

	async count(): Promise<number> {
		return await this.group.count({all: true});
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
		return await this.group.removeByQuery(this.transformQuery(query));
	}

	async searchIDs(query: X): Promise<Array<string>> {
		return await this.group.queryIds(this.transformQuery(query));
	}

	async search(query: X): Promise<Array<T>> {
		return await this.group.query(this.transformQuery(query));
	}

	async searchOne(query: X): Promise<T | undefined> {
		return await this.group.queryOne(this.transformQuery(query));
	}

	async searchCount(query: X): Promise<number> {
		return await this.group.count(this.transformQuery(query));
	}

}

export class QueryHelper {
	private q: DatabaseQuery = {};

	term(field: string, value: string | number | boolean | undefined) {
		if (value !== undefined && value !== null) {
			this.q.term = this.q.term || {};
			this.q.term[field] = value;
		}
	}

	match(field: string, value: string | undefined) {
		if (value !== undefined && value !== null) {
			this.q.match = this.q.match || {};
			this.q.match[field] = value;
		}
	}

	startsWith(field: string, value: string | undefined) {
		if (value !== undefined && value !== null) {
			this.q.startsWith = this.q.startsWith || {};
			this.q.startsWith[field] = value;
		}
	}

	startsWiths(field: string, value: Array<string> | undefined) {
		if (value !== undefined && value !== null) {
			this.q.startsWiths = this.q.startsWiths || {};
			this.q.startsWiths[field] = value;
		}
	}

	terms(field: string, value: Array<string | number | boolean> | undefined) {
		if (value !== undefined && value !== null) {
			this.q.terms = this.q.terms || {};
			this.q.terms[field] = value;
		}
	}

	true(field: string, value: boolean | undefined) {
		if (value !== undefined && value !== null) {
			this.q.term = this.q.term || {};
			this.q.term[field] = true;
		}
	}

	notNull(field: string, value: boolean | undefined) {
		if (value !== undefined && value !== null) {
			this.q.notNull = this.q.notNull || [];
			this.q.notNull.push(field);
		}
	}

	range(field: string, lte: number | undefined, gte: number | undefined) {
		if (lte !== undefined || gte !== undefined) {
			this.q.range = this.q.range || {};
			this.q.range[field] = {gte, lte};
		}
	}

	get(query: SearchQuery, fieldMap?: { [name: string]: string }): DatabaseQuery {
		if (Object.keys(this.q).length === 0) {
			this.q.all = true;
		}
		if (query.sorts) {
			const sorts: DatabaseQuerySort = {};
			query.sorts.forEach(sort => {
				const field = fieldMap ? fieldMap[sort.field] : sort.field;
				if (field) {
					sorts[field] = sort.descending ? DatabaseQuerySortType.descending : DatabaseQuerySortType.ascending;
				}
			});
			this.q.sort = sorts;
		}
		if (query.amount !== undefined && query.amount > 0) {
			this.q.amount = query.amount;
		}
		if (query.offset !== undefined && query.offset > 0) {
			this.q.offset = query.offset;
		}
		return this.q;
	}
}
