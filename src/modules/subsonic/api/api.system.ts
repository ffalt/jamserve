import { SubsonicParameterJukebox } from '../model/subsonic-rest-params.js';
import { SubsonicApiBase } from './api.base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicOKResponse, SubsonicResponseJukeboxStatus, SubsonicResponseLicense } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';

@SubsonicController()
export class SubsonicSystemApi extends SubsonicApiBase {
	/**
	 * Get details about the software license. Takes no extra parameters.
	 * Since 1.0.0
	 * http://your-server/rest/getLicense.view
	 * @return  Returns a <subsonic-response> element with a nested <license> element on success.
	 */
	@SubsonicRoute('/getLicense.view', () => SubsonicResponseLicense, {
		summary: 'Get License',
		description: 'Get details about the software license.',
		tags: ['System']
	})
	async getLicense(@SubsonicCtx() _ctx: Context): Promise<SubsonicResponseLicense> {
		return { license: { valid: true, email: 'dummy@email.nonexistingtld', licenseExpires: '0', trialExpires: '0' } };
	}

	/**
	 * Used to test connectivity with the server. Takes no extra parameters.
	 * Since 1.0.0
	 * http://your-server/rest/ping.view
	 */
	@SubsonicRoute('/ping.view', () => SubsonicOKResponse, {
		summary: 'Ping',
		description: 'Used to test connectivity with the server.',
		tags: ['System']
	})
	async ping(@SubsonicCtx() _ctx: Context): Promise<SubsonicOKResponse> {
		return {};
	}

	/**
	 * Controls the jukebox, i.e., playback directly on the server's audio hardware. Note: The user must be authorized to control the jukebox (see Settings > Users > user is allowed to play files in jukebox mode).
	 * Since 1.2.0
	 * http://your-server/rest/jukeboxControl.view
	 * @return Returns a <jukeboxStatus> element on success, unless the get action is used, in which case a nested <jukeboxPlaylist> element is returned.
	 */
	@SubsonicRoute('/jukeboxControl.view', () => SubsonicResponseJukeboxStatus, {
		summary: 'Jukebox Control',
		description: 'Controls the jukebox, i.e., playback directly on the server\'s audio hardware.',
		tags: ['System']
	})
	async jukeboxControl(@SubsonicParams() _query: SubsonicParameterJukebox,@SubsonicCtx()  _ctx: Context): Promise<SubsonicResponseJukeboxStatus> {
		/*
		 Parameter 	Required 	Default 	Comment
		 action 	Yes 		The operation to perform. Must be one of: get, status (since 1.7.0), set (since 1.7.0), start, stop, skip, add, clear, remove, shuffle, setGain
		 index 	No 		Used by skip and remove. Zero-based index of the song to skip to or remove.
		 offset 	No 		(Since 1.7.0) Used by skip. Start playing this many seconds into the track.
		 id 	No 		Used by add and set. ID of song to add to the jukebox playlist. Use multiple id parameters to add many songs in the same request. (set is similar to a clear followed by a add, but will not change the currently playing track.)
		 gain 	No 		Used by setGain to control the playback volume. A float value between 0.0 and 1.0.
		 */
		return { jukeboxStatus: { currentIndex: 0, playing: false, gain: 0 } };
	}
}
