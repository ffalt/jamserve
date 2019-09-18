import tmp from 'tmp';
import {TestDB} from '../db.spec';
import {DBNedb} from './db-nedb';

export class TestNeDB implements TestDB {
	name = 'nedb';
	// @ts-ignore
	database: DBNedb;
	// @ts-ignore
	dir: tmp.DirResult;

	async setup(): Promise<void> {
		this.dir = tmp.dirSync();
		this.database = new DBNedb(this.dir.name);
		await this.database.open();
	}

	async cleanup(): Promise<void> {
		await this.database.drop();
		await this.database.close();
		this.dir.removeCallback();
	}
}
