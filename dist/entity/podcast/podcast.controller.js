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
import { Podcast, PodcastDiscover, PodcastDiscoverTagPage, PodcastIndex, PodcastPage, PodcastUpdateStatus } from './podcast.model.js';
import { UserRole } from '../../types/enums.js';
import { EpisodePage } from '../episode/episode.model.js';
import { IncludesPodcastParameters, IncludesPodcastChildrenParameters, PodcastCreateParameters, PodcastDiscoverParameters, PodcastDiscoverByTagParameters, PodcastFilterParameters, PodcastOrderParameters, PodcastRefreshParameters } from './podcast.parameters.js';
import { EpisodeOrderParameters, IncludesEpisodeParameters } from '../episode/episode.parameters.js';
import { ListParameters, PageParameters } from '../base/base.parameters.js';
import { logger } from '../../utils/logger.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameter } from '../../modules/rest/decorators/query-parameter.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { BodyParameters } from '../../modules/rest/decorators/body-parameters.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
const log = logger('PodcastController');
let PodcastController = class PodcastController {
    async id(id, podcastParameters, podcastChildrenParameters, episodeParameters, { orm, engine, user }) {
        return engine.transform.podcast(orm, await orm.Podcast.oneOrFailByID(id), podcastParameters, podcastChildrenParameters, episodeParameters, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Podcast.indexFilter(filter, user);
        return engine.transform.Podcast.podcastIndex(orm, result);
    }
    async search(page, podcastParameters, podcastChildrenParameters, episodeParameters, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Podcast.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.podcast(orm, o, podcastParameters, podcastChildrenParameters, episodeParameters, user));
        }
        return await orm.Podcast.searchTransformFilter(filter, [order], page, user, o => engine.transform.podcast(orm, o, podcastParameters, podcastChildrenParameters, episodeParameters, user));
    }
    async episodes(page, episodeParameters, filter, order, { orm, engine, user }) {
        const podcastIDs = await orm.Podcast.findIDsFilter(filter, user);
        return await orm.Episode.searchTransformFilter({ podcastIDs }, [order], page, user, o => engine.transform.Episode.episodeBase(orm, o, episodeParameters, user));
    }
    async status(id, { orm, engine }) {
        return engine.transform.Podcast.podcastStatus(await orm.Podcast.oneOrFailByID(id));
    }
    async create({ url }, { orm, engine, user }) {
        const podcast = await engine.podcast.create(orm, url);
        engine.podcast.refresh(orm, podcast)
            .catch((error) => {
            log.error(error);
        });
        return engine.transform.podcast(orm, podcast, {}, {}, {}, user);
    }
    async refresh({ id }, { orm, engine }) {
        if (id) {
            const podcast = await orm.Podcast.oneOrFailByID(id);
            engine.podcast.refresh(orm, podcast)
                .catch((error) => {
                log.error(error);
            });
        }
        else {
            engine.podcast.refreshPodcasts(orm)
                .catch((error) => {
                log.error(error);
            });
        }
    }
    async remove(id, { orm, engine }) {
        const podcast = await orm.Podcast.oneOrFailByID(id);
        await engine.podcast.remove(orm, podcast);
    }
    async discover({ query }, { engine }) {
        return await engine.podcast.discover(query);
    }
    async podcastsDiscoverTags(page, { engine }) {
        return await engine.podcast.discoverTags(page);
    }
    async podcastsDiscoverByTag({ tag }, page, { engine }) {
        return await engine.podcast.discoverByTag(tag, page);
    }
    async podcastsDiscoverTop(page, { engine }) {
        return await engine.podcast.discoverTop(page);
    }
};
__decorate([
    Get('/id', () => Podcast, { description: 'Get a Podcast by Id', summary: 'Get Podcast' }),
    __param(0, QueryParameter('id', { description: 'Podcast Id', isID: true })),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesPodcastParameters,
        IncludesPodcastChildrenParameters,
        IncludesEpisodeParameters, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "id", null);
__decorate([
    Get('/index', () => PodcastIndex, { description: 'Get the Navigation Index for Podcasts', summary: 'Get Index' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastFilterParameters, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "index", null);
__decorate([
    Get('/search', () => PodcastPage, { description: 'Search Podcasts' }),
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
        IncludesPodcastParameters,
        IncludesPodcastChildrenParameters,
        IncludesEpisodeParameters,
        PodcastFilterParameters,
        PodcastOrderParameters,
        ListParameters, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "search", null);
__decorate([
    Get('/episodes', () => EpisodePage, { description: 'Get Episodes of Podcasts', summary: 'Get Episodes' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, QueryParameters()),
    __param(4, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters,
        IncludesEpisodeParameters,
        PodcastFilterParameters,
        EpisodeOrderParameters, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "episodes", null);
__decorate([
    Get('/status', () => PodcastUpdateStatus, { description: 'Get a Podcast Status by Podcast Id', summary: 'Get Status' }),
    __param(0, QueryParameter('id', { description: 'Podcast Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "status", null);
__decorate([
    Post('/create', () => Podcast, { description: 'Create a Podcast', roles: [UserRole.podcast], summary: 'Create Podcast' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastCreateParameters, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "create", null);
__decorate([
    Post('/refresh', { description: 'Check Podcast Feeds for new Episodes', roles: [UserRole.podcast], summary: 'Refresh Podcasts' }),
    __param(0, BodyParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastRefreshParameters, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "refresh", null);
__decorate([
    Post('/remove', { description: 'Remove a Podcast', roles: [UserRole.podcast], summary: 'Remove Podcast' }),
    __param(0, BodyParameter('id', { description: 'Podcast ID to remove', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "remove", null);
__decorate([
    Get('/discover', () => [PodcastDiscover], { description: 'Discover Podcasts via gpodder.net', summary: 'Discover Podcasts' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastDiscoverParameters, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "discover", null);
__decorate([
    Get('/discover/tags', () => PodcastDiscoverTagPage, { description: 'Discover Podcast Tags via gpodder.net', summary: 'Discover Podcast Tags' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "podcastsDiscoverTags", null);
__decorate([
    Get('/discover/byTag', () => PodcastDiscoverTagPage, { description: 'Discover Podcasts by Tag via gpodder.net', summary: 'Discover Podcasts by Tag' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastDiscoverByTagParameters,
        PageParameters, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "podcastsDiscoverByTag", null);
__decorate([
    Get('/discover/top', () => PodcastDiscoverTagPage, { description: 'Discover Top Podcasts via gpodder.net', summary: 'Discover Top Podcasts' }),
    __param(0, QueryParameters()),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageParameters, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "podcastsDiscoverTop", null);
PodcastController = __decorate([
    Controller('/podcast', { tags: ['Podcast'], roles: [UserRole.stream] })
], PodcastController);
export { PodcastController };
//# sourceMappingURL=podcast.controller.js.map