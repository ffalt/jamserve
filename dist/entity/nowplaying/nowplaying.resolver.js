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
import { Arg, Ctx, FieldResolver, ID, Mutation, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { NowPlaying, NowPlayingQL } from './nowplaying.js';
let NowPlayingResolver = class NowPlayingResolver {
    async nowPlaying({ engine }) {
        return engine.nowPlaying.getNowPlaying();
    }
    async userID(nowPlaying) {
        return nowPlaying.user.id;
    }
    async userName(nowPlaying) {
        return nowPlaying.user.name;
    }
    async scrobble(id, { engine, orm, user }) {
        return await engine.nowPlaying.scrobble(orm, id, user);
    }
};
__decorate([
    Query(() => [NowPlayingQL], { description: 'Get a List of media [Track, Episode] played currently by Users' }),
    __param(0, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NowPlayingResolver.prototype, "nowPlaying", null);
__decorate([
    FieldResolver(() => ID),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NowPlaying]),
    __metadata("design:returntype", Promise)
], NowPlayingResolver.prototype, "userID", null);
__decorate([
    FieldResolver(() => String),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NowPlaying]),
    __metadata("design:returntype", Promise)
], NowPlayingResolver.prototype, "userName", null);
__decorate([
    Mutation(() => NowPlayingQL),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NowPlayingResolver.prototype, "scrobble", null);
NowPlayingResolver = __decorate([
    Resolver(NowPlayingQL)
], NowPlayingResolver);
export { NowPlayingResolver };
//# sourceMappingURL=nowplaying.resolver.js.map