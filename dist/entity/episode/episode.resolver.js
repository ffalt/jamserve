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
import { WaveformQL } from '../waveform/waveform';
import { Episode, EpisodeChapterQL, EpisodeEnclosureQL, EpisodePageQL, EpisodeQL } from './episode';
import { TagQL } from '../tag/tag';
import { PodcastQL } from '../podcast/podcast';
import { BookmarkQL } from '../bookmark/bookmark';
import { EpisodesArgsQL } from './episode.args';
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
        return { obj: episode, objType: DBObjectType.episode };
    }
    async state(episode, { orm, user }) {
        return await orm.State.findOrCreate(episode.id, DBObjectType.episode, user.id);
    }
    async status(episode, { engine }) {
        return engine.episode.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status;
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
    Query(() => EpisodeQL, { description: 'Get a Episode by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "episode", null);
__decorate([
    Query(() => EpisodePageQL, { description: 'Search Episodes' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EpisodesArgsQL, Object]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "episodes", null);
__decorate([
    FieldResolver(() => TagQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "tag", null);
__decorate([
    FieldResolver(() => PodcastQL),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "podcast", null);
__decorate([
    FieldResolver(() => [BookmarkQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "bookmarks", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "bookmarksCount", null);
__decorate([
    FieldResolver(() => WaveformQL),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "waveform", null);
__decorate([
    FieldResolver(() => StateQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode, Object]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "state", null);
__decorate([
    FieldResolver(() => PodcastStatus),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode, Object]),
    __metadata("design:returntype", Promise)
], EpisodeResolver.prototype, "status", null);
__decorate([
    FieldResolver(() => Date),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode]),
    __metadata("design:returntype", Object)
], EpisodeResolver.prototype, "fileCreated", null);
__decorate([
    FieldResolver(() => Date),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode]),
    __metadata("design:returntype", Object)
], EpisodeResolver.prototype, "fileModified", null);
__decorate([
    FieldResolver(() => Date),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode]),
    __metadata("design:returntype", Date)
], EpisodeResolver.prototype, "date", null);
__decorate([
    FieldResolver(() => [EpisodeChapterQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode]),
    __metadata("design:returntype", Object)
], EpisodeResolver.prototype, "chapters", null);
__decorate([
    FieldResolver(() => [EpisodeEnclosureQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Episode]),
    __metadata("design:returntype", Object)
], EpisodeResolver.prototype, "enclosures", null);
EpisodeResolver = __decorate([
    Resolver(EpisodeQL)
], EpisodeResolver);
export { EpisodeResolver };
//# sourceMappingURL=episode.resolver.js.map