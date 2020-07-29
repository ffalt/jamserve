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
const typescript_ioc_1 = require("typescript-ioc");
const path_1 = __importDefault(require("path"));
const io_service_1 = require("./io.service");
const podcast_service_1 = require("../../../entity/podcast/podcast.service");
const episode_service_1 = require("../../../entity/episode/episode.service");
const session_utils_1 = require("../../../entity/session/session.utils");
const audio_module_1 = require("../../audio/audio.module");
const metadata_service_1 = require("../../../entity/metadata/metadata.service");
let TransformService = class TransformService {
    async trackBase(orm, o, trackArgs, user) {
        var _a;
        const tag = await o.tag.get();
        return {
            id: o.id,
            name: o.fileName || o.name,
            objType: enums_1.JamObjectType.track,
            created: o.createdAt.valueOf(),
            duration: (_a = tag === null || tag === void 0 ? void 0 : tag.mediaDuration) !== null && _a !== void 0 ? _a : 0,
            parentID: o.folder.idOrFail(),
            artistID: o.artist.id(),
            albumArtistID: o.albumArtist.id(),
            albumID: o.album.id(),
            seriesID: o.series.id(),
            tag: trackArgs.trackIncTag ? await this.mediaTag(orm, tag) : undefined,
            media: trackArgs.trackIncMedia ? await this.trackMedia(tag, o.fileSize) : undefined,
            tagRaw: trackArgs.trackIncRawTag ? await this.mediaRawTag(path_1.default.join(o.path, o.fileName)) : undefined,
            state: trackArgs.trackIncState ? await this.state(orm, o.id, enums_1.DBObjectType.track, user.id) : undefined
        };
    }
    async track(orm, o, trackArgs, user) {
        return this.trackBase(orm, o, trackArgs, user);
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
    async episodeBase(orm, o, episodeArgs, user) {
        var _a, _b;
        const chapters = o.chaptersJSON ? JSON.parse(o.chaptersJSON) : undefined;
        const enclosures = o.enclosuresJSON ? JSON.parse(o.enclosuresJSON) : undefined;
        const podcast = await o.podcast.getOrFail();
        const tag = await o.tag.get();
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
            podcastID: podcast.id,
            podcastName: podcast.name,
            status: this.episodeService.isDownloading(o.id) ? enums_1.PodcastStatus.downloading : o.status,
            created: o.createdAt.valueOf(),
            duration: (_b = (_a = tag === null || tag === void 0 ? void 0 : tag.mediaDuration) !== null && _a !== void 0 ? _a : o.duration) !== null && _b !== void 0 ? _b : 0,
            tag: episodeArgs.episodeIncTag ? await this.mediaTag(orm, tag) : undefined,
            media: episodeArgs.episodeIncMedia ? await this.trackMedia(tag, o.fileSize) : undefined,
            tagRaw: episodeArgs.episodeIncRawTag && o.path ? await this.mediaRawTag(o.path) : undefined,
            state: episodeArgs.episodeIncState ? await this.state(orm, o.id, enums_1.DBObjectType.episode, user.id) : undefined
        };
    }
    async episode(orm, o, episodeArgs, episodeParentArgs, podcastArgs, user) {
        return {
            ...(await this.episodeBase(orm, o, episodeArgs, user)),
            podcast: await this.podcastBase(orm, await o.podcast.getOrFail(), podcastArgs, user)
        };
    }
    episodeStatus(o) {
        return this.episodeService.isDownloading(o.id) ? { status: enums_1.PodcastStatus.downloading } : { status: o.status, error: o.error };
    }
    async podcastBase(orm, o, podcastArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            url: o.url,
            status: this.podcastService.isDownloading(o.id) ? enums_1.PodcastStatus.downloading : o.status,
            lastCheck: o.lastCheck.valueOf(),
            error: o.errorMessage,
            description: o.description,
            episodeIDs: podcastArgs.podcastIncEpisodeIDs ? (await o.episodes.getItems()).map(t => t.id) : undefined,
            episodeCount: podcastArgs.podcastIncEpisodeCount ? await o.episodes.count() : undefined,
            state: podcastArgs.podcastIncState ? await this.state(orm, o.id, enums_1.DBObjectType.podcast, user.id) : undefined
        };
    }
    async podcast(orm, o, podcastArgs, podcastChildrenArgs, episodeArgs, user) {
        return {
            ...(await this.podcastBase(orm, o, podcastArgs, user)),
            episodes: podcastChildrenArgs.podcastIncEpisodes ? await Promise.all((await o.episodes.getItems()).map(t => this.episodeBase(orm, t, episodeArgs, user))) : undefined,
        };
    }
    async podcastIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                episodeCount: await item.episodes.count()
            };
        });
    }
    podcastStatus(o) {
        return this.podcastService.isDownloading(o.id) ? { status: enums_1.PodcastStatus.downloading } : { status: o.status, error: o.errorMessage, lastCheck: o.lastCheck };
    }
    async folderBase(orm, o, folderArgs, user) {
        let info;
        if (folderArgs.folderIncInfo) {
            info =
                o.folderType === enums_1.FolderType.artist ?
                    await this.metaDataService.extInfo.byFolderArtist(orm, o) :
                    await this.metaDataService.extInfo.byFolderAlbum(orm, o);
        }
        const parentID = o.parent.id();
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            type: o.folderType,
            level: o.level,
            parentID,
            trackCount: folderArgs.folderIncTrackCount ? await o.tracks.count() : undefined,
            folderCount: folderArgs.folderIncChildFolderCount ? await o.children.count() : undefined,
            artworkCount: folderArgs.folderIncArtworkCount ? await o.children.count() : undefined,
            tag: folderArgs.folderIncTag ? this.folderTag(o) : undefined,
            parents: folderArgs.folderIncParents ? await this.folderParents(orm, o) : undefined,
            trackIDs: folderArgs.folderIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
            folderIDs: folderArgs.folderIncFolderIDs ? (await o.children.getItems()).map(t => t.id) : undefined,
            artworkIDs: folderArgs.folderIncArtworkIDs ? (await o.artworks.getItems()).map(t => t.id) : undefined,
            info,
            state: folderArgs.folderIncSimilar ? await this.state(orm, o.id, enums_1.DBObjectType.folder, user.id) : undefined
        };
    }
    async folder(orm, o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user) {
        return {
            ...(await this.folderBase(orm, o, folderArgs, user)),
            tracks: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncTracks ?
                await Promise.all((await o.tracks.getItems()).map(t => this.trackBase(orm, t, trackArgs, user))) :
                undefined,
            folders: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncFolders ?
                await Promise.all((await o.children.getItems()).map(t => this.folderBase(orm, t, folderArgs, user))) :
                undefined,
            artworks: folderChildrenArgs.folderIncArtworks ?
                await Promise.all((await o.artworks.getItems()).map(t => this.artworkBase(orm, t, artworkArgs, user))) :
                undefined
        };
    }
    async folderIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                trackCount: await item.tracks.count()
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
    async folderParents(orm, o) {
        const result = [];
        let parent = o;
        while (parent) {
            parent = await parent.parent.get();
            if (parent) {
                result.unshift({ id: parent.id, name: parent.name });
            }
        }
        return result;
    }
    async seriesBase(orm, o, seriesArgs, user) {
        const artist = await o.artist.getOrFail();
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            artist: artist.name,
            artistID: artist.id,
            albumTypes: o.albumTypes,
            albumCount: seriesArgs.seriesIncAlbumCount ? await o.albums.count() : undefined,
            trackCount: seriesArgs.seriesIncTrackCount ? await o.tracks.count() : undefined,
            trackIDs: seriesArgs.seriesIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
            albumIDs: seriesArgs.seriesIncAlbumIDs ? (await o.albums.getItems()).map(a => a.id) : undefined,
            info: seriesArgs.seriesIncInfo ? await this.metaDataService.extInfo.bySeries(orm, o) : undefined,
            state: seriesArgs.seriesIncState ? await this.state(orm, o.id, enums_1.DBObjectType.series, user.id) : undefined
        };
    }
    async series(orm, o, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user) {
        return {
            ...(await this.seriesBase(orm, o, seriesArgs, user)),
            tracks: seriesChildrenArgs.seriesIncTracks ? await Promise.all((await o.tracks.getItems()).map(t => this.trackBase(orm, t, trackArgs, user))) : undefined,
            albums: seriesChildrenArgs.seriesIncAlbums ? await Promise.all((await o.albums.getItems()).map(t => this.albumBase(orm, t, albumArgs, user))) : undefined
        };
    }
    async transformSeriesIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                albumCount: await item.albums.count(),
                trackCount: await item.tracks.count()
            };
        });
    }
    async artistBase(orm, o, artistArgs, user) {
        return {
            id: o.id,
            name: o.name,
            created: o.createdAt.valueOf(),
            albumCount: artistArgs.artistIncAlbumCount ? await o.albums.count() : undefined,
            trackCount: artistArgs.artistIncTrackCount ? await o.tracks.count() : undefined,
            seriesCount: artistArgs.artistIncSeriesCount ? await o.series.count() : undefined,
            mbArtistID: o.mbArtistID,
            genres: o.genres,
            albumTypes: o.albumTypes,
            state: artistArgs.artistIncState ? await this.state(orm, o.id, enums_1.DBObjectType.artist, user.id) : undefined,
            trackIDs: artistArgs.artistIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
            albumIDs: artistArgs.artistIncAlbumIDs ? (await o.albums.getItems()).map(a => a.id) : undefined,
            seriesIDs: artistArgs.artistIncSeriesIDs ? (await o.series.getItems()).map(s => s.id) : undefined,
            info: artistArgs.artistIncInfo ? await this.metaDataService.extInfo.byArtist(orm, o) : undefined
        };
    }
    async artist(orm, o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user) {
        return {
            ...(await this.artistBase(orm, o, artistArgs, user)),
            tracks: artistChildrenArgs.artistIncTracks ? await Promise.all((await o.tracks.getItems()).map(t => this.trackBase(orm, t, trackArgs, user))) : undefined,
            albums: artistChildrenArgs.artistIncAlbums ? await Promise.all((await o.albums.getItems()).map(t => this.albumBase(orm, t, albumArgs, user))) : undefined,
            series: artistChildrenArgs.artistIncSeries ? await Promise.all((await o.series.getItems()).map(t => this.seriesBase(orm, t, seriesArgs, user))) : undefined
        };
    }
    async artistIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                albumCount: await item.albums.count(),
                trackCount: await item.tracks.count()
            };
        });
    }
    async albumBase(orm, o, albumArgs, user) {
        const artist = await o.artist.getOrFail();
        const series = await o.series.get();
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
            artistID: artist.id,
            artistName: artist.name,
            series: series === null || series === void 0 ? void 0 : series.name,
            seriesID: series === null || series === void 0 ? void 0 : series.id,
            state: albumArgs.albumIncState ? await this.state(orm, o.id, enums_1.DBObjectType.album, user.id) : undefined,
            trackCount: albumArgs.albumIncTrackCount ? await o.tracks.count() : undefined,
            trackIDs: albumArgs.albumIncTrackIDs ? (await o.tracks.getItems()).map(t => t.id) : undefined,
            info: albumArgs.albumIncInfo ? await this.metaDataService.extInfo.byAlbum(orm, o) : undefined
        };
    }
    async album(orm, o, albumArgs, albumChildrenArgs, trackArgs, artistIncludes, user) {
        const tracks = albumChildrenArgs.albumIncTracks ? await Promise.all((await o.tracks.getItems()).map(t => this.trackBase(orm, t, trackArgs, user))) : undefined;
        const artist = albumChildrenArgs.albumIncArtist ? await this.artistBase(orm, await o.artist.getOrFail(), artistIncludes, user) : undefined;
        return {
            ...(await this.albumBase(orm, o, albumArgs, user)),
            tracks,
            artist
        };
    }
    async albumIndex(orm, result) {
        return this.index(result, async (item) => {
            const artist = await item.artist.getOrFail();
            return {
                id: item.id,
                name: item.name,
                artist: artist.name,
                artistID: artist.id,
                trackCount: await item.tracks.count()
            };
        });
    }
    async artworkBase(orm, o, artworksArgs, user) {
        return {
            id: o.id,
            name: o.name,
            types: o.types,
            height: o.height,
            width: o.width,
            format: o.format,
            created: o.createdAt.valueOf(),
            state: artworksArgs.artworkIncState ? await this.state(orm, o.id, enums_1.DBObjectType.artwork, user.id) : undefined,
            size: o.fileSize
        };
    }
    async artwork(orm, o, artworksArgs, artworkChildrenArgs, folderArgs, user) {
        return {
            ...(await this.artworkBase(orm, o, artworksArgs, user)),
            folder: artworkChildrenArgs.artworkIncFolder ? await this.folderBase(orm, await o.folder.getOrFail(), folderArgs, user) : undefined
        };
    }
    async stateBase(orm, o) {
        return {
            played: o.played,
            lastPlayed: o.lastPlayed ? o.lastPlayed.valueOf() : undefined,
            faved: o.faved,
            rated: o.rated
        };
    }
    async state(orm, id, type, userID) {
        const state = await orm.State.findOrCreate(id, type, userID);
        return this.stateBase(orm, state);
    }
    async bookmarkBase(orm, o) {
        return {
            id: o.id,
            trackID: o.track.id(),
            episodeID: o.episode.id(),
            position: o.position,
            comment: o.comment,
            created: o.createdAt.valueOf(),
            changed: o.updatedAt.valueOf()
        };
    }
    async bookmark(orm, o, bookmarkArgs, trackArgs, episodeArgs, user) {
        return {
            ...(await this.bookmarkBase(orm, o)),
            track: bookmarkArgs.bookmarkIncTrack && o.track.id() ? await this.trackBase(orm, await o.track.getOrFail(), trackArgs, user) : undefined,
            episode: bookmarkArgs.bookmarkIncTrack && o.episode.id() ? await this.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user) : undefined,
        };
    }
    async radio(orm, o, radioArgs, user) {
        return {
            id: o.id,
            name: o.name,
            url: o.url,
            homepage: o.homepage,
            created: o.createdAt.valueOf(),
            changed: o.updatedAt.valueOf(),
            state: radioArgs.radioState ? await this.state(orm, o.id, enums_1.DBObjectType.radio, user.id) : undefined
        };
    }
    async radioIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                url: item.url
            };
        });
    }
    async playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user) {
        const u = await o.user.getOrFail();
        const entries = playlistArgs.playlistIncEntriesIDs || playlistArgs.playlistIncEntries ? await o.entries.getItems() : [];
        return {
            id: o.id,
            name: o.name,
            changed: o.updatedAt.valueOf(),
            duration: o.duration,
            created: o.createdAt.valueOf(),
            isPublic: o.isPublic,
            comment: o.comment,
            userID: u.id,
            userName: u.name,
            entriesCount: await o.entries.count(),
            entriesIDs: playlistArgs.playlistIncEntriesIDs ? entries.map(t => (t.track.id()) || (t.episode.id())) : undefined,
            entries: playlistArgs.playlistIncEntries ? await Promise.all(entries.map(t => this.playlistEntry(orm, t, trackArgs, episodeArgs, user))) : undefined,
            state: playlistArgs.playlistIncState ? await this.state(orm, o.id, enums_1.DBObjectType.playlist, user.id) : undefined
        };
    }
    async playlistIndex(orm, result) {
        return this.index(result, async (item) => {
            return {
                id: item.id,
                name: item.name,
                entryCount: await item.entries.count()
            };
        });
    }
    async playlistEntry(orm, o, trackArgs, episodeArgs, user) {
        if (o.track.id()) {
            return await this.trackBase(orm, await o.track.getOrFail(), trackArgs, user);
        }
        if (o.episode.id()) {
            return await this.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user);
        }
        throw new Error('Internal: Invalid Playlist Entry');
    }
    async root(orm, o, rootArgs, user) {
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
    async playQueueEntry(orm, o, trackArgs, episodeArgs, user) {
        if (o.track.id()) {
            return await this.trackBase(orm, await o.track.getOrFail(), trackArgs, user);
        }
        if (o.episode.id()) {
            return await this.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user);
        }
        throw new Error('Internal: Invalid PlayQueue Entry');
    }
    async playQueue(orm, o, playQueueArgs, trackArgs, episodeArgs, user) {
        const entries = playQueueArgs.playQueueEntriesIDs || playQueueArgs.playQueueEntries ?
            await o.entries.getItems() : [];
        return {
            changed: o.updatedAt.valueOf(),
            changedBy: o.changedBy,
            created: o.createdAt.valueOf(),
            currentIndex: o.current,
            mediaPosition: o.position,
            userID: o.user.id,
            userName: o.user.name,
            entriesCount: await o.entries.count(),
            entriesIDs: playQueueArgs.playQueueEntriesIDs ? entries.map(t => (t.track.id()) || (t.episode.id())) : undefined,
            entries: playQueueArgs.playQueueEntries ? await Promise.all(entries.map(t => this.playQueueEntry(orm, t, trackArgs, episodeArgs, user))) : undefined
        };
    }
    async mediaRawTag(filename) {
        return this.audioModule.readRawTag(filename);
    }
    async mediaTag(orm, o) {
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
    async nowPlaying(orm, o, nowPlayingArgs, trackArgs, episodeArgs, user) {
        var _a, _b;
        return {
            userName: o.user.name,
            userID: o.user.id,
            minutesAgo: Math.round(moment_1.default.duration(moment_1.default().diff(moment_1.default(o.time))).asMinutes()),
            trackID: nowPlayingArgs.nowPlayingIncTrackIDs ? (_a = o.track) === null || _a === void 0 ? void 0 : _a.id : undefined,
            track: nowPlayingArgs.nowPlayingIncTracks && o.track ? (await this.trackBase(orm, o.track, trackArgs, user)) : undefined,
            episodeID: nowPlayingArgs.nowPlayingIncEpisodeIDs ? (_b = o.episode) === null || _b === void 0 ? void 0 : _b.id : undefined,
            episode: nowPlayingArgs.nowPlayingIncEpisodes && o.episode ? (await this.episodeBase(orm, o.episode, episodeArgs, user)) : undefined
        };
    }
    async user(orm, o, userArgs, currentUser) {
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
    userSession(orm, o) {
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
    typescript_ioc_1.InRequestScope
], TransformService);
exports.TransformService = TransformService;
//# sourceMappingURL=transform.service.js.map