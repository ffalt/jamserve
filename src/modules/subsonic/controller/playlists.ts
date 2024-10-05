import { Playlist } from '../../../entity/playlist/playlist.js';

import { DBObjectType } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParameterID, SubsonicParameterPlaylistCreate, SubsonicParameterPlaylists, SubsonicParameterPlaylistUpdate } from '../model/subsonic-rest-params.js';
import { SubsonicOKResponse, SubsonicPlaylists, SubsonicPlaylistWithSongs, SubsonicResponsePlaylist, SubsonicResponsePlaylists, SubsonicResponsePlaylistWithSongs } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';
import { Track } from '../../../entity/track/track.js';

@SubsonicController()
export class SubsonicPlaylistsApi {
	/**
	 * Creates (or updates) a playlist.
	 * Since 1.2.0
	 */
	@SubsonicRoute('/createPlaylist.view', () => SubsonicResponsePlaylistWithSongs, {
		summary: 'Create Playlists',
		description: 'Creates (or updates) a playlist.',
		tags: ['Playlists']
	})
	async createPlaylist(@SubsonicParams() query: SubsonicParameterPlaylistCreate, @SubsonicCtx() ctx: Context): Promise<SubsonicResponsePlaylistWithSongs> {
		/*
		 Parameter 	Required 	Default 	Comment
		 playlistId 	Yes (if updating) 		The playlist ID.
		 name 	Yes (if creating) 		The human-readable name of the playlist.
		 songId 	Yes 		ID of a song in the playlist. Use one songId parameter for each song in the playlist.
		 */
		let playlist: Playlist | undefined;
		if (!query.playlistId && !query.name) {
			return Promise.reject(SubsonicFormatter.ERRORS.PARAM_MISSING);
		}
		if (query.playlistId) {
			const playlistId = await ctx.orm.Subsonic.jamIDOrFail(query.playlistId);
			const updateQuery: SubsonicParameterPlaylistUpdate = {
				playlistId,
				name: query.name,
				songIdToAdd: query.songId
			};
			await this.updatePlaylist(updateQuery, ctx);
			playlist = await ctx.orm.Playlist.findOneOrFailByID(playlistId);
		} else if (query.name) {
			playlist = await ctx.engine.playlist.create(ctx.orm, {
				name: query.name,
				isPublic: false,
				mediaIDs: await ctx.orm.Subsonic.jamIDs(query.songId !== undefined ? (Array.isArray(query.songId) ? query.songId : [query.songId]) : [])
			}, ctx.user);
		}
		if (!playlist) {
			return Promise.reject(SubsonicFormatter.ERRORS.NOT_FOUND);
		}
		const entries = await playlist.entries.getItems();
		const tracks: Array<Track> = [];
		for (const entry of entries) {
			const track = await entry.track.get();
			if (track) {
				tracks.push(track);
			}
		}
		const states = await SubsonicHelper.loadStates(ctx.orm, tracks.map(t => t.id), DBObjectType.track, ctx.user.id);
		return { playlist: await SubsonicFormatter.packPlaylistWithSongs(ctx.orm, playlist, tracks, states) };
	}

