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
import { UserRole } from '../../types/enums.js';
import { NowPlaying } from './nowplaying.model.js';
import { IncludesNowPlayingParameters } from './nowplaying.parameters.js';
import { IncludesTrackParameters } from '../track/track.parameters.js';
import { IncludesEpisodeParameters } from '../episode/episode.parameters.js';
import { Controller } from '../../modules/rest/decorators/controller.js';
import { Get } from '../../modules/rest/decorators/get.js';
import { QueryParameters } from '../../modules/rest/decorators/query-parameters.js';
import { RestContext } from '../../modules/rest/decorators/rest-context.js';
import { Post } from '../../modules/rest/decorators/post.js';
import { BodyParameter } from '../../modules/rest/decorators/body-parameter.js';
let NowPlayingController = class NowPlayingController {
    async list(nowPlayingParameters, trackParameters, episodeParameters, { orm, engine, user }) {
        const result = await engine.nowPlaying.getNowPlaying();
        return await Promise.all(result.map(o => engine.transform.nowPlaying(orm, o, nowPlayingParameters, trackParameters, episodeParameters, user)));
    }
    async scrobble(id, { orm, engine, user }) {
        await engine.nowPlaying.scrobble(orm, id, user);
    }
};
__decorate([
    Get('/list', () => [NowPlaying], { description: 'Get a List of media [Track, Episode] played currently by Users', summary: 'Get Now Playing' }),
    __param(0, QueryParameters()),
    __param(1, QueryParameters()),
    __param(2, QueryParameters()),
    __param(3, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IncludesNowPlayingParameters,
        IncludesTrackParameters,
        IncludesEpisodeParameters, Object]),
    __metadata("design:returntype", Promise)
], NowPlayingController.prototype, "list", null);
__decorate([
    Post('/scrobble', { description: 'Report playing (scrobble) a media file [Track, Episode]', summary: 'Scrobble' }),
    __param(0, BodyParameter('id', { description: 'Media Id', isID: true })),
    __param(1, RestContext()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], NowPlayingController.prototype, "scrobble", null);
NowPlayingController = __decorate([
    Controller('/nowPlaying', { tags: ['Now Playing'], roles: [UserRole.stream] })
], NowPlayingController);
export { NowPlayingController };
//# sourceMappingURL=nowplaying.controller.js.map