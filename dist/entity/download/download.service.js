"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DownloadService = void 0;
const path_1 = __importDefault(require("path"));
const typescript_ioc_1 = require("typescript-ioc");
const compress_list_stream_1 = require("../../utils/compress-list-stream");
const compress_folder_stream_1 = require("../../utils/compress-folder-stream");
const express_error_1 = require("../../modules/rest/builder/express-error");
const enums_1 = require("../../types/enums");
let DownloadService = class DownloadService {
    async downloadEpisode(episode, format) {
        if (!episode.path) {
            return Promise.reject(Error('Podcast episode not ready'));
        }
        return { pipe: new compress_list_stream_1.CompressListStream([episode.path], path_1.default.basename(episode.path), format) };
    }
    async downloadTrack(track, format) {
        return { pipe: new compress_list_stream_1.CompressListStream([path_1.default.join(track.path, track.fileName)], path_1.default.basename(track.fileName), format) };
    }
    async downloadArtwork(artwork, format) {
        return { pipe: new compress_list_stream_1.CompressListStream([path_1.default.join(artwork.path, artwork.name)], path_1.default.basename(artwork.name), format) };
    }
    async downloadFolder(folder, format) {
        return { pipe: new compress_folder_stream_1.CompressFolderStream(folder.path, path_1.default.basename(folder.path), format) };
    }
    async downloadArtist(artist, format) {
        const tracks = await artist.tracks.getItems();
        const fileList = tracks.map(t => path_1.default.join(t.path, t.fileName));
        return { pipe: new compress_list_stream_1.CompressListStream(fileList, artist.name, format) };
    }
    async downloadSeries(series, format) {
        const tracks = await series.tracks.getItems();
        const fileList = tracks.map(t => path_1.default.join(t.path, t.fileName));
        return { pipe: new compress_list_stream_1.CompressListStream(fileList, series.name, format) };
    }
    async downloadAlbum(album, format) {
        const tracks = await album.tracks.getItems();
        const fileList = tracks.map(t => path_1.default.join(t.path, t.fileName));
        return { pipe: new compress_list_stream_1.CompressListStream(fileList, album.name, format) };
    }
    async downloadPodcast(podcast, format) {
        const episodes = await podcast.episodes.getItems();
        const fileList = episodes.filter(e => !!e.path).map(e => e.path);
        return { pipe: new compress_list_stream_1.CompressListStream(fileList, podcast.id, format) };
    }
    async downloadPlaylist(playlist, format, user) {
        const userID = await playlist.user.id();
        if (userID !== user.id && !playlist.isPublic) {
            return Promise.reject(express_error_1.UnauthError());
        }
        const entries = await playlist.entries.getItems();
        const fileList = [];
        for (const entry of entries) {
            const track = await entry.track.get();
            if (track) {
                fileList.push(path_1.default.join(track.path, track.fileName));
            }
            else {
                const episode = await entry.episode.get();
                if (episode && episode.path) {
                    fileList.push(episode.path);
                }
            }
        }
        return { pipe: new compress_list_stream_1.CompressListStream(fileList, playlist.name, format) };
    }
    async getObjDownload(o, objType, format, user) {
        switch (objType) {
            case enums_1.DBObjectType.track:
                return this.downloadTrack(o, format);
            case enums_1.DBObjectType.artwork:
                return this.downloadArtwork(o, format);
            case enums_1.DBObjectType.folder:
                return this.downloadFolder(o, format);
            case enums_1.DBObjectType.artist:
                return this.downloadArtist(o, format);
            case enums_1.DBObjectType.series:
                return this.downloadSeries(o, format);
            case enums_1.DBObjectType.album:
                return this.downloadAlbum(o, format);
            case enums_1.DBObjectType.episode:
                return this.downloadEpisode(o, format);
            case enums_1.DBObjectType.podcast:
                return this.downloadPodcast(o, format);
            case enums_1.DBObjectType.playlist:
                return this.downloadPlaylist(o, format, user);
            default:
        }
        return Promise.reject(Error('Invalid Download Type'));
    }
};
DownloadService = __decorate([
    typescript_ioc_1.InRequestScope
], DownloadService);
exports.DownloadService = DownloadService;
//# sourceMappingURL=download.service.js.map