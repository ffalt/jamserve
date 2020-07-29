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
var ImageService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageService = void 0;
const path_1 = __importDefault(require("path"));
const typescript_ioc_1 = require("typescript-ioc");
const image_module_1 = require("../../modules/image/image.module");
const enums_1 = require("../../types/enums");
const audio_module_1 = require("../../modules/audio/audio.module");
const podcast_service_1 = require("../podcast/podcast.service");
const track_service_1 = require("../track/track.service");
const folder_service_1 = require("../folder/folder.service");
const user_service_1 = require("../user/user.service");
const album_service_1 = require("../album/album.service");
const artist_service_1 = require("../artist/artist.service");
const series_service_1 = require("../series/series.service");
const root_service_1 = require("../root/root.service");
const artwork_service_1 = require("../artwork/artwork.service");
let ImageService = ImageService_1 = class ImageService {
    static getCoverArtTextFolder(folder) {
        let result;
        if (folder.folderType === enums_1.FolderType.artist) {
            result = folder.artist;
        }
        else if ([enums_1.FolderType.multialbum, enums_1.FolderType.album].includes(folder.folderType)) {
            result = folder.album;
        }
        if (!result || result.length === 0) {
            result = path_1.default.basename(folder.path);
        }
        return result;
    }
    static async getCoverArtTextEpisode(episode) {
        const tag = await episode.tag.get();
        let text = tag === null || tag === void 0 ? void 0 : tag.title;
        if (!text && episode.path) {
            text = path_1.default.basename(episode.path);
        }
        if (!text) {
            text = episode.name;
        }
        if (!text) {
            text = 'Podcast Episode';
        }
        return text;
    }
    static async getCoverArtTextTrack(track) {
        const tag = await track.tag.get();
        return tag && tag.title ? tag.title : path_1.default.basename(track.path);
    }
    static getCoverArtTextPodcast(podcast) {
        return podcast.title || podcast.url;
    }
    async getCoverArtText(o, type) {
        switch (type) {
            case enums_1.DBObjectType.track:
                return await ImageService_1.getCoverArtTextTrack(o);
            case enums_1.DBObjectType.folder:
                return ImageService_1.getCoverArtTextFolder(o);
            case enums_1.DBObjectType.episode:
                return await ImageService_1.getCoverArtTextEpisode(o);
            case enums_1.DBObjectType.playlist:
                return o.name;
            case enums_1.DBObjectType.series:
                return o.name;
            case enums_1.DBObjectType.podcast:
                return ImageService_1.getCoverArtTextPodcast(o);
            case enums_1.DBObjectType.album:
                return o.name;
            case enums_1.DBObjectType.artist:
                return o.name;
            case enums_1.DBObjectType.user:
                return o.name;
            case enums_1.DBObjectType.root:
                return o.name;
            default:
                return type;
        }
    }
    async getObjImage(orm, o, type, size, format) {
        let result;
        switch (type) {
            case enums_1.DBObjectType.track:
                result = await this.trackService.getImage(orm, o, size, format);
                break;
            case enums_1.DBObjectType.folder:
                result = await this.folderService.getImage(orm, o, size, format);
                break;
            case enums_1.DBObjectType.artist:
                result = await this.artistService.getImage(orm, o, size, format);
                break;
            case enums_1.DBObjectType.album:
                result = await this.albumService.getImage(orm, o, size, format);
                break;
            case enums_1.DBObjectType.user:
                result = await this.userService.getImage(orm, o, size, format);
                break;
            case enums_1.DBObjectType.podcast:
                result = await this.podcastService.getImage(orm, o, size, format);
                break;
            case enums_1.DBObjectType.episode:
                result = await this.podcastService.getEpisodeImage(orm, o, size, format);
                break;
            case enums_1.DBObjectType.series:
                result = await this.seriesService.getImage(orm, o, size, format);
                break;
            case enums_1.DBObjectType.artwork:
                result = await this.artworkService.getImage(orm, o, size, format);
                break;
            case enums_1.DBObjectType.root: {
                result = await this.rootService.getImage(orm, o, size, format);
                break;
            }
            default:
                break;
        }
        if (!result) {
            return this.paintImage(o, type, size, format);
        }
        return result;
    }
    async paintImage(obj, type, size, format) {
        const s = await this.getCoverArtText(obj, type);
        return this.imageModule.paint(s, size || 128, format);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_module_1.ImageModule)
], ImageService.prototype, "imageModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], ImageService.prototype, "audioModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", podcast_service_1.PodcastService)
], ImageService.prototype, "podcastService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", track_service_1.TrackService)
], ImageService.prototype, "trackService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", folder_service_1.FolderService)
], ImageService.prototype, "folderService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", user_service_1.UserService)
], ImageService.prototype, "userService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", root_service_1.RootService)
], ImageService.prototype, "rootService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", series_service_1.SeriesService)
], ImageService.prototype, "seriesService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", artist_service_1.ArtistService)
], ImageService.prototype, "artistService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", album_service_1.AlbumService)
], ImageService.prototype, "albumService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", artwork_service_1.ArtworkService)
], ImageService.prototype, "artworkService", void 0);
ImageService = ImageService_1 = __decorate([
    typescript_ioc_1.InRequestScope
], ImageService);
exports.ImageService = ImageService;
//# sourceMappingURL=image.service.js.map