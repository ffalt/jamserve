var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { minutesAgo } from '../../../utils/date-time.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { ChatTransformService } from '../../../entity/chat/chat.transform.js';
import { GenreTransformService } from '../../../entity/genre/genre.transform.js';
import { RadioTransformService } from '../../../entity/radio/radio.transform.js';
import { RootTransformService } from '../../../entity/root/root.transform.js';
import { PodcastTransformService } from '../../../entity/podcast/podcast.transform.js';
import { EpisodeTransformService } from '../../../entity/episode/episode.transform.js';
import { FolderTransformService } from '../../../entity/folder/folder.transform.js';
import { TrackTransformService } from '../../../entity/track/track.transform.js';
import { SeriesTransformService } from '../../../entity/series/series.transform.js';
import { ArtistTransformService } from '../../../entity/artist/artist.transform.js';
import { AlbumTransformService } from '../../../entity/album/album.transform.js';
import { ArtworkTransformService } from '../../../entity/artwork/artwork.transform.js';
import { PlaylistTransformService } from '../../../entity/playlist/playlist.transform.js';
import { BookmarkTransformService } from '../../../entity/bookmark/bookmark.transform.js';
import { PlayQueueTransformService } from '../../../entity/playqueue/playqueue.transform.js';
import { BaseTransformService } from '../../../entity/base/base.transform.js';
import { SessionTransformService } from '../../../entity/session/session.transform.js';
import { UserTransformService } from '../../../entity/user/user.transform.js';
let TransformService = class TransformService {
    async album(orm, o, albumParameters, albumChildrenParameters, trackParameters, artistIncludes, user) {
        return {
            ...(await this.Album.albumBase(orm, o, albumParameters, user)),
            tracks: albumChildrenParameters.albumIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackParameters, user) : undefined,
            artist: albumChildrenParameters.albumIncArtist ? await this.Artist.artistBase(orm, await o.artist.getOrFail(), artistIncludes, user) : undefined
        };
    }
    async artist(orm, o, artistParameters, artistChildrenParameters, trackParameters, albumParameters, seriesParameters, user) {
        return {
            ...(await this.Artist.artistBase(orm, o, artistParameters, user)),
            tracks: artistChildrenParameters.artistIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackParameters, user) : undefined,
            albums: artistChildrenParameters.artistIncAlbums ? await this.Album.albumBases(orm, await o.albums.getItems(), albumParameters, user) : undefined,
            series: artistChildrenParameters.artistIncSeries ? await this.Series.seriesBases(orm, await o.series.getItems(), seriesParameters, user) : undefined
        };
    }
    async artwork(orm, o, artworksParameters, artworkChildrenParameters, folderParameters, user) {
        return {
            ...(await this.Artwork.artworkBase(orm, o, artworksParameters, user)),
            folder: artworkChildrenParameters.artworkIncFolder ? await this.Folder.folderBase(orm, await o.folder.getOrFail(), folderParameters, user) : undefined
        };
    }
    async bookmark(orm, o, bookmarkParameters, trackParameters, episodeParameters, user) {
        return {
            ...(await this.Bookmark.bookmarkBase(orm, o)),
            track: bookmarkParameters.bookmarkIncTrack && o.track.id() ? await this.Track.trackBase(orm, await o.track.getOrFail(), trackParameters, user) : undefined,
            episode: bookmarkParameters.bookmarkIncTrack && o.episode.id() ? await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeParameters, user) : undefined
        };
    }
    async episode(orm, o, episodeParameters, episodeParentParameters, podcastParameters, user) {
        return {
            ...(await this.Episode.episodeBase(orm, o, episodeParameters, user)),
            podcast: episodeParentParameters.episodeIncParent ? await this.Podcast.podcastBase(orm, await o.podcast.getOrFail(), podcastParameters, user) : undefined
        };
    }
    async folder(orm, o, folderParameters, folderChildrenParameters, trackParameters, artworkParameters, user) {
        return {
            ...(await this.Folder.folderBase(orm, o, folderParameters, user)),
            tracks: folderChildrenParameters.folderIncChildren || folderChildrenParameters.folderIncTracks ?
                await this.Track.trackBases(orm, await o.tracks.getItems(), trackParameters, user) :
                undefined,
            folders: folderChildrenParameters.folderIncChildren || folderChildrenParameters.folderIncFolders ?
                await this.Folder.folderChildren(orm, o, folderChildrenParameters, user) :
                undefined,
            artworks: folderChildrenParameters.folderIncArtworks ?
                await this.Artwork.artworkBases(orm, await o.artworks.getItems(), artworkParameters, user) :
                undefined
        };
    }
    async playlist(orm, o, playlistParameters, trackParameters, episodeParameters, user) {
        const entries = playlistParameters.playlistIncEntriesIDs || playlistParameters.playlistIncEntries ? await o.entries.getItems() : [];
        return {
            ...(await this.Playlist.playlistBase(orm, o, playlistParameters, user)),
            entries: playlistParameters.playlistIncEntries ? await Promise.all(entries.map(t => this.playlistEntry(orm, t, trackParameters, episodeParameters, user))) : undefined
        };
    }
    async playlistEntry(orm, o, trackParameters, episodeParameters, user) {
        if (o.track.id()) {
            return await this.Track.trackBase(orm, await o.track.getOrFail(), trackParameters, user);
        }
        if (o.episode.id()) {
            return await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeParameters, user);
        }
        throw new Error('Internal: Invalid Playlist Entry');
    }
    async playQueue(orm, o, playQueueParameters, trackParameters, episodeParameters, user) {
        let entries;
        if (playQueueParameters.playQueueEntries) {
            const items = await o.entries.getItems();
            entries = await Promise.all(items.map(t => this.playQueueEntry(orm, t, trackParameters, episodeParameters, user)));
        }
        return {
            ...(await this.PlayQueue.playQueueBase(orm, o, playQueueParameters, user)),
            entries
        };
    }
    async playQueueEntry(orm, o, trackParameters, episodeParameters, user) {
        if (o.track.id()) {
            return await this.Track.trackBase(orm, await o.track.getOrFail(), trackParameters, user);
        }
        if (o.episode.id()) {
            return await this.Episode.episodeBase(orm, await o.episode.getOrFail(), episodeParameters, user);
        }
        throw new Error('Internal: Invalid PlayQueue Entry');
    }
    async podcast(orm, o, podcastParameters, podcastChildrenParameters, episodeParameters, user) {
        let episodes;
        if (podcastChildrenParameters.podcastIncEpisodes) {
            const items = await o.episodes.getItems();
            episodes = await Promise.all(items.map(t => this.Episode.episodeBase(orm, t, episodeParameters, user)));
        }
        return {
            ...(await this.Podcast.podcastBase(orm, o, podcastParameters, user)),
            episodes
        };
    }
    async nowPlaying(orm, o, nowPlayingParameters, trackParameters, episodeParameters, user) {
        return {
            userName: o.user.name,
            userID: o.user.id,
            minutesAgo: minutesAgo(o.time),
            trackID: nowPlayingParameters.nowPlayingIncTrackIDs ? o.track?.id : undefined,
            track: nowPlayingParameters.nowPlayingIncTracks && o.track ? (await this.Track.trackBase(orm, o.track, trackParameters, user)) : undefined,
            episodeID: nowPlayingParameters.nowPlayingIncEpisodeIDs ? o.episode?.id : undefined,
            episode: nowPlayingParameters.nowPlayingIncEpisodes && o.episode ? (await this.Episode.episodeBase(orm, o.episode, episodeParameters, user)) : undefined
        };
    }
    async series(orm, o, seriesParameters, seriesChildrenParameters, albumParameters, trackParameters, user) {
        return {
            ...(await this.Series.seriesBase(orm, o, seriesParameters, user)),
            tracks: seriesChildrenParameters.seriesIncTracks ? await this.Track.trackBases(orm, await o.tracks.getItems(), trackParameters, user) : undefined,
            albums: seriesChildrenParameters.seriesIncAlbums ? await this.Album.albumBases(orm, await o.albums.getItems(), albumParameters, user) : undefined
        };
    }
    async track(orm, o, trackParameters, user) {
        return this.Track.trackBase(orm, o, trackParameters, user);
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