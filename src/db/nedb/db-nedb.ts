import {DatabaseQuerySortType, DBObjectType} from '../../model/jam-types';
import path from 'path';
import Nedb from 'nedb';
import {DBObject} from '../../objects/base/base.model';
import {Database, DatabaseIndex, DatabaseQuery} from '../db.model';
import {fileDeleteIfExists} from '../../utils/fs-utils';

let globaltempid = Date.now();

function regExpEscape(literal_string: string): string {
	return literal_string.replace(/[-[\]{}()*+!<=:?.\/\\^$|#\s,]/g, '\\$&');
}

export class DBIndexNedb<T extends DBObject> implements DatabaseIndex<T> {
	protected _index: string;
	protected _type: string;
	type: DBObjectType;
	client: Nedb;

	private hit2Obj(hit: T): T {
		delete (<any>hit)._id;
		return hit;
	}

	private hits2Objs(hits: Array<T>): Array<T> {
		return hits.map(hit => {
			return this.hit2Obj(hit);
		});
	}

	constructor(type: DBObjectType, client: Nedb) {
		this.type = type;
		this._type = DBObjectType[type];
		this._index = 'jam_' + DBObjectType[type];
		this.client = client;
	}

	async getNewId(): Promise<string> {
		// TODO: implement real sequence id in nedb
		globaltempid++;
		return globaltempid.toString();
	}

	private translateSortQuery(query: DatabaseQuery): { [name: string]: number } | undefined {
		if (query.sort) {
			const result: { [name: string]: number } = {};
			const sort = query.sort;
			Object.keys(sort).forEach(key => {
				result[key] = sort[key] === DatabaseQuerySortType.ascending ? 1 : -1;
			});
			return result;
		}
		return;
	}

	private translateQuery(query: DatabaseQuery) {
		if (query.all) {
			return {};
		}
		let must: Array<any> = [];
		if (query.term) {
			const o = query.term;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					term[key] = o[key];
					return term;
				})
			);
		}
		if (query.match) {
			const o = query.match;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					term[key] = {$regex: new RegExp(regExpEscape(o[key].toString()), 'i')};
					return term;
				})
			);

		}
		if (query.terms) {
			const o = query.terms;
			must = must.concat(
				Object.keys(o).map(key => {
					const term: any = {};
					term[key] = {$in: o[key]};
					return term;
				})
			);
		}
		if (query.startsWith) {
			const o = query.startsWith;
			must = must.concat(
				Object.keys(o).map((key: string): any => {
					return {
						$where: function() {
							return this[key].indexOf(o[key]) === 0;
						}
					};
				})
			);
		}
		if (query.startsWiths) {
			const o = query.startsWiths;
			must = must.concat(
				Object.keys(o).map((key: string): any => {
					return {
						$where: function() {
							return !!o[key].find(entry => this[key].indexOf(entry) === 0);
						}
					};
				})
			);
		}
		if (query.range) {
			const o = query.range;
			Object.keys(o).forEach(key => {
				const vals = o[key];
				if (vals.hasOwnProperty('gte') && vals.gte !== undefined) {
					const term: any = {};
					term[key] = {$gte: vals.gte};
					must.push(term);
				}
				if (vals.hasOwnProperty('lte') && vals.lte !== undefined) {
					const term: any = {};
					term[key] = {$lte: vals.lte};
					must.push(term);
				}
			});
		}
		if (query.notNull) {
			const o = query.notNull;
			must = must.concat(o.map(key => {
				const term: any = {};
				term[key] = {$exists: true};
				return term;
			}));
		}
		return {$and: must};
	}

	async add(body: T): Promise<string> {
		const id = await this.getNewId();
		body.id = id;
		return new Promise<string>((resolve, reject) => {
			this.client.insert(body, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(id);
				}
			});
		});

	}

	async replace(id: string, body: T): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			this.client.update({id: id}, body, {}, (err, numReplaced) => {
				if (err) {
					reject(err);
				} else if (numReplaced !== 1) {
					return reject('Could not find ' + this._type + ' doc with id ' + id);
				} else {
					resolve();
				}
			});
		});
	}

	async upsert(id: string, body: T): Promise<void> {
		if (!id || id.length === 0) {
			await this.add(body);
			return;
		} else {
			await this.replace(id, body);
		}
	}

	async remove(id: string | Array<string>): Promise<void> {
		const ids = Array.isArray(id) ? id : [id];
		if (ids.length === 0) {
			return;
		}
		return new Promise<void>((resolve, reject) => {
			this.client.remove({id: {$in: ids}}, {multi: true}, (err, count) => {
				if (err) {
					reject(err);
				} else if (count !== ids.length) {
					reject('Found nr of items ' + count + ' does not match nr. of ids ' + ids.length);
				} else {
					resolve();
				}
			});
		});
	}

	async removeByQuery(query: DatabaseQuery): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.client.remove(this.translateQuery(query), {multi: true}, (err, count) => {
				if (err) {
					reject(err);
				} else {
					resolve(count);
				}
			});
		});
	}

	async byId(id: string): Promise<T | undefined> {
		if (this.type === undefined) {
			return await this.queryOne({term: {id: id}});
		} else {
			return new Promise<T>((resolve, reject) => {
				this.client.find<T>({id: id}, (err, docs) => {
					if (err) {
						reject(err);
					} else if (docs.length === 0) {
						resolve();
					} else {
						resolve(this.hit2Obj(docs[0]));
					}
				});
			});
		}
	}

	async byIds(ids: Array<string>): Promise<Array<T>> {
		return new Promise<Array<T>>((resolve, reject) => {
			this.client.find<T>({id: {$in: ids}}, (err, docs) => {
				if (err) {
					reject(err);
				} else {
					resolve(this.hits2Objs(docs));
				}
			});
		});
	}

	async query(query: DatabaseQuery): Promise<Array<T>> {
		let dbquery = this.client.find<T>(this.translateQuery(query));
		const sort = this.translateSortQuery(query);
		if (sort) {
			dbquery = dbquery.sort(sort);
		}
		if (query.offset) {
			dbquery = dbquery.skip(query.offset);
		}
		if (query.amount) {
			dbquery = dbquery.limit(query.amount);
		}

		return new Promise<Array<T>>((resolve, reject) => {
			dbquery.exec((err, docs) => {
				if (err) {
					reject(err);
				} else {
					resolve(this.hits2Objs(docs));
				}
			});
		});
	}

	async queryOne(query: DatabaseQuery): Promise<T | undefined> {
		return new Promise<T>((resolve, reject) => {
			this.client.find<T>(this.translateQuery(query)).limit(1).exec((err, docs) => {
				if (err) {
					reject(err);
				} else if (docs.length === 0) {
					resolve();
				} else {
					resolve(this.hit2Obj(docs[0]));
				}
			});
		});
	}

	async iterate(query: DatabaseQuery, onItems: (items: Array<T>) => Promise<void>): Promise<void> {
		let dbquery = this.client.find<T>(this.translateQuery(query));
		const sort = this.translateSortQuery(query);
		if (sort) {
			dbquery = dbquery.sort(sort);
		}
		if (query.offset) {
			dbquery = dbquery.skip(query.offset);
		}
		if (query.amount) {
			dbquery = dbquery.limit(query.amount);
		}
		return new Promise<void>((resolve, reject) => {
			dbquery.exec((err, docs) => {
				if (err) {
					reject(err);
				} else {
					onItems(this.hits2Objs(docs)).then(resolve).catch(reject);
				}
			});
		});
	}

	async queryIds(query: DatabaseQuery): Promise<Array<string>> {
		let dbquery = this.client.find<T>(this.translateQuery(query));
		const sort = this.translateSortQuery(query);
		if (sort) {
			dbquery = dbquery.sort(sort);
		}
		if (query.offset) {
			dbquery = dbquery.skip(query.offset);
		}
		if (query.amount) {
			dbquery = dbquery.limit(query.amount);
		}
		return new Promise<Array<string>>((resolve, reject) => {
			dbquery.exec((err, docs) => {
				if (err) {
					reject(err);
				} else {
					resolve(docs.map(o => o.id));
				}
			});
		});
	}

	private getDotFieldValues(field: string, o: any): Array<string> {
		const result: Array<any> = [];

		const getFieldValueR = (fields: Array<string>, obj: any) => {
			const sub = obj[fields[0]];
			if (sub === undefined) {
				return;
			}
			if (Array.isArray(sub)) {
				if (fields.length === 1) {
					return;
				}
				sub.forEach(child => {
					getFieldValueR(fields.slice(1), child);
				});
			} else {
				if (fields.length === 1) {
					result.push(sub.toString());
				} else if (typeof sub === 'object') {
					getFieldValueR(fields.slice(1), sub);
				}
			}
		};

		getFieldValueR(field.split('.'), o);
		return result;
	}

	async aggregate(query: DatabaseQuery, field: string): Promise<number> {
		let dbquery = this.client.find<T>(this.translateQuery(query));
		const sort = this.translateSortQuery(query);
		if (sort) {
			dbquery = dbquery.sort(sort);
		}
		if (query.offset) {
			dbquery = dbquery.skip(query.offset);
		}
		if (query.amount) {
			dbquery = dbquery.limit(query.amount);
		}
		return new Promise<number>((resolve, reject) => {
			dbquery.exec((err, docs) => {
				if (err) {
					reject(err);
				} else {
					const list: Array<string> = [];
					docs.forEach(doc => {
						const vals = this.getDotFieldValues(field, doc);
						vals.forEach(val => {
							if (list.indexOf(val) < 0) {
								list.push(val);
							}
						});
					});
					resolve(list.length);
				}
			});
		});
	}

	async count(query: DatabaseQuery): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			this.client.count(this.translateQuery(query), (err, count) => {
				if (err) {
					reject(err);
				} else {
					resolve(count);
				}
			});
		});
	}

	async distinct(fieldname: string): Promise<Array<string>> {
		return new Promise<Array<string>>((resolve, reject) => {
			this.client.find<T>({}, (err, docs) => {
				if (err) {
					reject(err);
				} else {
					const list: Array<string> = [];
					docs.forEach(doc => {
						const vals = this.getDotFieldValues(fieldname, doc);
						vals.forEach(val => {
							if (list.indexOf(val) < 0) {
								list.push(val);
							}
						});
					});
					resolve(list);
				}
			});
		});
	}

}

