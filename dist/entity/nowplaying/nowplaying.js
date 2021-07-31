var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Track, TrackQL } from '../track/track';
import { Episode, EpisodeQL } from '../episode/episode';
import { Field, Float, ID, ObjectType } from 'type-graphql';
let NowPlaying = class NowPlaying {
};
__decorate([
    Field(() => Float),
    __metadata("design:type", Number)
], NowPlaying.prototype, "time", void 0);
__decorate([
    Field(() => TrackQL, { nullable: true }),
    __metadata("design:type", Track)
], NowPlaying.prototype, "track", void 0);
__decorate([
    Field(() => EpisodeQL, { nullable: true }),
    __metadata("design:type", Episode)
], NowPlaying.prototype, "episode", void 0);
NowPlaying = __decorate([
    ObjectType()
], NowPlaying);
export { NowPlaying };
let NowPlayingQL = class NowPlayingQL extends NowPlaying {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], NowPlayingQL.prototype, "userName", void 0);
__decorate([
    Field(() => ID),
    __metadata("design:type", String)
], NowPlayingQL.prototype, "userID", void 0);
NowPlayingQL = __decorate([
    ObjectType()
], NowPlayingQL);
export { NowPlayingQL };
//# sourceMappingURL=nowplaying.js.map