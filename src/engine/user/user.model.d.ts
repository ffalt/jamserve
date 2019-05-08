import {DBObject} from '../base/base.model';

export interface User extends DBObject {
	name: string;
	salt: string;
	hash: string;
	subsonic_pass: string;
	email: string;
	created: number;
	scrobblingEnabled: boolean;
	avatarLastChanged?: number;
	avatar?: string;
	maxBitRate?: number;
	allowedfolder?: Array<string>;
	roles: UserRoles;
}

export interface UserRoles {
	[name: string]: boolean;
	stream: boolean;
	upload: boolean;
	admin: boolean;
	podcast: boolean;
}
