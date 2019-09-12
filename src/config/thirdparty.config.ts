/*
	Third Party Web Services
 */

import {JAMSERVE_VERSION} from '../version';

export interface ThirdpartyToolsConfig {
	acoustid: {
		apiKey: string;
		userAgent: string;
	};
	lastfm: {
		apiKey: string;
		userAgent: string;
	};
	musicbrainz: {
		userAgent: string;
	};
	acousticbrainz: {
		userAgent: string;
	};
	coverartarchive: {
		userAgent: string;
	};
	chartlyrics: {
		userAgent: string;
	};
	wikipedia: {
		userAgent: string;
	};
}

export const userAgent = `JamServe/${JAMSERVE_VERSION}`;

export const ThirdPartyConfig: ThirdpartyToolsConfig = {
	/*
		Acoustid
		https://acoustid.org/
		audio identification via fingerprinting
	 */
	acoustid: {apiKey: 'xuwbosoqd4', userAgent},
	/*
		LastFM
		https://www.last.fm/api
		music database
	 */
	lastfm: {apiKey: 'ead198fb293eefea29e8a5b8f0908e55', userAgent},
	/*
		MusicBrainz
		https://musicbrainz.org/
		open music encyclopedia
	 */
	musicbrainz: {userAgent: `${userAgent} ( jamserve@protonmail.com )`},
	/*
		AcousticBrainz
		https://acousticbrainz.org/
		crowd sourced acoustic information
 	*/
	acousticbrainz: {userAgent: `${userAgent} ( jamserve@protonmail.com )`},
	/*
		CoverArtArchive
		https://coverartarchive.org/
		cover art from Internet Archive (archive.org) via musicbrainz ids
 	*/
	coverartarchive: {userAgent: `${userAgent} ( jamserve@protonmail.com )`},
	/*
		Wikipedia
		https://en.wikipedia.org/api/rest_v1/#/
 	*/
	wikipedia: {userAgent: `${userAgent} ( jamserve@protonmail.com )`},
	/*
		Chart Lyrics
		http://www.chartlyrics.com/
		lyrics database
	 */
	chartlyrics: {userAgent}
};
