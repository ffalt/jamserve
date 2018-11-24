import {Jam} from '../../model/jam-rest-data-0.1.0';
import {User, UserRoles} from './user.model';

function formatRoles(roles: UserRoles): Jam.Roles {
	return {
		// coverArt: roles.coverArtRole ? true : undefined,
		stream: roles.streamRole ? true : undefined,
		upload: roles.uploadRole ? true : undefined,
		admin: roles.adminRole ? true : undefined,
		podcast: roles.podcastRole ? true : undefined,
		// settings: roles.settingsRole ? true : undefined,
		// download: roles.downloadRole ? true : undefined,
		// playlist: roles.playlistRole ? true : undefined,
		// comment: roles.commentRole ? true : undefined,
		// jukebox: roles.jukeboxRole ? true : undefined,
		// share: roles.shareRole ? true : undefined,
		// videoConversion: roles.videoConversionRole ? true : undefined
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

