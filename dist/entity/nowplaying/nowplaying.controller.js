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
import { BodyParam, Controller, Ctx, Get, Post, QueryParams } from '../../modules/rest';
import { UserRole } from '../../types/enums';
import { NowPlaying } from './nowplaying.model';
import { IncludesNowPlayingArgs } from './nowplaying.args';
import { IncludesTrackArgs } from '../track/track.args';
import { IncludesEpisodeArgs } from '../episode/episode.args';
let NowPlayingController = class NowPlayingController {
    async list(nowPlayingArgs, trackArgs, episodeArgs, { orm, engine, user }) {
        const result = await engine.nowPlaying.getNowPlaying();
        return await Promise.all(result.map(o => engine.transform.nowPlaying(orm, o, nowPlayingArgs, trackArgs, episodeArgs, user)));
    }
    async scrobble(id, { orm, engine, user }) {
        await engine.nowPlaying.scrobble(orm, id, user);
    }
};
__decorate([
    Get('/list', () => [NowPlaying], { description: 'Get a List of media [Track, Episode] played currently by Users', summary: 'Get Now Playing' }),
    __param(0, QueryParams()),
    __param(1, QueryParams()),
    __param(2, QueryParams()),
    __param(3, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IncludesNowPlayingArgs,
        IncludesTrackArgs,
        IncludesEpisodeArgs, Object]),
    __metadata("design:returntype", Promise)
], NowPlayingController.prototype, "list", null);
__decorate([
    Post('/scrobble', { description: 'Report playing (scrobble) a media file [Track, Episode]', summary: 'Scrobble' }),
    __param(0, BodyParam('id', { description: 'Media Id', isID: true })),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NowPlayingController.prototype, "scrobble", null);
NowPlayingController = __decorate([
    Controller('/nowPlaying', { tags: ['Now Playing'], roles: [UserRole.stream] })
], NowPlayingController);
export { NowPlayingController };
//# sourceMappingURL=nowplaying.controller.js.map