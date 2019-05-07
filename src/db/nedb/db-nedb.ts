import Nedb from 'nedb';
import path from 'path';
import {DBObject} from '../../objects/base/base.model';
import {fileDeleteIfExists} from '../../utils/fs-utils';
import {Database} from '../db.model';
import {DBObjectType} from '../db.types';
import {DBIndexNedb} from './db-nedb.index';

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

	private async loadDatabase(db: Nedb): Promise<void> {
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

	getDBIndex<T extends DBObject>(type: DBObjectType): DBIndexNedb<T> {
		return new DBIndexNedb<T>(type, this.clients[DBObjectType[type]].client);
	}
}
