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
exports.PodcastResolver = void 0;
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const podcast_1 = require("./podcast");
const podcast_args_1 = require("./podcast.args");
const episode_1 = require("../episode/episode");
let PodcastResolver = class PodcastResolver {
    async podcast(id, { orm }) {
        return await orm.Podcast.oneOrFailByID(id);
    }
    async podcasts({ page, filter, order, list }, { orm, user }) {
        if (list) {
            return await orm.Podcast.findListFilter(list, filter, order, page, user);
        }
        return await orm.Podcast.searchFilter(filter, order, page, user);
    }
    async podcastIndex({ filter }, { orm, user }) {
        return await orm.Podcast.indexFilter(filter, user);
    }
    async state(podcast, { orm, user }) {
        return await orm.State.findOrCreate(podcast.id, enums_1.DBObjectType.podcast, user.id);
    }
    status(podcast, { engine }) {
        return engine.podcast.isDownloading(podcast.id) ? enums_1.PodcastStatus.downloading : podcast.status;
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
};
__decorate([
    type_graphql_1.Query(() => podcast_1.PodcastQL, { description: 'Get a Podcast by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "podcast", null);
__decorate([
    type_graphql_1.Query(() => podcast_1.PodcastPageQL, { description: 'Search Podcasts' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [podcast_args_1.PodcastsArgsQL, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "podcasts", null);
__decorate([
    type_graphql_1.Query(() => podcast_1.PodcastIndexQL, { description: 'Get the Navigation Index for Podcasts' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [podcast_args_1.PodcastIndexArgsQL, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "podcastIndex", null);
__decorate([
    type_graphql_1.FieldResolver(() => state_1.StateQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [podcast_1.Podcast, Object]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "state", null);
__decorate([
    type_graphql_1.FieldResolver(() => enums_1.PodcastStatus),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [podcast_1.Podcast, Object]),
    __metadata("design:returntype", String)
], PodcastResolver.prototype, "status", null);
__decorate([
    type_graphql_1.FieldResolver(() => [episode_1.EpisodeQL]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [podcast_1.Podcast]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "episodes", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [podcast_1.Podcast]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "episodesCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => Date),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", Promise)
], PodcastResolver.prototype, "lastCheck", null);
PodcastResolver = __decorate([
    type_graphql_1.Resolver(podcast_1.PodcastQL)
], PodcastResolver);
exports.PodcastResolver = PodcastResolver;
//# sourceMappingURL=podcast.resolver.js.map