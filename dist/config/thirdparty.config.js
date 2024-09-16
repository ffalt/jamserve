import { JAMSERVE_VERSION } from '../version.js';
export const userAgent = `JamServe/${JAMSERVE_VERSION}`;
export const ThirdPartyConfig = {
    acoustid: { apiKey: 'bLwTKyNczi', userAgent },
    lastfm: { apiKey: 'ead198fb293eefea29e8a5b8f0908e55', userAgent },
    musicbrainz: { userAgent: `${userAgent} ( jamserve@protonmail.com )` },
    acousticbrainz: { userAgent: `${userAgent} ( jamserve@protonmail.com )` },
    coverartarchive: { userAgent: `${userAgent} ( jamserve@protonmail.com )` },
    wikipedia: { userAgent: `${userAgent} ( jamserve@protonmail.com )` },
    lyricsovh: { userAgent: `${userAgent} ( jamserve@protonmail.com )` },
    gpodder: { userAgent: `${userAgent} ( jamserve@protonmail.com )` },
};
//# sourceMappingURL=thirdparty.config.js.map