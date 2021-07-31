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
import { DBObjectType, PodcastStatus } from '../../types/enums';
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { StateQL } from '../state/state';
import { Podcast, PodcastDiscoverPageQL, PodcastDiscoverQL, PodcastDiscoverTagPageQL, PodcastIndexQL, PodcastPageQL, PodcastQL } from './podcast';
import { PodcastDiscoverArgsQL, PodcastDiscoverByTagArgsQL, PodcastIndexArgsQL, PodcastsArgsQL } from './podcast.args';
import { EpisodeQL } from '../episode/episode';
import { PageArgsQL } from '../base/base.args';
let PodcastResolver = class PodcastResolver {
    async podcast(id, { orm }) {
        return await orm.Podcast.oneOrFailByID(id);
    }
    async podcasts({ page, filter, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Podcast.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Podcast.searchFilter(filter, order, page, user);
    }
    async podcastIndex({ filter }, { orm, user }) {
        return await orm.Podcast.indexFilter(filter, user);
    }
    async state(podcast, { orm, user }) {
        return await orm.State.findOrCreate(podcast.id, DBObjectType.podcast, user.id);
    }
    status(podcast, { engine }) {
        return engine.podcast.isDownloading(podcast.id) ? PodcastStatus.downloading : podcast.status;
    }
    async episodes(podcast) {
        return podcast.episodes.getItems();
    }
    async episodesCount(podcast) {
        return podcast.episodes.count();
    }
    async lastCheck(timestamp) {
        return new Date(timestamp);
    }
    async podcastsDiscover({ query }, { engine }) {
        return await engine.podcast.discover(query);
    }
    async podcastsDiscoverTags(page, { engine, user }) {
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
    Query(() => PodcastQL, { description: 'Get a Podcast by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "podcast", null);
__decorate([
    Query(() => PodcastPageQL, { description: 'Search Podcasts' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastsArgsQL, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "podcasts", null);
__decorate([
    Query(() => PodcastIndexQL, { description: 'Get the Navigation Index for Podcasts' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastIndexArgsQL, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "podcastIndex", null);
__decorate([
    FieldResolver(() => StateQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Podcast, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "state", null);
__decorate([
    FieldResolver(() => PodcastStatus),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Podcast, Object]),
    __metadata("design:returntype", String)
], PodcastResolver.prototype, "status", null);
__decorate([
    FieldResolver(() => [EpisodeQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Podcast]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "episodes", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Podcast]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "episodesCount", null);
__decorate([
    FieldResolver(() => Date),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "lastCheck", null);
__decorate([
    Query(() => [PodcastDiscoverQL], { description: 'Discover Podcasts via gpodder.net' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastDiscoverArgsQL, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "podcastsDiscover", null);
__decorate([
    Query(() => PodcastDiscoverTagPageQL, { description: 'Discover Podcast Tags via gpodder.net' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgsQL, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "podcastsDiscoverTags", null);
__decorate([
    Query(() => PodcastDiscoverPageQL, { description: 'Discover Podcasts by Tag via gpodder.net' }),
    __param(0, Args()),
    __param(1, Args()),
    __param(2, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PodcastDiscoverByTagArgsQL, PageArgsQL, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "podcastsDiscoverByTag", null);
__decorate([
    Query(() => PodcastDiscoverPageQL, { description: 'Discover Top Podcasts via gpodder.net' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PageArgsQL, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "podcastsDiscoverTop", null);
PodcastResolver = __decorate([
    Resolver(PodcastQL)
], PodcastResolver);
export { PodcastResolver };
//# sourceMappingURL=podcast.resolver.js.map