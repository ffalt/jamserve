import { SubsonicApiBase, SubsonicFormatter } from './api.base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParameterChangePassword, SubsonicParameterUpdateUser, SubsonicParameterUsername } from '../model/subsonic-rest-params.js';
import { SubsonicOKResponse, SubsonicResponse, SubsonicResponseUser, SubsonicResponseUsers } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';

@SubsonicController()
export class SubsonicUserApi extends SubsonicApiBase {
	/**
	 * Get details about a given user, including which authorization roles it has. Can be used to enable/disable certain features in the client, such as jukebox control.
	 * Since 1.3.0
	 * http://your-server/rest/getUser.view
	 * @return Returns a <subsonic-response> element with a nested <user> element on success.
	 */
	@SubsonicRoute('/getUser.view', () => SubsonicResponseUser, {
		summary: 'Get User',
		description: 'Get details about a given user, including which authorization roles it has.',
		tags: ['Users']
	})
	async getUser(@SubsonicParams() query: SubsonicParameterUsername, { orm, user }: Context): Promise<SubsonicResponseUser> {
		/*
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The name of the user to retrieve. You can only retrieve your own user unless you have admin privileges.
		  */
		if ((!query.username) || (user.name === query.username)) {
			return { user: this.format.packUser(user) };
		}
		if (!user.roleAdmin) {
			return Promise.reject({ fail: SubsonicFormatter.FAIL.UNAUTH });
		}
		const u = await orm.User.findOne({ where: { name: query.username } });
		if (!u) {
			return Promise.reject({ fail: SubsonicFormatter.FAIL.NOTFOUND });
		}
		return { user: this.format.packUser(u) };
	}

	/**
	 * Get details about all users, including which authorization roles they have. Only users with admin privileges are allowed to req this method.
	 * Since 1.8.0
	 * http://your-server/rest/getUsers.view
	 * @return Returns a <subsonic-response> element with a nested <users> element on success.
	 */
	@SubsonicRoute('/getUsers.view', () => SubsonicResponseUsers, {
		summary: 'Get Users',
		description: 'Get details about all users, including which authorization roles they have.',
		tags: ['Users']
	})
	async getUsers(_query: unknown, { orm, user }: Context): Promise<SubsonicResponseUsers> {
		if (!user.roleAdmin) {
			return Promise.reject({ fail: SubsonicFormatter.FAIL.UNAUTH });
		}
		const users = await orm.User.all();
		return { users: { user: users.map(this.format.packUser) } };
	}

