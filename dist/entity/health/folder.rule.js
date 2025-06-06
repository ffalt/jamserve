import path from 'path';
import { fileSuffix, replaceFolderSystemChars } from '../../utils/fs-utils.js';
import { AlbumTypesArtistMusic, FolderHealthID, FolderType, FolderTypesAlbum } from '../../types/enums.js';
import { getFolderDisplayArtwork } from '../folder/folder.service.js';
function isAlbumTopMostFolder(orm, folder, parents) {
    if (folder.folderType === FolderType.multialbum) {
        const parent = parents[parents.length - 1];
        if (parent && parent.folderType === FolderType.multialbum) {
            return false;
        }
    }
    return (FolderTypesAlbum.includes(folder.folderType));
}
async function validateFolderArtwork(orm, folder) {
    const artwork = await getFolderDisplayArtwork(orm, folder);
    if (artwork && (artwork.format === 'invalid')) {
        return { details: [{ reason: 'Broken or unsupported File Format' }] };
    }
    if (artwork && artwork.path) {
        let actual = fileSuffix(artwork.name);
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
        id: FolderHealthID.albumTagsExists,
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
                if ((await folder.genres.count()) === 0) {
                    missing.push('genre');
                }
                if (!folder.albumTrackCount) {
                    missing.push('album total track count');
                }
                if (folder.albumType !== undefined && AlbumTypesArtistMusic.includes(folder.albumType)) {
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
        id: FolderHealthID.albumMBIDExists,
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
        id: FolderHealthID.albumTracksComplete,
        name: 'Album folder seems to be incomplete',
        run: async (orm, folder) => {
            if ((folder.folderType === FolderType.album) && (folder.albumTrackCount)) {
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
        id: FolderHealthID.albumNameConform,
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
                return replaceFolderSystemChars(sanitizeName(s), '_').trim();
            }
            function getNiceAlbumFolderName() {
                const year = folder.year ? folder.year.toString() : '';
                const name = replaceFolderSystemChars(sanitizeName(folder.album || ''), '_');
                const s = (year.length > 0 ? `[${replaceFolderSystemChars(year, '_')}] ` : '') + name;
                return s.trim();
            }
            function slug(folderPath) {
                return path.basename(folderPath).trim().replace(/[_:!?/ ]/g, '').toLowerCase();
            }
            function niceSlug(nicename) {
                return nicename.replace(/[_:!?/ ]/g, '').toLowerCase();
            }
            function checkNiceName(nicename) {
                const nameSlug = slug(folder.path);
                const nicenameSlug = niceSlug(nicename);
                if (nameSlug.localeCompare(nicenameSlug) !== 0) {
                    return { details: [{ reason: 'not equal', actual: path.basename(folder.path), expected: nicename }] };
                }
                return;
            }
            if (isAlbumTopMostFolder(orm, folder, parents)) {
                const hasArtist = parents.find(p => p.folderType === FolderType.artist);
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
        id: FolderHealthID.albumImageExists,
        name: 'Album folder image is missing',
        run: async (orm, folder, parents) => {
            if (isAlbumTopMostFolder(orm, folder, parents)) {
                const artwork = await getFolderDisplayArtwork(orm, folder);
                if (!artwork) {
                    return {};
                }
            }
            return;
        }
    },
    {
        id: FolderHealthID.albumImageValid,
        name: 'Album folder image is invalid',
        run: async (orm, folder, parents) => {
            if (isAlbumTopMostFolder(orm, folder, parents)) {
                return validateFolderArtwork(orm, folder);
            }
            return;
        }
    },
    {
        id: FolderHealthID.albumImageQuality,
        name: 'Album folder image is of low quality',
        run: async (orm, folder, parents) => {
            if (isAlbumTopMostFolder(orm, folder, parents)) {
                const artwork = await getFolderDisplayArtwork(orm, folder);
                if (artwork && artwork.height && artwork.width && (artwork.height < 300 || artwork.width < 300)) {
                    return { details: [{ reason: 'Image is too small', actual: `${artwork.width} x ${artwork.height}`, expected: '>=300 x >=300' }] };
                }
            }
            return;
        }
    },
    {
        id: FolderHealthID.artistImageExists,
        name: 'Artist folder image is missing',
        run: async (orm, folder) => {
            if (folder.folderType === FolderType.artist) {
                const artwork = await getFolderDisplayArtwork(orm, folder);
                if (!artwork) {
                    return {};
                }
            }
            return;
        }
    },
    {
        id: FolderHealthID.artistImageValid,
        name: 'Artist folder image is invalid',
        run: async (orm, folder) => {
            if (folder.folderType === FolderType.artist) {
                return validateFolderArtwork(orm, folder);
            }
            return;
        }
    },
    {
        id: FolderHealthID.artistNameConform,
        name: 'Artist folder name is not conform',
        run: async (orm, folder) => {
            if (folder.folderType === FolderType.artist && folder.artist) {
                const nameSlug = path.basename(folder.path).trim().replace(/[_:!?/ ]/g, '').toLowerCase();
                const artistName = replaceFolderSystemChars(folder.artist, '_');
                const artistNameSlug = artistName.replace(/[_:!?/ ]/g, '').toLowerCase();
                if (nameSlug.localeCompare(artistNameSlug) !== 0) {
                    return { details: [{ reason: 'not equal', actual: path.basename(folder.path), expected: artistName }] };
                }
            }
            return;
        }
    }
];
export class FolderRulesChecker {
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
//# sourceMappingURL=folder.rule.js.map