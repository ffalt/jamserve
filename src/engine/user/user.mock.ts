import {User} from './user.model';
import {DBObjectType} from '../../db/db.types';
import {hashSalt} from '../../utils/salthash';

export const mockUserSalt = 'a salt';
export const mockUserPass = 'a pass';
export const mockUserName = 'testuser';

export function mockUser(): User {
	const hash = hashSalt(mockUserPass, mockUserSalt);
	return {
		id: '',
		type: DBObjectType.user,
		name: mockUserName,
		salt: mockUserSalt,
		hash,
		subsonic_pass: 'a subsonic password',
		email: 'a@mail',
		created: 1543495268,
		scrobblingEnabled: false,
		avatarLastChanged: 1543495269,
		avatar: 'userID1.jpg',
		maxBitRate: 10,
		allowedfolder: [],
		roles: {
			admin: true,
			podcast: true,
			stream: true,
			upload: true
		}
	};
}

export const mockUserPass2 = 'second pass';
export const mockUserSalt2 = 'second salt';
export const mockUserName2 = 'second name';

export function mockUser2(): User {
	const hash = hashSalt(mockUserPass2, mockUserSalt2);
	return {
		id: '',
		type: DBObjectType.user,
		name: mockUserName2,
		salt: mockUserSalt2,
		hash,
		subsonic_pass: 'second subsonic password',
		email: 'second@mail',
		created: 1443495268,
		scrobblingEnabled: true,
		avatarLastChanged: 1443495269,
		avatar: 'userID2.jpg',
		maxBitRate: 20,
		allowedfolder: [],
		roles: {
			admin: false,
			podcast: false,
			stream: false,
			upload: false
		}
	};
}