export class DBNedb implements Database {
	clients: {
		[type: string]: { client: Nedb; filename: string };
	} = {};

	constructor(db_path: string) {
		this.getTypes().forEach(type => {
			const filename = path.resolve(db_path, DBObjectType[type] + '.db');
			this.clients[DBObjectType[type]] = {client: new Nedb({filename}), filename};
		});
	}

	async drop(): Promise<void> {
		for (const type of this.getTypes()) {
			const db = this.clients[DBObjectType[type]];
			await fileDeleteIfExists(db.filename);
		}
	}

	private async loadDatabase(db: Nedb) {
		return new Promise((resolve, reject) => {
			db.loadDatabase((err) => {
				if (err) {
					return reject(err);
				}
				resolve();
			});
		});
	}

	async open(): Promise<void> {
		for (const type of this.getTypes()) {
			const db = this.clients[DBObjectType[type]];
			await this.loadDatabase(db.client);
		}
		await this.check();
	}

	async close(): Promise<void> {
		return;
	}

	private getTypes(): Array<DBObjectType> {
		return Object.keys(DBObjectType)
			.filter(key => !isNaN(Number(key)))
			.map(key => parseInt(key, 10));
	}

	private async resetIndex(db: Nedb): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			db.remove({}, {multi: true}, (err) => {
				if (err) {
					return reject(err);
				}
				db.loadDatabase((err2) => {
					if (err2) {
						reject(err2);
					}
					resolve();
				});
			});
		});
	}

	async reset(): Promise<void> {
		for (const type of this.getTypes()) {
			const db = this.clients[DBObjectType[type]];
			await this.resetIndex(db.client);
		}
	}

	private async checkIndex(db: Nedb): Promise<void> {
		return;
	}

	async check(): Promise<void> {
		for (const type of this.getTypes()) {
			const db = this.clients[DBObjectType[type]];
			await this.checkIndex(db.client);
		}
	}

	getDBIndex<T extends DBObject>(type: DBObjectType) {
		return new DBIndexNedb<T>(type, this.clients[DBObjectType[type]].client);
	}
}
