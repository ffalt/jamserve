var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ObjField, ObjParamsType } from '../../modules/rest/index.js';
import { AlbumType, ArtistOrderFields, ListType } from '../../types/enums.js';
import { ArgsType, Field, Float, ID, InputType } from 'type-graphql';
import { FilterArgs, OrderByArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
let IncludesArtistArgs = class IncludesArtistArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include album ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncAlbumIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include album count on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncAlbumCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include user states (fav,rate) on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncState", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include track ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncTrackIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include track count on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncTrackCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include series ids on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncSeriesIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include series count on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncSeriesCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include extended meta data on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncInfo", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include genre on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistArgs.prototype, "artistIncGenres", void 0);
IncludesArtistArgs = __decorate([
    ObjParamsType()
], IncludesArtistArgs);
export { IncludesArtistArgs };
let IncludesArtistChildrenArgs = class IncludesArtistChildrenArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include albums on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenArgs.prototype, "artistIncAlbums", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include tracks on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenArgs.prototype, "artistIncTracks", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include series on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenArgs.prototype, "artistIncSeries", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include similar artists on artist(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesArtistChildrenArgs.prototype, "artistIncSimilar", void 0);
IncludesArtistChildrenArgs = __decorate([
    ObjParamsType()
], IncludesArtistChildrenArgs);
export { IncludesArtistChildrenArgs };
let ArtistFilterArgs = class ArtistFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'pink' }),
    __metadata("design:type", String)
], ArtistFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Artist Name', example: 'Pink Floyd' }),
    __metadata("design:type", String)
], ArtistFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Artist Slug', example: 'pinkfloyd' }),
    __metadata("design:type", String)
], ArtistFilterArgs.prototype, "slug", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "rootIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "albumIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Album Track Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "albumTrackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "seriesIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Genres', example: examples.genres }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "genres", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "genreIDs", void 0);
__decorate([
    Field(() => [AlbumType], { nullable: true }),
    ObjField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook] }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "albumTypes", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID] }),
    __metadata("design:type", Array)
], ArtistFilterArgs.prototype, "mbArtistIDs", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField(() => String, { nullable: true, description: 'exclude by MusicBrainz Artist Id', example: examples.mbArtistID }),
    __metadata("design:type", String)
], ArtistFilterArgs.prototype, "notMbArtistID", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], ArtistFilterArgs.prototype, "since", void 0);
ArtistFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], ArtistFilterArgs);
export { ArtistFilterArgs };
let ArtistFilterArgsQL = class ArtistFilterArgsQL extends ArtistFilterArgs {
};
ArtistFilterArgsQL = __decorate([
    InputType()
], ArtistFilterArgsQL);
export { ArtistFilterArgsQL };
let ArtistOrderArgs = class ArtistOrderArgs extends OrderByArgs {
};
__decorate([
    Field(() => ArtistOrderFields, { nullable: true }),
    ObjField(() => ArtistOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], ArtistOrderArgs.prototype, "orderBy", void 0);
ArtistOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], ArtistOrderArgs);
export { ArtistOrderArgs };
let ArtistOrderArgsQL = class ArtistOrderArgsQL extends ArtistOrderArgs {
};
ArtistOrderArgsQL = __decorate([
    InputType()
], ArtistOrderArgsQL);
export { ArtistOrderArgsQL };
let ArtistIndexArgsQL = class ArtistIndexArgsQL extends FilterArgs(ArtistFilterArgsQL) {
};
ArtistIndexArgsQL = __decorate([
    ArgsType()
], ArtistIndexArgsQL);
export { ArtistIndexArgsQL };
let ArtistPageArgsQL = class ArtistPageArgsQL extends PaginatedFilterArgs(ArtistFilterArgsQL, ArtistOrderArgsQL) {
};
ArtistPageArgsQL = __decorate([
    ArgsType()
], ArtistPageArgsQL);
export { ArtistPageArgsQL };
let ArtistsArgsQL = class ArtistsArgsQL extends ArtistPageArgsQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], ArtistsArgsQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], ArtistsArgsQL.prototype, "seed", void 0);
ArtistsArgsQL = __decorate([
    ArgsType()
], ArtistsArgsQL);
export { ArtistsArgsQL };
//# sourceMappingURL=artist.args.js.map