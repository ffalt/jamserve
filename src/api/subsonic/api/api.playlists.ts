import {DBObjectType} from '../../../db/db.types';
import {FolderType} from '../../../model/jam-types';
import {Subsonic} from '../../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../../model/subsonic-rest-params';
import {paginate} from '../../../utils/paginate';
import {ApiOptions, SubsonicApiBase} from '../base';
import {FORMAT} from '../format';
import {Playlist} from '../../../engine/playlist/playlist.model';

export class SubsonicPlaylistsApi extends SubsonicApiBase {

	/**
	 * Creates (or updates) a playlist.
	 * Since 1.2.0
	 * http://your-server/rest/createPlaylist.view
	 * @return Since 1.14.0 the newly created/updated playlist is returned. In earlier versions an empty <subsonic-response> element is returned.
	 */
	async createPlaylist(req: ApiOptions<SubsonicParameters.PlaylistCreate>): Promise<{ playlist: Subsonic.PlaylistWithSongs }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 playlistId 	Yes (if updating) 		The playlist ID.
		 name 	Yes (if creating) 		The human-readable name of the playlist.
		 songId 	Yes 		ID of a song in the playlist. Use one songId parameter for each song in the playlist.
		 */
		let playlist: Playlist | undefined;
		if (!req.query.playlistId && !req.query.name) {
			return Promise.reject({fail: FORMAT.FAIL.PARAMETER});
		}
		if (req.query.playlistId) {
			const updateQuery: SubsonicParameters.PlaylistUpdate = {
				playlistId: req.query.playlistId,
				name: req.query.name,
				songIdToAdd: req.query.songId
			};
			(req as any).query = updateQuery;
			await this.updatePlaylist(req as ApiOptions<SubsonicParameters.PlaylistUpdate>);
			playlist = await this.byID<Playlist>(req.query.playlistId, this.engine.store.playlistStore);
		} else if (req.query.name) {
			playlist = await this.engine.playlistService.create(req.query.name, undefined, false, req.user.id, req.query.songId !== undefined ? (Array.isArray(req.query.songId) ? req.query.songId : [req.query.songId]) : []);
		}
		if (!playlist) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		const tracks = await this.engine.store.trackStore.byIds(playlist.trackIDs);
		const states = await this.engine.stateService.findOrCreateMany(playlist.trackIDs, req.user.id, DBObjectType.track);
		return {playlist: FORMAT.packPlaylistWithSongs(playlist, tracks, states)};
	}

	/**
	 * Updates a playlist. Only the owner of a playlist is allowed to update it.
	 * Since 1.8.0
	 * http://your-server/rest/updatePlaylist.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async updatePlaylist(req: ApiOptions<SubsonicParameters.PlaylistUpdate>): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 playlistId 	Yes 		The playlist ID.
		 name 	No 		The human-readable name of the playlist.
		 comment 	No 		The playlist comment.
		 public 	No 		true if the playlist should be visible to all users, false otherwise.
		 songIdToAdd 	No 		Add this song with this ID to the playlist. Multiple parameters allowed.
		 songIndexToRemove 	No 		Remove the song at this position in the playlist. Multiple parameters allowed.
		 */
		const playlist = await this.byID<Playlist>(req.query.playlistId, this.engine.store.playlistStore);
		if (req.user.id !== playlist.userID) {
			return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
		}

		const removeTracks = req.query.songIndexToRemove !== undefined ? (Array.isArray(req.query.songIndexToRemove) ? req.query.songIndexToRemove : [req.query.songIndexToRemove]) : [];
		playlist.trackIDs = playlist.trackIDs.filter((id, index) => !removeTracks.includes(index));

		const tracks: Array<string> = playlist.trackIDs;
		if (req.query.songIdToAdd) {
			const songAdd = (Array.isArray(req.query.songIdToAdd) ? req.query.songIdToAdd : [req.query.songIdToAdd]);
			playlist.trackIDs = tracks.concat(songAdd);
		}
		playlist.name = req.query.name || playlist.name;
		playlist.comment = req.query.comment || playlist.comment;
		playlist.isPublic = req.query.public !== undefined ? req.query.public : playlist.isPublic;
		playlist.changed = Date.now();
		await this.engine.playlistService.update(playlist);
	}

	/**
	 * Deletes a saved playlist.
	 * Since 1.2.0
	 * http://your-server/rest/deletePlaylist.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async deletePlaylist(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	yes 		ID of the playlist to delete, as obtained by getPlaylists.
		 */
		const playlist = await this.byID<Playlist>(req.query.id, this.engine.store.playlistStore);
		if (playlist.userID !== req.user.id) {
			return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
		}
		await this.engine.playlistService.remove(playlist);
	}

	/**
	 * Returns all playlists a user is allowed to play.
	 * Since 1.0.0
	 * http://your-server/rest/getPlaylists.view
	 * @return Returns a <subsonic-response> element with a nested <playlists> element on success.
	 */
	async getPlaylists(req: ApiOptions<SubsonicParameters.Playlists>): Promise<{ playlists: Subsonic.Playlists }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 username 	no 		(Since 1.8.0) If specified, return playlists for this user rather than for the authenticated user. The authenticated user must have admin role if this parameter is used.
		 */
		let userID = req.user.id;
		if ((req.query.username) && (req.query.username !== req.user.name)) {
			if (!req.user.roles.admin) {
				return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
			}
			const u = await this.engine.userService.getByName(req.query.username);
			if (!u) {
				return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
			}
			userID = u.id;
		}
		const list = await this.engine.store.playlistStore.search({userID, isPublic: req.user.id !== userID});
		const playlists: Subsonic.Playlists = {};
		const result: Array<Subsonic.Playlist> = [];
		for (const playlist of list.items) {
			const plist = await this.preparePlaylist(playlist, req.user);
			result.push(plist);
		}
		playlists.playlist = result;
		return {playlists};
	}

	/**
	 * Returns a listing of files in a saved playlist.
	 * Since 1.0.0
	 * http://your-server/rest/getPlaylist.view
	 * @return Returns a <subsonic-response> element with a nested <playlist> element on success.
	 */
	async getPlaylist(req: ApiOptions<SubsonicParameters.ID>): Promise<{ playlist: Subsonic.Playlist }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	yes 		ID of the playlist to return, as obtained by getPlaylists.
		 */
		const playlist = await this.byID<Playlist>(req.query.id, this.engine.store.playlistStore);
		if (playlist.userID !== req.user.id) {
			return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
		}
		const result = await this.preparePlaylist(playlist, req.user);
		return {playlist: result};
	}

}
