import {User} from './user.model';
import {DBObjectType} from '../../types';

export function mockUser(): User {
	return {
		id: '',
		type: DBObjectType.user,
		name: 'a name',
		pass: 'a pass',
		email: 'a@mail',
		created: 1543495268,
		scrobblingEnabled: false,
		avatarLastChanged: 1543495269,
		avatar: 'userID1.jpg',
		maxBitRate: 10,
		allowedfolder: [],
		roles: {
			adminRole: false,
			podcastRole: false,
			streamRole: false,
			uploadRole: false
		}
	};
}

export function mockUser2(): User {
	return {
		id: '',
		type: DBObjectType.user,
		name: 'second name',
		pass: 'second pass',
		email: 'second@mail',
		created: 1443495268,
		scrobblingEnabled: true,
		avatarLastChanged: 1443495269,
		avatar: 'userID2.jpg',
		maxBitRate: 20,
		allowedfolder: [],
		roles: {
			adminRole: true,
			podcastRole: true,
			streamRole: true,
			uploadRole: true
		}
	};
}
