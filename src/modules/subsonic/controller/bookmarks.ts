import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParameterBookmark, SubsonicParameterID, SubsonicParameterPlayQueue } from '../model/subsonic-rest-parameters.js';
import { SubsonicBookmarks, SubsonicID, SubsonicOKResponse, SubsonicResponseBookmarks, SubsonicResponsePlayQueue } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';
import { Track } from '../../../entity/track/track.js';

@SubsonicController()
export class SubsonicBookmarkApi {
	/**
	 *
	 * Since 1.9.0
	 */
	@SubsonicRoute('/createBookmark', () => SubsonicOKResponse,
		{
			summary: 'Create Bookmarks',
			description: 'Creates or updates a bookmark (a position within a media file). Bookmarks are personal and not visible to other users.',
			tags: ['Bookmarks']
		})
	async createBookmark(@SubsonicParameters() query: SubsonicParameterBookmark, @SubsonicContext() { engine, orm, user }: Context): Promise<void> {
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
	 */
	@SubsonicRoute('/getBookmarks', () => SubsonicResponseBookmarks,
		{
			summary: 'Get Bookmarks',
			description: 'Returns all bookmarks for this user. A bookmark is a position within a certain media file.',
			tags: ['Bookmarks']
		})
	async getBookmarks(@SubsonicContext() { orm, user }: Context): Promise<SubsonicResponseBookmarks> {
		const bookmarklist = await orm.Bookmark.findFilter({ userIDs: [user.id] });
		const bookmarks: SubsonicBookmarks = {
			bookmark: await SubsonicHelper.prepareBookmarks(orm, bookmarklist, user)
		};
		return { bookmarks };
	}

	/**
	 * Deletes the bookmark for a given file.
	 * Since 1.9.0
	 */
	@SubsonicRoute('/deleteBookmark', () => SubsonicOKResponse,
		{ summary: 'Delete Bookmarks', description: 'Deletes the bookmark for a given media file.', tags: ['Bookmarks'] })
	async deleteBookmark(@SubsonicParameters() query: SubsonicParameterID, @SubsonicContext() { engine, orm, user }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the media file for which to delete the bookmark. Other users' bookmarks are not affected.
		 */
		if (query.id) {
			await engine.bookmark.removeByDest(orm, query.id, user.id);
		}
		return {};
	}

	/**
	 * Returns the state of the play queue for this user (as set by savePlayQueue).
	 * This includes the tracks in the play queue, the currently playing track, and the position within this track.
	 * Typically used to allow a user to move between different clients/apps while retaining the same play queue (for instance when listening to an audio book).
	 * Since 1.12.0
	 */
	@SubsonicRoute('/getPlayQueue', () => SubsonicResponsePlayQueue,
		{ summary: 'Get Play Queue', description: 'Returns the state of the play queue for this user (as set by savePlayQueue).', tags: ['PlayQueue'] })
	async getPlayQueue(@SubsonicContext() { engine, orm, user }: Context): Promise<SubsonicResponsePlayQueue> {
		const playqueue = await engine.playQueue.get(orm, user);
		const entries = await playqueue.entries.getItems();
		const tracks: Array<Track> = [];
		for (const entry of entries) {
			const track = await entry.track.get();
			if (track) {
				tracks.push(track);
			}
		}
		const childs = await SubsonicHelper.prepareTracks(orm, tracks, user);
		return { playQueue: SubsonicFormatter.packPlayQueue(playqueue, user, childs) };
	}

	/**
	 * Saves the state of the play queue for this user. This includes the tracks in the play queue,
	 * the currently playing track, and the position within this track. Typically used to allow a user to move between different clients/apps
	 * while retaining the same play queue (for instance when listening to an audio book).
	 * Since 1.12.0
	 */
	@SubsonicRoute('/savePlayQueue', () => SubsonicOKResponse,
		{ summary: 'Save Play Queue', description: 'Returns the state of the play queue for this user (as set by savePlayQueue).', tags: ['PlayQueue'] })
	async savePlayQueue(@SubsonicParameters() query: SubsonicParameterPlayQueue, @SubsonicContext() { engine, orm, user, client }: Context): Promise<SubsonicOKResponse> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		ID of a song in the play queue. Use one id parameter for each song in the play queue.
		current 	No 		The ID of the current playing song.
		position 	No 		The position in milliseconds within the currently playing song.
		 */
		let mediaIDs: Array<SubsonicID> = [];
		if (query.id) {
			mediaIDs = Array.isArray(query.id) ? query.id : [query.id];
		}
		await engine.playQueue.set(orm, {
			mediaIDs,
			currentID: query.current,
			position: query.position
		}, user, client ?? 'unknown');
		return {};
	}
}
