import {DBNedb} from './db-nedb';
import {SynchrounousResult} from 'tmp';
import tmp from 'tmp';

export class TestNeDB {
	database: DBNedb;
	dir: SynchrounousResult;

	constructor() {
		this.dir = tmp.dirSync();
		this.database = new DBNedb(this.dir.name);
	}

	async setup() {
		await this.database.open();
	}

	async cleanup() {
		await this.database.drop();
		await this.database.close();
		this.dir.removeCallback();
	}
}
