import {DatabaseQuery, DatabaseQuerySort} from '../../db/db.model';
import {DatabaseQuerySortType} from '../../model/jam-types';
import {SearchQuery} from './base.store';

export class QueryHelper {
	private q: DatabaseQuery = {};

	term(field: string, value: string | number | boolean | undefined): void {
		if (value !== undefined && value !== null) {
			this.q.term = this.q.term || {};
			this.q.term[field] = value;
		}
	}

	match(field: string, value: string | undefined): void {
		if (value !== undefined && value !== null) {
			this.q.match = this.q.match || {};
			this.q.match[field] = value;
		}
	}

	startsWith(field: string, value: string | undefined): void {
		if (value !== undefined && value !== null) {
			this.q.startsWith = this.q.startsWith || {};
			this.q.startsWith[field] = value;
		}
	}

	startsWiths(field: string, value: Array<string> | undefined): void {
		if (value !== undefined && value !== null) {
			this.q.startsWiths = this.q.startsWiths || {};
			this.q.startsWiths[field] = value;
		}
	}

	terms(field: string, value: Array<string | number | boolean> | undefined): void {
		if (value !== undefined && value !== null) {
			this.q.terms = this.q.terms || {};
			this.q.terms[field] = value;
		}
	}

	bool(field: string, value: boolean | undefined): void {
		if (value !== undefined && value !== null) {
			this.q.term = this.q.term || {};
			this.q.term[field] = value;
		}
	}

	notNull(field: string, value: boolean | undefined): void {
		if (value !== undefined && value !== null) {
			this.q.notNull = this.q.notNull || [];
			this.q.notNull.push(field);
		}
	}

	range(field: string, lte: number | undefined, gte: number | undefined): void {
		if (lte !== undefined || gte !== undefined) {
			this.q.range = this.q.range || {};
			this.q.range[field] = {gte, lte};
		}
	}

	get(query: SearchQuery, fieldMap?: { [name: string]: string }): DatabaseQuery {
		this.terms('id', query.ids);
		this.term('id', query.id);
		if (Object.keys(this.q).length === 0) {
			this.q.all = true;
		}
		if (query.sorts && query.sorts.length > 0) {
			const sorts: DatabaseQuerySort = {};
			query.sorts.forEach(sort => {
				const field = fieldMap ? fieldMap[sort.field] : undefined;
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
