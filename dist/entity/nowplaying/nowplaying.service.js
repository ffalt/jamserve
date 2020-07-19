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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NowPlayingService = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const orm_service_1 = require("../../modules/engine/services/orm.service");
const builder_1 = require("../../modules/rest/builder");
const enums_1 = require("../../types/enums");
const logger_1 = require("../../utils/logger");
const state_service_1 = require("../state/state.service");
const log = logger_1.logger('NowPlayingService');
let NowPlayingService = class NowPlayingService {
    constructor() {
        this.playing = [];
    }
    async getNowPlaying() {
        return this.playing;
    }
    clear() {
        this.playing = [];
    }
    async report(entries) {
    }
    async reportEpisode(episode, user) {
        this.playing = this.playing.filter(np => (np.user.id !== user.id));
        const result = { time: Date.now(), episode, user };
        this.playing.push(result);
        this.report([
            { id: episode.id, type: enums_1.DBObjectType.episode, userID: user.id },
            { id: episode.podcast.id, type: enums_1.DBObjectType.podcast, userID: user.id },
        ]).catch(e => log.error(e));
        return result;
    }
    async reportTrack(track, user) {
        var _a, _b, _c, _d, _e;
        this.playing = this.playing.filter(np => (np.user.id !== user.id));
        const result = { time: Date.now(), track, user };
        this.playing.push(result);
        this.report([
            { id: track.id, type: enums_1.DBObjectType.track, userID: user.id },
            { id: (_a = track.album) === null || _a === void 0 ? void 0 : _a.id, type: enums_1.DBObjectType.album, userID: user.id },
            { id: (_b = track.artist) === null || _b === void 0 ? void 0 : _b.id, type: enums_1.DBObjectType.artist, userID: user.id },
            { id: (_c = track.folder) === null || _c === void 0 ? void 0 : _c.id, type: enums_1.DBObjectType.folder, userID: user.id },
            { id: (_d = track.series) === null || _d === void 0 ? void 0 : _d.id, type: enums_1.DBObjectType.series, userID: user.id },
            { id: (_e = track.root) === null || _e === void 0 ? void 0 : _e.id, type: enums_1.DBObjectType.root, userID: user.id },
        ]).catch(e => log.error(e));
        return result;
    }
    async scrobble(id, user) {
        const result = await this.orm.findInStreamTypes(id);
        if (!result) {
            return Promise.reject(builder_1.NotFoundError());
        }
        switch (result.objType) {
            case enums_1.DBObjectType.track:
                return await this.reportTrack(result.obj, user);
            case enums_1.DBObjectType.episode:
                return this.reportEpisode(result.obj, user);
            default:
                return Promise.reject(Error('Invalid Object Type for Scrobbling'));
        }
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], NowPlayingService.prototype, "orm", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", state_service_1.StateService)
], NowPlayingService.prototype, "stateService", void 0);
NowPlayingService = __decorate([
    typescript_ioc_1.Singleton
], NowPlayingService);
exports.NowPlayingService = NowPlayingService;
//# sourceMappingURL=nowplaying.service.js.map