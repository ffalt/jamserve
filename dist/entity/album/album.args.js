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
import { AlbumOrderFields, AlbumType, ListType } from '../../types/enums';
import { ArgsType, Field, Float, ID, InputType, Int } from 'type-graphql';
import { FilterArgs, OrderByArgs, PaginatedFilterArgs } from '../base/base.args';
import { examples } from '../../modules/engine/rest/example.consts';
let IncludesAlbumArgs = class IncludesAlbumArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include track ids on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumArgs.prototype, "albumIncTrackIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include track count on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumArgs.prototype, "albumIncTrackCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include user states (fav,rate) on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumArgs.prototype, "albumIncState", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include extended meta data on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumArgs.prototype, "albumIncInfo", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include genre on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumArgs.prototype, "albumIncGenres", void 0);
IncludesAlbumArgs = __decorate([
    ObjParamsType()
], IncludesAlbumArgs);
export { IncludesAlbumArgs };
let IncludesAlbumChildrenArgs = class IncludesAlbumChildrenArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include tracks on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumChildrenArgs.prototype, "albumIncTracks", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include artist on album(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesAlbumChildrenArgs.prototype, "albumIncArtist", void 0);
IncludesAlbumChildrenArgs = __decorate([
    ObjParamsType()
], IncludesAlbumChildrenArgs);
export { IncludesAlbumChildrenArgs };
let AlbumFilterArgs = class AlbumFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'balkan' }),
    __metadata("design:type", String)
], AlbumFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Album Name', example: 'Balkan Beat Box' }),
    __metadata("design:type", String)
], AlbumFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Album Slug', example: 'balkanbeatbox' }),
    __metadata("design:type", String)
], AlbumFilterArgs.prototype, "slug", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Artist Name', example: 'Balkan Beat Box' }),
    __metadata("design:type", String)
], AlbumFilterArgs.prototype, "artist", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "rootIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "artistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "seriesIDs", void 0);
__decorate([
    Field(() => [AlbumType], { nullable: true }),
    ObjField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.audiobook] }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "albumTypes", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Release Ids', example: [examples.mbReleaseID] }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "mbReleaseIDs", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID] }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "mbArtistIDs", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField(() => String, { nullable: true, description: 'exclude by MusicBrainz Artist Id', example: examples.mbArtistID }),
    __metadata("design:type", String)
], AlbumFilterArgs.prototype, "notMbArtistID", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Genres', example: examples.genres }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "genres", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], AlbumFilterArgs.prototype, "genreIDs", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], AlbumFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by since year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], AlbumFilterArgs.prototype, "fromYear", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by until year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], AlbumFilterArgs.prototype, "toYear", void 0);
AlbumFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], AlbumFilterArgs);
export { AlbumFilterArgs };
let AlbumFilterArgsQL = class AlbumFilterArgsQL extends AlbumFilterArgs {
};
AlbumFilterArgsQL = __decorate([
    InputType()
], AlbumFilterArgsQL);
export { AlbumFilterArgsQL };
let AlbumOrderArgs = class AlbumOrderArgs extends OrderByArgs {
};
__decorate([
    Field(() => AlbumOrderFields, { nullable: true }),
    ObjField(() => AlbumOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], AlbumOrderArgs.prototype, "orderBy", void 0);
AlbumOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], AlbumOrderArgs);
export { AlbumOrderArgs };
let AlbumOrderArgsQL = class AlbumOrderArgsQL extends AlbumOrderArgs {
};
AlbumOrderArgsQL = __decorate([
    InputType()
], AlbumOrderArgsQL);
export { AlbumOrderArgsQL };
let AlbumIndexArgsQL = class AlbumIndexArgsQL extends FilterArgs(AlbumFilterArgsQL) {
};
AlbumIndexArgsQL = __decorate([
    ArgsType()
], AlbumIndexArgsQL);
export { AlbumIndexArgsQL };
let AlbumPageArgsQL = class AlbumPageArgsQL extends PaginatedFilterArgs(AlbumFilterArgsQL, AlbumOrderArgsQL) {
};
AlbumPageArgsQL = __decorate([
    ArgsType()
], AlbumPageArgsQL);
export { AlbumPageArgsQL };
let AlbumsArgsQL = class AlbumsArgsQL extends AlbumPageArgsQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], AlbumsArgsQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], AlbumsArgsQL.prototype, "seed", void 0);
AlbumsArgsQL = __decorate([
    ArgsType()
], AlbumsArgsQL);
export { AlbumsArgsQL };
//# sourceMappingURL=album.args.js.map