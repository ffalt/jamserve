"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackRulesChecker = void 0;
const jamp3_1 = require("jamp3");
const path_1 = __importDefault(require("path"));
const audio_module_1 = require("../../modules/audio/audio.module");
const flac_1 = require("../../modules/audio/tools/flac");
const logger_1 = require("../../utils/logger");
const enums_1 = require("../../types/enums");
const log = logger_1.logger('TrackHealth');
const analyzeErrors = {
    xing: [
        'XING: Wrong number of data bytes declared in VBRI Header',
        'XING: Wrong number of frames declared in VBRI Header',
        'XING: Wrong number of data bytes declared in Info Header',
        'XING: Wrong number of frames declared in Info Header',
        'XING: Wrong number of data bytes declared in Xing Header',
        'XING: Wrong number of frames declared in Xing Header'
    ],
    xingMissing: [
        'XING: VBR detected, but no VBR head frame found'
    ],
    mpeg: [
        'MPEG: Unknown data found between ID3v2 and audio',
        'MPEG: Unknown data found before audio'
    ]
};
const fixable = analyzeErrors.xingMissing.concat(analyzeErrors.xing).concat(analyzeErrors.mpeg);
const GARBAGE_FRAMES_IDS = [
    'PRIV',
    'COMM',
    'POPM'
];
function hasID3v2Tag(track) {
    var _a;
    return !!((_a = track.tag) === null || _a === void 0 ? void 0 : _a.format) && audio_module_1.ID3TrackTagRawFormatTypes.includes(track.tag.format);
}
function isMP3(track) {
    return !!track.tag && track.tag.mediaFormat === enums_1.AudioFormatType.mp3;
}
function isFlac(track) {
    return !!track.tag && track.tag.mediaFormat === enums_1.AudioFormatType.flac;
}
const trackRules = [
    {
        id: enums_1.TrackHealthID.tagValuesExists,
        name: 'Tag Values missing',
        all: true,
        run: async (track) => {
            var _a, _b, _c, _d, _e, _f, _g;
            const missing = [];
            if (!((_a = track.tag) === null || _a === void 0 ? void 0 : _a.album)) {
                missing.push('album');
            }
            if (!((_b = track.tag) === null || _b === void 0 ? void 0 : _b.artist)) {
                missing.push('artist');
            }
            if (!((_c = track.tag) === null || _c === void 0 ? void 0 : _c.albumArtist)) {
                missing.push('album artist');
            }
            if (!((_d = track.tag) === null || _d === void 0 ? void 0 : _d.genres) || track.tag.genres.length === 0) {
                missing.push('genre');
            }
            if (!((_e = track.tag) === null || _e === void 0 ? void 0 : _e.trackNr)) {
                missing.push('track nr');
            }
            if (track.folder.albumType !== undefined && !track.series && !((_f = track.tag) === null || _f === void 0 ? void 0 : _f.trackTotal)) {
                missing.push('total track count');
            }
            if (track.folder.albumType !== undefined && enums_1.AlbumTypesArtistMusic.includes(track.folder.albumType) && !((_g = track.tag) === null || _g === void 0 ? void 0 : _g.year)) {
                missing.push('year');
            }
            if (missing.length > 0) {
                return { details: missing.map(m => ({ reason: m })) };
            }
        }
    },
    {
        id: enums_1.TrackHealthID.id3v2NoId3v1,
        name: 'ID3v2 is available, ID3v1 is redundant',
        mp3: true,
        run: async (track, tagCache) => {
            if (hasID3v2Tag(track) && tagCache.id3v1) {
                return {};
            }
        }
    },
    {
        id: enums_1.TrackHealthID.id3v2Exists,
        name: 'ID3v2 Tag is missing',
        mp3: true,
        run: async (track) => {
            if (!hasID3v2Tag(track)) {
                return {};
            }
        }
    },
    {
        id: enums_1.TrackHealthID.id3v2Valid,
        name: 'ID3v2 is invalid',
        mp3: true,
        run: async (track, tagCache) => {
            if (tagCache.mp3Warnings && tagCache.mp3Warnings.id3v2 && tagCache.mp3Warnings.id3v2.length > 0) {
                return {
                    details: tagCache.mp3Warnings.id3v2.map(m => {
                        return { reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString() };
                    })
                };
            }
        }
    },
    {
        id: enums_1.TrackHealthID.id3v2Garbage,
        name: 'ID3v2 has garbage frames',
        mp3: true,
        run: async (track, tagCache) => {
            if (tagCache.id3v2) {
                const frames = tagCache.id3v2.frames.filter(frame => GARBAGE_FRAMES_IDS.includes(frame.id));
                if (frames.length > 0) {
                    const ids = [];
                    frames.forEach(frame => {
                        if (!ids.includes(frame.id)) {
                            ids.push(frame.id);
                        }
                    });
                    return {
                        details: ids.map(m => {
                            return { reason: m };
                        })
                    };
                }
            }
        }
    },
    {
        id: enums_1.TrackHealthID.mp3Garbage,
        name: 'MP3 has unaccounted data',
        mp3: true,
        run: async (track, tagCache) => {
            if (tagCache.mp3Warnings && tagCache.mp3Warnings.mpeg) {
                const warnings = tagCache.mp3Warnings.mpeg.filter(m => analyzeErrors.mpeg.includes(m.msg));
                if (warnings.length > 0) {
                    return {
                        details: warnings.map(m => {
                            return { reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString() };
                        })
                    };
                }
            }
        }
    },
    {
        id: enums_1.TrackHealthID.mp3HeaderExists,
        name: 'VBR Header is missing',
        mp3: true,
        run: async (track, tagCache) => {
            if (tagCache.mp3Warnings && tagCache.mp3Warnings.xing) {
                const warning = tagCache.mp3Warnings.xing.find(m => {
                    return analyzeErrors.xingMissing.includes(m.msg);
                });
                if (warning) {
                    return {};
                }
            }
        }
    },
    {
        id: enums_1.TrackHealthID.mp3HeaderValid,
        name: 'VBR Header is invalid',
        mp3: true,
        run: async (track, tagCache) => {
            if (tagCache.mp3Warnings && tagCache.mp3Warnings.xing) {
                const warnings = tagCache.mp3Warnings.xing.filter(m => analyzeErrors.xing.includes(m.msg));
                if (warnings.length > 0) {
                    return {
                        details: warnings.map(m => {
                            return { reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString() };
                        })
                    };
                }
            }
        }
    },
    {
        id: enums_1.TrackHealthID.mp3MediaValid,
        name: 'MP3 Media is invalid',
        mp3: true,
        run: async (track, tagCache) => {
            if (tagCache.mp3Warnings && tagCache.mp3Warnings.mpeg) {
                const mp3Warnings = tagCache.mp3Warnings.mpeg.filter(m => !fixable.includes(m.msg));
                if (mp3Warnings.length > 0) {
                    return {
                        details: mp3Warnings.map(m => {
                            return { reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString() };
                        })
                    };
                }
            }
        }
    },
    {
        id: enums_1.TrackHealthID.flacMediaValid,
        name: 'Flac Media is invalid',
        mp3: true,
        run: async (track, tagCache) => {
            if (tagCache.flacWarnings) {
                return { details: [{ reason: tagCache.flacWarnings }] };
            }
        }
    }
];
class TrackRulesChecker {
    constructor(audiomodule) {
        this.audiomodule = audiomodule;
    }
    async run(track, checkMedia) {
        const result = [];
        const mediaCache = {};
        const filename = path_1.default.join(track.path, track.fileName);
        log.debug('Analyzing track', filename);
        if (checkMedia) {
            if (isMP3(track)) {
                log.debug('Check MPEG', filename);
                const ana = await this.audiomodule.mp3.analyze(filename);
                mediaCache.id3v1 = ana.tags.id3v1;
                mediaCache.id3v2 = ana.tags.id3v2;
                mediaCache.mp3Warnings = {
                    xing: ana.warnings.filter(w => w.msg.startsWith('XING:')),
                    mpeg: ana.warnings.filter(w => w.msg.startsWith('MPEG:')),
                    id3v1: ana.warnings.filter(w => w.msg.startsWith('ID3V1:')),
                    id3v2: ana.warnings.filter(w => w.msg.startsWith('ID3V2:'))
                };
            }
            else {
                log.debug('Check Media with flac', filename);
                mediaCache.flacWarnings = await flac_1.flac_test(filename);
            }
        }
        else {
            if (isMP3(track)) {
                const id3v2 = new jamp3_1.ID3v2();
                mediaCache.id3v2 = await id3v2.read(filename);
                if (mediaCache.id3v2) {
                    mediaCache.mp3Warnings = {
                        xing: [],
                        mpeg: [],
                        id3v1: [],
                        id3v2: jamp3_1.ID3v2.check(mediaCache.id3v2)
                    };
                }
            }
        }
        const mp3 = isMP3(track);
        const flac = isFlac(track);
        for (const rule of trackRules) {
            if (rule.all || (rule.mp3 && mp3) || (rule.flac && flac)) {
                const match = await rule.run(track, mediaCache);
                if (match) {
                    result.push({
                        id: rule.id,
                        name: rule.name,
                        details: match.details
                    });
                }
            }
        }
        return result;
    }
}
exports.TrackRulesChecker = TrackRulesChecker;
//# sourceMappingURL=track.rule.js.map