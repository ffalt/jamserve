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
exports.NowPlayingResolver = void 0;
const type_graphql_1 = require("type-graphql");
const nowplaying_1 = require("./nowplaying");
let NowPlayingResolver = class NowPlayingResolver {
    async nowPlaying({ engine }) {
        return engine.nowPlayingService.getNowPlaying();
    }
    async userID(nowPlaying) {
        return nowPlaying.user.id;
    }
    async userName(nowPlaying) {
        return nowPlaying.user.name;
    }
    async scrobble(id, { engine, orm, user }) {
        return await engine.nowPlayingService.scrobble(orm, id, user);
    }
};
__decorate([
    type_graphql_1.Query(() => [nowplaying_1.NowPlayingQL], { description: 'Get a List of media [Track, Episode] played currently by Users' }),
    __param(0, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], NowPlayingResolver.prototype, "nowPlaying", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.ID),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nowplaying_1.NowPlaying]),
    __metadata("design:returntype", Promise)
], NowPlayingResolver.prototype, "userID", null);
__decorate([
    type_graphql_1.FieldResolver(() => String),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [nowplaying_1.NowPlaying]),
    __metadata("design:returntype", Promise)
], NowPlayingResolver.prototype, "userName", null);
__decorate([
    type_graphql_1.Mutation(() => nowplaying_1.NowPlayingQL),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NowPlayingResolver.prototype, "scrobble", null);
NowPlayingResolver = __decorate([
    type_graphql_1.Resolver(nowplaying_1.NowPlayingQL)
], NowPlayingResolver);
exports.NowPlayingResolver = NowPlayingResolver;
//# sourceMappingURL=nowplaying.resolver.js.map