import {User} from '../../engine/user/user.model';
import {UnauthError} from './error';
import {JamApiRole} from './routes';

export async function checkRoles(user?: User, roles?: Array<JamApiRole>): Promise<void> {
	if (!user) {
		return Promise.reject(UnauthError());
	}
	if (roles && roles.length > 0) {
		for (const role of roles) {
			if (!user.roles[role]) {
				return Promise.reject(UnauthError());
			}
		}
	}
}
