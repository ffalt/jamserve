import {DBObject} from '../base/base.model';

export interface Settings extends DBObject {
	section: string;
	version: string;
	data: any;
}
