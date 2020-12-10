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
exports.EpisodeController = void 0;
const episode_model_1 = require("./episode.model");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const podcast_args_1 = require("../podcast/podcast.args");
const episode_args_1 = require("./episode.args");
const base_args_1 = require("../base/base.args");
const logger_1 = require("../../utils/logger");
const log = logger_1.logger('EpisodeController');
let EpisodeController = class EpisodeController {
    async id(id, episodeArgs, episodeParentArgs, podcastArgs, { orm, engine, user }) {
        return engine.transform.episode(orm, await orm.Episode.oneOrFailByID(id), episodeArgs, episodeParentArgs, podcastArgs, user);
    }
    async search(page, episodeArgs, episodeParentArgs, podcastArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Episode.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.episode(orm, o, episodeArgs, episodeParentArgs, podcastArgs, user));
        }
        return await orm.Episode.searchTransformFilter(filter, [order], page, user, o => engine.transform.episode(orm, o, episodeArgs, episodeParentArgs, podcastArgs, user));
    }
    async status(id, { orm, engine }) {
        return engine.transform.Episode.episodeStatus(await orm.Episode.oneOrFailByID(id));
    }
    async retrieve(id, { orm, engine }) {
        const episode = await orm.Episode.oneOrFailByID(id);
        if (!episode.path) {
            engine.episode.downloadEpisode(orm, episode).catch(e => log.error(e));
        }
    }
};
__decorate([
    rest_1.Get('/id', () => episode_model_1.Episode, { description: 'Get a Episode by Id', summary: 'Get Episode' }),
    __param(0, rest_1.QueryParam('id', { description: 'Episode Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, episode_args_1.IncludesEpisodeArgs,
        episode_args_1.IncludesEpisodeParentArgs,
        podcast_args_1.IncludesPodcastArgs, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "id", null);
__decorate([
    rest_1.Get('/search', () => episode_model_1.EpisodePage, { description: 'Search Episodes' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.QueryParams()),
    __param(6, rest_1.QueryParams()),
    __param(7, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        episode_args_1.IncludesEpisodeArgs,
        episode_args_1.IncludesEpisodeParentArgs,
        podcast_args_1.IncludesPodcastArgs,
        episode_args_1.EpisodeFilterArgs,
        episode_args_1.EpisodeOrderArgs,
        base_args_1.ListArgs, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "search", null);
__decorate([
    rest_1.Get('/status', () => episode_model_1.EpisodeUpdateStatus, { description: 'Get a Episode Status by Id', summary: 'Get Status' }),
    __param(0, rest_1.QueryParam('id', { description: 'Episode Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "status", null);
__decorate([
    rest_1.Post('/retrieve', { description: 'Retrieve a Podcast Episode Media File', roles: [enums_1.UserRole.podcast], summary: 'Retrieve Episode' }),
    __param(0, rest_1.BodyParam('id', { description: 'Episode Id', isID: true })),
    __param(1, rest_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "retrieve", null);
EpisodeController = __decorate([
    rest_1.Controller('/episode', { tags: ['Episode'], roles: [enums_1.UserRole.stream] })
], EpisodeController);
exports.EpisodeController = EpisodeController;
//# sourceMappingURL=episode.controller.js.map