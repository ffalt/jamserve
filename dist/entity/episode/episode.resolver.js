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
exports.EpisodeResolver = void 0;
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const waveform_1 = require("../waveform/waveform");
const episode_1 = require("./episode");
const tag_1 = require("../tag/tag");
const podcast_1 = require("../podcast/podcast");
const bookmark_1 = require("../bookmark/bookmark");
const episode_args_1 = require("./episode.args");
let EpisodeResolver = class EpisodeResolver {
    async episode(id, { orm }) {
        return await orm.Episode.oneOrFailByID(id);
    }
    async episodes({ page, filter, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Episode.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Episode.searchFilter(filter, order, page, user);
    }
    async tag(episode) {
        return episode.tag.get();
    }
    async podcast(episode) {
        return episode.podcast.getOrFail();
    }
    async bookmarks(episode) {
        return episode.bookmarks.getItems();
    }
    async bookmarksCount(episode) {
        return episode.bookmarks.count();
    }
    async waveform(episode) {
        return { obj: episode, objType: enums_1.DBObjectType.episode };
    }
    async state(episode, { orm, user }) {
        return await orm.State.findOrCreate(episode.id, enums_1.DBObjectType.episode, user.id);
    }
    async status(episode, { engine }) {
        return engine.episode.isDownloading(episode.id) ? enums_1.PodcastStatus.downloading : episode.status;
    }
    fileCreated(episode) {
        return episode.statCreated;
    }
    fileModified(episode) {
        return episode.statModified;
    }
    date(episode) {
        return new Date(episode.date);
    }
    chapters(episode) {
        return episode.chaptersJSON ? JSON.parse(episode.chaptersJSON) : undefined;
    }
    enclosures(episode) {
        return episode.enclosuresJSON ? JSON.parse(episode.enclosuresJSON) : undefined;
    }
};
__decorate([
    type_graphql_1.Query(() => episode_1.EpisodeQL, { description: 'Get a Episode by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "episode", null);
__decorate([
    type_graphql_1.Query(() => episode_1.EpisodePageQL, { description: 'Search Episodes' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_args_1.EpisodesArgsQL, Object]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "episodes", null);
__decorate([
    type_graphql_1.FieldResolver(() => tag_1.TagQL, { nullable: true }),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "tag", null);
__decorate([
    type_graphql_1.FieldResolver(() => podcast_1.PodcastQL),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "podcast", null);
__decorate([
    type_graphql_1.FieldResolver(() => [bookmark_1.BookmarkQL]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "bookmarks", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "bookmarksCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => waveform_1.WaveformQL),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "waveform", null);
__decorate([
    type_graphql_1.FieldResolver(() => state_1.StateQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode, Object]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "state", null);
__decorate([
    type_graphql_1.FieldResolver(() => enums_1.PodcastStatus),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode, Object]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "status", null);
__decorate([
    type_graphql_1.FieldResolver(() => Date),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode]),
    __metadata("design:returntype", Object)
], EpisodeResolver.prototype, "fileCreated", null);
__decorate([
    type_graphql_1.FieldResolver(() => Date),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode]),
    __metadata("design:returntype", Object)
], EpisodeResolver.prototype, "fileModified", null);
__decorate([
    type_graphql_1.FieldResolver(() => Date),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode]),
    __metadata("design:returntype", Date)
], EpisodeResolver.prototype, "date", null);
__decorate([
    type_graphql_1.FieldResolver(() => [episode_1.EpisodeChapterQL]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode]),
    __metadata("design:returntype", Object)
], EpisodeResolver.prototype, "chapters", null);
__decorate([
    type_graphql_1.FieldResolver(() => [episode_1.EpisodeEnclosureQL]),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [episode_1.Episode]),
    __metadata("design:returntype", Object)
], EpisodeResolver.prototype, "enclosures", null);
EpisodeResolver = __decorate([
    type_graphql_1.Resolver(episode_1.EpisodeQL)
], EpisodeResolver);
exports.EpisodeResolver = EpisodeResolver;
//# sourceMappingURL=episode.resolver.js.map