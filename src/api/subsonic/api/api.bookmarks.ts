import {Track} from '../../../engine/track/track.model';
import {Subsonic} from '../../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../../model/subsonic-rest-params';
import {ApiOptions, SubsonicApiBase} from '../base';
import {FORMAT} from '../format';

export class SubsonicBookmarkApi extends SubsonicApiBase {

	/**
	 * Creates or updates a bookmark (a position within a media file). Bookmarks are personal and not visible to other users.
	 * Since 1.9.0
	 * http://your-server/rest/createBookmark.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async createBookmark(req: ApiOptions<SubsonicParameters.Bookmark>): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the media file to bookmark. If a bookmark already exists for this file it will be overwritten.
		 position 	Yes 		The position (in milliseconds) within the media file.
		 comment 	No 		A user-defined comment.
		 */
		const track = await this.byID<Track>(req.query.id, this.engine.store.trackStore);
		await this.engine.bookmarkService.create(track.id, req.user.id, req.query.position, req.query.comment);
	}

	/**
	 * Returns all bookmarks for this user. A bookmark is a position within a certain media file.
	 * Since 1.9.0
	 * http://your-server/rest/getBookmarks.view
	 * @return Returns a <subsonic-response> element with a nested <bookmarks> element on success.
	 */
	async getBookmarks(req: ApiOptions<{}>): Promise<{ bookmarks: Subsonic.Bookmarks }> {
		const bookmarklist = await this.engine.bookmarkService.byUser(req.user.id);
		const bookmarks: Subsonic.Bookmarks = {};
		bookmarks.bookmark = await this.prepareBookmarks(bookmarklist.items, req.user);
		return {bookmarks};
	}

	/**
	 * Deletes the bookmark for a given file.
	 * Since 1.9.0
	 * http://your-server/rest/deleteBookmark.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async deleteBookmark(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the media file for which to delete the bookmark. Other users' bookmarks are not affected.
		 */
		await this.engine.bookmarkService.remove(req.query.id, req.user.id);
	}

	/**
	 * Returns the state of the play queue for this user (as set by savePlayQueue).
	 * This includes the tracks in the play queue, the currently playing track, and the position within this track.
	 * Typically used to allow a user to move between different clients/apps while retaining the same play queue (for instance when listening to an audio book).
	 * Since 1.12.0
	 * http://your-server/rest/getPlayQueue.view
	 * @return Returns a <subsonic-response> element with a nested <playQueue> element on success, or an empty <subsonic-response> if no play queue has been saved.
	 */
	async getPlayQueue(req: ApiOptions<{}>): Promise<{ playQueue: Subsonic.PlayQueue }> {
		const playqueue = await this.engine.playQueueService.get(req.user.id);
		if (!playqueue) {
			return {} as any;
		}
		const tracks = await this.engine.store.trackStore.byIds(playqueue.trackIDs);
		const childs = await this.prepareTracks(tracks, req.user);
		return {playQueue: FORMAT.packPlayQueue(playqueue, req.user, childs)};
	}

	/**
	 * Saves the state of the play queue for this user. This includes the tracks in the play queue,
	 * the currently playing track, and the position within this track. Typically used to allow a user to move between different clients/apps
	 * while retaining the same play queue (for instance when listening to an audio book).
	 * Since 1.12.0
	 * http://your-server/rest/savePlayQueue.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	async savePlayQueue(req: ApiOptions<SubsonicParameters.PlayQueue>): Promise<void> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		ID of a song in the play queue. Use one id parameter for each song in the play queue.
		current 	No 		The ID of the current playing song.
		position 	No 		The position in milliseconds within the currently playing song.
		 */
		const ids: Array<string> = req.query.id ? (Array.isArray(req.query.id) ? req.query.id : [req.query.id]) : [];
		await this.engine.playQueueService.save(req.user.id, ids, req.query.current, req.query.position, req.client);
	}

}
