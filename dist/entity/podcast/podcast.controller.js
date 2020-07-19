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
exports.PodcastController = void 0;
const podcast_model_1 = require("./podcast.model");
const user_1 = require("../user/user");
const rest_1 = require("../../modules/rest");
const enums_1 = require("../../types/enums");
const base_controller_1 = require("../base/base.controller");
const episode_model_1 = require("../episode/episode.model");
const podcast_args_1 = require("./podcast.args");
const episode_args_1 = require("../episode/episode.args");
const base_args_1 = require("../base/base.args");
const typescript_ioc_1 = require("typescript-ioc");
const podcast_service_1 = require("./podcast.service");
const logger_1 = require("../../utils/logger");
const log = logger_1.logger('PodcastController');
let PodcastController = class PodcastController extends base_controller_1.BaseController {
    async id(id, podcastArgs, podcastChildrenArgs, episodeArgs, user) {
        return this.transform.podcast(await this.orm.Podcast.oneOrFail(id), podcastArgs, podcastChildrenArgs, episodeArgs, user);
    }
    async index(filter, user) {
        const result = await this.orm.Podcast.indexFilter(filter, user);
        return this.transform.podcastIndex(result);
    }
    async search(page, podcastArgs, podcastChildrenArgs, episodeArgs, filter, order, list, user) {
        if (list.list) {
            return await this.orm.Podcast.findListTransformFilter(list.list, filter, [order], page, user, o => this.transform.podcast(o, podcastArgs, podcastChildrenArgs, episodeArgs, user));
        }
        return await this.orm.Podcast.searchTransformFilter(filter, [order], page, user, o => this.transform.podcast(o, podcastArgs, podcastChildrenArgs, episodeArgs, user));
    }
    async episodes(page, episodeArgs, filter, order, user) {
        const podcastIDs = await this.orm.Podcast.findIDsFilter(filter, user);
        return await this.orm.Episode.searchTransformFilter({ podcastIDs }, [order], page, user, o => this.transform.episodeBase(o, episodeArgs, user));
    }
    async status(id) {
        return this.transform.podcastStatus(await this.orm.Podcast.oneOrFail(id));
    }
    async create(args, user) {
        const podcast = await this.podcastService.create(args.url);
        this.podcastService.refresh(podcast).catch(e => log.error(e));
        return this.transform.podcast(podcast, {}, {}, {}, user);
    }
    async refresh(args) {
        if (args.id) {
            const podcast = await this.orm.Podcast.oneOrFail(args.id);
            this.podcastService.refresh(podcast).catch(e => log.error(e));
        }
        else {
            this.podcastService.refreshPodcasts().catch(e => log.error(e));
        }
    }
    async remove(id) {
        const podcast = await this.orm.Podcast.oneOrFail(id);
        await this.podcastService.remove(podcast);
    }
};
__decorate([
    typescript_ioc_1.Inject,
    __metadata("design:type", podcast_service_1.PodcastService)
], PodcastController.prototype, "podcastService", void 0);
__decorate([
    rest_1.Get('/id', () => podcast_model_1.Podcast, { description: 'Get a Podcast by Id', summary: 'Get Podcast' }),
    __param(0, rest_1.QueryParam('id', { description: 'Podcast Id', isID: true })),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, podcast_args_1.IncludesPodcastArgs,
        podcast_args_1.IncludesPodcastChildrenArgs,
        episode_args_1.IncludesEpisodeArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "id", null);
__decorate([
    rest_1.Get('/index', () => podcast_model_1.PodcastIndex, { description: 'Get the Navigation Index for Podcasts', summary: 'Get Index' }),
    __param(0, rest_1.QueryParams()), __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [podcast_args_1.PodcastFilterArgs, user_1.User]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "index", null);
__decorate([
    rest_1.Get('/search', () => podcast_model_1.PodcastPage, { description: 'Search Podcasts' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.QueryParams()),
    __param(5, rest_1.QueryParams()),
    __param(6, rest_1.QueryParams()),
    __param(7, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        podcast_args_1.IncludesPodcastArgs,
        podcast_args_1.IncludesPodcastChildrenArgs,
        episode_args_1.IncludesEpisodeArgs,
        podcast_args_1.PodcastFilterArgs,
        podcast_args_1.PodcastOrderArgs,
        base_args_1.ListArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "search", null);
__decorate([
    rest_1.Get('/episodes', () => episode_model_1.EpisodePage, { description: 'Get Episodes of Podcasts', summary: 'Get Episodes' }),
    __param(0, rest_1.QueryParams()),
    __param(1, rest_1.QueryParams()),
    __param(2, rest_1.QueryParams()),
    __param(3, rest_1.QueryParams()),
    __param(4, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [base_args_1.PageArgs,
        episode_args_1.IncludesEpisodeArgs,
        podcast_args_1.PodcastFilterArgs,
        episode_args_1.EpisodeOrderArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "episodes", null);
__decorate([
    rest_1.Get('/status', () => podcast_model_1.PodcastUpdateStatus, { description: 'Get a Podcast Status by Podcast Id', summary: 'Get Status' }),
    __param(0, rest_1.QueryParam('id', { description: 'Podcast Id', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "status", null);
__decorate([
    rest_1.Post('/create', () => podcast_model_1.Podcast, { description: 'Create a Podcast', roles: [enums_1.UserRole.podcast], summary: 'Create Podcast' }),
    __param(0, rest_1.BodyParams()),
    __param(1, rest_1.CurrentUser()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [podcast_args_1.PodcastCreateArgs,
        user_1.User]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "create", null);
__decorate([
    rest_1.Post('/refresh', { description: 'Check Podcast Feeds for new Episodes', roles: [enums_1.UserRole.podcast], summary: 'Refresh Podcasts' }),
    __param(0, rest_1.BodyParams()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [podcast_args_1.PodcastRefreshArgs]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "refresh", null);
__decorate([
    rest_1.Post('/remove', { description: 'Remove a Podcast', roles: [enums_1.UserRole.podcast], summary: 'Remove Podcast' }),
    __param(0, rest_1.BodyParam('id', { description: 'Podcast ID to remove', isID: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "remove", null);
PodcastController = __decorate([
    rest_1.Controller('/podcast', { tags: ['Podcast'], roles: [enums_1.UserRole.stream] })
], PodcastController);
exports.PodcastController = PodcastController;
//# sourceMappingURL=podcast.controller.js.map