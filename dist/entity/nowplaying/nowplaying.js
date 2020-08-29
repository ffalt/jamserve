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
exports.NowPlayingQL = exports.NowPlaying = void 0;
const track_1 = require("../track/track");
const episode_1 = require("../episode/episode");
const type_graphql_1 = require("type-graphql");
let NowPlaying = class NowPlaying {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float),
    __metadata("design:type", Number)
], NowPlaying.prototype, "time", void 0);
__decorate([
    type_graphql_1.Field(() => track_1.TrackQL, { nullable: true }),
    __metadata("design:type", track_1.Track)
], NowPlaying.prototype, "track", void 0);
__decorate([
    type_graphql_1.Field(() => episode_1.EpisodeQL, { nullable: true }),
    __metadata("design:type", episode_1.Episode)
], NowPlaying.prototype, "episode", void 0);
NowPlaying = __decorate([
    type_graphql_1.ObjectType()
], NowPlaying);
exports.NowPlaying = NowPlaying;
let NowPlayingQL = class NowPlayingQL extends NowPlaying {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], NowPlayingQL.prototype, "userName", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    __metadata("design:type", String)
], NowPlayingQL.prototype, "userID", void 0);
NowPlayingQL = __decorate([
    type_graphql_1.ObjectType()
], NowPlayingQL);
exports.NowPlayingQL = NowPlayingQL;
//# sourceMappingURL=nowplaying.js.map