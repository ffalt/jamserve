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
const typescript_ioc_1 = require("typescript-ioc");
const chat_transform_1 = require("../../../entity/chat/chat.transform");
const genre_transform_1 = require("../../../entity/genre/genre.transform");
const radio_transform_1 = require("../../../entity/radio/radio.transform");
const root_transform_1 = require("../../../entity/root/root.transform");
const podcast_transform_1 = require("../../../entity/podcast/podcast.transform");
const episode_transform_1 = require("../../../entity/episode/episode.transform");
const folder_transform_1 = require("../../../entity/folder/folder.transform");
const track_transform_1 = require("../../../entity/track/track.transform");
const series_transform_1 = require("../../../entity/series/series.transform");
const artist_transform_1 = require("../../../entity/artist/artist.transform");
const album_transform_1 = require("../../../entity/album/album.transform");
const artwork_transform_1 = require("../../../entity/artwork/artwork.transform");
const playlist_transform_1 = require("../../../entity/playlist/playlist.transform");
const bookmark_transform_1 = require("../../../entity/bookmark/bookmark.transform");
const playqueue_transform_1 = require("../../../entity/playqueue/playqueue.transform");
const base_transform_1 = require("../../../entity/base/base.transform");
const session_transform_1 = require("../../../entity/session/session.transform");
const user_transform_1 = require("../../../entity/user/user.transform");
let TransformService = class TransformService {
    async album(orm, o, albumArgs, albumChildrenArgs, trackArgs, artistIncludes, user) {
        return {
            ...(await this.Album.albumBase(orm, o, albumArgs, user)),
            tracks: albumChildrenArgs.albumIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackArgs, user) : undefined,
            artist: albumChildrenArgs.albumIncArtist ? await this.Artist.artistBase(orm, await o.artist.getOrFail(), artistIncludes, user) : undefined
        };
    }
    async artist(orm, o, artistArgs, artistChildrenArgs, trackArgs, albumArgs, seriesArgs, user) {
        return {
            ...(await this.Artist.artistBase(orm, o, artistArgs, user)),
            tracks: artistChildrenArgs.artistIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackArgs, user) : undefined,
            albums: artistChildrenArgs.artistIncAlbums ? await this.Album.albumBases(orm, await o.albums.getItems(), albumArgs, user) : undefined,
            series: artistChildrenArgs.artistIncSeries ? await this.Series.seriesBases(orm, await o.series.getItems(), seriesArgs, user) : undefined
        };
    }
    async artwork(orm, o, artworksArgs, artworkChildrenArgs, folderArgs, user) {
        return {
            ...(await this.Artwork.artworkBase(orm, o, artworksArgs, user)),
            folder: artworkChildrenArgs.artworkIncFolder ? await this.Folder.folderBase(orm, await o.folder.getOrFail(), folderArgs, user) : undefined
        };
    }
    async bookmark(orm, o, bookmarkArgs, trackArgs, episodeArgs, user) {
        return {
            ...(await this.Bookmark.bookmarkBase(orm, o)),
            track: bookmarkArgs.bookmarkIncTrack && o.track.id() ? await this.Track.trackBase(orm, await o.track.getOrFail(), trackArgs, user) : undefined,
            episode: bookmarkArgs.bookmarkIncTrack && o.episode.id() ? await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user) : undefined,
        };
    }
    async episode(orm, o, episodeArgs, episodeParentArgs, podcastArgs, user) {
        return {
            ...(await this.Episode.episodeBase(orm, o, episodeArgs, user)),
            podcast: episodeParentArgs.episodeIncParent ? await this.Podcast.podcastBase(orm, await o.podcast.getOrFail(), podcastArgs, user) : undefined
        };
    }
    async folder(orm, o, folderArgs, folderChildrenArgs, trackArgs, artworkArgs, user) {
        return {
            ...(await this.Folder.folderBase(orm, o, folderArgs, user)),
            tracks: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncTracks ?
                await this.Track.trackBases(orm, await o.tracks.getItems(), trackArgs, user) :
                undefined,
            folders: folderChildrenArgs.folderIncChildren || folderChildrenArgs.folderIncFolders ?
                await this.Folder.folderChildren(orm, o, folderChildrenArgs, user)
                : undefined,
            artworks: folderChildrenArgs.folderIncArtworks ?
                await this.Artwork.artworkBases(orm, await o.artworks.getItems(), artworkArgs, user) :
                undefined
        };
    }
    async playlist(orm, o, playlistArgs, trackArgs, episodeArgs, user) {
        const entries = playlistArgs.playlistIncEntriesIDs || playlistArgs.playlistIncEntries ? await o.entries.getItems() : [];
        return {
            ...(await this.Playlist.playlistBase(orm, o, playlistArgs, user)),
            entries: playlistArgs.playlistIncEntries ? await Promise.all(entries.map(t => this.playlistEntry(orm, t, trackArgs, episodeArgs, user))) : undefined
        };
    }
    async playlistEntry(orm, o, trackArgs, episodeArgs, user) {
        if (o.track.id()) {
            return await this.Track.trackBase(orm, await o.track.getOrFail(), trackArgs, user);
        }
        if (o.episode.id()) {
            return await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user);
        }
        throw new Error('Internal: Invalid Playlist Entry');
    }
    async playQueue(orm, o, playQueueArgs, trackArgs, episodeArgs, user) {
        return {
            ...(await this.PlayQueue.playQueueBase(orm, o, playQueueArgs, user)),
            entries: playQueueArgs.playQueueEntries ? await Promise.all((await o.entries.getItems()).map(t => this.playQueueEntry(orm, t, trackArgs, episodeArgs, user))) : undefined
        };
    }
    async playQueueEntry(orm, o, trackArgs, episodeArgs, user) {
        if (o.track.id()) {
            return await this.Track.trackBase(orm, await o.track.getOrFail(), trackArgs, user);
        }
        if (o.episode.id()) {
            return await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeArgs, user);
        }
        throw new Error('Internal: Invalid PlayQueue Entry');
    }
    async podcast(orm, o, podcastArgs, podcastChildrenArgs, episodeArgs, user) {
        return {
            ...(await this.Podcast.podcastBase(orm, o, podcastArgs, user)),
            episodes: podcastChildrenArgs.podcastIncEpisodes ? await Promise.all((await o.episodes.getItems()).map(t => this.Episode.episodeBase(orm, t, episodeArgs, user))) : undefined,
        };
    }
    async nowPlaying(orm, o, nowPlayingArgs, trackArgs, episodeArgs, user) {
        var _a, _b;
        return {
            userName: o.user.name,
            userID: o.user.id,
            minutesAgo: Math.round(moment_1.default.duration(moment_1.default().diff(moment_1.default(o.time))).asMinutes()),
            trackID: nowPlayingArgs.nowPlayingIncTrackIDs ? (_a = o.track) === null || _a === void 0 ? void 0 : _a.id : undefined,
            track: nowPlayingArgs.nowPlayingIncTracks && o.track ? (await this.Track.trackBase(orm, o.track, trackArgs, user)) : undefined,
            episodeID: nowPlayingArgs.nowPlayingIncEpisodeIDs ? (_b = o.episode) === null || _b === void 0 ? void 0 : _b.id : undefined,
            episode: nowPlayingArgs.nowPlayingIncEpisodes && o.episode ? (await this.Episode.episodeBase(orm, o.episode, episodeArgs, user)) : undefined
        };
    }
    async series(orm, o, seriesArgs, seriesChildrenArgs, albumArgs, trackArgs, user) {
        return {
            ...(await this.Series.seriesBase(orm, o, seriesArgs, user)),
            tracks: seriesChildrenArgs.seriesIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackArgs, user) : undefined,
            albums: seriesChildrenArgs.seriesIncAlbums ? await this.Album.albumBases(orm, await o.albums.getItems(), albumArgs, user) : undefined
        };
    }
    async track(orm, o, trackArgs, user) {
        return this.Track.trackBase(orm, o, trackArgs, user);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", base_transform_1.BaseTransformService)
], TransformService.prototype, "Base", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", chat_transform_1.ChatTransformService)
], TransformService.prototype, "Chat", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", genre_transform_1.GenreTransformService)
], TransformService.prototype, "Genre", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", radio_transform_1.RadioTransformService)
], TransformService.prototype, "Radio", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", root_transform_1.RootTransformService)
], TransformService.prototype, "Root", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", podcast_transform_1.PodcastTransformService)
], TransformService.prototype, "Podcast", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", episode_transform_1.EpisodeTransformService)
], TransformService.prototype, "Episode", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", folder_transform_1.FolderTransformService)
], TransformService.prototype, "Folder", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", track_transform_1.TrackTransformService)
], TransformService.prototype, "Track", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", series_transform_1.SeriesTransformService)
], TransformService.prototype, "Series", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", artist_transform_1.ArtistTransformService)
], TransformService.prototype, "Artist", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", album_transform_1.AlbumTransformService)
], TransformService.prototype, "Album", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", artwork_transform_1.ArtworkTransformService)
], TransformService.prototype, "Artwork", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", playlist_transform_1.PlaylistTransformService)
], TransformService.prototype, "Playlist", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", bookmark_transform_1.BookmarkTransformService)
], TransformService.prototype, "Bookmark", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", playqueue_transform_1.PlayQueueTransformService)
], TransformService.prototype, "PlayQueue", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", session_transform_1.SessionTransformService)
], TransformService.prototype, "Session", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", user_transform_1.UserTransformService)
], TransformService.prototype, "User", void 0);
TransformService = __decorate([
    typescript_ioc_1.InRequestScope
], TransformService);
exports.TransformService = TransformService;
//# sourceMappingURL=transform.service.js.map