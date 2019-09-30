import {Subsonic} from '../../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../../model/subsonic-rest-params';
import {ApiOptions, SubsonicApiBase} from '../base';
import {FORMAT} from '../format';

export class SubsonicUserApi extends SubsonicApiBase {

	/**
	 * Changes the password of an existing Subsonic user. You can only change your own password unless you have admin privileges.
	 * Since 1.1.0
	 * http://your-server/rest/changePassword.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async changePassword(req: ApiOptions<SubsonicParameters.ChangePassword>): Promise<void> {
		return Promise.reject('disabled');
		/*
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The name of the user which should change its password.
		 password 	Yes 		The new password of the new user, either in clear text of hex-encoded (see above).
		 */
		/*
		if (
			(!req.query.username) ||
			(!req.query.password) ||
			(req.query.password.length === 0)
		) {
			return Promise.reject({fail: FORMAT.FAIL.PARAMETER});
		}
		if (req.query.username !== req.user.name) {
			if (!req.user.roles.admin) {
				return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
			}
		}
		const u = await this.engine.userService.getByName(req.query.username);
		if (!u) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		u.subsonic_pass = req.query.password;
		if (u.subsonic_pass.startsWith('enc:')) {
			u.subsonic_pass = hexDecode(u.subsonic_pass.slice(4)).trim();
		}
		await this.engine.userService.update(u);
		 */
	}

	/**
	 * Creates a new Subsonic user
	 * Since 1.1.0
	 * http://your-server/rest/createUser.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async createUser(req: ApiOptions<SubsonicParameters.UpdateUser>): Promise<void> {
		return Promise.reject('disabled');
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
			(!req.query.username) || (req.query.username.length === 0) ||
			(!req.query.password) || (req.query.password.length === 0) ||
			(!req.query.email) || (req.query.email.length === 0)
		) {
			return Promise.reject({fail: FORMAT.FAIL.PARAMETER});
		}
		const getBool = (b: boolean | undefined, def: boolean): boolean => {
			return b === undefined ? def : b;
		};
		const u: User = {
			id: '',
			name: req.query.username || '',
			salt: '',
			hash: '',
			subsonic_pass: req.query.password || 'invalid',
			email: req.query.email || 'invalid',
			avatarLastChanged: Date.now(),
			created: Date.now(),
			type: DBObjectType.user,
			// ldapAuthenticated: getBool(req.query.ldapAuthenticated, false),
			scrobblingEnabled: false, // getBool(req.query.scrobblingEnabled, false),
			roles: {
				admin: getBool(req.query.adminRole, false),
				// settingsRole: getBool(req.query.settingsRole, true),
				stream: getBool(req.query.streamRole, true),
				// jukeboxRole: getBool(req.query.jukeboxRole, false),
				// downloadRole: getBool(req.query.downloadRole, false),
				upload: getBool(req.query.uploadRole, false),
				// playlistRole: getBool(req.query.playlistRole, false),
				// coverArtRole: getBool(req.query.coverArtRole, false),
				// commentRole: getBool(req.query.commentRole, false),
				podcast: getBool(req.query.podcastRole, false),
				// shareRole: getBool(req.query.shareRole, false),
				// videoConversionRole: getBool(req.query.videoConversionRole, false)
			}
		};
		if (u.subsonic_pass.startsWith('enc:')) {
			u.subsonic_pass = hexDecode(u.subsonic_pass.slice(4)).trim();
		}
		await this.engine.userService.create(u);
		*/
	}

	/**
	 * Deletes an existing Subsonic user
	 * Since 1.3.0
	 * http://your-server/rest/deleteUser.view
	 * @return  Returns an empty <subsonic-response> element on success.
	 */
	async deleteUser(req: ApiOptions<SubsonicParameters.Username>): Promise<void> {
		return Promise.reject('disabled');
		/*
			 Parameter 	Required 	Default 	Comment
			 username 	Yes 		The name of the user to delete.
			 */
		/*
		const u = await this.engine.userService.getByName(req.query.username);
		if (!u) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		await this.engine.userService.remove(u);
		 */
	}

	/**
	 * Get details about a given user, including which authorization roles it has. Can be used to enable/disable certain features in the client, such as jukebox control.
	 * Since 1.3.0
	 * http://your-server/rest/getUser.view
	 * @return Returns a <subsonic-response> element with a nested <user> element on success.
	 */
	async getUser(req: ApiOptions<SubsonicParameters.Username>): Promise<{ user: Subsonic.User }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The name of the user to retrieve. You can only retrieve your own user unless you have admin privileges.
		  */
		if ((!req.query.username) || (req.user.name === req.query.username)) {
			return {user: FORMAT.packUser(req.user)};
		}
		if (!req.user.roles.admin) {
			return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
		}
		const u = await this.engine.userService.getByName(req.query.username);
		if (!u) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		return {user: FORMAT.packUser(u)};
	}

	/**
	 * Get details about all users, including which authorization roles they have. Only users with admin privileges are allowed to req this method.
	 * Since 1.8.0
	 * http://your-server/rest/getUsers.view
	 * @return Returns a <subsonic-response> element with a nested <users> element on success.
	 */
	async getUsers(req: ApiOptions<{}>): Promise<{ users: Subsonic.Users }> {
		const users = await this.engine.store.userStore.all();
		return {users: {user: users.map(FORMAT.packUser)}};
	}

	/**
	 * Modifies an existing Subsonic user
	 * Since 1.10.1
	 * http://your-server/rest/updateUser.view
	 * @return  Returns an empty <subsonic-response> element on success.
	 */
	async updateUser(req: ApiOptions<SubsonicParameters.UpdateUser>): Promise<void> {
		return Promise.reject('disabled');
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
		const username = req.query.username;
		const u = await this.engine.userService.getByName(username);
		if (!u) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		if (req.query.email) {
			u.email = req.query.email;
		}
		if (req.query.password) {
			u.subsonic_pass = req.query.password;
		}
		if (req.query.musicFolderId) {
			u.allowedFolder = (Array.isArray(req.query.musicFolderId) ? req.query.musicFolderId : [req.query.musicFolderId]).map(id => id.toString());
		}
		if (req.query.maxBitRate !== undefined) {
			u.maxBitRate = req.query.maxBitRate || 0;
		}
		if (req.query.username) {
			u.name = req.query.username;
		}
		// u.ldapAuthenticated = getBool(req.query.ldapAuthenticated, u.ldapAuthenticated);
		// u.scrobblingEnabled = getBool(req.query.scrobblingEnabled, u.scrobblingEnabled);
		u.roles.admin = getBool(req.query.adminRole, u.roles.admin);
		// u.roles.settingsRole = getBool(req.query.settingsRole, u.roles.settingsRole);
		u.roles.stream = getBool(req.query.streamRole, u.roles.stream);
		// u.roles.jukeboxRole = getBool(req.query.jukeboxRole, u.roles.jukeboxRole);
		// u.roles.downloadRole = getBool(req.query.downloadRole, u.roles.downloadRole);
		u.roles.upload = getBool(req.query.uploadRole, u.roles.upload);
		// u.roles.coverArtRole = getBool(req.query.coverArtRole, u.roles.coverArtRole);
		// u.roles.commentRole = getBool(req.query.commentRole, u.roles.commentRole);
		u.roles.podcast = getBool(req.query.podcastRole, u.roles.podcast);
		// u.roles.playlistRole = getBool(req.query.playlistRole, u.roles.playlistRole);
		// u.roles.shareRole = getBool(req.query.shareRole, u.roles.shareRole);
		// u.roles.videoConversionRole = getBool(req.query.videoConversionRole, u.roles.videoConversionRole);
		await this.engine.userService.update(u);
		 */
	}

}
