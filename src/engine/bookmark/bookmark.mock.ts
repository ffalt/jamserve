import {DBObjectType} from '../../db/db.types';
import {Bookmark} from './bookmark.model';

export function mockBookmark(): Bookmark {
	return {
		id: '',
		type: DBObjectType.bookmark,
		destID: 'trackID1',
		userID: 'userID1',
		comment: 'a comment',
		created: 1543495268,
		changed: 1543495269,
		position: 1234
	};
}

export function mockBookmark2(): Bookmark {
	return {
		id: '',
		type: DBObjectType.bookmark,
		destID: 'trackID2',
		userID: 'userID2',
		comment: 'second comment',
		created: 1443495268,
		changed: 1443495269,
		position: 4321
	};
}
