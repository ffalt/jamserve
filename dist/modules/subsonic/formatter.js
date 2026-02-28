import { formatDateToUTC, minutesAgo } from '../../utils/date-time.js';
import path from 'node:path';
import { fileSuffix } from '../../utils/fs-utils.js';
import mimeTypes from 'mime-types';
import { AlbumType, AudioFormatType, PodcastStatus } from '../../types/enums.js';
import { JAMSERVE_VERSION } from '../../version.js';
export class SubsonicApiError extends Error {
    constructor(options) {
        super(options.message);
        this.code = options.code || 500;
        this.message = options.message;
        this.name = this.constructor.name;
    }
}
export class SubsonicFormatter {
    static packFail(code, txt) {
        const codeStrings = {
            0: 'A generic error.',
            10: 'Required parameter is missing.',
            20: 'Incompatible Subsonic REST protocol version. Client must upgrade.',
            30: 'Incompatible Subsonic REST protocol version. Server must upgrade.',
            40: 'Wrong username or password.',
            50: 'user is not authorized for the given operation.',
            70: 'The requested data was not found.'
        };
        return {
            'subsonic-response': {
                ...SubsonicFormatter.defaultProperties, status: 'failed', error: {
                    code,
                    message: txt ?? codeStrings[code]
                }
            }
        };
    }
    static packResponse(o) {
        return {
            'subsonic-response': { ...SubsonicFormatter.defaultProperties, ...o }
        };
    }
    static packOK() {
        return {
            'subsonic-response': SubsonicFormatter.defaultProperties
        };
    }
    static formatSubSonicDate(date) {
        if (date === undefined) {
            return;
        }
        return formatDateToUTC(date);
    }
    static async packRoot(root) {
        return { id: root.id, name: root.name };
    }
    static packUser(user) {
        return {
            username: user.name,
            email: user.email,
            maxBitRate: user.maxBitRate,
            avatarLastChanged: SubsonicFormatter.formatSubSonicDate(user.updatedAt),
            folder: undefined,
            scrobblingEnabled: false,
            adminRole: user.roleAdmin,
            settingsRole: user.roleAdmin,
            downloadRole: user.roleStream,
            uploadRole: user.roleUpload,
            playlistRole: true,
            coverArtRole: user.roleAdmin,
            commentRole: user.roleAdmin,
            podcastRole: user.rolePodcast,
            streamRole: user.roleStream,
            jukeboxRole: false,
            shareRole: false,
            videoConversionRole: false
        };
    }
    static async packFolderIndexArtist(entry, state) {
        return {
            id: entry.id,
            name: entry.name,
            starred: SubsonicFormatter.formatSubSonicDate(state?.faved),
            userRating: state?.rated && state.rated > 0 ? state.rated : undefined
        };
    }
    static async packFolderIndex(index, states) {
        if (!index) {
            return [];
        }
        const indexes = [];
        for (const group of index.groups) {
            const artist = [];
            for (const item of group.items) {
                artist.push(await SubsonicFormatter.packFolderIndexArtist(item, states[item.id]));
            }
            indexes.push({ name: group.name, artist });
        }
        return indexes;
    }
    static async packArtistIndex(index, states) {
        if (!index) {
            return [];
        }
        const indexes = [];
        for (const group of index.groups) {
            const artists = [];
            for (const artist of group.items) {
                if ((await artist.albums.count()) > 0) {
                    artists.push(await SubsonicFormatter.packArtist(artist, states[artist.id]));
                }
            }
            indexes.push({ name: group.name, artist: artists });
        }
        return indexes;
    }
    static async packDirectory(folder, state) {
        return {
            id: folder.id,
            parent: folder.parent.id(),
            name: path.basename(folder.path),
            starred: SubsonicFormatter.formatSubSonicDate(state?.faved)
        };
    }
    static async packFolderArtist(folder, state) {
        return {
            id: folder.id,
            name: (folder.title ?? folder.artist) ?? '',
            starred: SubsonicFormatter.formatSubSonicDate(state?.faved),
            userRating: state?.rated && state.rated > 0 ? state.rated : undefined
        };
    }
    static async packAlbum(album, state) {
        const artist = await album.artist.get();
        const genres = await album.genres.getItems();
        return {
            id: album.id,
            name: album.name,
            artist: artist?.name,
            artistId: artist?.id,
            coverArt: album.id,
            songCount: await album.tracks.count(),
            duration: SubsonicFormatter.packDuration(album.duration),
            year: album.year,
            genre: await SubsonicFormatter.packGenres(genres),
            created: SubsonicFormatter.formatSubSonicDate(album.createdAt) ?? '',
            starred: SubsonicFormatter.formatSubSonicDate(state?.faved),
            played: SubsonicFormatter.formatSubSonicDate(state?.lastPlayed),
            userRating: state?.rated && state.rated > 0 ? state.rated : undefined,
            musicBrainzId: album.mbReleaseID,
            genres: genres.length > 0 ? genres.map(g => ({ name: g.name })) : undefined,
            isCompilation: album.albumType === AlbumType.compilation
        };
    }
    static packDuration(duration) {
        if (!duration || duration <= 0 || Number.isNaN(duration)) {
            return -1;
        }
        return Math.trunc(duration / 1000);
    }
    static packBitrate(bitrate) {
        return bitrate === undefined ? undefined : Math.round(bitrate / 1000);
    }
    static async packGenreCollection(genres) {
        return genres && (await genres.count()) > 0 ? await SubsonicFormatter.packGenres(await genres.getItems()) : undefined;
    }
    static async packGenres(genres) {
        return genres && genres.length > 0 ? genres.map(g => g.name).join(' / ') : undefined;
    }
    static async packArtist(artist, state) {
        return {
            id: artist.id,
            name: artist.name,
            coverArt: artist.id,
            albumCount: await artist.albums.count(),
            userRating: state?.rated && state.rated > 0 ? state.rated : undefined,
            starred: SubsonicFormatter.formatSubSonicDate(state?.faved),
            musicBrainzId: artist.mbArtistID,
            sortName: artist.nameSort
        };
    }
    static packImageInfo(info, result) {
        for (const image of (info?.image ?? [])) {
            switch (image.size) {
                case 'small': {
                    result.smallImageUrl = image.url;
                    break;
                }
                case 'medium': {
                    result.mediumImageUrl = image.url;
                    break;
                }
                case 'large': {
                    result.largeImageUrl = image.url;
                    break;
                }
            }
        }
    }
    static packAlbumInfo(info) {
        const result = {
            notes: info.wiki ? info.wiki.content : undefined,
            musicBrainzId: info.mbid,
            lastFmUrl: info.url
        };
        SubsonicFormatter.packImageInfo(info, result);
        return result;
    }
    static packArtistInfo(info, similar) {
        const result = {
            biography: info.bio ? info.bio.content : undefined,
            musicBrainzId: info.mbid,
            lastFmUrl: info.url,
            similarArtist: similar
        };
        SubsonicFormatter.packImageInfo(info, result);
        return result;
    }
    static packArtistInfo2(info, similar) {
        const result = {
            biography: info.bio ? info.bio.content : undefined,
            musicBrainzId: info.mbid,
            lastFmUrl: info.url,
            similarArtist: similar ?? []
        };
        SubsonicFormatter.packImageInfo(info, result);
        return result;
    }
    static async packTrack(track, state) {
        const suffix = fileSuffix(track.name);
        const tag = await track.tag.get();
        const result = {
            id: track.id,
            parent: track.folder.id(),
            title: tag?.title ?? track.name,
            album: tag?.album,
            artist: tag?.artist,
            isDir: false,
            coverArt: track.id,
            genre: (tag?.genres ?? []).join(' / '),
            year: tag?.year,
            created: SubsonicFormatter.formatSubSonicDate(track.statCreated),
            duration: SubsonicFormatter.packDuration(tag?.mediaDuration),
            bitRate: SubsonicFormatter.packBitrate(tag?.mediaBitRate),
            track: tag?.trackNr,
            size: Math.trunc(track.fileSize / 10),
            suffix,
            contentType: mimeTypes.lookup(suffix) || 'audio/mpeg',
            isVideo: false,
            discNumber: tag?.disc,
            albumId: track.album.id(),
            artistId: track.artist.id(),
            type: 'music',
            userRating: state?.rated && state.rated > 0 ? state.rated : undefined,
            starred: SubsonicFormatter.formatSubSonicDate(state?.faved),
            playCount: state?.played && state.played > 0 ? state.played : 0,
            bitDepth: tag?.mediaBitDepth,
            samplingRate: tag?.mediaSampleRate,
            channelCount: tag?.mediaChannels,
            mediaType: 'song',
            played: SubsonicFormatter.formatSubSonicDate(state?.lastPlayed),
            sortName: tag?.titleSort,
            musicBrainzId: tag?.mbTrackID,
            genres: tag?.genres?.length ? tag.genres.map(g => ({ name: g })) : undefined
        };
        if (suffix !== AudioFormatType.mp3) {
            result.transcodedSuffix = AudioFormatType.mp3;
            result.transcodedContentType = mimeTypes.lookup(result.transcodedSuffix) || 'audio/mpeg';
        }
        return result;
    }
    static async packNowPlaying(nowPlaying, state) {
        let entry;
        if (nowPlaying.track) {
            entry = await SubsonicFormatter.packTrack(nowPlaying.track, state);
        }
        else if (nowPlaying.episode) {
            entry = await SubsonicFormatter.packPodcastEpisode(nowPlaying.episode, state);
        }
        else {
            entry = {
                id: '0',
                isDir: false,
                title: 'Unknown'
            };
        }
        const nowPlay = entry;
        nowPlay.username = nowPlaying.user.name;
        nowPlay.minutesAgo = minutesAgo(nowPlaying.time);
        nowPlay.playerId = 0;
        return nowPlay;
    }
    static async packFolder(folder, state) {
        return {
            id: folder.id,
            parent: folder.parent.id(),
            isDir: true,
            title: folder.title ?? path.basename(folder.path),
            album: folder.album,
            artist: folder.artist,
            year: folder.year,
            genre: await SubsonicFormatter.packGenreCollection(folder.genres),
            coverArt: folder.id,
            userRating: state?.rated && state.rated > 0 ? state.rated : undefined,
            playCount: state?.played && state.played > 0 ? state.played : 0,
            albumId: (await folder.albums.getIDs()).at(0),
            artistId: (await folder.artists.getIDs()).at(0),
            created: SubsonicFormatter.formatSubSonicDate(folder.createdAt),
            starred: SubsonicFormatter.formatSubSonicDate(state?.faved)
        };
    }
    static async packPodcast(podcast, status) {
        return {
            id: podcast.id,
            url: podcast.url,
            errorMessage: podcast.errorMessage,
            title: podcast.title,
            status: status ? PodcastStatus[status] : PodcastStatus[podcast.status],
            description: podcast.description,
            coverArt: podcast.id,
            originalImageUrl: podcast.image
        };
    }
    static async packPodcastEpisode(episode, state, status) {
        const tag = await episode.tag.get();
        const result = {
            streamId: episode.id,
            coverArt: episode.id,
            channelId: episode.podcast.idOrFail(),
            description: episode.summary,
            publishDate: SubsonicFormatter.formatSubSonicDate(episode.date),
            title: episode.name,
            status: status ?? episode.status,
            id: episode.id,
            parent: episode.podcast.id(),
            artist: tag ? tag.artist : episode.author,
            album: tag?.album,
            track: tag?.trackNr,
            year: tag?.year,
            genre: (tag?.genres ?? []).join(' / '),
            discNumber: tag?.disc,
            type: 'podcast',
            playCount: state?.played && state.played > 0 ? state.played : 0,
            starred: SubsonicFormatter.formatSubSonicDate(state?.faved),
            userRating: state?.rated && state.rated > 0 ? state.rated : undefined,
            isVideo: false,
            isDir: false,
            size: episode.fileSize ? Math.trunc(episode.fileSize / 10) : undefined,
            created: SubsonicFormatter.formatSubSonicDate(episode.statCreated),
            duration: SubsonicFormatter.packDuration(tag?.mediaDuration),
            bitRate: SubsonicFormatter.packBitrate(tag?.mediaBitRate)
        };
        if (episode.path) {
            result.suffix = fileSuffix(episode.path);
            if (result.suffix !== AudioFormatType.mp3) {
                result.transcodedSuffix = AudioFormatType.mp3;
                result.transcodedContentType = mimeTypes.lookup(result.transcodedSuffix) || 'audio/mpeg';
            }
            result.contentType = mimeTypes.lookup(result.suffix) || 'audio/mpeg';
            result.size = episode.fileSize;
            result.created = SubsonicFormatter.formatSubSonicDate(episode.statCreated);
            result.duration = SubsonicFormatter.packDuration(tag?.mediaDuration);
            result.bitRate = SubsonicFormatter.packBitrate(tag?.mediaBitRate);
        }
        return result;
    }
    static async packPlaylist(playlist, state) {
        return {
            id: playlist.id,
            name: playlist.name,
            comment: playlist.comment ?? '',
            public: playlist.isPublic,
            duration: SubsonicFormatter.packDuration(playlist.duration),
            created: SubsonicFormatter.formatSubSonicDate(playlist.createdAt) ?? '',
            changed: SubsonicFormatter.formatSubSonicDate(playlist.updatedAt) ?? '',
            coverArt: playlist.coverArt,
            starred: SubsonicFormatter.formatSubSonicDate(state?.faved),
            userRating: state?.rated && state.rated > 0 ? state.rated : undefined,
            allowedUser: [],
            songCount: await playlist.entries.count(),
            owner: playlist.user.id()
        };
    }
    static async packPlaylistWithSongs(playlist, tracks, states) {
        const result = await SubsonicFormatter.packPlaylist(playlist);
        const entry = [];
        for (const track of tracks) {
            entry.push(await SubsonicFormatter.packTrack(track, states[track.id]));
        }
        result.entry = entry;
        return result;
    }
    static packBookmark(bookmark, username, child) {
        return {
            entry: child,
            username,
            position: bookmark.position,
            comment: bookmark.comment,
            created: SubsonicFormatter.formatSubSonicDate(bookmark.createdAt) ?? '',
            changed: SubsonicFormatter.formatSubSonicDate(bookmark.updatedAt) ?? ''
        };
    }
    static packSimilarSongs(childs) {
        return {
            song: childs
        };
    }
    static packPlayQueue(playqueue, user, childs) {
        return {
            entry: childs,
            current: playqueue.current,
            position: playqueue.position,
            username: user.name,
            changed: SubsonicFormatter.formatSubSonicDate(playqueue.updatedAt) ?? '',
            changedBy: ''
        };
    }
    static async packRadio(radio) {
        return {
            id: radio.id,
            name: radio.name,
            streamUrl: radio.url,
            homePageUrl: radio.homepage
        };
    }
    static async packGenre(genre) {
        return {
            value: genre.name,
            songCount: await genre.tracks.count(),
            albumCount: await genre.albums.count(),
            artistCount: await genre.artists.count()
        };
    }
    static packChatMessage(message) {
        return {
            username: message.userName,
            time: message.created,
            message: message.message
        };
    }
}
SubsonicFormatter.FAIL = {
    GENERIC: 0,
    PARAMETER: 10,
    CLIENT_OLD: 20,
    SERVER_OLD: 30,
    CREDENTIALS: 40,
    UNAUTH: 50,
    NOTFOUND: 70
};
SubsonicFormatter.ERRORS = {
    LOGIN_FAILED: { code: SubsonicFormatter.FAIL.CREDENTIALS, message: 'Wrong username or password.' },
    PARAM_MISSING: { code: SubsonicFormatter.FAIL.PARAMETER, message: 'Required parameter is missing.' },
    PARAM_INVALID: { code: SubsonicFormatter.FAIL.PARAMETER, message: 'Required parameter is invalid.' },
    SERVER_OLD: { code: SubsonicFormatter.FAIL.SERVER_OLD, message: 'Incompatible Subsonic REST protocol version. Server must upgrade.' },
    CLIENT_OLD: { code: SubsonicFormatter.FAIL.CLIENT_OLD, message: 'Incompatible Subsonic REST protocol version. Client must upgrade.' },
    NOT_FOUND: { code: SubsonicFormatter.FAIL.NOTFOUND, message: 'The requested data was not found.' },
    UNAUTH: { code: SubsonicFormatter.FAIL.UNAUTH, message: 'Not authorised' },
    NO_SHARING: { code: SubsonicFormatter.FAIL.UNAUTH, message: 'Sharing is disabled via Subsonic API.' },
    NO_USER_MANAGEMENT: { code: SubsonicFormatter.FAIL.UNAUTH, message: 'User manangement is disabled via Subsonic API.' },
    NOT_IMPLEMENTED: { code: SubsonicFormatter.FAIL.NOTFOUND, message: 'Not implemented' }
};
SubsonicFormatter.defaultProperties = {
    status: 'ok',
    version: '1.16.0',
    type: 'jam',
    serverVersion: JAMSERVE_VERSION,
    openSubsonic: true
};
//# sourceMappingURL=formatter.js.map