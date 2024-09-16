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
import { Episode, EpisodePage, EpisodeUpdateStatus } from './episode.model.js';
import { BodyParam, Controller, Ctx, Get, Post, QueryParam, QueryParams } from '../../modules/rest/index.js';
import { UserRole } from '../../types/enums.js';
import { IncludesPodcastArgs } from '../podcast/podcast.args.js';
import { EpisodeFilterArgs, EpisodeOrderArgs, IncludesEpisodeArgs, IncludesEpisodeParentArgs } from './episode.args.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { logger } from '../../utils/logger.js';
const log = logger('EpisodeController');
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
    Get('/id', () => Episode, { description: 'Get a Episode by Id', summary: 'Get Episode' }),
    __param(0, QueryParam('id', { description: 'Episode Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesEpisodeArgs,
        IncludesEpisodeParentArgs,
        IncludesPodcastArgs, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "id", null);
__decorate([
    Get('/search', () => EpisodePage, { description: 'Search Episodes' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, QueryParams()),
    __param(5, QueryParams()),
    __param(6, QueryParams()),
    __param(7, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesEpisodeArgs,
        IncludesEpisodeParentArgs,
        IncludesPodcastArgs,
        EpisodeFilterArgs,
        EpisodeOrderArgs,
        ListArgs, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "search", null);
__decorate([
    Get('/status', () => EpisodeUpdateStatus, { description: 'Get a Episode Status by Id', summary: 'Get Status' }),
    __param(0, QueryParam('id', { description: 'Episode Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "status", null);
__decorate([
    Post('/retrieve', { description: 'Retrieve a Podcast Episode Media File', roles: [UserRole.podcast], summary: 'Retrieve Episode' }),
    __param(0, BodyParam('id', { description: 'Episode Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "retrieve", null);
EpisodeController = __decorate([
    Controller('/episode', { tags: ['Episode'], roles: [UserRole.stream] })
], EpisodeController);
export { EpisodeController };
//# sourceMappingURL=episode.controller.js.map