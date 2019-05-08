import {Jam} from '../../model/jam-rest-data';
import {User, UserRoles} from './user.model';

function formatRoles(roles: UserRoles): Jam.Roles {
	return {
		stream: roles.stream ? true : undefined,
		upload: roles.upload ? true : undefined,
		admin: roles.admin ? true : undefined,
		podcast: roles.podcast ? true : undefined
	};
}

export function formatUser(user: User): Jam.User {
	return {
		id: user.id,
		created: user.created,
		name: user.name,
		email: user.email,
		roles: formatRoles(user.roles)
	};
}

export function formatSessionUser(user: User): Jam.SessionUser {
	return {
		id: user.id,
		created: user.created,
		name: user.name,
		roles: formatRoles(user.roles)
	};
}
