import {DBObjectType} from '../../db/db.types';
import {hashSaltSHA512} from '../../utils/hash';
import {User} from './user.model';

export const mockUserSalt = 'a salt';
export const mockUserPass = 'a pass';
export const mockUserName = 'testuser';

export function mockUser(): User {
	const hash = hashSaltSHA512(mockUserPass, mockUserSalt);
	return {
		id: '',
		type: DBObjectType.user,
		name: mockUserName,
		salt: mockUserSalt,
		hash,
		email: 'a@mail',
		created: 1543495268,
		scrobblingEnabled: false,
		maxBitRate: 10,
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
	const hash = hashSaltSHA512(mockUserPass2, mockUserSalt2);
	return {
		id: '',
		type: DBObjectType.user,
		name: mockUserName2,
		salt: mockUserSalt2,
		hash,
		email: 'second@mail',
		created: 1443495268,
		scrobblingEnabled: true,
		maxBitRate: 20,
		roles: {
			admin: false,
			podcast: false,
			stream: false,
			upload: false
		}
	};
}
