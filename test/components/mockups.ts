import path from 'path';
import {User} from '../../src/objects/user/user.model';
import {DBObjectType} from '../../src/types';
import {Root} from '../../src/objects/root/root.model';

export const mockupAdmin: User = {
	id: '',
	name: 'admin',
	pass: 'pass',
	email: 'admin@localhost',
	type: DBObjectType.user,
	ldapAuthenticated: true,
	scrobblingEnabled: true,
	created: Date.now(),
	roles: {
		// coverArtRole: true,
		streamRole: true,
		uploadRole: true,
		adminRole: true,
		// settingsRole: true,
		// downloadRole: true,
		// playlistRole: true,
		// commentRole: true,
		// jukeboxRole: true,
		podcastRole: true
		// videoConversionRole: true,
		// shareRole: true
	}
};

export const mockupUser: User = {
	id: '',
	name: 'user',
	pass: 'user',
	email: 'user@localhost',
	type: DBObjectType.user,
	ldapAuthenticated: false,
	scrobblingEnabled: false,
	created: Date.now(),
	roles: {
		// coverArtRole: false,
		streamRole: false,
		uploadRole: false,
		adminRole: false,
		// settingsRole: false,
		// downloadRole: false,
		// playlistRole: false,
		// commentRole: false,
		// jukeboxRole: false,
		podcastRole: false
		// videoConversionRole: false,
		// shareRole: false
	}
};

export const mockupRoot: Root = {
	id: '',
	created: Date.now(),
	type: DBObjectType.root,
	name: 'Music',
	path: path.resolve('./test/data/files/Music/')
};
