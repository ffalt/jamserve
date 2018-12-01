import {DBObject} from '../base/base.model';

export interface Root extends DBObject {
	name: string;
	path: string;
	created: number;
}

export interface RootStatus {
	lastScan: number;
	scanning?: boolean;
	error?: string;
}
