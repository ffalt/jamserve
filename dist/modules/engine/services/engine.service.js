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
var EngineService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineService = void 0;
const path_1 = __importDefault(require("path"));
const fs_extra_1 = __importDefault(require("fs-extra"));
const settings_service_1 = require("../../../entity/settings/settings.service");
const io_service_1 = require("./io.service");
const config_service_1 = require("./config.service");
const version_1 = require("../../../version");
const orm_service_1 = require("./orm.service");
const waveform_service_1 = require("../../../entity/waveform/waveform.service");
const typescript_ioc_1 = require("typescript-ioc");
const logger_1 = require("../../../utils/logger");
const enums_1 = require("../../../types/enums");
const user_service_1 = require("../../../entity/user/user.service");
const session_service_1 = require("../../../entity/session/session.service");
const podcast_service_1 = require("../../../entity/podcast/podcast.service");
const episode_service_1 = require("../../../entity/episode/episode.service");
const genre_service_1 = require("../../../entity/genre/genre.service");
const stats_service_1 = require("../../../entity/stats/stats.service");
const metadata_service_1 = require("../../../entity/metadata/metadata.service");
const audio_module_1 = require("../../audio/audio.module");
const state_service_1 = require("../../../entity/state/state.service");
const nowplaying_service_1 = require("../../../entity/nowplaying/nowplaying.service");
const playqueue_service_1 = require("../../../entity/playqueue/playqueue.service");
const chat_service_1 = require("../../../entity/chat/chat.service");
const track_service_1 = require("../../../entity/track/track.service");
const artwork_service_1 = require("../../../entity/artwork/artwork.service");
const download_service_1 = require("../../../entity/download/download.service");
const folder_service_1 = require("../../../entity/folder/folder.service");
const image_service_1 = require("../../../entity/image/image.service");
const playlist_service_1 = require("../../../entity/playlist/playlist.service");
const stream_service_1 = require("../../../entity/stream/stream.service");
const transform_service_1 = require("./transform.service");
const bookmark_service_1 = require("../../../entity/bookmark/bookmark.service");
const ratelimit_service_1 = require("./ratelimit.service");
const log = logger_1.logger('Engine');
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
        const forceRescan = !!version && version !== version_1.JAMSERVE_VERSION;
        if (forceRescan) {
            log.info(`Updating from version ${version || '-'}`);
        }
        if (forceRescan || this.settings.settings.library.scanAtStart) {
            log.info(`Starting rescan`);
            this.io.startUpRefresh(orm, forceRescan).then(() => {
                return forceRescan ? this.settings.saveSettings(orm) : undefined;
            }).catch(e => {
                log.error('Error on startup scanning', e);
            });
        }
    }
    async checkDataPaths() {
        await fs_extra_1.default.ensureDir(path_1.default.resolve(this.config.env.paths.data));
        const paths = this.resolveCachePaths();
        for (const p of paths) {
            await fs_extra_1.default.ensureDir(p);
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
                strategy: first.strategy || enums_1.RootScanStrategy.auto
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
    typescript_ioc_1.Inject,
    __metadata("design:type", artwork_service_1.ArtworkService)
], EngineService.prototype, "artwork", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], EngineService.prototype, "audio", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", chat_service_1.ChatService)
], EngineService.prototype, "chat", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", config_service_1.ConfigService)
], EngineService.prototype, "config", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", download_service_1.DownloadService)
], EngineService.prototype, "download", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", episode_service_1.EpisodeService)
], EngineService.prototype, "episode", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", folder_service_1.FolderService)
], EngineService.prototype, "folder", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", genre_service_1.GenreService)
], EngineService.prototype, "genre", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", image_service_1.ImageService)
], EngineService.prototype, "image", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", io_service_1.IoService)
], EngineService.prototype, "io", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", metadata_service_1.MetaDataService)
], EngineService.prototype, "metadata", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", nowplaying_service_1.NowPlayingService)
], EngineService.prototype, "nowPlaying", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], EngineService.prototype, "orm", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", playlist_service_1.PlaylistService)
], EngineService.prototype, "playlist", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", playqueue_service_1.PlayQueueService)
], EngineService.prototype, "playQueue", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", podcast_service_1.PodcastService)
], EngineService.prototype, "podcast", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", session_service_1.SessionService)
], EngineService.prototype, "session", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", settings_service_1.SettingsService)
], EngineService.prototype, "settings", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", state_service_1.StateService)
], EngineService.prototype, "state", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", stats_service_1.StatsService)
], EngineService.prototype, "stats", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", stream_service_1.StreamService)
], EngineService.prototype, "stream", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", track_service_1.TrackService)
], EngineService.prototype, "track", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", transform_service_1.TransformService)
], EngineService.prototype, "transform", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", user_service_1.UserService)
], EngineService.prototype, "user", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", waveform_service_1.WaveformService)
], EngineService.prototype, "waveform", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", bookmark_service_1.BookmarkService)
], EngineService.prototype, "bookmark", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", ratelimit_service_1.RateLimitService)
], EngineService.prototype, "rateLimit", void 0);
EngineService = EngineService_1 = __decorate([
    typescript_ioc_1.InRequestScope,
    __metadata("design:paramtypes", [])
], EngineService);
exports.EngineService = EngineService;
//# sourceMappingURL=engine.service.js.map