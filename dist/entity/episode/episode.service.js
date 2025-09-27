var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import fse from 'fs-extra';
import path from 'node:path';
import { AudioModule } from '../../modules/audio/audio.module.js';
import { ImageModule } from '../../modules/image/image.module.js';
import { downloadFile } from '../../utils/download.js';
import { SupportedAudioFormat } from '../../utils/filetype.js';
import { fileDeleteIfExists, fileSuffix } from '../../utils/fs-utils.js';
import { logger } from '../../utils/logger.js';
import { Inject, InRequestScope } from 'typescript-ioc';
import { DebouncePromises } from '../../utils/debounce-promises.js';
import { PodcastStatus } from '../../types/enums.js';
import { ConfigService } from '../../modules/engine/services/config.service.js';
const log = logger('EpisodeService');
let EpisodeService = class EpisodeService {
    constructor() {
        this.episodeDownloadDebounce = new DebouncePromises();
        this.podcastsPath = this.configService.getDataPath(['podcasts']);
    }
    isDownloading(podcastEpisodeId) {
        return this.episodeDownloadDebounce.isPending(podcastEpisodeId);
    }
    async downloadEpisodeFile(episode) {
        const enclosures = episode.enclosuresJSON ? JSON.parse(episode.enclosuresJSON) : undefined;
        const url = enclosures?.at(0)?.url;
        if (!url) {
            throw new Error('No podcast episode url found');
        }
        let suffix = fileSuffix(url);
        if (suffix.includes('?')) {
            suffix = suffix.slice(0, suffix.indexOf('?'));
        }
        if (!SupportedAudioFormat.includes(suffix)) {
            throw new Error(`Unsupported Podcast audio format .${suffix}`);
        }
        const podcastID = episode.podcast.idOrFail();
        const p = path.resolve(this.podcastsPath, podcastID);
        await fse.ensureDir(p);
        const filename = path.join(p, `${episode.id}.${suffix}`);
        log.info('retrieving file', url);
        await downloadFile(url, filename);
        return filename;
    }
    async downloadEpisode(orm, episode) {
        if (this.episodeDownloadDebounce.isPending(episode.id)) {
            return this.episodeDownloadDebounce.append(episode.id);
        }
        this.episodeDownloadDebounce.setPending(episode.id);
        try {
            try {
                const filename = await this.downloadEpisodeFile(episode);
                const stat = await fse.stat(filename);
                const result = await this.audioModule.read(filename);
                const oldTag = await episode.tag.get();
                if (oldTag) {
                    orm.Tag.removeLater(oldTag);
                }
                const tag = orm.Tag.createByScan(result, filename);
                orm.Tag.persistLater(tag);
                await episode.tag.set(tag);
                episode.status = PodcastStatus.completed;
                episode.statCreated = stat.ctime;
                episode.statModified = stat.mtime;
                episode.fileSize = stat.size;
                episode.duration = result.mediaDuration;
                episode.path = filename;
            }
            catch (error) {
                episode.status = PodcastStatus.error;
                episode.error = JSON.stringify(error);
            }
            await orm.Episode.persistAndFlush(episode);
            this.episodeDownloadDebounce.resolve(episode.id, undefined);
        }
        catch (error) {
            this.episodeDownloadDebounce.resolve(episode.id, undefined);
            return Promise.reject(error);
        }
    }
    async removeEpisodes(orm, podcastID) {
        const removeEpisodes = await orm.Episode.find({ where: { podcast: podcastID } });
        await this.imageModule.clearImageCacheByIDs(removeEpisodes.map(it => it.id));
        for (const episode of removeEpisodes) {
            orm.Episode.removeLater(episode);
            if (episode.path) {
                await fileDeleteIfExists(episode.path);
            }
        }
    }
    async deleteEpisode(orm, episode) {
        if (!episode.path) {
            return;
        }
        await fileDeleteIfExists(episode.path);
        const tag = await episode.tag.get();
        if (tag) {
            orm.Tag.removeLater(tag);
        }
        await episode.tag.set(undefined);
        episode.path = undefined;
        episode.statCreated = undefined;
        episode.statModified = undefined;
        episode.fileSize = undefined;
        episode.status = PodcastStatus.deleted;
        await orm.Episode.persistAndFlush(episode);
    }
    async getImage(episode, size, format) {
        if (!episode.path) {
            return;
        }
        const tag = await episode.tag.get();
        if (tag?.nrTagImages) {
            const result = await this.imageModule.getExisting(episode.id, size, format);
            if (result) {
                return result;
            }
            try {
                const buffer = await this.audioModule.extractTagImage(episode.path);
                if (buffer) {
                    return await this.imageModule.getBuffer(episode.id, buffer, size, format);
                }
            }
            catch {
                log.error('getImage', `Extracting image from audio failed: ${episode.path}`);
            }
        }
        return;
    }
};
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], EpisodeService.prototype, "audioModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", ImageModule)
], EpisodeService.prototype, "imageModule", void 0);
__decorate([
    Inject,
    __metadata("design:type", ConfigService)
], EpisodeService.prototype, "configService", void 0);
EpisodeService = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], EpisodeService);
export { EpisodeService };
//# sourceMappingURL=episode.service.js.map