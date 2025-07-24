import { SubsonicParameterJukebox } from '../model/subsonic-rest-params.js';

import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicOKResponse, SubsonicOpenSubsonicResponse, SubsonicResponseJukeboxStatus, SubsonicResponseLicense, SubsonicResponseScanStatus } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
import { logger } from '../../../utils/logger.js';

const log = logger('SubsonicApi');

@SubsonicController()
export class SubsonicSystemApi {
	/**
	 * Get details about the software license. Takes no extra parameters.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/getLicense', () => SubsonicResponseLicense, {
		summary: 'Get License',
		description: 'Get details about the software license.',
		tags: ['System']
	})
	async getLicense(@SubsonicCtx() _ctx: Context): Promise<SubsonicResponseLicense> {
		return { license: { valid: true, email: 'example@@example.com' } };
	}

	/**
	 * Used to test connectivity with the server. Takes no extra parameters.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/ping', () => SubsonicOKResponse, {
		summary: 'Ping',
		description: 'Used to test connectivity with the server.',
		tags: ['System']
	})
	async ping(@SubsonicCtx() _ctx: Context): Promise<SubsonicOKResponse> {
		return {};
	}

	/**
	 * https://opensubsonic.netlify.app/docs/endpoints/getopensubsonicextensions/
	 */
	@SubsonicRoute('/getOpenSubsonicExtensions', () => SubsonicOpenSubsonicResponse, {
		summary: 'OpenSubsonic Extensions',
		description: 'List the OpenSubsonic extensions supported by this server.',
		tags: ['System']
	})
	async getOpenSubsonicExtensions(@SubsonicCtx() _ctx: Context): Promise<SubsonicOpenSubsonicResponse> {
		return {
			openSubsonicExtensions: [
				{ name: 'songLyrics', versions: [1] }, // https://opensubsonic.netlify.app/docs/extensions/songlyrics/
				{ name: 'formPost', versions: [1] } // https://opensubsonic.netlify.app/docs/extensions/formpost/
				// TODO: support timeOffset in stream https://opensubsonic.netlify.app/docs/extensions/transcodeoffset/, { name: 'transcodeOffset', versions: [1] }
			]
		};
	}

	/**
	 * Controls the jukebox, i.e., playback directly on the server's audio hardware. Note: The user must be authorized to control the jukebox (see Settings > Users > user is allowed to play files in jukebox mode).
	 * Since 1.2.0
	 */
	@SubsonicRoute('/jukeboxControl', () => SubsonicResponseJukeboxStatus, {
		summary: 'Jukebox Control',
		description: 'Controls the jukebox, i.e., playback directly on the server\'s audio hardware.',
		tags: ['System']
	})
	async jukeboxControl(@SubsonicParams() _query: SubsonicParameterJukebox, @SubsonicCtx() { user }: Context): Promise<SubsonicResponseJukeboxStatus> {
		if (!user.roleAdmin) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
		}
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

	/**
	 * Returns the current status for media library scanning. Takes no extra parameters.
	 * Since 1.15.0
	 */
	@SubsonicRoute('/getScanStatus', () => SubsonicResponseScanStatus, {
		summary: 'Scan Status',
		description: 'Returns the current status for media library scanning.',
		tags: ['System']
	})
	async getScanStatus(@SubsonicCtx() { engine }: Context): Promise<SubsonicResponseScanStatus> {
		return { scanStatus: { scanning: engine.io.scanning } };
	}

	/**
	 * Initiates a rescan of the media libraries. Takes no extra parameters.
	 * Since 1.15.0
	 */
	@SubsonicRoute('/startScan', () => SubsonicOKResponse, {
		summary: 'Start Status',
		description: 'Initiates a rescan of the media libraries. Takes no extra parameters.',
		tags: ['System']
	})
	async startScan(@SubsonicCtx() { engine, orm, user }: Context): Promise<SubsonicOKResponse> {
		if (!user.roleAdmin) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.UNAUTH));
		}
		if (!engine.io.scanning) {
			engine.io.root.refreshAllMeta(orm).catch(error => log.error(error)); // do not wait;
		}
		return {};
	}
}
