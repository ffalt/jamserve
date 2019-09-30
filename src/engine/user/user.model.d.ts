import {DBObject} from '../base/base.model';

export interface User extends DBObject {
	name: string;
	salt: string;
	hash: string;
	email: string;
	created: number;
	scrobblingEnabled: boolean;
	maxBitRate?: number;
	allowedFolder?: Array<string>;
	roles: UserRoles;
}

export interface UserRoles {
	stream: boolean;
	upload: boolean;
	admin: boolean;
	podcast: boolean;
}
