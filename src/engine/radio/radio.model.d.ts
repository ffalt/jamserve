import {DBObject} from '../base/base.model';

export interface Radio extends DBObject {
	name: string;
	url: string;
	homepage?: string;
	disabled?: boolean;
	created: number;
	changed: number;
}
