var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import path from 'path';
import { InRequestScope } from 'typescript-ioc';
import { InvalidParamError, UnauthError } from '../../modules/rest';
import { CompressListStream } from '../../utils/compress-list-stream';
import { CompressFolderStream } from '../../utils/compress-folder-stream';
import { DBObjectType } from '../../types/enums';
let DownloadService = class DownloadService {
    async downloadEpisode(episode, format) {
        if (!episode.path) {
            return Promise.reject(Error('Podcast episode not ready'));
        }
        return { pipe: new CompressListStream([episode.path], path.basename(episode.path), format) };
    }
    async downloadTrack(track, format) {
        return { pipe: new CompressListStream([path.join(track.path, track.fileName)], path.basename(track.fileName), format) };
    }
    async downloadArtwork(artwork, format) {
        return { pipe: new CompressListStream([path.join(artwork.path, artwork.name)], path.basename(artwork.name), format) };
    }
    async downloadFolder(folder, format) {
        return { pipe: new CompressFolderStream(folder.path, path.basename(folder.path), format) };
    }
    async downloadArtist(artist, format) {
        const tracks = await artist.tracks.getItems();
        const fileList = tracks.map(t => path.join(t.path, t.fileName));
        return { pipe: new CompressListStream(fileList, artist.name, format) };
    }
    async downloadSeries(series, format) {
        const tracks = await series.tracks.getItems();
        const fileList = tracks.map(t => path.join(t.path, t.fileName));
        return { pipe: new CompressListStream(fileList, series.name, format) };
    }
    async downloadAlbum(album, format) {
        const tracks = await album.tracks.getItems();
        const fileList = tracks.map(t => path.join(t.path, t.fileName));
        return { pipe: new CompressListStream(fileList, album.name, format) };
    }
    async downloadPodcast(podcast, format) {
        const episodes = await podcast.episodes.getItems();
        const fileList = episodes.filter(e => !!e.path).map(e => e.path);
        return { pipe: new CompressListStream(fileList, podcast.id, format) };
    }
    async downloadPlaylist(playlist, format, user) {
        const userID = await playlist.user.id();
        if (userID !== user.id && !playlist.isPublic) {
            return Promise.reject(UnauthError());
        }
        const entries = await playlist.entries.getItems();
        const fileList = [];
        for (const entry of entries) {
            const track = await entry.track.get();
            if (track) {
                fileList.push(path.join(track.path, track.fileName));
            }
            else {
                const episode = await entry.episode.get();
                if (episode?.path) {
                    fileList.push(episode.path);
                }
            }
        }
        return { pipe: new CompressListStream(fileList, playlist.name, format) };
    }
    async getObjDownload(o, objType, format, user) {
        switch (objType) {
            case DBObjectType.track:
                return this.downloadTrack(o, format);
            case DBObjectType.artwork:
                return this.downloadArtwork(o, format);
            case DBObjectType.folder:
                return this.downloadFolder(o, format);
            case DBObjectType.artist:
                return this.downloadArtist(o, format);
            case DBObjectType.series:
                return this.downloadSeries(o, format);
            case DBObjectType.album:
                return this.downloadAlbum(o, format);
            case DBObjectType.episode:
                return this.downloadEpisode(o, format);
            case DBObjectType.podcast:
                return this.downloadPodcast(o, format);
            case DBObjectType.playlist:
                return this.downloadPlaylist(o, format, user);
            default:
        }
        return Promise.reject(InvalidParamError('type', 'Invalid Download Type'));
    }
};
DownloadService = __decorate([
    InRequestScope
], DownloadService);
export { DownloadService };
//# sourceMappingURL=download.service.js.map