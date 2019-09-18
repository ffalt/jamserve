import {Database} from './db.model';

export interface TestDB {
	name: string;
	database: Database;

	setup(): Promise<void>;

	cleanup(): Promise<void>;
}
