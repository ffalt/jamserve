import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParameterChangePassword, SubsonicParameterUpdateUser, SubsonicParameterUsername } from '../model/subsonic-rest-params.js';
import { SubsonicOKResponse, SubsonicResponseUser, SubsonicResponseUsers } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';

@SubsonicController()
export class SubsonicUserApi {
	/**
	 * Get details about a given user, including which authorization roles it has. Can be used to enable/disable certain features in the client, such as jukebox control.
	 * Since 1.3.0
	 */
	@SubsonicRoute('/getUser', () => SubsonicResponseUser, {
		summary: 'Get User',
		description: 'Get details about a given user, including which authorization roles it has.',
		tags: ['Users']
	})
	async getUser(@SubsonicParams() query: SubsonicParameterUsername, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseUser> {
		/*
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The name of the user to retrieve. You can only retrieve your own user unless you have admin privileges.
		  */
		if ((!query.username) || (user.name === query.username)) {
			return { user: SubsonicFormatter.packUser(user) };
		}
		if (!user.roleAdmin) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
		}
		const u = await orm.User.findOne({ where: { name: query.username } });
		if (!u) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
		}
		return { user: SubsonicFormatter.packUser(u) };
	}

	/**
	 * Get details about all users, including which authorization roles they have. Only users with admin privileges are allowed to req this method.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/getUsers', () => SubsonicResponseUsers, {
		summary: 'Get Users',
		description: 'Get details about all users, including which authorization roles they have.',
		tags: ['Users']
	})
	async getUsers(@SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseUsers> {
		if (!user.roleAdmin) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
		}
		const users = await orm.User.all();
		return { users: { user: users.map(SubsonicFormatter.packUser) } };
	}

	/**
	 * Creates a new Subsonic user
	 * Since 1.1.0
	 */
	@SubsonicRoute('/createUser', () => SubsonicOKResponse, {
		summary: 'Create User',
		description: 'Creates a new Subsonic user',
		tags: ['Users']
	})
	async createUser(@SubsonicParams() _query: SubsonicParameterUpdateUser, @SubsonicCtx() _ctx: Context): Promise<SubsonicOKResponse> {
		/*
				 Parameter 	Required 	Default 	Comment
				 username 	Yes 		The name of the new user.
				 password 	Yes 		The password of the new user, either in clear text of hex-encoded (see above).
				 email 	Yes 		The email address of the new user.
				 ldapAuthenticated 	No 	false 	Whether the user is authenicated in LDAP.
				 adminRole 	No 	false 	Whether the user is administrator.
				 settingsRole 	No 	true 	Whether the user is allowed to change settings and password.
				 streamRole 	No 	true 	Whether the user is allowed to play files.
				 jukeboxRole 	No 	false 	Whether the user is allowed to play files in jukebox mode.
				 downloadRole 	No 	false 	Whether the user is allowed to download files.
				 uploadRole 	No 	false 	Whether the user is allowed to upload files.
				 playlistRole 	No 	false 	Whether the user is allowed to create and delete playlists. Since 1.8.0, changing this role has no effect.
				 coverArtRole 	No 	false 	Whether the user is allowed to change cover art and tags.
				 commentRole 	No 	false 	Whether the user is allowed to create and edit comments and ratings.
				 podcastRole 	No 	false 	Whether the user is allowed to administrate Podcasts.
				 shareRole 	No 	false 	(Since 1.8.0)Whether the user is allowed to share files with anyone.
				 videoConversionRole 	No 	false 	(Since 1.15.0) Whether the user is allowed to start video conversions.
				 musicFolderId 	No 	All folders 	(Since 1.12.0) IDs of the music folders the user is allowed access to. Include the parameter once for each folder.
				 */
		return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_USER_MANAGEMENT));
	}

	/**
	 * Changes the password of an existing Subsonic user. You can only change your own password unless you have admin privileges.
	 * Since 1.1.0
	 */
	@SubsonicRoute('/changePassword', () => SubsonicOKResponse, {
		summary: 'Change Password',
		description: 'Changes the password of an existing Subsonic user. You can only change your own password unless you have admin privileges.',
		tags: ['Users']
	})
	async changePassword(@SubsonicParams() _query: SubsonicParameterChangePassword, @SubsonicCtx() _ctx: Context): Promise<SubsonicOKResponse> {
		/*
			 Parameter 	Required 	Default 	Comment
			 username 	Yes 		The name of the user which should change its password.
			 password 	Yes 		The new password of the new user, either in clear text of hex-encoded (see above).
		*/
		return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_USER_MANAGEMENT));
	}

	/**
	 * Modifies an existing Subsonic user
	 * Since 1.10.1
	 */
	@SubsonicRoute('/updateUser', () => SubsonicOKResponse, {
		summary: 'Update User',
		description: 'Modifies an existing Subsonic user',
		tags: ['Users']
	})
	async updateUser(@SubsonicParams() _query: SubsonicParameterUpdateUser, @SubsonicCtx() _ctx: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The name of the user.
		 password 	No 		The password of the user, either in clear text of hex-encoded (see above).
		 email 	No 		The email address of the user.
		 ldapAuthenticated 	No 		Whether the user is authenicated in LDAP.
		 adminRole 	No 		Whether the user is administrator.
		 settingsRole 	No 		Whether the user is allowed to change settings and password.
		 streamRole 	No 		Whether the user is allowed to play files.
		 jukeboxRole 	No 		Whether the user is allowed to play files in jukebox mode.
		 downloadRole 	No 		Whether the user is allowed to download files.
		 uploadRole 	No 		Whether the user is allowed to upload files.
		 coverArtRole 	No 		Whether the user is allowed to change cover art and tags.
		 commentRole 	No 		Whether the user is allowed to create and edit comments and ratings.
		 podcastRole 	No 		Whether the user is allowed to administrate Podcasts.
		 shareRole 	No 		Whether the user is allowed to share files with anyone.
		 videoConversionRole 	No 	false 	(Since 1.15.0) Whether the user is allowed to start video conversions.
		 musicFolderId 	No 		(Since 1.12.0) IDs of the music folders the user is allowed access to. Include the parameter once for each folder.
		 maxBitRate 	No 		(Since 1.13.0) The maximum bit rate (in Kbps) for the user. Audio streams of higher bit rates are automatically downsampled to this bit rate. Legal values: 0 (no limit), 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320.
		 */
		return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_USER_MANAGEMENT));
	}

	/**
	 * Deletes an existing Subsonic user
	 * Since 1.3.0
	 */
	@SubsonicRoute('/deleteUser', () => SubsonicOKResponse, {
		summary: 'Delete User',
		description: 'Deletes an existing Subsonic user',
		tags: ['Users']
	})
	async deleteUser(@SubsonicParams() _query: SubsonicParameterUsername, @SubsonicCtx() _ctx: Context): Promise<SubsonicOKResponse> {
		/*
			 Parameter 	Required 	Default 	Comment
			 username 	Yes 		The name of the user to delete.
		*/
		return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NO_USER_MANAGEMENT));
	}
}
