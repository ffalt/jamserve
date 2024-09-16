var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { TrackBase } from '../track/track.model.js';
import { ObjField, ResultType } from '../../modules/rest/index.js';
import { EpisodeBase } from '../episode/episode.model.js';
import { Page } from '../base/base.model.js';
let NowPlaying = class NowPlaying {
};
__decorate([
    ObjField({ description: 'User Name', example: 'user' }),
    __metadata("design:type", String)
], NowPlaying.prototype, "userName", void 0);
__decorate([
    ObjField({ description: 'User Id', isID: true }),
    __metadata("design:type", String)
], NowPlaying.prototype, "userID", void 0);
__decorate([
    ObjField({ description: 'Minutes ago', example: 3 }),
    __metadata("design:type", Number)
], NowPlaying.prototype, "minutesAgo", void 0);
__decorate([
    ObjField(() => TrackBase, { nullable: true, description: 'The played track' }),
    __metadata("design:type", TrackBase)
], NowPlaying.prototype, "track", void 0);
__decorate([
    ObjField({ nullable: true, description: 'The played track id' }),
    __metadata("design:type", String)
], NowPlaying.prototype, "trackID", void 0);
__decorate([
    ObjField(() => EpisodeBase, { nullable: true, description: 'The played episode' }),
    __metadata("design:type", EpisodeBase)
], NowPlaying.prototype, "episode", void 0);
__decorate([
    ObjField({ nullable: true, description: 'The played episode id' }),
    __metadata("design:type", String)
], NowPlaying.prototype, "episodeID", void 0);
NowPlaying = __decorate([
    ResultType({ description: 'Now Playing Data' })
], NowPlaying);
export { NowPlaying };
let NowPlayingPage = class NowPlayingPage extends Page {
};
__decorate([
    ObjField(() => NowPlaying, { description: 'List of Now Playing Data' }),
    __metadata("design:type", Array)
], NowPlayingPage.prototype, "items", void 0);
NowPlayingPage = __decorate([
    ResultType({ description: 'Now Playing Page' })
], NowPlayingPage);
export { NowPlayingPage };
//# sourceMappingURL=nowplaying.model.js.map