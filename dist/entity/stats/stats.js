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
exports.StatsQL = exports.StatsAlbumTypesQL = void 0;
const type_graphql_1 = require("type-graphql");
let StatsAlbumTypesQL = class StatsAlbumTypesQL {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "album", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "compilation", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "artistCompilation", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "live", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "audiobook", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "soundtrack", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "series", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "bootleg", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "ep", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "single", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsAlbumTypesQL.prototype, "unknown", void 0);
StatsAlbumTypesQL = __decorate([
    type_graphql_1.ObjectType()
], StatsAlbumTypesQL);
exports.StatsAlbumTypesQL = StatsAlbumTypesQL;
let StatsQL = class StatsQL {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], StatsQL.prototype, "rootID", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsQL.prototype, "track", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsQL.prototype, "folder", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsQL.prototype, "series", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsQL.prototype, "artist", void 0);
__decorate([
    type_graphql_1.Field(() => StatsAlbumTypesQL),
    __metadata("design:type", StatsAlbumTypesQL)
], StatsQL.prototype, "artistTypes", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], StatsQL.prototype, "album", void 0);
__decorate([
    type_graphql_1.Field(() => StatsAlbumTypesQL),
    __metadata("design:type", StatsAlbumTypesQL)
], StatsQL.prototype, "albumTypes", void 0);
StatsQL = __decorate([
    type_graphql_1.ObjectType()
], StatsQL);
exports.StatsQL = StatsQL;
//# sourceMappingURL=stats.js.map