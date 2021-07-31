var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ObjParamsType } from '../../modules/rest/decorators';
let IncludesNowPlayingArgs = class IncludesNowPlayingArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include track Id on now playing entries', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesNowPlayingArgs.prototype, "nowPlayingIncTrackIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include tracks on now playing entries', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesNowPlayingArgs.prototype, "nowPlayingIncTracks", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include track Id on now playing entries', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesNowPlayingArgs.prototype, "nowPlayingIncEpisodeIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include tracks on now playing entries', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesNowPlayingArgs.prototype, "nowPlayingIncEpisodes", void 0);
IncludesNowPlayingArgs = __decorate([
    ObjParamsType()
], IncludesNowPlayingArgs);
export { IncludesNowPlayingArgs };
//# sourceMappingURL=nowplaying.args.js.map