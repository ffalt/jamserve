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
import { IncludesPodcastArgs, IncludesPodcastChildrenArgs, PodcastCreateArgs, PodcastDiscoverArgs, PodcastDiscoverByTagArgs, PodcastFilterArgs, PodcastOrderArgs, PodcastRefreshArgs } from './podcast.args.js';
import { EpisodeOrderArgs, IncludesEpisodeArgs } from '../episode/episode.args.js';
import { ListArgs, PageArgs } from '../base/base.args.js';
import { logger } from '../../utils/logger.js';
import { Controller } from '../../modules/rest/decorators/Controller.js';
import { Get } from '../../modules/rest/decorators/Get.js';
import { QueryParam } from '../../modules/rest/decorators/QueryParam.js';
import { QueryParams } from '../../modules/rest/decorators/QueryParams.js';
import { Ctx } from '../../modules/rest/decorators/Ctx.js';
import { BodyParams } from '../../modules/rest/decorators/BodyParams.js';
import { Post } from '../../modules/rest/decorators/Post.js';
import { BodyParam } from '../../modules/rest/decorators/BodyParam.js';
const log = logger('PodcastController');
let PodcastController = class PodcastController {
    async id(id, podcastArgs, podcastChildrenArgs, episodeArgs, { orm, engine, user }) {
        return engine.transform.podcast(orm, await orm.Podcast.oneOrFailByID(id), podcastArgs, podcastChildrenArgs, episodeArgs, user);
    }
    async index(filter, { orm, engine, user }) {
        const result = await orm.Podcast.indexFilter(filter, user);
        return engine.transform.Podcast.podcastIndex(orm, result);
    }
    async search(page, podcastArgs, podcastChildrenArgs, episodeArgs, filter, order, list, { orm, engine, user }) {
        if (list.list) {
            return await orm.Podcast.findListTransformFilter(list.list, list.seed, filter, [order], page, user, o => engine.transform.podcast(orm, o, podcastArgs, podcastChildrenArgs, episodeArgs, user));
        }
        return await orm.Podcast.searchTransformFilter(filter, [order], page, user, o => engine.transform.podcast(orm, o, podcastArgs, podcastChildrenArgs, episodeArgs, user));
    }
    async episodes(page, episodeArgs, filter, order, { orm, engine, user }) {
        const podcastIDs = await orm.Podcast.findIDsFilter(filter, user);
        return await orm.Episode.searchTransformFilter({ podcastIDs }, [order], page, user, o => engine.transform.Episode.episodeBase(orm, o, episodeArgs, user));
    }
    async status(id, { orm, engine }) {
        return engine.transform.Podcast.podcastStatus(await orm.Podcast.oneOrFailByID(id));
    }
    async create(args, { orm, engine, user }) {
        const podcast = await engine.podcast.create(orm, args.url);
        engine.podcast.refresh(orm, podcast).catch(e => log.error(e));
        return engine.transform.podcast(orm, podcast, {}, {}, {}, user);
    }
    async refresh(args, { orm, engine }) {
        if (args.id) {
            const podcast = await orm.Podcast.oneOrFailByID(args.id);
            engine.podcast.refresh(orm, podcast).catch(e => log.error(e));
        }
        else {
            engine.podcast.refreshPodcasts(orm).catch(e => log.error(e));
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
    __param(0, QueryParam('id', { description: 'Podcast Id', isID: true })),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, IncludesPodcastArgs,
        IncludesPodcastChildrenArgs,
        IncludesEpisodeArgs, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "id", null);
__decorate([
    Get('/index', () => PodcastIndex, { description: 'Get the Navigation Index for Podcasts', summary: 'Get Index' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastFilterArgs, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "index", null);
__decorate([
    Get('/search', () => PodcastPage, { description: 'Search Podcasts' }),
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
        IncludesPodcastArgs,
        IncludesPodcastChildrenArgs,
        IncludesEpisodeArgs,
        PodcastFilterArgs,
        PodcastOrderArgs,
        ListArgs, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "search", null);
__decorate([
    Get('/episodes', () => EpisodePage, { description: 'Get Episodes of Podcasts', summary: 'Get Episodes' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, QueryParams()),
    __param(4, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs,
        IncludesEpisodeArgs,
        PodcastFilterArgs,
        EpisodeOrderArgs, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "episodes", null);
__decorate([
    Get('/status', () => PodcastUpdateStatus, { description: 'Get a Podcast Status by Podcast Id', summary: 'Get Status' }),
    __param(0, QueryParam('id', { description: 'Podcast Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "status", null);
__decorate([
    Post('/create', () => Podcast, { description: 'Create a Podcast', roles: [UserRole.podcast], summary: 'Create Podcast' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastCreateArgs, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "create", null);
__decorate([
    Post('/refresh', { description: 'Check Podcast Feeds for new Episodes', roles: [UserRole.podcast], summary: 'Refresh Podcasts' }),
    __param(0, BodyParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastRefreshArgs, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "refresh", null);
__decorate([
    Post('/remove', { description: 'Remove a Podcast', roles: [UserRole.podcast], summary: 'Remove Podcast' }),
    __param(0, BodyParam('id', { description: 'Podcast ID to remove', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "remove", null);
__decorate([
    Get('/discover', () => [PodcastDiscover], { description: 'Discover Podcasts via gpodder.net', summary: 'Discover Podcasts' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastDiscoverArgs, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "discover", null);
__decorate([
    Get('/discover/tags', () => PodcastDiscoverTagPage, { description: 'Discover Podcast Tags via gpodder.net', summary: 'Discover Podcast Tags' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "podcastsDiscoverTags", null);
__decorate([
    Get('/discover/byTag', () => PodcastDiscoverTagPage, { description: 'Discover Podcasts by Tag via gpodder.net', summary: 'Discover Podcasts by Tag' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastDiscoverByTagArgs,
        PageArgs, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "podcastsDiscoverByTag", null);
__decorate([
    Get('/discover/top', () => PodcastDiscoverTagPage, { description: 'Discover Top Podcasts via gpodder.net', summary: 'Discover Top Podcasts' }),
    __param(0, QueryParams()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgs, Object]),
    __metadata("design:returntype", Promise)
], PodcastController.prototype, "podcastsDiscoverTop", null);
PodcastController = __decorate([
    Controller('/podcast', { tags: ['Podcast'], roles: [UserRole.stream] })
], PodcastController);
export { PodcastController };
//# sourceMappingURL=podcast.controller.js.map