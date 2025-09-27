import { ID3v2 } from 'jamp3';
import path from 'node:path';
import { ID3TrackTagRawFormatTypes } from '../../modules/audio/audio.module.js';
import { flac_test } from '../../modules/audio/tools/flac.js';
import { logger } from '../../utils/logger.js';
import { AlbumTypesArtistMusic, AudioFormatType, TrackHealthID } from '../../types/enums.js';
const log = logger('TrackHealth');
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
const FIXABLE = new Set([...analyzeErrors.xingMissing, ...analyzeErrors.xing, ...analyzeErrors.mpeg]);
const GARBAGE_FRAMES_IDS = new Set([
    'PRIV',
    'COMM',
    'POPM'
]);
function hasID3v2Tag(_track, tag) {
    return !!tag?.format && ID3TrackTagRawFormatTypes.includes(tag.format);
}
function isMP3(_track, tag) {
    return !!tag && tag.mediaFormat === AudioFormatType.mp3;
}
function isFlac(_track, tag) {
    return !!tag && tag.mediaFormat === AudioFormatType.flac;
}
const trackRules = [
    {
        id: TrackHealthID.tagValuesExists,
        name: 'Tag Values missing',
        all: true,
        run: async (folder, track, tag) => {
            const missing = [];
            if (!tag?.album) {
                missing.push('album');
            }
            if (!tag?.artist) {
                missing.push('artist');
            }
            if (!tag?.albumArtist) {
                missing.push('album artist');
            }
            if (!tag?.genres || tag.genres.length === 0) {
                missing.push('genre');
            }
            if (!tag?.trackNr) {
                missing.push('track nr');
            }
            if (folder.albumType !== undefined && !track.series.id() && !tag?.trackTotal) {
                missing.push('total track count');
            }
            if (folder.albumType !== undefined && AlbumTypesArtistMusic.includes(folder.albumType) && !tag?.year) {
                missing.push('year');
            }
            if (missing.length > 0) {
                return { details: missing.map(m => ({ reason: m })) };
            }
            return;
        }
    },
    {
        id: TrackHealthID.id3v2Exists,
        name: 'ID3v2 Tag is missing',
        mp3: true,
        run: async (_folder, track, tag) => {
            if (!hasID3v2Tag(track, tag)) {
                return {};
            }
            return;
        }
    },
    {
        id: TrackHealthID.id3v2Valid,
        name: 'ID3v2 is invalid',
        mp3: true,
        run: async (_folder, _track, _tag, tagCache) => {
            if (tagCache.mp3Warnings?.id3v2 && tagCache.mp3Warnings.id3v2.length > 0) {
                return {
                    details: tagCache.mp3Warnings.id3v2.map(m => {
                        return { reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString() };
                    })
                };
            }
            return;
        }
    },
    {
        id: TrackHealthID.id3v2Garbage,
        name: 'ID3v2 has garbage frames',
        mp3: true,
        run: async (_folder, _track, _tag, tagCache) => {
            if (tagCache.id3v2) {
                const frames = tagCache.id3v2.frames.filter(frame => GARBAGE_FRAMES_IDS.has(frame.id));
                if (frames.length > 0) {
                    const ids = [];
                    for (const frame of frames) {
                        if (!ids.includes(frame.id)) {
                            ids.push(frame.id);
                        }
                    }
                    return {
                        details: ids.map(m => {
                            return { reason: m };
                        })
                    };
                }
            }
            return;
        }
    },
    {
        id: TrackHealthID.mp3Garbage,
        name: 'MP3 has unaccounted data',
        mp3: true,
        run: async (_folder, _track, _tag, tagCache) => {
            if (tagCache.mp3Warnings?.mpeg) {
                const warnings = tagCache.mp3Warnings.mpeg.filter(m => analyzeErrors.mpeg.includes(m.msg));
                if (warnings.length > 0) {
                    return {
                        details: warnings.map(m => {
                            return { reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString() };
                        })
                    };
                }
            }
            return;
        }
    },
    {
        id: TrackHealthID.mp3HeaderExists,
        name: 'VBR Header is missing',
        mp3: true,
        run: async (_folder, _track, _tag, tagCache) => {
            if (tagCache.mp3Warnings?.xing) {
                const warning = tagCache.mp3Warnings.xing.find(m => {
                    return analyzeErrors.xingMissing.includes(m.msg);
                });
                if (warning) {
                    return {};
                }
            }
            return;
        }
    },
    {
        id: TrackHealthID.mp3HeaderValid,
        name: 'VBR Header is invalid',
        mp3: true,
        run: async (_folder, _track, _tag, tagCache) => {
            if (tagCache.mp3Warnings?.xing) {
                const warnings = tagCache.mp3Warnings.xing.filter(m => analyzeErrors.xing.includes(m.msg));
                if (warnings.length > 0) {
                    return {
                        details: warnings.map(m => {
                            return { reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString() };
                        })
                    };
                }
            }
            return;
        }
    },
    {
        id: TrackHealthID.mp3MediaValid,
        name: 'MP3 Media is invalid',
        mp3: true,
        run: async (_folder, _track, _tag, tagCache) => {
            if (tagCache.mp3Warnings?.mpeg) {
                const mp3Warnings = tagCache.mp3Warnings.mpeg.filter(m => !FIXABLE.has(m.msg));
                if (mp3Warnings.length > 0) {
                    return {
                        details: mp3Warnings.map(m => {
                            return { reason: m.msg, expected: m.expected.toString(), actual: m.actual.toString() };
                        })
                    };
                }
            }
            return;
        }
    },
    {
        id: TrackHealthID.flacMediaValid,
        name: 'Flac Media is invalid',
        mp3: true,
        run: async (_folder, _track, _tag, tagCache) => {
            if (tagCache.flacWarnings) {
                return { details: [{ reason: tagCache.flacWarnings }] };
            }
            return;
        }
    }
];
export class TrackRulesChecker {
    constructor(audiomodule) {
        this.audiomodule = audiomodule;
    }
    async run(track, checkMedia) {
        const result = [];
        const mediaCache = {};
        const filename = path.join(track.path, track.fileName);
        log.debug('Analyzing track', filename);
        const tag = await track.tag.get();
        if (!tag) {
            return [];
        }
        if (checkMedia) {
            if (isMP3(track, tag)) {
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
            else if (isFlac(track, tag)) {
                log.debug('Check Media with flac', filename);
                mediaCache.flacWarnings = await flac_test(filename);
            }
        }
        else if (isMP3(track, tag)) {
            const id3v2 = new ID3v2();
            mediaCache.id3v2 = await id3v2.read(filename);
            if (mediaCache.id3v2) {
                mediaCache.mp3Warnings = {
                    xing: [],
                    mpeg: [],
                    id3v1: [],
                    id3v2: ID3v2.check(mediaCache.id3v2)
                };
            }
        }
        const folder = await track.folder.getOrFail();
        const mp3 = isMP3(track, tag);
        const flac = isFlac(track, tag);
        for (const rule of trackRules) {
            if (rule.all || (rule.mp3 && mp3) || (rule.flac && flac)) {
                const match = await rule.run(folder, track, tag, mediaCache);
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
//# sourceMappingURL=track.rule.js.map