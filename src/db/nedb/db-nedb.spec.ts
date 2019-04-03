import {DBNedb} from './db-nedb';
import tmp from 'tmp';

export class TestNeDB {
	name = 'nedb';
	// @ts-ignore
	database: DBNedb;
	// @ts-ignore
	dir: tmp.DirResult;

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
