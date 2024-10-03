import { SubsonicApiBase, SubsonicFormatter } from './api.base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterRate, SubsonicParameterScrobble, SubsonicParameterState } from '../model/subsonic-rest-params.js';

export class SubsonicAnnotationApi extends SubsonicApiBase {
	/**
	 * Attaches a star to a song, album or artist.
	 * Since 1.8.0
	 * http://your-server/rest/star.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('star.view')
	async star(@SubsonicParams() query: SubsonicParameterState, { engine, orm, user }: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	No 		The ID of the file (song) or folder (album/artist) to star. Multiple parameters allowed.
		 albumId 	No 		The ID of an album to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 artistId 	No 		The ID of an artist to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 */
		const ids = this.collectStateChangeIds(query);
		for (const id of ids) {
			await engine.state.fav(orm, id, false, user);
		}
	}

	/**
	 * Removes the star from a song, album or artist.
	 * Since 1.8.0
	 * http://your-server/rest/unstar.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('unstar.view')
	async unstar(@SubsonicParams() query: SubsonicParameterState, { engine, orm, user }: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	No 		The ID of the file (song) or folder (album/artist) to unstar. Multiple parameters allowed.
		 albumId 	No 		The ID of an album to unstar. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 artistId 	No 		The ID of an artist to unstar. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 */
		const ids = this.collectStateChangeIds(query);
		for (const id of ids) {
			await engine.state.fav(orm, id, true, user);
		}
	}

	/**
	 * Sets the rating for a music file.
	 * Since 1.6.0
	 * http://your-server/rest/setRating.view
	 * @return Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('setRating.view')
	async setRating(@SubsonicParams() query: SubsonicParameterRate, { engine, orm, user }: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file (song) or folder (album/artist) to rate.
		 rating 	Yes 		The rating between 1 and 5 (inclusive), or 0 to remove the rating.
		 */
		if ((query.rating < 0) || (query.rating > 5)) {
			return Promise.reject({ fail: SubsonicFormatter.FAIL.PARAMETER });
		}
		await engine.state.rate(orm, query.id, query.rating, user);
	}

	/**
	 * Registers the local playback of one or more media files. Typically used when playing media that is cached on the client. This operation includes the following:
	 * "Scrobbles" the media files on last.fm if the user has configured his/her last.fm credentials on the Subsonic server (Settings > Personal).
	 * Updates the play count and last played timestamp for the media files. (Since 1.11.0)
	 * Makes the media files appear in the "Now playing" page in the web app, and appear in the list of songs returned by getNowPlaying (Since 1.11.0)
	 * Since 1.8.0 you may specify multiple id (and optionally time) parameters to scrobble multiple files.
	 * Since 1.5.0
	 * http://your-server/rest/scrobble.view
	 * @return  Returns an empty <subsonic-response> element on success.
	 */
	@SubsonicRoute('scrobble.view')
	async scrobble(@SubsonicParams() _query: SubsonicParameterScrobble, _ctx: Context): Promise<void> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file to scrobble.
		 time 	No 		(Since 1.8.0) The time (in milliseconds since 1 Jan 1970) at which the song was listened to.
		 submission 	No 	True 	Whether this is a "submission" or a "now playing" notification.
		 */
	}
}
