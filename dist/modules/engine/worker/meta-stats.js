import path from 'node:path';
import { AlbumType, FolderType, RootScanStrategy } from '../../../types/enums.js';
import { MetaStatBuilder } from '../../../utils/stats-builder.js';
import { extractAlbumName } from '../../../utils/album-name.js';
import { MUSICBRAINZ_VARIOUS_ARTISTS_ID, MUSICBRAINZ_VARIOUS_ARTISTS_NAME } from '../../../types/consts.js';
const typeByGenreNames = {
    'audiobook': AlbumType.audiobook,
    'audio theater': AlbumType.audiobook,
    'audio drama': AlbumType.audiobook,
    'audio series': AlbumType.audiobook,
    'soundtrack': AlbumType.soundtrack
};
const typeByMusicbrainzString = [
    { type: AlbumType.audiobook, names: ['audiobook', 'spokenword', 'audiodrama', 'audio drama', 'audio theater', 'audio series'] },
    { type: AlbumType.bootleg, names: ['bootleg'] },
    { type: AlbumType.compilation, names: ['compilation'] },
    { type: AlbumType.live, names: ['live'] },
    { type: AlbumType.soundtrack, names: ['soundtrack'] },
    { type: AlbumType.ep, names: ['ep'] },
    { type: AlbumType.single, names: ['single'] },
    { type: AlbumType.album, names: ['album'] }
];
export class MatchNodeMetaStats {
    static getGenreAlbumType(genre) {
        return typeByGenreNames[genre.toLowerCase()] ?? AlbumType.unknown;
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
        return AlbumType.unknown;
    }
    static getStrategyAlbumType(strategy, hasMultipleArtists) {
        switch (strategy) {
            case RootScanStrategy.auto: {
                return hasMultipleArtists ? AlbumType.compilation : AlbumType.album;
            }
            case RootScanStrategy.artistalbum: {
                return AlbumType.album;
            }
            case RootScanStrategy.compilation: {
                return AlbumType.compilation;
            }
            case RootScanStrategy.audiobook: {
                return AlbumType.audiobook;
            }
            default: {
                return AlbumType.unknown;
            }
        }
    }
    static async buildTrackSlugs(match, builder) {
        builder.statSlugValue('artist', match.artist);
        builder.statSlugValue('artistSort', match.artistSort);
        for (const genre of (match.genres ?? [])) {
            builder.statSlugValue('genre', genre);
        }
        builder.statSlugValue('series', match.series);
        builder.statSlugValue('album', match.album ? extractAlbumName(match.album) : undefined);
        builder.statNumber('year', match.year);
        builder.statTrackCount('totalTrackCount', match.trackTotal, match.disc);
        builder.statSlugValue('mbAlbumType', match.mbAlbumType);
        builder.statID('mbArtistID', match.artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME ? MUSICBRAINZ_VARIOUS_ARTISTS_ID : match.mbArtistID);
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
        builder.statSlugValue('album', folder.album ? extractAlbumName(folder.album) : undefined);
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
            if (child.folder.folderType !== FolderType.extras) {
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
            if (child.folder.folderType !== FolderType.extras) {
                MatchNodeMetaStats.buildSubFolderSlugs(child.folder, builder);
            }
        }
    }
    static getAlbumInfo(builder, strategy) {
        const artist = builder.mostUsed('artist', MUSICBRAINZ_VARIOUS_ARTISTS_NAME);
        const genre = builder.mostUsed('genre');
        const mbAlbumType = builder.mostUsed('mbAlbumType', '');
        const hasMultipleArtists = artist === MUSICBRAINZ_VARIOUS_ARTISTS_NAME;
        let albumType = AlbumType.unknown;
        if (genre) {
            albumType = MatchNodeMetaStats.getGenreAlbumType(genre);
        }
        if (mbAlbumType && albumType === AlbumType.unknown) {
            albumType = MatchNodeMetaStats.getMusicbrainzAlbumType(mbAlbumType);
        }
        if (hasMultipleArtists && albumType !== AlbumType.soundtrack) {
            albumType = AlbumType.compilation;
        }
        if (albumType === AlbumType.unknown) {
            albumType = MatchNodeMetaStats.getStrategyAlbumType(strategy, hasMultipleArtists);
        }
        if (albumType === AlbumType.audiobook) {
            const series = builder.mostUsed('series');
            if (series) {
                albumType = AlbumType.series;
            }
        }
        return { albumType, artist, hasMultipleArtists, mbAlbumType, genres: builder.asStringList('genre') };
    }
    static async buildMetaStat(node, strategy) {
        const builder = new MetaStatBuilder();
        await MatchNodeMetaStats.buildTracksSlugs(node, builder);
        const { subFolderTrackCount, subFolderCount } = MatchNodeMetaStats.recursiveCount(node);
        await MatchNodeMetaStats.buildSubFoldersSlugs(node, builder);
        const { albumType, artist, hasMultipleArtists, mbAlbumType, genres } = MatchNodeMetaStats.getAlbumInfo(builder, strategy);
        return {
            trackCount: node.nrOfTracks,
            folderCount: node.children.filter(c => c.folder.folderType !== FolderType.extras).length,
            subFolderTrackCount,
            subFolderCount,
            albumType,
            genres,
            artist,
            hasMultipleArtists,
            mbAlbumType,
            hasMultipleAlbums: builder.asList('album').length > 1,
            album: builder.mostUsed('album', extractAlbumName(path.basename(node.path))),
            artistSort: hasMultipleArtists ? undefined : builder.mostUsed('artistSort'),
            mbReleaseID: builder.mostUsed('mbReleaseID', ''),
            mbReleaseGroupID: builder.mostUsed('mbReleaseGroupID', ''),
            mbArtistID: builder.mostUsed('mbArtistID', ''),
            year: builder.mostUsedNumber('year')
        };
    }
}
//# sourceMappingURL=meta-stats.js.map