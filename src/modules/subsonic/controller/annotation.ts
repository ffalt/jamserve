import { SubsonicRoute } from '../decorators/subsonic-route.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParameters } from '../decorators/subsonic-parameters.js';
import { SubsonicParameterRate, SubsonicParameterScrobble, SubsonicParameterState } from '../model/subsonic-rest-parameters.js';
import { SubsonicOKResponse } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/subsonic-controller.js';
import { SubsonicContext } from '../decorators/subsonic-context.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';

@SubsonicController()
export class SubsonicAnnotationApi {
	/**
	 * Attaches a star to a song, album or artist.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/star', () => SubsonicOKResponse, {
		summary: 'Star',
		description: 'Attaches a star to a song, album or artist.',
		tags: ['Annotation']
	})
	async star(@SubsonicParameters() query: SubsonicParameterState, @SubsonicContext() { engine, orm, user }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	No 		The ID of the file (song) or folder (album/artist) to star. Multiple parameters allowed.
		 albumId 	No 		The ID of an album to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 artistId 	No 		The ID of an artist to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 */
		const ids = await SubsonicHelper.collectStateChangeIds(query);
		for (const id of ids) {
			await engine.state.fav(orm, id, false, user);
		}
		return {};
	}

	/**
	 * Removes the star from a song, album or artist.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/unstar', () => SubsonicOKResponse, { summary: 'Unstar', description: 'Removes the star from a song, album or artist.', tags: ['Annotation'] })
	async unstar(@SubsonicParameters() query: SubsonicParameterState, @SubsonicContext() { engine, orm, user }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	No 		The ID of the file (song) or folder (album/artist) to unstar. Multiple parameters allowed.
		 albumId 	No 		The ID of an album to unstar. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 artistId 	No 		The ID of an artist to unstar. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 */
		const ids = await SubsonicHelper.collectStateChangeIds(query);
		for (const id of ids) {
			await engine.state.fav(orm, id, true, user);
		}
		return {};
	}

	/**
	 * Sets the rating for a music file.
	 * Since 1.6.0
	 */
	@SubsonicRoute('/setRating', () => SubsonicOKResponse, { summary: 'Rate', description: 'Sets the rating for a music file.', tags: ['Annotation'] })
	async setRating(@SubsonicParameters() query: SubsonicParameterRate, @SubsonicContext() { engine, orm, user }: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file (song) or folder (album/artist) to rate.
		 rating 	Yes 		The rating between 1 and 5 (inclusive), or 0 to remove the rating.
		 */
		if ((query.rating < 0) || (query.rating > 5)) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_INVALID));
		}
		await engine.state.rate(orm, query.id, query.rating, user);
		return {};
	}

	/**
	 * Registers the local playback of one or more media files. Typically used when playing media that is cached on the client. This operation includes the following:
	 * "Scrobbles" the media files on last.fm if the user has configured his/her last.fm credentials on the Subsonic server (Settings > Personal).
	 * Updates the play count and last played timestamp for the media files. (Since 1.11.0)
	 * Makes the media files appear in the "Now playing" page in the web app, and appear in the list of songs returned by getNowPlaying (Since 1.11.0)
	 * Since 1.8.0 you may specify multiple id (and optionally time) parameters to scrobble multiple files.
	 * Since 1.5.0
	 */
	@SubsonicRoute('/scrobble', () => SubsonicOKResponse, { summary: 'Scrobble', description: 'Registers the local playback of one or more media files.', tags: ['Annotation'] })
	async scrobble(@SubsonicParameters() _query: SubsonicParameterScrobble, @SubsonicContext() _context: Context): Promise<SubsonicOKResponse> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file to scrobble.
		 time 	No 		(Since 1.8.0) The time (in milliseconds since 1 Jan 1970) at which the song was listened to.
		 submission 	No 	True 	Whether this is a "submission" or a "now playing" notification.
		 */
		return {};
	}
}
