import {RootScanStrategy} from '../types/enums';

export interface FirstStartConfig {
	adminUser?: {
		name: string;
		pass: string;
		mail: string;
	};
	roots?: Array<{ name: string; path: string; strategy?: RootScanStrategy }>;
}
