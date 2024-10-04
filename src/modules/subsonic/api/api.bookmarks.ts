import { SubsonicApiBase } from './api.base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParameterBookmark, SubsonicParameterID, SubsonicParameterPlayQueue } from '../model/subsonic-rest-params.js';
import { SubsonicBookmarks, SubsonicResponseBookmarks, SubsonicResponsePlayQueue } from '../model/subsonic-rest-data.js';

export class SubsonicBookmarkApi extends SubsonicApiBase {
	/**
	 *
	 * Since 1.9.0
	 * http://your-server/rest/createBookmark.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('createBookmark.view',
		{
			summary: 'Create Bookmarks',
			description: 'Creates or updates a bookmark (a position within a media file). Bookmarks are personal and not visible to other users.',
			tags: ['Bookmarks']
		})
	async createBookmark(@SubsonicParams() query: SubsonicParameterBookmark, { engine, orm, user }: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the media file to bookmark. If a bookmark already exists for this file it will be overwritten.
		 position 	Yes 		The position (in milliseconds) within the media file.
		 comment 	No 		A user-defined comment.
		 */
		const track = await orm.Track.findOneOrFailByID(query.id);
		await engine.bookmark.create(orm, track.id, user, query.position, query.comment);
	}

	/**
	 * Returns all bookmarks for this user. A bookmark is a position within a certain media file.
	 * Since 1.9.0
	 * http://your-server/rest/getBookmarks.view
	 * @return Returns a <subsonic-response> element with a nested <bookmarks> element on success.
	 */
	@SubsonicRoute('getBookmarks.view', () => SubsonicResponseBookmarks,
		{
			summary: 'Get Bookmarks',
			description: 'Returns all bookmarks for this user. A bookmark is a position within a certain media file.',
			tags: ['Bookmarks']
		})
	async getBookmarks(_query: unknown, { orm, user }: Context): Promise<SubsonicResponseBookmarks> {
		const bookmarklist = await orm.Bookmark.findFilter({ userIDs: [user.id] });
		const bookmarks: SubsonicBookmarks = {};
		bookmarks.bookmark = await this.prepareBookmarks(orm, bookmarklist, user);
		return { bookmarks };
	}

	/**
	 * Deletes the bookmark for a given file.
	 * Since 1.9.0
	 * http://your-server/rest/deleteBookmark.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('deleteBookmark.view', () => SubsonicResponseBookmarks,
		{ summary: 'Delete Bookmarks', description: 'Deletes the bookmark for a given media file.', tags: ['Bookmarks'] })
	async deleteBookmark(@SubsonicParams() query: SubsonicParameterID, { engine, orm, user }: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the media file for which to delete the bookmark. Other users' bookmarks are not affected.
		 */
		const id = await this.subsonicORM.resolveID(query.id);
		if (id) {
			await engine.bookmark.remove(orm, id, user.id);
		}
	}

	/**
	 * Returns the state of the play queue for this user (as set by savePlayQueue).
	 * This includes the tracks in the play queue, the currently playing track, and the position within this track.
	 * Typically used to allow a user to move between different clients/apps while retaining the same play queue (for instance when listening to an audio book).
	 * Since 1.12.0
	 * http://your-server/rest/getPlayQueue.view
	 * @return Returns a <subsonic-response> element with a nested <playQueue> element on success, or an empty <subsonic-response> if no play queue has been saved.
	 */
	@SubsonicRoute('getPlayQueue.view', () => SubsonicResponsePlayQueue,
		{ summary: 'Get Play Queue', description: 'Returns the state of the play queue for this user (as set by savePlayQueue).', tags: ['PlayQueue'] })
	async getPlayQueue(_query: unknown, { engine, orm, user }: Context): Promise<SubsonicResponsePlayQueue> {
		const playqueue = await engine.playQueue.get(orm, user);
		if (!playqueue) {
			return {} as any;
		}
		const entries = await playqueue.entries.getItems();
		const tracks = await Promise.all(entries.map(entry => entry.track.get()));
		const childs = await this.prepareTracks(orm, tracks.filter(t => !!t), user);
		return { playQueue: this.format.packPlayQueue(playqueue, user, childs) };
	}

	/**
	 * Saves the state of the play queue for this user. This includes the tracks in the play queue,
	 * the currently playing track, and the position within this track. Typically used to allow a user to move between different clients/apps
	 * while retaining the same play queue (for instance when listening to an audio book).
	 * Since 1.12.0
	 * http://your-server/rest/savePlayQueue.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('savePlayQueue.view',
		{ summary: 'Save Play Queue', description: 'Returns the state of the play queue for this user (as set by savePlayQueue).', tags: ['PlayQueue'] })
	async savePlayQueue(@SubsonicParams() query: SubsonicParameterPlayQueue, { engine, orm, user, client }: Context): Promise<void> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		ID of a song in the play queue. Use one id parameter for each song in the play queue.
		current 	No 		The ID of the current playing song.
		position 	No 		The position in milliseconds within the currently playing song.
		 */
		const mediaIDs: Array<string> = query.id ? (Array.isArray(query.id) ? query.id : [query.id]) : [];
		await engine.playQueue.set(orm, {
			mediaIDs,
			currentID: query.current,
			position: query.position
		}, user, client || 'unknown');
	}
}
