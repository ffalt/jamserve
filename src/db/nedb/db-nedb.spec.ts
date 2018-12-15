import {DBNedb} from './db-nedb';
import {SynchrounousResult} from 'tmp';
import tmp from 'tmp';

export class TestNeDB {
	name = 'nedb';
	// @ts-ignore
	database: DBNedb;
	// @ts-ignore
	dir: SynchrounousResult;

	constructor() {
	}

	async setup() {
		this.dir = tmp.dirSync();
		this.database = new DBNedb(this.dir.name);
		await this.database.open();
	}

	async cleanup() {
		await this.database.drop();
		await this.database.close();
		this.dir.removeCallback();
	}
}
