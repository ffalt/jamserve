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
Object.defineProperty(exports, "__esModule", { value: true });
exports.NowPlayingPage = exports.NowPlaying = void 0;
const track_model_1 = require("../track/track.model");
const decorators_1 = require("../../modules/rest/decorators");
const episode_model_1 = require("../episode/episode.model");
const base_model_1 = require("../base/base.model");
let NowPlaying = class NowPlaying {
};
__decorate([
    decorators_1.ObjField({ description: 'User Name', example: 'user' }),
    __metadata("design:type", String)
], NowPlaying.prototype, "userName", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User Id', isID: true }),
    __metadata("design:type", String)
], NowPlaying.prototype, "userID", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Minutes ago', example: 3 }),
    __metadata("design:type", Number)
], NowPlaying.prototype, "minutesAgo", void 0);
__decorate([
    decorators_1.ObjField(() => track_model_1.TrackBase, { nullable: true, description: 'The played track' }),
    __metadata("design:type", track_model_1.TrackBase)
], NowPlaying.prototype, "track", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'The played track id' }),
    __metadata("design:type", String)
], NowPlaying.prototype, "trackID", void 0);
__decorate([
    decorators_1.ObjField(() => episode_model_1.EpisodeBase, { nullable: true, description: 'The played episode' }),
    __metadata("design:type", episode_model_1.EpisodeBase)
], NowPlaying.prototype, "episode", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'The played episode id' }),
    __metadata("design:type", String)
], NowPlaying.prototype, "episodeID", void 0);
NowPlaying = __decorate([
    decorators_1.ResultType({ description: 'Now Playing Data' })
], NowPlaying);
exports.NowPlaying = NowPlaying;
let NowPlayingPage = class NowPlayingPage extends base_model_1.Page {
};
__decorate([
    decorators_1.ObjField(() => NowPlaying, { description: 'List of Now Playing Data' }),
    __metadata("design:type", Array)
], NowPlayingPage.prototype, "items", void 0);
NowPlayingPage = __decorate([
    decorators_1.ResultType({ description: 'Now Playing Page' })
], NowPlayingPage);
exports.NowPlayingPage = NowPlayingPage;
//# sourceMappingURL=nowplaying.model.js.map