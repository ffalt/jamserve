var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import moment from 'moment';
import { Inject, InRequestScope } from 'typescript-ioc';
import { ChatTransformService } from '../../../entity/chat/chat.transform';
import { GenreTransformService } from '../../../entity/genre/genre.transform';
import { RadioTransformService } from '../../../entity/radio/radio.transform';
import { RootTransformService } from '../../../entity/root/root.transform';
import { PodcastTransformService } from '../../../entity/podcast/podcast.transform';
import { EpisodeTransformService } from '../../../entity/episode/episode.transform';
import { FolderTransformService } from '../../../entity/folder/folder.transform';
import { TrackTransformService } from '../../../entity/track/track.transform';
import { SeriesTransformService } from '../../../entity/series/series.transform';
import { ArtistTransformService } from '../../../entity/artist/artist.transform';
import { AlbumTransformService } from '../../../entity/album/album.transform';
import { ArtworkTransformService } from '../../../entity/artwork/artwork.transform';
import { PlaylistTransformService } from '../../../entity/playlist/playlist.transform';
import { BookmarkTransformService } from '../../../entity/bookmark/bookmark.transform';
import { PlayQueueTransformService } from '../../../entity/playqueue/playqueue.transform';
import { BaseTransformService } from '../../../entity/base/base.transform';
import { SessionTransformService } from '../../../entity/session/session.transform';
import { UserTransformService } from '../../../entity/user/user.transform';
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
        return {
            userName: o.user.name,
            userID: o.user.id,
            minutesAgo: Math.round(moment.duration(moment().diff(moment(o.time))).asMinutes()),
            trackID: nowPlayingArgs.nowPlayingIncTrackIDs ? o.track?.id : undefined,
            track: nowPlayingArgs.nowPlayingIncTracks && o.track ? (await this.Track.trackBase(orm, o.track, trackArgs, user)) : undefined,
            episodeID: nowPlayingArgs.nowPlayingIncEpisodeIDs ? o.episode?.id : undefined,
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
    Inject,
    __metadata("design:type", BaseTransformService)
], TransformService.prototype, "Base", void 0);
__decorate([
    Inject,
    __metadata("design:type", ChatTransformService)
], TransformService.prototype, "Chat", void 0);
__decorate([
    Inject,
    __metadata("design:type", GenreTransformService)
], TransformService.prototype, "Genre", void 0);
__decorate([
    Inject,
    __metadata("design:type", RadioTransformService)
], TransformService.prototype, "Radio", void 0);
__decorate([
    Inject,
    __metadata("design:type", RootTransformService)
], TransformService.prototype, "Root", void 0);
__decorate([
    Inject,
    __metadata("design:type", PodcastTransformService)
], TransformService.prototype, "Podcast", void 0);
__decorate([
    Inject,
    __metadata("design:type", EpisodeTransformService)
], TransformService.prototype, "Episode", void 0);
__decorate([
    Inject,
    __metadata("design:type", FolderTransformService)
], TransformService.prototype, "Folder", void 0);
__decorate([
    Inject,
    __metadata("design:type", TrackTransformService)
], TransformService.prototype, "Track", void 0);
__decorate([
    Inject,
    __metadata("design:type", SeriesTransformService)
], TransformService.prototype, "Series", void 0);
__decorate([
    Inject,
    __metadata("design:type", ArtistTransformService)
], TransformService.prototype, "Artist", void 0);
__decorate([
    Inject,
    __metadata("design:type", AlbumTransformService)
], TransformService.prototype, "Album", void 0);
__decorate([
    Inject,
    __metadata("design:type", ArtworkTransformService)
], TransformService.prototype, "Artwork", void 0);
__decorate([
    Inject,
    __metadata("design:type", PlaylistTransformService)
], TransformService.prototype, "Playlist", void 0);
__decorate([
    Inject,
    __metadata("design:type", BookmarkTransformService)
], TransformService.prototype, "Bookmark", void 0);
__decorate([
    Inject,
    __metadata("design:type", PlayQueueTransformService)
], TransformService.prototype, "PlayQueue", void 0);
__decorate([
    Inject,
    __metadata("design:type", SessionTransformService)
], TransformService.prototype, "Session", void 0);
__decorate([
    Inject,
    __metadata("design:type", UserTransformService)
], TransformService.prototype, "User", void 0);
TransformService = __decorate([
    InRequestScope
], TransformService);
export { TransformService };
//# sourceMappingURL=transform.service.js.map