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
import { Ctx, FieldResolver, Resolver, Root as GQLRoot } from 'type-graphql';
import { PlaylistEntry, PlaylistEntryQL } from './playlist-entry.js';
import { TrackQL } from '../track/track.js';
import { EpisodeQL } from '../episode/episode.js';
import { PlaylistQL } from '../playlist/playlist.js';
let PlaylistEntryResolver = class PlaylistEntryResolver {
    async playlist(playlistEntry, _context) {
        return playlistEntry.playlist.getOrFail();
    }
    async track(playlistEntry, _context) {
        return playlistEntry.track.get();
    }
    async episode(playlistEntry, _context) {
        return playlistEntry.episode.get();
    }
};
__decorate([
    FieldResolver(() => PlaylistQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlaylistEntry, Object]),
    __metadata("design:returntype", Promise)
], PlaylistEntryResolver.prototype, "playlist", null);
__decorate([
    FieldResolver(() => TrackQL, { nullable: true }),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlaylistEntry, Object]),
    __metadata("design:returntype", Promise)
], PlaylistEntryResolver.prototype, "track", null);
__decorate([
    FieldResolver(() => EpisodeQL, { nullable: true }),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [PlaylistEntry, Object]),
    __metadata("design:returntype", Promise)
], PlaylistEntryResolver.prototype, "episode", null);
PlaylistEntryResolver = __decorate([
    Resolver(PlaylistEntryQL)
], PlaylistEntryResolver);
export { PlaylistEntryResolver };
//# sourceMappingURL=playlist-entry.resolver.js.map