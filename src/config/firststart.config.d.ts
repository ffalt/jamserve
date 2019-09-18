import {Jam} from '../model/jam-rest-data';

export interface FirstStartConfig {
	adminUser?: {
		name: string;
		pass: string;
		mail: string;
	};
	roots?: Array<{ name: string; path: string; strategy?: Jam.RootScanStrategy }>;
}