	/**
	 * Creates a new Subsonic user
	 * Since 1.1.0
	 * http://your-server/rest/createUser.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('/createUser.view', () => SubsonicOKResponse, {
		summary: 'Create User',
		description: 'Creates a new Subsonic user',
		tags: ['Users']
	})
	async createUser(@SubsonicParams() _query: SubsonicParameterUpdateUser, _ctx: Context): Promise<SubsonicOKResponse> {
		return {};
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
		/*

		if (
			(!query.username) || (query.username.length === 0) ||
			(!query.password) || (query.password.length === 0) ||
			(!query.email) || (query.email.length === 0)
		) {
			return Promise.reject({fail: FORMAT.FAIL.PARAMETER});
		}
		const getBool = (b: boolean | undefined, def: boolean): boolean => {
			return b === undefined ? def : b;
		};
		const u: User = {
			id: '',
			name: query.username || '',
			salt: '',
			hash: '',
			subsonic_pass: query.password || 'invalid',
			email: query.email || 'invalid',
			avatarLastChanged: Date.now(),
			created: Date.now(),
			type: DBObjectType.user,
			// ldapAuthenticated: getBool(query.ldapAuthenticated, false),
			scrobblingEnabled: false, // getBool(query.scrobblingEnabled, false),
			roles: {
				admin: getBool(query.adminRole, false),
				// settingsRole: getBool(query.settingsRole, true),
				stream: getBool(query.streamRole, true),
				// jukeboxRole: getBool(query.jukeboxRole, false),
				// downloadRole: getBool(query.downloadRole, false),
				upload: getBool(query.uploadRole, false),
				// playlistRole: getBool(query.playlistRole, false),
				// coverArtRole: getBool(query.coverArtRole, false),
				// commentRole: getBool(query.commentRole, false),
				podcast: getBool(query.podcastRole, false),
				// shareRole: getBool(query.shareRole, false),
				// videoConversionRole: getBool(query.videoConversionRole, false)
			}
		};
		if (u.subsonic_pass.startsWith('enc:')) {
			u.subsonic_pass = hexDecode(u.subsonic_pass.slice(4)).trim();
		}
		await this.engine.userService.create(u);
		*/
	}

	/**
	 * Changes the password of an existing Subsonic user. You can only change your own password unless you have admin privileges.
	 * Since 1.1.0
	 * http://your-server/rest/changePassword.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('/changePassword.view', () => SubsonicOKResponse, {
		summary: 'Change Password',
		description: 'Changes the password of an existing Subsonic user. You can only change your own password unless you have admin privileges.',
		tags: ['Users']
	})
	async changePassword(@SubsonicParams() _query: SubsonicParameterChangePassword, _ctx: Context): Promise<SubsonicOKResponse> {
		return {};
		/*
			 Parameter 	Required 	Default 	Comment
			 username 	Yes 		The name of the user which should change its password.
			 password 	Yes 		The new password of the new user, either in clear text of hex-encoded (see above).
			 */
		/*
		if (
			(!query.username) ||
			(!query.password) ||
			(query.password.length === 0)
		) {
			return Promise.reject({fail: FORMAT.FAIL.PARAMETER});
		}
		if (query.username !== user.name) {
			if (!user.roles.admin) {
				return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
			}
		}
		const u = await this.engine.userService.getByName(query.username);
		if (!u) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		u.subsonic_pass = query.password;
		if (u.subsonic_pass.startsWith('enc:')) {
			u.subsonic_pass = hexDecode(u.subsonic_pass.slice(4)).trim();
		}
		await this.engine.userService.update(u);
		 */
	}

	/**
	 * Modifies an existing Subsonic user
	 * Since 1.10.1
	 * http://your-server/rest/updateUser.view
	 * @return  Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('/updateUser.view', () => SubsonicOKResponse, {
		summary: 'Update User',
		description: 'Modifies an existing Subsonic user',
		tags: ['Users']
	})
	async updateUser(@SubsonicParams() _query: SubsonicParameterUpdateUser, _ctx: Context): Promise<SubsonicOKResponse> {
		return {};
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
		/*
		const getBool = (b: boolean | undefined, def: boolean): boolean => {
			return b === undefined ? def : b;
		};
		const username = query.username;
		const u = await this.engine.userService.getByName(username);
		if (!u) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		if (query.email) {
			u.email = query.email;
		}
		if (query.password) {
			u.subsonic_pass = query.password;
		}
		if (query.musicFolderId) {
			u.allowedFolder = (Array.isArray(query.musicFolderId) ? query.musicFolderId : [query.musicFolderId]).map(id => id.toString());
		}
		if (query.maxBitRate !== undefined) {
			u.maxBitRate = query.maxBitRate || 0;
		}
		if (query.username) {
			u.name = query.username;
		}
		// u.ldapAuthenticated = getBool(query.ldapAuthenticated, u.ldapAuthenticated);
		// u.scrobblingEnabled = getBool(query.scrobblingEnabled, u.scrobblingEnabled);
		u.roles.admin = getBool(query.adminRole, u.roles.admin);
		// u.roles.settingsRole = getBool(query.settingsRole, u.roles.settingsRole);
		u.roles.stream = getBool(query.streamRole, u.roles.stream);
		// u.roles.jukeboxRole = getBool(query.jukeboxRole, u.roles.jukeboxRole);
		// u.roles.downloadRole = getBool(query.downloadRole, u.roles.downloadRole);
		u.roles.upload = getBool(query.uploadRole, u.roles.upload);
		// u.roles.coverArtRole = getBool(query.coverArtRole, u.roles.coverArtRole);
		// u.roles.commentRole = getBool(query.commentRole, u.roles.commentRole);
		u.roles.podcast = getBool(query.podcastRole, u.roles.podcast);
		// u.roles.playlistRole = getBool(query.playlistRole, u.roles.playlistRole);
		// u.roles.shareRole = getBool(query.shareRole, u.roles.shareRole);
		// u.roles.videoConversionRole = getBool(query.videoConversionRole, u.roles.videoConversionRole);
		await this.engine.userService.update(u);
		 */
	}

	/**
	 * Deletes an existing Subsonic user
	 * Since 1.3.0
	 * http://your-server/rest/deleteUser.view
	 * @return  Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('/deleteUser.view', () => SubsonicOKResponse, {
		summary: 'Delete User',
		description: 'Deletes an existing Subsonic user',
		tags: ['Users']
	})
	async deleteUser(@SubsonicParams() _query: SubsonicParameterUsername, _ctx: Context): Promise<SubsonicOKResponse> {
		return {};
		/*
			 Parameter 	Required 	Default 	Comment
			 username 	Yes 		The name of the user to delete.
			 */
		/*
		const u = await this.engine.userService.getByName(query.username);
		if (!u) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		await this.engine.userService.remove(u);
		 */
	}
}