	/**
	 * Updates a playlist. Only the owner of a playlist is allowed to update it.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/updatePlaylist.view', () => SubsonicOKResponse, {
		summary: 'Update Playlists',
		description: 'Updates a playlist. Only the owner of a playlist is allowed to update it.',
		tags: ['Playlists']
	})
	async updatePlaylist(@SubsonicParams() query: SubsonicParameterPlaylistUpdate, @SubsonicCtx() { orm, engine, user }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 playlistId 	Yes 		The playlist ID.
		 name 	No 		The human-readable name of the playlist.
		 comment 	No 		The playlist comment.
		 public 	No 		true if the playlist should be visible to all users, false otherwise.
		 songIdToAdd 	No 		Add this song with this ID to the playlist. Multiple parameters allowed.
		 songIndexToRemove 	No 		Remove the song at this position in the playlist. Multiple parameters allowed.
		 */
		const playlist = await orm.Playlist.findOneOrFailByID(query.playlistId);
		if (user.id !== playlist.user.id()) {
			return Promise.reject(SubsonicFormatter.ERRORS.UNAUTH);
		}
		const entries = await playlist.entries.getItems();
		let trackIDs = entries.map(e => e.track.id());
		const removeTracks = query.songIndexToRemove !== undefined ? (Array.isArray(query.songIndexToRemove) ? query.songIndexToRemove : [query.songIndexToRemove]) : [];
		trackIDs = trackIDs.filter((id, index) => !removeTracks.includes(index));
		if (query.songIdToAdd) {
			const songAdd = (Array.isArray(query.songIdToAdd) ? query.songIdToAdd : [query.songIdToAdd]);
			trackIDs = trackIDs.concat(await orm.Subsonic.jamIDs(songAdd));
		}
		const mediaIDs = trackIDs.filter(t => t !== undefined);
		await engine.playlist.update(orm, {
			name: query.name || playlist.name,
			comment: query.comment || playlist.comment,
			isPublic: query.public !== undefined ? query.public : playlist.isPublic,
			mediaIDs
		}, playlist);
		return {};
	}

	/**
	 * Deletes a saved playlist.
	 * Since 1.2.0
	 */
	@SubsonicRoute('/deletePlaylist.view', () => SubsonicOKResponse, {
		summary: 'Delete Playlists',
		description: 'Deletes a saved playlist.',
		tags: ['Playlists']
	})
	async deletePlaylist(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm, engine, user }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	yes 		ID of the playlist to delete, as obtained by getPlaylists.
		 */
		const playlist = await orm.Subsonic.findOneSubsonicOrFailByID(query.id, orm.Playlist);
		if (user.id !== playlist.user.id()) {
			return Promise.reject(SubsonicFormatter.ERRORS.UNAUTH);
		}
		await engine.playlist.remove(orm, playlist);
		return {};
	}

	/**
	 * Returns all playlists a user is allowed to play.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/getPlaylists.view', () => SubsonicResponsePlaylists, {
		summary: 'Get Playlists',
		description: 'Returns all playlists a user is allowed to play.',
		tags: ['Playlists']
	})
	async getPlaylists(@SubsonicParams() query: SubsonicParameterPlaylists, @SubsonicCtx() { orm, engine, user }: Context): Promise<SubsonicResponsePlaylists> {
		/*
		 Parameter 	Required 	Default 	Comment
		 username 	no 		(Since 1.8.0) If specified, return playlists for this user rather than for the authenticated user. The authenticated user must have admin role if this parameter is used.
		 */
		let userID = user.id;
		if ((query.username) && (query.username !== user.name)) {
			if (!user.roleAdmin) {
				return Promise.reject(SubsonicFormatter.ERRORS.UNAUTH);
			}
			const u = await engine.user.findByName(orm, query.username);
			if (!u) {
				return Promise.reject(SubsonicFormatter.ERRORS.NOT_FOUND);
			}
			userID = u.id;
		}
		const list = await orm.Playlist.findFilter({ userIDs: [userID], isPublic: user.id !== userID });
		const playlist: Array<SubsonicPlaylistWithSongs> = [];
		for (const plist of list) {
			playlist.push(await SubsonicHelper.preparePlaylist(orm, plist, user));
		}
		return { playlists: { playlist } };
	}

	/**
	 * Returns a listing of files in a saved playlist.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/getPlaylist.view', () => SubsonicResponsePlaylist, {
		summary: 'Get Playlist',
		description: 'Returns a listing of files in a saved playlist.',
		tags: ['Playlists']
	})
	async getPlaylist(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponsePlaylist> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	yes 		ID of the playlist to return, as obtained by getPlaylists.
		 */
		const playlist = await orm.Subsonic.findOneSubsonicOrFailByID(query.id, orm.Playlist);
		if (playlist.user.id() !== user.id) {
			return Promise.reject(SubsonicFormatter.ERRORS.UNAUTH);
		}
		const result = await SubsonicHelper.preparePlaylist(orm, playlist, user);
		return { playlist: result };
	}
}
