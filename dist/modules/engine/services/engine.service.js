var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var EngineService_1;
import path from 'path';
import fse from 'fs-extra';
import { SettingsService } from '../../../entity/settings/settings.service';
import { IoService } from './io.service';
import { ConfigService } from './config.service';
import { JAMSERVE_VERSION } from '../../../version';
import { OrmService } from './orm.service';
import { WaveformService } from '../../../entity/waveform/waveform.service';
import { Inject, InRequestScope } from 'typescript-ioc';
import { logger } from '../../../utils/logger';
import { RootScanStrategy } from '../../../types/enums';
import { UserService } from '../../../entity/user/user.service';
import { SessionService } from '../../../entity/session/session.service';
import { PodcastService } from '../../../entity/podcast/podcast.service';
import { EpisodeService } from '../../../entity/episode/episode.service';
import { GenreService } from '../../../entity/genre/genre.service';
import { StatsService } from '../../../entity/stats/stats.service';
import { MetaDataService } from '../../../entity/metadata/metadata.service';
import { AudioModule } from '../../audio/audio.module';
import { StateService } from '../../../entity/state/state.service';
import { NowPlayingService } from '../../../entity/nowplaying/nowplaying.service';
import { PlayQueueService } from '../../../entity/playqueue/playqueue.service';
import { ChatService } from '../../../entity/chat/chat.service';
import { TrackService } from '../../../entity/track/track.service';
import { ArtworkService } from '../../../entity/artwork/artwork.service';
import { DownloadService } from '../../../entity/download/download.service';
import { FolderService } from '../../../entity/folder/folder.service';
import { ImageService } from '../../../entity/image/image.service';
import { PlaylistService } from '../../../entity/playlist/playlist.service';
import { StreamService } from '../../../entity/stream/stream.service';
import { TransformService } from './transform.service';
import { BookmarkService } from '../../../entity/bookmark/bookmark.service';
import { RateLimitService } from './ratelimit.service';
const log = logger('Engine');
let EngineService = EngineService_1 = class EngineService {
    constructor() {
        this.io.registerAfterRefresh(() => this.afterRefresh());
    }
    async afterRefresh() {
    }
    resolveCachePaths() {
        return [
            this.config.getDataPath(['cache', 'waveforms']),
            this.config.getDataPath(['cache', 'uploads']),
            this.config.getDataPath(['cache', 'images']),
            this.config.getDataPath(['cache', 'transcode']),
            this.config.getDataPath(['images']),
            this.config.getDataPath(['podcasts'])
        ];
    }
    async checkRescan(orm) {
        const version = await this.settings.settingsVersion(orm);
        const forceRescan = !!version && version !== JAMSERVE_VERSION;
        if (forceRescan) {
            log.info(`Updating from version ${version || '-'}`);
        }
        if (forceRescan || this.settings.settings.library.scanAtStart) {
            log.info(`Starting rescan`);
            this.io.root.startUpRefresh(orm, forceRescan).then(() => {
                return forceRescan ? this.settings.saveSettings(orm) : undefined;
            }).catch(e => {
                log.error('Error on startup scanning', e);
            });
        }
    }
    async checkDataPaths() {
        await fse.ensureDir(path.resolve(this.config.env.paths.data));
        const paths = this.resolveCachePaths();
        for (const p of paths) {
            await fse.ensureDir(p);
        }
    }
    async init() {
        log.debug(`check data paths`);
        await this.checkDataPaths();
        log.debug(`init orm`);
        await this.orm.init(this.config);
    }
    async start() {
        log.debug(`start orm`);
        await this.orm.start();
        const orm = this.orm.fork();
        log.debug(`load settings`);
        await this.settings.loadSettings(orm);
        log.debug(`check first start`);
        await this.checkFirstStart(orm);
        log.debug(`check for rescan`);
        await this.checkRescan(orm);
    }
    async stop() {
        await this.orm.stop();
    }
    async buildAdminUser(orm, admin) {
        await this.user.createUser(orm, admin.name, admin.mail || '', admin.pass, true, true, true, true);
    }
    static async buildRoots(orm, roots) {
        for (const first of roots) {
            const root = orm.Root.create({
                name: first.name,
                path: first.path,
                strategy: first.strategy || RootScanStrategy.auto
            });
            await orm.Root.persistAndFlush(root);
        }
    }
    async checkFirstStart(orm) {
        if (!this.config.firstStart) {
            return;
        }
        if (this.config.firstStart.adminUser) {
            const count = await orm.User.count();
            if (count === 0) {
                await this.buildAdminUser(orm, this.config.firstStart.adminUser);
            }
        }
        if (this.config.firstStart.roots) {
            const count = await orm.Root.count();
            if (count === 0) {
                await EngineService_1.buildRoots(orm, this.config.firstStart.roots);
            }
        }
    }
};
__decorate([
    Inject,
    __metadata("design:type", ArtworkService)
], EngineService.prototype, "artwork", void 0);
__decorate([
    Inject,
    __metadata("design:type", AudioModule)
], EngineService.prototype, "audio", void 0);
__decorate([
    Inject,
    __metadata("design:type", ChatService)
], EngineService.prototype, "chat", void 0);
__decorate([
    Inject,
    __metadata("design:type", ConfigService)
], EngineService.prototype, "config", void 0);
__decorate([
    Inject,
    __metadata("design:type", DownloadService)
], EngineService.prototype, "download", void 0);
__decorate([
    Inject,
    __metadata("design:type", EpisodeService)
], EngineService.prototype, "episode", void 0);
__decorate([
    Inject,
    __metadata("design:type", FolderService)
], EngineService.prototype, "folder", void 0);
__decorate([
    Inject,
    __metadata("design:type", GenreService)
], EngineService.prototype, "genre", void 0);
__decorate([
    Inject,
    __metadata("design:type", ImageService)
], EngineService.prototype, "image", void 0);
__decorate([
    Inject,
    __metadata("design:type", IoService)
], EngineService.prototype, "io", void 0);
__decorate([
    Inject,
    __metadata("design:type", MetaDataService)
], EngineService.prototype, "metadata", void 0);
__decorate([
    Inject,
    __metadata("design:type", NowPlayingService)
], EngineService.prototype, "nowPlaying", void 0);
__decorate([
    Inject,
    __metadata("design:type", OrmService)
], EngineService.prototype, "orm", void 0);
__decorate([
    Inject,
    __metadata("design:type", PlaylistService)
], EngineService.prototype, "playlist", void 0);
__decorate([
    Inject,
    __metadata("design:type", PlayQueueService)
], EngineService.prototype, "playQueue", void 0);
__decorate([
    Inject,
    __metadata("design:type", PodcastService)
], EngineService.prototype, "podcast", void 0);
__decorate([
    Inject,
    __metadata("design:type", SessionService)
], EngineService.prototype, "session", void 0);
__decorate([
    Inject,
    __metadata("design:type", SettingsService)
], EngineService.prototype, "settings", void 0);
__decorate([
    Inject,
    __metadata("design:type", StateService)
], EngineService.prototype, "state", void 0);
__decorate([
    Inject,
    __metadata("design:type", StatsService)
], EngineService.prototype, "stats", void 0);
__decorate([
    Inject,
    __metadata("design:type", StreamService)
], EngineService.prototype, "stream", void 0);
__decorate([
    Inject,
    __metadata("design:type", TrackService)
], EngineService.prototype, "track", void 0);
__decorate([
    Inject,
    __metadata("design:type", TransformService)
], EngineService.prototype, "transform", void 0);
__decorate([
    Inject,
    __metadata("design:type", UserService)
], EngineService.prototype, "user", void 0);
__decorate([
    Inject,
    __metadata("design:type", WaveformService)
], EngineService.prototype, "waveform", void 0);
__decorate([
    Inject,
    __metadata("design:type", BookmarkService)
], EngineService.prototype, "bookmark", void 0);
__decorate([
    Inject,
    __metadata("design:type", RateLimitService)
], EngineService.prototype, "rateLimit", void 0);
EngineService = EngineService_1 = __decorate([
    InRequestScope,
    __metadata("design:paramtypes", [])
], EngineService);
export { EngineService };
//# sourceMappingURL=engine.service.js.map