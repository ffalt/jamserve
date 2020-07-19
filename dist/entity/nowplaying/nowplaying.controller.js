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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NowPlayingController = void 0;
const typescript_ioc_1 = require("typescript-ioc");
const transform_service_1 = require("../../modules/engine/services/transform.service");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const nowplaying_service_1 = require("./nowplaying.service");
const nowplaying_model_1 = require("./nowplaying.model");
const user_1 = require("../user/user");
const nowplaying_args_1 = require("./nowplaying.args");
const track_args_1 = require("../track/track.args");
const episode_args_1 = require("../episode/episode.args");
const orm_service_1 = require("../../modules/engine/services/orm.service");
let NowPlayingController = class NowPlayingController {
    async list(nowPlayingArgs, trackArgs, episodeArgs, user) {
        const result = await this.nowPlayingService.getNowPlaying();
        return await Promise.all(result.map(o => this.transform.nowPlaying(o, nowPlayingArgs, trackArgs, episodeArgs, user)));
    }
    async scrobble(id, user) {
        await this.nowPlayingService.scrobble(id, user);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", transform_service_1.TransformService)
], NowPlayingController.prototype, "transform", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", nowplaying_service_1.NowPlayingService)
], NowPlayingController.prototype, "nowPlayingService", void 0);
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", orm_service_1.OrmService)
], NowPlayingController.prototype, "orm", void 0);
__decorate([
    rest_1.Get('/list', () => [nowplaying_model_1.NowPlaying], { description: 'Get a List of media [Track, Episode] played currently by Users', summary: 'Get Now Playing' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nowplaying_args_1.IncludesNowPlayingArgs,
        track_args_1.IncludesTrackArgs,
        episode_args_1.IncludesEpisodeArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], NowPlayingController.prototype, "list", null);
__decorate([
    rest_1.Post('/scrobble', { description: 'Report playing (scrobble) a media file [Track, Episode]', summary: 'Scrobble' }),
    __param(0, rest_1.BodyParam('id', { description: 'Media Id', isID: true })),
    __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, user_1.User]),
    __metadata("design:returntype", Promise)
], NowPlayingController.prototype, "scrobble", null);
NowPlayingController = __decorate([
    rest_1.Controller('/nowPlaying', { tags: ['Now Playing'], roles: [enums_1.UserRole.stream] })
], NowPlayingController);
exports.NowPlayingController = NowPlayingController;
//# sourceMappingURL=nowplaying.controller.js.map