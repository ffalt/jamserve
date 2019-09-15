import {DBObject} from '../base/base.model';

export interface User extends DBObject {
	name: string;
	salt: string;
	hash: string;
	subsonic_pass: string;
	email: string;
	created: number;
	scrobblingEnabled: boolean;
	maxBitRate?: number;
	allowedfolder?: Array<string>;
	roles: UserRoles;
}

export interface UserRoles {
	stream: boolean;
	upload: boolean;
	admin: boolean;
	podcast: boolean;
}
