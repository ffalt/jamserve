import {DBObject} from '../base/base.model';

export interface User extends DBObject {
	name: string;
	pass: string;
	email: string;
	created: number;
	// ldapAuthenticated: boolean;
	scrobblingEnabled: boolean;
	avatarLastChanged?: number;
	avatar?: string;
	maxBitRate?: number;
	allowedfolder?: Array<string>;
	roles: UserRoles;
}

export interface UserRoles {
	// coverArtRole: boolean;
	streamRole: boolean;
	uploadRole: boolean;
	adminRole: boolean;
	podcastRole: boolean;
	// settingsRole: boolean;
	// downloadRole: boolean;
	// playlistRole: boolean;
	// commentRole: boolean;
	// jukeboxRole: boolean;
	// shareRole: boolean;
	// videoConversionRole: boolean;
}

