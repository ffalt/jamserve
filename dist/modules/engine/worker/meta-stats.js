"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MatchNodeMetaStats = void 0;
const path_1 = __importDefault(require("path"));
const enums_1 = require("../../../types/enums");
const stats_builder_1 = require("../../../utils/stats-builder");
const album_name_1 = require("../../../utils/album-name");
const consts_1 = require("../../../types/consts");
const typeByGenreNames = {
    audiobook: enums_1.AlbumType.audiobook,
    'audio theater': enums_1.AlbumType.audiobook,
    'audio drama': enums_1.AlbumType.audiobook,
    'audio series': enums_1.AlbumType.audiobook,
    soundtrack: enums_1.AlbumType.soundtrack
};
const typeByMusicbrainzString = [
    { type: enums_1.AlbumType.audiobook, names: ['audiobook', 'spokenword', 'audiodrama', 'audio drama', 'audio theater', 'audio series'] },
    { type: enums_1.AlbumType.bootleg, names: ['bootleg'] },
    { type: enums_1.AlbumType.compilation, names: ['compilation'] },
    { type: enums_1.AlbumType.live, names: ['live'] },
    { type: enums_1.AlbumType.soundtrack, names: ['soundtrack'] },
    { type: enums_1.AlbumType.ep, names: ['ep'] },
    { type: enums_1.AlbumType.single, names: ['single'] },
    { type: enums_1.AlbumType.album, names: ['album'] }
];
class MatchNodeMetaStats {
    static getGenreAlbumType(genre) {
        return typeByGenreNames[genre.toLowerCase()] || enums_1.AlbumType.unknown;
    }
    static getMusicbrainzAlbumType(mbAlbumType) {
        const t = mbAlbumType.toLowerCase();
        for (const type of typeByMusicbrainzString) {
            for (const name of type.names) {
                if (t.includes(name)) {
                    return type.type;
                }
            }
        }
        return enums_1.AlbumType.unknown;
    }
    static getStrategyAlbumType(strategy, hasMultipleArtists) {
        switch (strategy) {
            case enums_1.RootScanStrategy.auto:
                return hasMultipleArtists ? enums_1.AlbumType.compilation : enums_1.AlbumType.album;
            case enums_1.RootScanStrategy.artistalbum:
                return enums_1.AlbumType.album;
            case enums_1.RootScanStrategy.compilation:
                return enums_1.AlbumType.compilation;
            case enums_1.RootScanStrategy.audiobook:
                return enums_1.AlbumType.audiobook;
            default:
                return enums_1.AlbumType.unknown;
        }
    }
    static async buildTrackSlugs(match, builder) {
        builder.statSlugValue('artist', match.artist);
        builder.statSlugValue('artistSort', match.artistSort);
        for (const genre of (match.genres || [])) {
            builder.statSlugValue('genre', genre);
        }
        builder.statSlugValue('series', match.series);
        builder.statSlugValue('album', match.album ? album_name_1.extractAlbumName(match.album) : undefined);
        builder.statNumber('year', match.year);
        builder.statTrackCount('totalTrackCount', match.trackTotal, match.disc);
        builder.statSlugValue('mbAlbumType', match.mbAlbumType);
        builder.statID('mbArtistID', match.mbArtistID);
        builder.statID('mbReleaseID', match.mbReleaseID);
        builder.statID('mbReleaseGroupID', match.mbReleaseGroupID);
    }
    static async buildTracksSlugs(node, builder) {
        for (const track of node.tracks) {
            await MatchNodeMetaStats.buildTrackSlugs(await track.get(), builder);
        }
    }
    static buildSubFolderSlugs(folder, builder) {
        builder.statSlugValue('artist', folder.artist);
        builder.statSlugValue('artistSort', folder.artistSort);
        builder.statSlugValue('album', folder.album ? album_name_1.extractAlbumName(folder.album) : undefined);
        builder.statNumber('year', folder.year);
        builder.statSlugValue('mbAlbumType', folder.mbAlbumType);
        builder.statID('mbArtistID', folder.mbArtistID);
        builder.statID('mbReleaseID', folder.mbReleaseID);
        builder.statID('mbReleaseGroupID', folder.mbReleaseGroupID);
    }
    static recursiveCount(dir) {
        let subFolderTrackCount = 0;
        let subFolderCount = 0;
        for (const child of dir.children) {
            if (child.folder.folderType !== enums_1.FolderType.extras) {
                const result = MatchNodeMetaStats.recursiveCount(child);
                subFolderCount += result.subFolderCount + 1;
                subFolderTrackCount += result.subFolderTrackCount;
            }
            subFolderTrackCount += child.nrOfTracks;
        }
        return { subFolderTrackCount, subFolderCount };
    }
    static async buildSubFoldersSlugs(dir, builder) {
        for (const child of dir.children) {
            if (child.folder.folderType !== enums_1.FolderType.extras) {
                await MatchNodeMetaStats.buildSubFolderSlugs(child.folder, builder);
            }
        }
    }
    static getAlbumInfo(builder, strategy) {
        const artist = builder.mostUsed('artist', consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_NAME);
        const genre = builder.mostUsed('genre');
        const mbAlbumType = builder.mostUsed('mbAlbumType', '');
        const hasMultipleArtists = artist === consts_1.MUSICBRAINZ_VARIOUS_ARTISTS_NAME;
        let albumType = enums_1.AlbumType.unknown;
        if (genre) {
            albumType = MatchNodeMetaStats.getGenreAlbumType(genre);
        }
        if (mbAlbumType && albumType === enums_1.AlbumType.unknown) {
            albumType = MatchNodeMetaStats.getMusicbrainzAlbumType(mbAlbumType);
        }
        if (albumType === enums_1.AlbumType.unknown) {
            albumType = MatchNodeMetaStats.getStrategyAlbumType(strategy, hasMultipleArtists);
        }
        if (albumType === enums_1.AlbumType.audiobook) {
            const series = builder.mostUsed('series');
            if (series) {
                albumType = enums_1.AlbumType.series;
            }
        }
        return { albumType, artist, hasMultipleArtists, mbAlbumType, genres: builder.asStringList('genre') };
    }
    static async buildMetaStat(node, strategy) {
        const builder = new stats_builder_1.MetaStatBuilder();
        await MatchNodeMetaStats.buildTracksSlugs(node, builder);
        const { subFolderTrackCount, subFolderCount } = MatchNodeMetaStats.recursiveCount(node);
        await MatchNodeMetaStats.buildSubFoldersSlugs(node, builder);
        const { albumType, artist, hasMultipleArtists, mbAlbumType, genres } = MatchNodeMetaStats.getAlbumInfo(builder, strategy);
        return {
            trackCount: node.nrOfTracks,
            folderCount: node.children.filter(c => c.folder.folderType !== enums_1.FolderType.extras).length,
            subFolderTrackCount,
            subFolderCount,
            albumType,
            genres,
            artist,
            hasMultipleArtists,
            mbAlbumType,
            hasMultipleAlbums: builder.asList('album').length > 1,
            album: builder.mostUsed('album', album_name_1.extractAlbumName(path_1.default.basename(node.path))),
            artistSort: hasMultipleArtists ? undefined : builder.mostUsed('artistSort'),
            mbReleaseID: builder.mostUsed('mbReleaseID', ''),
            mbReleaseGroupID: builder.mostUsed('mbReleaseGroupID', ''),
            mbArtistID: builder.mostUsed('mbArtistID', ''),
            year: builder.mostUsedNumber('year')
        };
    }
}
exports.MatchNodeMetaStats = MatchNodeMetaStats;
//# sourceMappingURL=meta-stats.js.map