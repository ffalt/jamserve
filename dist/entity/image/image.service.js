var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var ImageService_1;
import path from 'path';
import { Inject, InRequestScope } from 'typescript-ioc';
import { ImageModule } from '../../modules/image/image.module';
import { DBObjectType, FolderType } from '../../types/enums';
import { AudioModule } from '../../modules/audio/audio.module';
import { PodcastService } from '../podcast/podcast.service';
import { TrackService } from '../track/track.service';
import { FolderService } from '../folder/folder.service';
import { UserService } from '../user/user.service';
import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { SeriesService } from '../series/series.service';
import { RootService } from '../root/root.service';
import { ArtworkService } from '../artwork/artwork.service';
let ImageService = ImageService_1 = class ImageService {
    static getCoverArtTextFolder(folder) {
        let result;
        if (folder.folderType === FolderType.artist) {
            result = folder.artist;
        }
        else if ([FolderType.multialbum, FolderType.album].includes(folder.folderType)) {
            result = folder.album;
        }
        if (!result || result.length === 0) {
            result = path.basename(folder.path);
        }
        return result;
    }
    static async getCoverArtTextEpisode(episode) {
        const tag = await episode.tag.get();
        let text = tag?.title;
        if (!text && episode.path) {
            text = path.basename(episode.path);
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
        return tag && tag.title ? tag.title : path.basename(track.path);
    }
    static getCoverArtTextPodcast(podcast) {
        return podcast.title || podcast.url;
    }
    async getCoverArtText(o, type) {
        switch (type) {
            case DBObjectType.track:
                return await ImageService_1.getCoverArtTextTrack(o);
            case DBObjectType.folder:
                return ImageService_1.getCoverArtTextFolder(o);
            case DBObjectType.episode:
                return await ImageService_1.getCoverArtTextEpisode(o);
            case DBObjectType.podcast:
                return ImageService_1.getCoverArtTextPodcast(o);
            case DBObjectType.playlist:
                return o.name;
            case DBObjectType.series:
                return o.name;
            case DBObjectType.album:
                return o.name;
            case DBObjectType.artist:
                return o.name;
            case DBObjectType.user:
                return o.name;
            case DBObjectType.root:
                return o.name;
        }
        return type;
    }
    async getObjImageByType(orm, o, type, size, format) {
        switch (type) {
            case DBObjectType.track:
                return this.trackService.getImage(orm, o, size, format);
            case DBObjectType.folder:
                return this.folderService.getImage(orm, o, size, format);
            case DBObjectType.artist:
                return this.artistService.getImage(orm, o, size, format);
            case DBObjectType.album:
                return this.albumService.getImage(orm, o, size, format);
            case DBObjectType.user:
                return this.userService.getImage(orm, o, size, format);
            case DBObjectType.podcast:
                return this.podcastService.getImage(orm, o, size, format);
            case DBObjectType.episode:
                return this.podcastService.getEpisodeImage(orm, o, size, format);
            case DBObjectType.series:
                return this.seriesService.getImage(orm, o, size, format);
            case DBObjectType.artwork:
                return this.artworkService.getImage(orm, o, size, format);
            case DBObjectType.root:
                return this.rootService.getImage(orm, o, size, format);
        }
        return;
    }
    async getObjImage(orm, o, type, size, format) {
        return await this.getObjImageByType(orm, o, type, size, format) ?? await this.paintImage(o, type, size, format);
    }
    async paintImage(obj, type, size, format) {
        const s = await this.getCoverArtText(obj, type);
        return this.imageModule.paint(s, size || 128, format);
    }
};
__decorate([
    Inject,
    __metadata("design:type", ImageModule)
], ImageService.prototype, "imageModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], ImageService.prototype, "audioModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", PodcastService)
], ImageService.prototype, "podcastService", void 0);
__decorate([
    Inject,
    __metadata("design:type", TrackService)
], ImageService.prototype, "trackService", void 0);
__decorate([
    Inject,
    __metadata("design:type", FolderService)
], ImageService.prototype, "folderService", void 0);
__decorate([
    Inject,
    __metadata("design:type", UserService)
], ImageService.prototype, "userService", void 0);
__decorate([
    Inject,
    __metadata("design:type", RootService)
], ImageService.prototype, "rootService", void 0);
__decorate([
    Inject,
    __metadata("design:type", SeriesService)
], ImageService.prototype, "seriesService", void 0);
__decorate([
    Inject,
    __metadata("design:type", ArtistService)
], ImageService.prototype, "artistService", void 0);
__decorate([
    Inject,
    __metadata("design:type", AlbumService)
], ImageService.prototype, "albumService", void 0);
__decorate([
    Inject,
    __metadata("design:type", ArtworkService)
], ImageService.prototype, "artworkService", void 0);
ImageService = ImageService_1 = __decorate([
    InRequestScope
], ImageService);
export { ImageService };
//# sourceMappingURL=image.service.js.map