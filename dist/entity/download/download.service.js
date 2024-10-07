var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var DownloadService_1;
import path from 'path';
import { InRequestScope } from 'typescript-ioc';
import { CompressListStream } from '../../utils/compress-list-stream.js';
import { CompressFolderStream } from '../../utils/compress-folder-stream.js';
import { DBObjectType } from '../../types/enums.js';
import { InvalidParamError, UnauthError } from '../../modules/deco/express/express-error.js';
let DownloadService = DownloadService_1 = class DownloadService {
    static async downloadEpisode(episode, format) {
        if (!episode.path) {
            return Promise.reject(Error('Podcast episode not ready'));
        }
        return { pipe: new CompressListStream([episode.path], path.basename(episode.path), format) };
    }
    static async downloadTrack(track, format) {
        return { pipe: new CompressListStream([path.join(track.path, track.fileName)], path.basename(track.fileName), format) };
    }
    static async downloadArtwork(artwork, format) {
        return { pipe: new CompressListStream([path.join(artwork.path, artwork.name)], path.basename(artwork.name), format) };
    }
    static async downloadFolder(folder, format) {
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
    static async downloadPlaylist(playlist, format, user) {
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
                return DownloadService_1.downloadTrack(o, format);
            case DBObjectType.artwork:
                return DownloadService_1.downloadArtwork(o, format);
            case DBObjectType.folder:
                return DownloadService_1.downloadFolder(o, format);
            case DBObjectType.artist:
                return this.downloadArtist(o, format);
            case DBObjectType.series:
                return this.downloadSeries(o, format);
            case DBObjectType.album:
                return this.downloadAlbum(o, format);
            case DBObjectType.episode:
                return DownloadService_1.downloadEpisode(o, format);
            case DBObjectType.podcast:
                return this.downloadPodcast(o, format);
            case DBObjectType.playlist:
                return DownloadService_1.downloadPlaylist(o, format, user);
            default:
        }
        return Promise.reject(InvalidParamError('type', 'Invalid Download Type'));
    }
};
DownloadService = DownloadService_1 = __decorate([
    InRequestScope
], DownloadService);
export { DownloadService };
//# sourceMappingURL=download.service.js.map