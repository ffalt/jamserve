"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransformService = void 0;
const moment_1 = __importDefault(require("moment"));
const enums_1 = require("../../../types/enums");
const orm_service_1 = require("./orm.service");
const typescript_ioc_1 = require("typescript-ioc");
const path_1 = __importDefault(require("path"));
const io_service_1 = require("./io.service");
const podcast_service_1 = require("../../../entity/podcast/podcast.service");
const episode_service_1 = require("../../../entity/episode/episode.service");
const session_utils_1 = require("../../../entity/session/session.utils");
const audio_module_1 = require("../../audio/audio.module");
const metadata_service_1 = require("../../../entity/metadata/metadata.service");
let TransformService = class TransformService {
    async trackBase(o, trackArgs, user) {
        var _a, _b, _c, _d, _e, _f;
        await this.orm.Track.populate(o, ['tag']);
        return {
            id: o.id,
            name: o.fileName || o.name,
            objType: enums_1.JamObjectType.track,
            created: o.createdAt.valueOf(),
            duration: (_b = (_a = o.tag) === null || _a === void 0 ? void 0 : _a.mediaDuration) !== null && _b !== void 0 ? _b : 0,
            parentID: o.folder.id,
            artistID: (_c = o.artist) === null || _c === void 0 ? void 0 : _c.id,
            albumArtistID: (_d = o.albumArtist) === null || _d === void 0 ? void 0 : _d.id,
            albumID: (_e = o.album) === null || _e === void 0 ? void 0 : _e.id,
            seriesID: (_f = o.series) === null || _f === void 0 ? void 0 : _f.id,
            tag: trackArgs.trackIncTag ? await this.mediaTag(o.tag) : undefined,
            media: trackArgs.trackIncMedia ? await this.trackMedia(o.tag, o.fileSize) : undefined,
            tagRaw: trackArgs.trackIncRawTag ? await this.mediaRawTag(path_1.default.join(o.path, o.fileName)) : undefined,
            state: trackArgs.trackIncState ? await this.state(o.id, enums_1.DBObjectType.track, user.id) : undefined
        };
    }
    async track(o, trackArgs, user) {
        return this.trackBase(o, trackArgs, user);
    }
    async trackMedia(o, fileSize) {
        return {
            bitRate: o === null || o === void 0 ? void 0 : o.mediaBitRate,
            format: o === null || o === void 0 ? void 0 : o.mediaFormat,
            channels: o === null || o === void 0 ? void 0 : o.mediaChannels,
            sampleRate: o === null || o === void 0 ? void 0 : o.mediaSampleRate,
            size: fileSize
        };
    }
    async episodeBase(o, episodeArgs, user) {
        var _a, _b, _c;
        const chapters = o.chaptersJSON ? JSON.parse(o.chaptersJSON) : undefined;
        const enclosures = o.enclosuresJSON ? JSON.parse(o.enclosuresJSON) : undefined;
        return {
            id: o.id,
            name: o.name,
            objType: enums_1.JamObjectType.episode,
            date: o.date.valueOf(),
            summary: o.summary,
            author: o.author,
            error: o.error,
            chapters,
            url: enclosures ? enclosures[0].url : undefined,
            link: o.link,
            guid: o.guid,
            podcastID: o.podcast.id,
            podcastName: o.podcast.name,
            status: this.episodeService.isDownloading(o.id) ? enums_1.PodcastStatus.downloading : o.status,
            created: o.createdAt.valueOf(),
            duration: (_c = (_b = (_a = o.tag) === null || _a === void 0 ? void 0 : _a.mediaDuration) !== null && _b !== void 0 ? _b : o.duration) !== null && _c !== void 0 ? _c : 0,
            tag: episodeArgs.episodeIncTag ? await this.mediaTag(o.tag) : undefined,
            media: episodeArgs.episodeIncMedia ? await this.trackMedia(o.tag, o.fileSize) : undefined,
            tagRaw: episodeArgs.episodeIncRawTag && o.path ? await this.mediaRawTag(o.path) : undefined,
            state: episodeArgs.episodeIncState ? await this.state(o.id, enums_1.DBObjectType.episode, user.id) : undefined
        };
    }
    async episode(o, episodeArgs, episodeParentArgs, podcastArgs, user) {
        return {
            ...(await this.episodeBase(o, episodeArgs, user)),
            podcast: await this.podcastBase(o.podcast, podcastArgs, user)
        };
    }
    episodeStatus(o) {
        return this.episodeService.isDownloading(o.id) ? { status: enums_1.PodcastStatus.downloading } : { status: o.status, error: o.error };
    }
    async podcastBase(o, podcastArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            url: o.url,
            status: this.podcastService.isDownloading(o.id) ? enums_1.PodcastStatus.downloading : o.status,
            lastCheck: o.lastCheck.valueOf(),
            error: o.errorMessage,
            description: o.description,
            episodeIDs: podcastArgs.podcastIncEpisodeIDs ? o.episodes.getItems().map(t => t.id) : undefined,
            episodeCount: podcastArgs.podcastIncEpisodeCount ? o.episodes.length : undefined,
            state: podcastArgs.podcastIncState ? await this.state(o.id, enums_1.DBObjectType.podcast, user.id) : undefined
        };
    }
    async podcast(o, podcastArgs, podcastChildrenArgs, episodeArgs, user) {
        await this.orm.Podcast.populate(o, ['episodes']);
        return {
            ...(await this.podcastBase(o, podcastArgs, user)),
            episodes: podcastChildrenArgs.podcastIncEpisodes ? await Promise.all(o.episodes.getItems().map(t => this.episodeBase(t, episodeArgs, user))) : undefined,
        };
    }
    async podcastIndex(result) {
        return this.index(result, async (item) => {
            await this.orm.Podcast.populate(item, ['episodes']);
            return {
                id: item.id,
                name: item.name,
                episodeCount: item.episodes.length
            };
        });
    }
    podcastStatus(o) {
        return this.podcastService.isDownloading(o.id) ? { status: enums_1.PodcastStatus.downloading } : { status: o.status, error: o.errorMessage, lastCheck: o.lastCheck };
    }
    async folderBase(o, folderArgs, user) {
        var _a;
        await this.populate(o, {
            'tracks': folderArgs.folderIncTrackIDs || folderArgs.folderIncTrackCount,
            'children': folderArgs.folderIncFolderIDs || folderArgs.folderIncChildFolderCount,
            'artworks': folderArgs.folderIncArtworkIDs || folderArgs.folderIncArtworkCount
        });
        let info;
        if (folderArgs.folderIncInfo) {
            info =
                o.folderType === enums_1.FolderType.artist ?
                    await this.metaDataService.extInfo.byFolderArtist(o) :
                    await this.metaDataService.extInfo.byFolderAlbum(o);
        }
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            type: o.folderType,
            level: o.level,
            parentID: (_a = o.parent) === null || _a === void 0 ? void 0 : _a.id,
            trackCount: folderArgs.folderIncTrackCount ? o.tracks.length : undefined,
            folderCount: folderArgs.folderIncChildFolderCount ? o.children.length : undefined,
            artworkCount: folderArgs.folderIncArtworkCount ? o.children.length : undefined,
            tag: folderArgs.folderIncTag ? this.folderTag(o) : undefined,
            parents: folderArgs.folderIncParents ? await this.folderParents(o) : undefined,
            trackIDs: folderArgs.folderIncTrackIDs ? o.tracks.getItems().map(t => t.id) : undefined,
            folderIDs: folderArgs.folderIncFolderIDs ? o.children.getItems().map(t => t.id) : undefined,
            artworkIDs: folderArgs.folderIncArtworkIDs ? o.artworks.getItems().map(t => t.id) : undefined,
            info,
            state: folderArgs.folderIncSimilar ? await this.state(o.id, enums_1.DBObjectType.folder, user.id) : undefined
        };
    }
    async folder(o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user) {
        await this.populate(o, {
            'tracks': folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncTracks,
            'children': folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncFolders,
            'artworks': folderChildrenArgs.folderIncArtworks
        });
        return {
            ...(await this.folderBase(o, folderArgs, user)),
            tracks: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncTracks ? await Promise.all(o.tracks.getItems().map(t => this.trackBase(t, trackArgs, user))) : undefined,
            folders: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncFolders ? await Promise.all(o.children.getItems().map(t => this.folderBase(t, folderArgs, user))) : undefined,
            artworks: folderChildrenArgs.folderIncArtworks ? await Promise.all(o.artworks.getItems().map(t => this.artworkBase(t, artworkArgs, user))) : undefined
        };
    }
    async folderIndex(result) {
        return this.index(result, async (item) => {
            await this.orm.Folder.populate(item, ['tracks']);
            return {
                id: item.id,
                name: item.name,
                trackCount: item.tracks.length
            };
        });
    }
    folderTag(o) {
        return {
            album: o.album,
            albumType: o.albumType,
            artist: o.artist,
            artistSort: o.artistSort,
            genres: o.genres,
            year: o.year,
            mbArtistID: o.mbArtistID,
            mbReleaseID: o.mbReleaseID,
            mbReleaseGroupID: o.mbReleaseGroupID
        };
    }
    async folderParents(o) {
        const result = [];
        let parent = o;
        while (parent) {
            await this.orm.Folder.populate(parent, 'parent');
            parent = parent.parent;
            if (parent) {
                result.unshift({ id: parent.id, name: parent.name });
            }
        }
        return result;
    }
    async seriesBase(o, seriesArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            artist: o.artist.name,
            artistID: o.artist.id,
            albumTypes: o.albumTypes,
            albumCount: seriesArgs.seriesIncAlbumCount ? o.albums.length : undefined,
            trackCount: seriesArgs.seriesIncTrackCount ? o.tracks.length : undefined,
            trackIDs: seriesArgs.seriesIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
            albumIDs: seriesArgs.seriesIncAlbumIDs ? (await o.albums.getItems()).map(a => a.id) : undefined,
            info: seriesArgs.seriesIncInfo ? await this.metaDataService.extInfo.bySeries(o) : undefined,
            state: seriesArgs.seriesIncState ? await this.state(o.id, enums_1.DBObjectType.series, user.id) : undefined
        };
    }
    async series(o, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user) {
        return {
            ...(await this.seriesBase(o, seriesArgs, user)),
            tracks: seriesChildrenArgs.seriesIncTracks ? await Promise.all(o.tracks.getItems().map(t => this.trackBase(t, trackArgs, user))) : undefined,
            albums: seriesChildrenArgs.seriesIncAlbums ? await Promise.all(o.albums.getItems().map(t => this.albumBase(t, albumArgs, user))) : undefined
        };
    }
    async transformSeriesIndex(result) {
        return this.index(result, async (item) => {
            await this.orm.Series.populate(item, ['tracks', 'albums']);
            return {
                id: item.id,
                name: item.name,
                albumCount: item.albums.length,
                trackCount: item.tracks.length
            };
        });
    }
    async artistBase(o, artistArgs, user) {
        await this.populate(o, {
            'tracks': artistArgs.artistIncTrackIDs || artistArgs.artistIncTrackCount,
            'albums': artistArgs.artistIncAlbumIDs || artistArgs.artistIncAlbumCount,
            'series': artistArgs.artistIncSeriesIDs || artistArgs.artistIncSeriesCount
        });
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            albumCount: artistArgs.artistIncAlbumCount ? o.albums.length : undefined,
            trackCount: artistArgs.artistIncTrackCount ? o.tracks.length : undefined,
            seriesCount: artistArgs.artistIncSeriesCount ? o.series.length : undefined,
            mbArtistID: o.mbArtistID,
            genres: o.genres,
            albumTypes: o.albumTypes,
            state: artistArgs.artistIncState ? await this.state(o.id, enums_1.DBObjectType.artist, user.id) : undefined,
            trackIDs: artistArgs.artistIncTrackIDs ? o.tracks.getItems().map(t => t.id) : undefined,
            albumIDs: artistArgs.artistIncAlbumIDs ? o.albums.getItems().map(a => a.id) : undefined,
            seriesIDs: artistArgs.artistIncSeriesIDs ? o.series.getItems().map(s => s.id) : undefined,
            info: artistArgs.artistIncInfo ? await this.metaDataService.extInfo.byArtist(o) : undefined
        };
    }
    async artist(o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user) {
        await this.populate(o, {
            'tracks': artistChildrenArgs.artistIncTracks,
            'albums': artistChildrenArgs.artistIncAlbums,
            'series': artistChildrenArgs.artistIncSeries
        });
        return {
            ...(await this.artistBase(o, artistArgs, user)),
            tracks: artistChildrenArgs.artistIncTracks ? await Promise.all(o.tracks.getItems().map(t => this.trackBase(t, trackArgs, user))) : undefined,
            albums: artistChildrenArgs.artistIncAlbums ? await Promise.all(o.albums.getItems().map(t => this.albumBase(t, albumArgs, user))) : undefined,
            series: artistChildrenArgs.artistIncSeries ? await Promise.all(o.series.getItems().map(t => this.seriesBase(t, seriesArgs, user))) : undefined
        };
    }
    async artistIndex(result) {
        return this.index(result, async (item) => {
            await this.orm.Artist.populate(item, ['tracks', 'albums']);
            return {
                id: item.id,
                name: item.name,
                albumCount: item.albums.length,
                trackCount: item.tracks.length
            };
        });
    }
    async albumBase(o, albumArgs, user) {
        var _a, _b;
        await this.populate(o, {
            'tracks': albumArgs.albumIncTrackCount || albumArgs.albumIncTrackIDs,
            'artist': true,
            'series': true
        });
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            genres: o.genres,
            year: o.year,
            mbArtistID: o.mbArtistID,
            mbReleaseID: o.mbReleaseID,
            albumType: o.albumType,
            duration: o.duration,
            artistID: o.artist.id,
            artistName: o.artist.name,
            series: (_a = o.series) === null || _a === void 0 ? void 0 : _a.name,
            seriesID: (_b = o.series) === null || _b === void 0 ? void 0 : _b.id,
            state: albumArgs.albumIncState ? await this.state(o.id, enums_1.DBObjectType.album, user.id) : undefined,
            trackCount: albumArgs.albumIncTrackCount ? o.tracks.length : undefined,
            trackIDs: albumArgs.albumIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
            info: albumArgs.albumIncInfo ? await this.metaDataService.extInfo.byAlbum(o) : undefined
        };
    }
    async album(o, albumArgs, albumChildrenArgs, trackArgs, artistIncludes, user) {
        await this.populate(o, {
            'tracks': albumChildrenArgs.albumIncTracks,
            'artist': albumChildrenArgs.albumIncArtist
        });
        const tracks = albumChildrenArgs.albumIncTracks ? await Promise.all(o.tracks.getItems().map(t => this.trackBase(t, trackArgs, user))) : undefined;
        const artist = albumChildrenArgs.albumIncArtist ? await this.artistBase(o.artist, artistIncludes, user) : undefined;
        return {
            ...(await this.albumBase(o, albumArgs, user)),
            tracks,
            artist
        };
    }
    async albumIndex(result) {
        return this.index(result, async (item) => {
            var _a, _b;
            await this.orm.Album.populate(item, ['tracks', 'artist']);
            return {
                id: item.id,
                name: item.name,
                artist: (_a = item.artist) === null || _a === void 0 ? void 0 : _a.name,
                artistID: (_b = item.artist) === null || _b === void 0 ? void 0 : _b.id,
                trackCount: item.tracks.length
            };
        });
    }
    async artworkBase(o, artworksArgs, user) {
        return {
            id: o.id,
            name: o.name,
            types: o.types,
            height: o.height,
            width: o.width,
            format: o.format,
            created: o.createdAt.valueOf(),
            state: artworksArgs.artworkIncState ? await this.state(o.id, enums_1.DBObjectType.artwork, user.id) : undefined,
            size: o.fileSize
        };
    }
    async artwork(o, artworksArgs, artworkChildrenArgs, folderArgs, user) {
        return {
            ...(await this.artworkBase(o, artworksArgs, user)),
            folder: artworkChildrenArgs.artworkIncFolder ? await this.folderBase(o.folder, folderArgs, user) : undefined
        };
    }
    async stateBase(o) {
        return {
            played: o.played,
            lastPlayed: o.lastPlayed ? o.lastPlayed.valueOf() : undefined,
            faved: o.faved,
            rated: o.rated
        };
    }
    async state(id, type, userID) {
        const state = await this.orm.State.findOrCreate(id, type, userID);
        return this.stateBase(state);
    }
    async bookmarkBase(o) {
        var _a, _b;
        return {
            id: o.id,
            trackID: (_a = o.track) === null || _a === void 0 ? void 0 : _a.id,
            episodeID: (_b = o.episode) === null || _b === void 0 ? void 0 : _b.id,
            position: o.position,
            comment: o.comment,
            created: o.createdAt.valueOf(),
            changed: o.updatedAt.valueOf()
        };
    }
    async bookmark(o, bookmarkArgs, trackArgs, episodeArgs, user) {
        return {
            ...(await this.bookmarkBase(o)),
            track: bookmarkArgs.bookmarkIncTrack && o.track ? await this.trackBase(o.track, trackArgs, user) : undefined,
            episode: bookmarkArgs.bookmarkIncTrack && o.episode ? await this.episodeBase(o.episode, episodeArgs, user) : undefined,
        };
    }
    async radio(o, radioArgs, user) {
        return {
            id: o.id,
            name: o.name,
            url: o.url,
            homepage: o.homepage,
            created: o.createdAt.valueOf(),
            changed: o.updatedAt.valueOf(),
            state: radioArgs.radioState ? await this.state(o.id, enums_1.DBObjectType.radio, user.id) : undefined
        };
    }
    async radioIndex(result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                url: item.url
            };
        });
    }
    async playlist(o, playlistArgs, trackArgs, episodeArgs, user) {
        await this.orm.Playlist.populate(o, ['entries']);
        return {
            id: o.id,
            name: o.name,
            changed: o.updatedAt.valueOf(),
            duration: o.duration,
            created: o.createdAt.valueOf(),
            isPublic: o.isPublic,
            comment: o.comment,
            userID: o.user.id,
            userName: o.user.name,
            entriesCount: o.entries.length,
            entriesIDs: playlistArgs.playlistIncEntriesIDs ? o.entries.getItems().map(t => { var _a, _b; return ((_a = t.track) === null || _a === void 0 ? void 0 : _a.id) || ((_b = t.episode) === null || _b === void 0 ? void 0 : _b.id); }) : undefined,
            entries: playlistArgs.playlistIncEntries ? await Promise.all(o.entries.getItems().map(t => this.playlistEntry(t, trackArgs, episodeArgs, user))) : undefined,
            state: playlistArgs.playlistIncState ? await this.state(o.id, enums_1.DBObjectType.playlist, user.id) : undefined
        };
    }
    async playlistIndex(result) {
        return this.index(result, async (item) => {
            await this.orm.Playlist.populate(item, ['entries']);
            return {
                id: item.id,
                name: item.name,
                entryCount: item.entries.length
            };
        });
    }
    async playlistEntry(o, trackArgs, episodeArgs, user) {
        if (o.track) {
            return await this.trackBase(o.track, trackArgs, user);
        }
        else if (o.episode) {
            return await this.episodeBase(o.episode, episodeArgs, user);
        }
        throw new Error('Internal: Invalid Playlist Entry');
    }
    async root(o, rootArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            path: user.roleAdmin ? o.path : undefined,
            status: this.ioService.getRootStatus(o.id),
            strategy: o.strategy
        };
    }
    rootStatus(root) {
        return this.ioService.getRootStatus(root.id);
    }
    async playQueueEntry(o, trackArgs, episodeArgs, user) {
        if (o.track) {
            return await this.trackBase(o.track, trackArgs, user);
        }
        else if (o.episode) {
            return await this.episodeBase(o.episode, episodeArgs, user);
        }
        throw new Error('Internal: Invalid PlayQueue Entry');
    }
    async playQueue(o, playQueueArgs, trackArgs, episodeArgs, user) {
        return {
            changed: o.updatedAt.valueOf(),
            changedBy: o.changedBy,
            created: o.createdAt.valueOf(),
            currentIndex: o.current,
            mediaPosition: o.position,
            userID: o.user.id,
            userName: o.user.name,
            entriesCount: o.entries.length,
            entriesIDs: playQueueArgs.playQueueEntriesIDs ? o.entries.getItems().map(t => { var _a, _b; return ((_a = t.track) === null || _a === void 0 ? void 0 : _a.id) || ((_b = t.episode) === null || _b === void 0 ? void 0 : _b.id); }) : undefined,
            entries: playQueueArgs.playQueueEntries ? await Promise.all(o.entries.getItems().map(t => this.playQueueEntry(t, trackArgs, episodeArgs, user))) : undefined
        };
    }
    async mediaRawTag(filename) {
        return this.audioModule.readRawTag(filename);
    }
    async mediaTag(o) {
        if (!o) {
            return {};
        }
        return {
            title: o.title,
            album: o.album,
            artist: o.artist,
            genres: o.genres,
            year: o.year,
            trackNr: o.trackNr,
            disc: o.disc,
            discTotal: o.discTotal,
            mbTrackID: o.mbTrackID,
            mbRecordingID: o.mbRecordingID,
            mbReleaseTrackID: o.mbReleaseTrackID,
            mbReleaseGroupID: o.mbReleaseGroupID,
            mbReleaseID: o.mbReleaseID,
            mbArtistID: o.mbArtistID,
            mbAlbumArtistID: o.mbAlbumArtistID
        };
    }
    async nowPlaying(o, nowPlayingArgs, trackArgs, episodeArgs, user) {
        var _a, _b;
        return {
            userName: o.user.name,
            userID: o.user.id,
            minutesAgo: Math.round(moment_1.default.duration(moment_1.default().diff(moment_1.default(o.time))).asMinutes()),
            trackID: nowPlayingArgs.nowPlayingIncTrackIDs ? (_a = o.track) === null || _a === void 0 ? void 0 : _a.id : undefined,
            track: nowPlayingArgs.nowPlayingIncTracks && o.track ? (await this.trackBase(o.track, trackArgs, user)) : undefined,
            episodeID: nowPlayingArgs.nowPlayingIncEpisodeIDs ? (_b = o.episode) === null || _b === void 0 ? void 0 : _b.id : undefined,
            episode: nowPlayingArgs.nowPlayingIncEpisodes && o.episode ? (await this.episodeBase(o.episode, episodeArgs, user)) : undefined
        };
    }
    async user(o, userArgs, currentUser) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            email: o.email,
            roles: {
                admin: o.roleAdmin,
                podcast: o.rolePodcast,
                stream: o.roleStream,
                upload: o.roleUpload
            }
        };
    }
    chats(chats) {
        return chats.map(c => {
            return { ...c, created: c.created.valueOf() };
        });
    }
    userSession(o) {
        const ua = session_utils_1.parseAgent(o);
        return {
            id: o.id,
            client: o.client,
            expires: o.expires,
            mode: o.mode,
            platform: ua === null || ua === void 0 ? void 0 : ua.platform,
            os: ua === null || ua === void 0 ? void 0 : ua.os,
            agent: o.agent
        };
    }
    async populate(items, fields) {
        const keys = Object.keys(fields);
        const pop = keys.map(key => (fields[key] ? key : undefined)).filter(d => !!d);
        if (pop.length > 0) {
            await this.orm.orm.em.populate(items, pop);
        }
    }
    async index(result, mapItem) {
        return {
            lastModified: new Date().valueOf(),
            groups: await Promise.all(result.groups.map(async (group) => {
                return {
                    name: group.name,
                    items: await Promise.all(group.items.map(async (item) => {
                        return await mapItem(item);
                    }))
                };
            }))
        };
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], TransformService.prototype, "orm", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", io_service_1.IoService)
], TransformService.prototype, "ioService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", podcast_service_1.PodcastService)
], TransformService.prototype, "podcastService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", episode_service_1.EpisodeService)
], TransformService.prototype, "episodeService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], TransformService.prototype, "audioModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", metadata_service_1.MetaDataService)
], TransformService.prototype, "metaDataService", void 0);
TransformService = __decorate([
    typescript_ioc_1.Singleton
], TransformService);
exports.TransformService = TransformService;
//# sourceMappingURL=transform.service.js.map