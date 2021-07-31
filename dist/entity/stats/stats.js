var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, ID, Int, ObjectType } from 'type-graphql';
let StatsAlbumTypesQL = class StatsAlbumTypesQL {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "album", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "compilation", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "artistCompilation", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "live", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "audiobook", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "soundtrack", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "series", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "bootleg", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "ep", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "single", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "unknown", void 0);
StatsAlbumTypesQL = __decorate([
    ObjectType()
], StatsAlbumTypesQL);
export { StatsAlbumTypesQL };
let StatsQL = class StatsQL {
};
__decorate([
    Field(() => ID, { nullable: true }),
    __metadata("design:type", String)
], StatsQL.prototype, "rootID", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsQL.prototype, "track", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsQL.prototype, "folder", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsQL.prototype, "series", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsQL.prototype, "artist", void 0);
__decorate([
    Field(() => StatsAlbumTypesQL),
    __metadata("design:type", StatsAlbumTypesQL)
], StatsQL.prototype, "artistTypes", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], StatsQL.prototype, "album", void 0);
__decorate([
    Field(() => StatsAlbumTypesQL),
    __metadata("design:type", StatsAlbumTypesQL)
], StatsQL.prototype, "albumTypes", void 0);
StatsQL = __decorate([
    ObjectType()
], StatsQL);
export { StatsQL };
let UserDetailStatsQL = class UserDetailStatsQL {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], UserDetailStatsQL.prototype, "track", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], UserDetailStatsQL.prototype, "folder", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], UserDetailStatsQL.prototype, "series", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], UserDetailStatsQL.prototype, "artist", void 0);
__decorate([
    Field(() => StatsAlbumTypesQL),
    __metadata("design:type", StatsAlbumTypesQL)
], UserDetailStatsQL.prototype, "artistTypes", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], UserDetailStatsQL.prototype, "album", void 0);
__decorate([
    Field(() => StatsAlbumTypesQL),
    __metadata("design:type", StatsAlbumTypesQL)
], UserDetailStatsQL.prototype, "albumTypes", void 0);
UserDetailStatsQL = __decorate([
    ObjectType()
], UserDetailStatsQL);
export { UserDetailStatsQL };
let UserStatsQL = class UserStatsQL {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], UserStatsQL.prototype, "playlist", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], UserStatsQL.prototype, "bookmark", void 0);
__decorate([
    Field(() => UserDetailStatsQL),
    __metadata("design:type", UserDetailStatsQL)
], UserStatsQL.prototype, "favorite", void 0);
__decorate([
    Field(() => UserDetailStatsQL),
    __metadata("design:type", UserDetailStatsQL)
], UserStatsQL.prototype, "played", void 0);
UserStatsQL = __decorate([
    ObjectType()
], UserStatsQL);
export { UserStatsQL };
//# sourceMappingURL=stats.js.map