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
import { UserRole } from '../../types/enums.js';
import { IncludesPodcastParameters } from '../podcast/podcast.parameters.js';
import { EpisodeFilterParameters, EpisodeOrderParameters, IncludesEpisodeParameters, IncludesEpisodeParentParameters } from './episode.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { logger } from '../../utils/logger.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
const log = logger('EpisodeController');
let EpisodeController = class EpisodeController {
    async id(id, episodeParameters, episodeParentParameters, podcastParameters, { orm, engine, user }) {
        return engine.transform.episode(orm, await orm.Episode.oneOrFailByID(id), episodeParameters, episodeParentParameters, podcastParameters, user);
    }
    async search(page, episodeParameters, episodeParentParameters, podcastParameters, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Episode.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.episode(orm, o, episodeParameters, episodeParentParameters, podcastParameters, user));
        }
        return await orm.Episode.searchTransformFilter(filter, [order], page, user, o => engine.transform.episode(orm, o, episodeParameters, episodeParentParameters, podcastParameters, user));
    }
    async status(id, { orm, engine }) {
        return engine.transform.Episode.episodeStatus(await orm.Episode.oneOrFailByID(id));
    }
    async retrieve(id, { orm, engine }) {
        const episode = await orm.Episode.oneOrFailByID(id);
        if (!episode.path) {
            engine.episode.downloadEpisode(orm, episode)
                .catch((error) => {
                log.error(error);
            });
        }
    }
};
__decorate([
    Get('/id', () => Episode, { description: 'Get a Episode by Id', summary: 'Get Episode' }),
    __param(0, QueryParameter('id', { description: 'Episode Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesEpisodeParameters,
        IncludesEpisodeParentParameters,
        IncludesPodcastParameters, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "id", null);
__decorate([
    Get('/search', () => EpisodePage, { description: 'Search Episodes' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, QueryParameters()),
    __param(5, QueryParameters()),
    __param(6, QueryParameters()),
    __param(7, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesEpisodeParameters,
        IncludesEpisodeParentParameters,
        IncludesPodcastParameters,
        EpisodeFilterParameters,
        EpisodeOrderParameters,
        ListParameters, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "search", null);
__decorate([
    Get('/status', () => EpisodeUpdateStatus, { description: 'Get a Episode Status by Id', summary: 'Get Status' }),
    __param(0, QueryParameter('id', { description: 'Episode Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "status", null);
__decorate([
    Post('/retrieve', { description: 'Retrieve a Podcast Episode Media File', roles: [UserRole.podcast], summary: 'Retrieve Episode' }),
    __param(0, BodyParameter('id', { description: 'Episode Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EpisodeController.prototype, "retrieve", null);
EpisodeController = __decorate([
    Controller('/episode', { tags: ['Episode'], roles: [UserRole.stream] })
], EpisodeController);
export { EpisodeController };
//# sourceMappingURL=episode.controller.js.map