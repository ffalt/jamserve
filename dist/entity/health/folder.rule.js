"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderRulesChecker = void 0;
const path_1 = __importDefault(require("path"));
const fs_utils_1 = require("../../utils/fs-utils");
const enums_1 = require("../../types/enums");
const folder_service_1 = require("../folder/folder.service");
function isAlbumTopMostFolder(orm, folder, parents) {
    if (folder.folderType === enums_1.FolderType.multialbum) {
        const parent = parents[parents.length - 1];
        if (parent && parent.folderType === enums_1.FolderType.multialbum) {
            return false;
        }
    }
    return (enums_1.FolderTypesAlbum.includes(folder.folderType));
}
async function validateFolderArtwork(orm, folder) {
    const artwork = await folder_service_1.getFolderDisplayArtwork(orm, folder);
    if (artwork && (artwork.format === 'invalid')) {
        return { details: [{ reason: 'Broken or unsupported File Format' }] };
    }
    if (artwork && artwork.path) {
        let actual = fs_utils_1.fileSuffix(artwork.name);
        if (actual === 'jpg') {
            actual = 'jpeg';
        }
        const expected = artwork.format;
        if (actual !== expected) {
            return { details: [{ reason: 'Wrong File Extension', actual, expected }] };
        }
    }
    return;
}
const folderRules = [
    {
        id: enums_1.FolderHealthID.albumTagsExists,
        name: 'Album folder values are missing',
        run: async (orm, folder, parents) => {
            if (isAlbumTopMostFolder(orm, folder, parents)) {
                const missing = [];
                if (!folder.album) {
                    missing.push('album');
                }
                if (!folder.artist) {
                    missing.push('artist');
                }
                if (await folder.genres.count() === 0) {
                    missing.push('genre');
                }
                if (!folder.albumTrackCount) {
                    missing.push('album total track count');
                }
                if (folder.albumType !== undefined && enums_1.AlbumTypesArtistMusic.includes(folder.albumType)) {
                    if (!folder.year) {
                        missing.push('year');
                    }
                }
                if (missing.length > 0) {
                    return {
                        details: missing.map(m => {
                            return { reason: 'value empty', expected: m };
                        })
                    };
                }
            }
            return;
        }
    },
    {
        id: enums_1.FolderHealthID.albumMBIDExists,
        name: 'Album folder musicbrainz id are missing',
        run: async (orm, folder, parents) => {
            if (isAlbumTopMostFolder(orm, folder, parents)) {
                const missing = [];
                if (!folder.mbReleaseID) {
                    missing.push('musicbrainz album id');
                }
                else {
                    if (!folder.mbAlbumType) {
                        missing.push('musicbrainz album type');
                    }
                }
                if (missing.length > 0) {
                    return {
                        details: missing.map(m => {
                            return { reason: 'value empty', expected: m };
                        })
                    };
                }
            }
            return;
        }
    },
    {
        id: enums_1.FolderHealthID.albumTracksComplete,
        name: 'Album folder seems to be incomplete',
        run: async (orm, folder) => {
            if ((folder.folderType === enums_1.FolderType.album) && (folder.albumTrackCount)) {
                const trackCount = await orm.Track.countFilter({ childOfID: folder.id });
                if (trackCount !== folder.albumTrackCount) {
                    return {
                        details: [
                            { reason: 'not equal', expected: folder.albumTrackCount.toString(), actual: trackCount.toString() }
                        ]
                    };
                }
            }
            return;
        }
    },
    {
        id: enums_1.FolderHealthID.albumNameConform,
        name: 'Album folder name is not conform',
        run: async (orm, folder, parents) => {
            function sanitizeName(s) {
                return s
                    .replace(/[!?]/g, '_')
                    .replace(/< ?>/g, ' - ')
                    .replace(/[/]/g, '-')
                    .replace(/\.\.\./g, '…')
                    .replace(/ {2}/g, ' ')
                    .trim();
            }
            function getNiceOtherFolderName(s) {
                return fs_utils_1.replaceFolderSystemChars(sanitizeName(s), '_').trim();
            }
            function getNiceAlbumFolderName() {
                const year = folder.year ? folder.year.toString() : '';
                const name = fs_utils_1.replaceFolderSystemChars(sanitizeName(folder.album || ''), '_');
                const s = (year.length > 0 ? `[${fs_utils_1.replaceFolderSystemChars(year, '_')}] ` : '') + name;
                return s.trim();
            }
            function slug(folderPath) {
                return path_1.default.basename(folderPath).trim().replace(/[_:!?/ ]/g, '').toLowerCase();
            }
            function niceSlug(nicename) {
                return nicename.replace(/[_:!?/ ]/g, '').toLowerCase();
            }
            function checkNiceName(nicename) {
                const nameSlug = slug(folder.path);
                const nicenameSlug = niceSlug(nicename);
                if (nameSlug.localeCompare(nicenameSlug) !== 0) {
                    return { details: [{ reason: 'not equal', actual: path_1.default.basename(folder.path), expected: nicename }] };
                }
                return;
            }
            if (isAlbumTopMostFolder(orm, folder, parents)) {
                const hasArtist = parents.find(p => p.folderType === enums_1.FolderType.artist);
                if (hasArtist) {
                    if ((folder.album) && (folder.year) && (folder.year > 0)) {
                        return checkNiceName(getNiceAlbumFolderName());
                    }
                }
                if ((folder.album)) {
                    return checkNiceName(getNiceOtherFolderName(folder.album));
                }
            }
            return;
        }
    },
    {
        id: enums_1.FolderHealthID.albumImageExists,
        name: 'Album folder image is missing',
        run: async (orm, folder, parents) => {
            if (isAlbumTopMostFolder(orm, folder, parents)) {
                const artwork = await folder_service_1.getFolderDisplayArtwork(orm, folder);
                if (!artwork) {
                    return {};
                }
            }
            return;
        }
    },
    {
        id: enums_1.FolderHealthID.albumImageValid,
        name: 'Album folder image is invalid',
        run: async (orm, folder, parents) => {
            if (isAlbumTopMostFolder(orm, folder, parents)) {
                return validateFolderArtwork(orm, folder);
            }
            return;
        }
    },
    {
        id: enums_1.FolderHealthID.albumImageQuality,
        name: 'Album folder image is of low quality',
        run: async (orm, folder, parents) => {
            if (isAlbumTopMostFolder(orm, folder, parents)) {
                const artwork = await folder_service_1.getFolderDisplayArtwork(orm, folder);
                if (artwork && artwork.height && artwork.width && (artwork.height < 300 || artwork.width < 300)) {
                    return { details: [{ reason: 'Image is too small', actual: `${artwork.width} x ${artwork.height}`, expected: '>=300 x >=300' }] };
                }
            }
            return;
        }
    },
    {
        id: enums_1.FolderHealthID.artistImageExists,
        name: 'Artist folder image is missing',
        run: async (orm, folder) => {
            if (folder.folderType === enums_1.FolderType.artist) {
                const artwork = await folder_service_1.getFolderDisplayArtwork(orm, folder);
                if (!artwork) {
                    return {};
                }
            }
            return;
        }
    },
    {
        id: enums_1.FolderHealthID.artistImageValid,
        name: 'Artist folder image is invalid',
        run: async (orm, folder) => {
            if (folder.folderType === enums_1.FolderType.artist) {
                return validateFolderArtwork(orm, folder);
            }
            return;
        }
    },
    {
        id: enums_1.FolderHealthID.artistNameConform,
        name: 'Artist folder name is not conform',
        run: async (orm, folder) => {
            if (folder.folderType === enums_1.FolderType.artist && folder.artist) {
                const nameSlug = path_1.default.basename(folder.path).trim().replace(/[_:!?/ ]/g, '').toLowerCase();
                const artistName = fs_utils_1.replaceFolderSystemChars(folder.artist, '_');
                const artistNameSlug = artistName.replace(/[_:!?/ ]/g, '').toLowerCase();
                if (nameSlug.localeCompare(artistNameSlug) !== 0) {
                    return { details: [{ reason: 'not equal', actual: path_1.default.basename(folder.path), expected: artistName }] };
                }
            }
            return;
        }
    }
];
class FolderRulesChecker {
    async run(orm, folder, parents) {
        const result = [];
        for (const rule of folderRules) {
            const match = await rule.run(orm, folder, parents);
            if (match) {
                result.push({
                    id: rule.id,
                    name: rule.name,
                    details: match.details
                });
            }
        }
        return result;
    }
}
exports.FolderRulesChecker = FolderRulesChecker;
//# sourceMappingURL=folder.rule.js.map