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
Object.defineProperty(exports, "__esModule", { value: true });
exports.EngineService = void 0;
const hash_1 = require("../../../utils/hash");
const enums_1 = require("../../../types/enums");
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
const user_service_1 = require("../../../entity/user/user.service");
const session_service_1 = require("../../../entity/settings/session.service");
const podcast_service_1 = require("../../../entity/podcast/podcast.service");
const episode_service_1 = require("../../../entity/episode/episode.service");
const genre_service_1 = require("../../../entity/genre/genre.service");
const stats_service_1 = require("../../../entity/stats/stats.service");
const metadata_service_1 = require("../../../entity/metadata/metadata.service");
const audio_module_1 = require("../../audio/audio.module");
const state_service_1 = require("../../../entity/state/state.service");
const nowplaying_service_1 = require("../../../entity/nowplaying/nowplaying.service");
const playqueue_service_1 = require("../../../entity/playqueue/playqueue.service");
const log = logger_1.logger('Engine');
let EngineService = class EngineService {
    constructor() {
        this.ioService.registerAfterRefresh(() => this.afterRefresh());
    }
    async afterRefresh() {
    }
    resolveCachePaths() {
        return [
            this.configService.getDataPath(['cache', 'waveforms']),
            this.configService.getDataPath(['cache', 'uploads']),
            this.configService.getDataPath(['cache', 'images']),
            this.configService.getDataPath(['cache', 'transcode']),
            this.configService.getDataPath(['images']),
            this.configService.getDataPath(['podcasts'])
        ];
    }
    async checkRescan() {
        const version = await this.settingsService.settingsVersion();
        const forceRescan = !!version && version !== version_1.JAMSERVE_VERSION;
        if (forceRescan) {
            log.info(`Updating from version ${version || '-'}`);
        }
        if (forceRescan || this.settingsService.settings.library.scanAtStart) {
            this.ioService.refresh().then(() => {
                return forceRescan ? this.settingsService.saveSettings() : undefined;
            }).catch(e => {
                log.error('Error on startup scanning', e);
            });
        }
    }
    async checkDataPaths() {
        await fs_extra_1.default.ensureDir(path_1.default.resolve(this.configService.env.paths.data));
        const paths = this.resolveCachePaths();
        for (const p of paths) {
            await fs_extra_1.default.ensureDir(p);
        }
    }
    async start() {
        await this.checkDataPaths();
        await this.orm.start(this.configService.env.paths.data);
        await this.checkFirstStart();
        await this.checkRescan();
    }
    async stop() {
        await this.orm.stop();
    }
    async buildAdminUser(admin) {
        const pw = hash_1.hashAndSaltSHA512(admin.pass || '');
        const user = this.orm.User.create({
            name: admin.name,
            salt: pw.salt,
            hash: pw.hash,
            email: admin.mail || '',
            roleAdmin: true,
            rolePodcast: true,
            roleStream: true,
            roleUpload: true
        });
        await this.orm.orm.em.persistAndFlush(user);
    }
    async buildRoots(roots) {
        for (const first of roots) {
            const root = this.orm.Root.create({
                name: first.name,
                path: first.path,
                strategy: first.strategy || enums_1.RootScanStrategy.auto
            });
            await this.orm.orm.em.persistAndFlush(root);
        }
    }
    async checkFirstStart() {
        if (!this.configService.firstStart) {
            return;
        }
        if (this.configService.firstStart.adminUser) {
            const count = await this.orm.User.count();
            if (count === 0) {
                await this.buildAdminUser(this.configService.firstStart.adminUser);
            }
        }
        if (this.configService.firstStart.roots) {
            const count = await this.orm.Root.count();
            if (count === 0) {
                await this.buildRoots(this.configService.firstStart.roots);
            }
        }
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", config_service_1.ConfigService)
], EngineService.prototype, "configService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], EngineService.prototype, "orm", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", settings_service_1.SettingsService)
], EngineService.prototype, "settingsService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", state_service_1.StateService)
], EngineService.prototype, "stateService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", io_service_1.IoService)
], EngineService.prototype, "ioService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", audio_module_1.AudioModule)
], EngineService.prototype, "audioModule", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", waveform_service_1.WaveformService)
], EngineService.prototype, "waveformService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", metadata_service_1.MetaDataService)
], EngineService.prototype, "metadataService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", user_service_1.UserService)
], EngineService.prototype, "userService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", nowplaying_service_1.NowPlayingService)
], EngineService.prototype, "nowPlayingService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", session_service_1.SessionService)
], EngineService.prototype, "sessionService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", podcast_service_1.PodcastService)
], EngineService.prototype, "podcastService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", episode_service_1.EpisodeService)
], EngineService.prototype, "episodeService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", genre_service_1.GenreService)
], EngineService.prototype, "genreService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", stats_service_1.StatsService)
], EngineService.prototype, "statsService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", playqueue_service_1.PlayQueueService)
], EngineService.prototype, "playQueueService", void 0);
EngineService = __decorate([
    typescript_ioc_1.Singleton,
    __metadata("design:paramtypes", [])
], EngineService);
exports.EngineService = EngineService;
//# sourceMappingURL=engine.service.js.map