/*
	Third Party Web Services
 */

import { JAMSERVE_VERSION } from '../version.js';

export interface ThirdpartyToolsConfig {
	acoustid: { apiKey: string; userAgent: string };
	lastfm: { apiKey: string; userAgent: string };
	musicbrainz: { userAgent: string };
	acousticbrainz: { userAgent: string };
	coverartarchive: { userAgent: string };
	wikipedia: { userAgent: string };
	gpodder: { userAgent: string };
	lyricsovh: { userAgent: string };
	lrclib: { userAgent: string };
}

export const userAgent = `JamServe/${JAMSERVE_VERSION}`;
export const contact = 'https://github.com/ffalt/jamserve';

export const ThirdPartyConfig: ThirdpartyToolsConfig = {
	/*
		Acoustid
		https://acoustid.org/
		audio identification via fingerprinting
	 */
	acoustid: { apiKey: process.env.JAM_ACOUSTID_API_KEY ?? '', userAgent },
	/*
		LastFM
		https://www.last.fm/api
		music database
	 */
	lastfm: { apiKey: process.env.JAM_LASTFM_API_KEY ?? '', userAgent },
	/*
		MusicBrainz
		https://musicbrainz.org/
		open music encyclopedia
	 */
	musicbrainz: { userAgent: `${userAgent} ( ${contact} )` },
	/*
		AcousticBrainz
		https://acousticbrainz.org/
		crowd sourced acoustic information
 	*/
	acousticbrainz: { userAgent: `${userAgent} ( ${contact} )` },
	/*
		CoverArtArchive
		https://coverartarchive.org/
		cover art from Internet Archive (archive.org) via musicbrainz ids
 	*/
	coverartarchive: { userAgent: `${userAgent} ( ${contact} )` },
	/*
		Wikipedia
		https://en.wikipedia.org/api/rest_v1/#/
 	*/
	wikipedia: { userAgent: `${userAgent} ( ${contact} )` },
	/*
		lyricsovh
		https://lyrics.ovh/
 	*/
	lyricsovh: { userAgent: `${userAgent} ( ${contact} )` },
	/*
		gPodder
		https://gpodder.net/
 	*/
	gpodder: { userAgent: `${userAgent} ( ${contact} )` },
	/*
		Lrclib
		https://lrclib.net/
    */
	lrclib: { userAgent: `${userAgent} ( ${contact} )` }
};
