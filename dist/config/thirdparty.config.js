"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ThirdPartyConfig = exports.userAgent = void 0;
const version_1 = require("../version");
exports.userAgent = `JamServe/${version_1.JAMSERVE_VERSION}`;
exports.ThirdPartyConfig = {
    acoustid: { apiKey: 'bLwTKyNczi', userAgent: exports.userAgent },
    lastfm: { apiKey: 'ead198fb293eefea29e8a5b8f0908e55', userAgent: exports.userAgent },
    musicbrainz: { userAgent: `${exports.userAgent} ( jamserve@protonmail.com )` },
    acousticbrainz: { userAgent: `${exports.userAgent} ( jamserve@protonmail.com )` },
    coverartarchive: { userAgent: `${exports.userAgent} ( jamserve@protonmail.com )` },
    wikipedia: { userAgent: `${exports.userAgent} ( jamserve@protonmail.com )` },
    lyricsovh: { userAgent: `${exports.userAgent} ( jamserve@protonmail.com )` },
};
//# sourceMappingURL=thirdparty.config.js.map