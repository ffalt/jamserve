import Nedb from 'nedb';
import path from 'path';
import {DBObject} from '../../engine/base/base.model';
import {fileDeleteIfExists} from '../../utils/fs-utils';
import {Database} from '../db.model';
import {DBObjectType} from '../db.types';
import {DBIndexNedb} from './db-nedb.index';

interface NebDBClient {
	client: Nedb;
	filename: string;
}

export class DBNedb implements Database {
	clients: { [type: string]: NebDBClient } = {};
	sequenceId = 99999;

	constructor(dbPath: string) {
		this.getTypes().map(type => DBObjectType[type]).forEach(type => {
			this.clients[type] = this.initClient(type, dbPath);
		});
	}

	private initClient(type: string, dbPath: string): NebDBClient {
		const filename = path.resolve(dbPath, `${type}.db`);
		return {client: new Nedb({filename}), filename};
	}

	async drop(): Promise<void> {
		for (const type of this.getTypes()) {
			const db = this.clients[DBObjectType[type]];
			await fileDeleteIfExists(db.filename);
		}
	}

	private async checkMaxSequence(db: NebDBClient): Promise<void> {
		return new Promise((resolve, reject) => {
			db.client.find({}).sort({id: -1}).exec((err, docs) => {
				if (err) {
					return reject(err);
				}
				if (docs.length > 0) {
					const nr = Number(docs[0].id);
					if (!isNaN(nr)) {
						this.sequenceId = Math.max(this.sequenceId, nr);
					}
				}
				resolve();
			});
		});
	}

	private async loadDatabase(db: NebDBClient): Promise<void> {
		return new Promise((resolve, reject) => {
			db.client.loadDatabase(err => {
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
			await this.loadDatabase(db);
			await this.checkMaxSequence(db);
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
			db.remove({}, {multi: true}, err => {
				if (err) {
					return reject(err);
				}
				db.loadDatabase(err2 => {
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

	getNewID(): string {
		this.sequenceId++;
		return this.sequenceId.toString();
	}

	getDBIndex<T extends DBObject>(type: DBObjectType): DBIndexNedb<T> {
		return new DBIndexNedb<T>(type, this.clients[DBObjectType[type]].client, () => this.getNewID());
	}
}
