import {DBObjectType} from '../../db/db.types';
import {Session} from './session.model';

const cookie = {originalMaxAge: 2592000000, expires: '2019-10-14T15:10:52.586Z', secure: false, httpOnly: true, path: '/'};

export function mockSession(): Session {
	return {
		id: '',
		sessionID: 'sessionID1',
		type: DBObjectType.session,
		jwth: 'bearer1',
		client: 'Jamboree',
		userID: 'userID1',
		expires: 1543495269,
		cookie: JSON.stringify(cookie),
		agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.14; rv:69.0) Gecko/20100101 Firefox/69.0'
	};
}

export function mockSession2(): Session {
	return {
		id: '',
		sessionID: 'sessionID2',
		type: DBObjectType.session,
		client: 'Jamberry',
		jwth: 'bearer2',
		userID: 'userID2',
		expires: 1443495269,
		cookie: JSON.stringify(cookie),
		agent: 'Commodore/64.0 (Atari 2000) BoulderDash/19840101 Amiga/3'
	};
}
