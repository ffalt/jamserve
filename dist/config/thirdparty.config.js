import { JAMSERVE_VERSION } from '../version.js';
export const userAgent = `JamServe/${JAMSERVE_VERSION}`;
export const LRCLIB_APP_NAME = 'Jam';
export const contact = 'https://github.com/ffalt/jamserve';
export const ThirdPartyConfig = {
    acoustid: { apiKey: '', userAgent },
    lastfm: { apiKey: '', userAgent },
    musicbrainz: { userAgent: `${userAgent} ( ${contact} )` },
    acousticbrainz: { userAgent: `${userAgent} ( ${contact} )` },
    coverartarchive: { userAgent: `${userAgent} ( ${contact} )` },
    wikipedia: { userAgent: `${userAgent} ( ${contact} )` },
    lyricsovh: { userAgent: `${userAgent} ( ${contact} )` },
    gpodder: { userAgent: `${userAgent} ( ${contact} )` },
    lrclib: { apiKey: '', appId: '', userAgent: `${LRCLIB_APP_NAME} v${JAMSERVE_VERSION} (${contact})` },
    discogs: { apiToken: '', userAgent: `${userAgent} ( ${contact} )` }
};
//# sourceMappingURL=thirdparty.config.js.map