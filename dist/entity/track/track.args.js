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
import { ListType, TrackHealthID, TrackOrderFields } from '../../types/enums';
import { ArgsType, Field, Float, ID, InputType, Int } from 'type-graphql';
import { OrderByArgs, PaginatedFilterArgs } from '../base/base.args';
import { examples } from '../../modules/engine/rest/example.consts';
let IncludesTrackArgs = class IncludesTrackArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include media information on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackArgs.prototype, "trackIncMedia", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include tag on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackArgs.prototype, "trackIncTag", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include raw tag on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackArgs.prototype, "trackIncRawTag", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include genre on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackArgs.prototype, "trackIncGenres", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include user states (fav,rate) on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackArgs.prototype, "trackIncState", void 0);
IncludesTrackArgs = __decorate([
    ObjParamsType()
], IncludesTrackArgs);
export { IncludesTrackArgs };
let MediaHealthArgs = class MediaHealthArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'check media file integrity', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], MediaHealthArgs.prototype, "healthMedia", void 0);
MediaHealthArgs = __decorate([
    ObjParamsType()
], MediaHealthArgs);
export { MediaHealthArgs };
let TrackRenameArgs = class TrackRenameArgs {
};
__decorate([
    ObjField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], TrackRenameArgs.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'New track file name', isID: true }),
    __metadata("design:type", String)
], TrackRenameArgs.prototype, "name", void 0);
TrackRenameArgs = __decorate([
    ObjParamsType()
], TrackRenameArgs);
export { TrackRenameArgs };
let TrackMoveArgs = class TrackMoveArgs {
};
__decorate([
    ObjField(() => [String], { description: 'Track Ids', isID: true }),
    __metadata("design:type", Array)
], TrackMoveArgs.prototype, "ids", void 0);
__decorate([
    ObjField({ description: 'ID of the destination folder', isID: true }),
    __metadata("design:type", String)
], TrackMoveArgs.prototype, "folderID", void 0);
TrackMoveArgs = __decorate([
    ObjParamsType()
], TrackMoveArgs);
export { TrackMoveArgs };
let TrackFixArgs = class TrackFixArgs {
};
__decorate([
    ObjField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], TrackFixArgs.prototype, "id", void 0);
__decorate([
    ObjField(() => TrackHealthID, { description: 'Which issue to fix with the track' }),
    __metadata("design:type", String)
], TrackFixArgs.prototype, "fixID", void 0);
TrackFixArgs = __decorate([
    ObjParamsType()
], TrackFixArgs);
export { TrackFixArgs };
let MediaTagRawUpdateArgs = class MediaTagRawUpdateArgs {
};
__decorate([
    ObjField({ description: 'Tag Version' }),
    __metadata("design:type", Number)
], MediaTagRawUpdateArgs.prototype, "version", void 0);
__decorate([
    ObjField(() => Object, { description: 'Tag Frames', generic: true }),
    __metadata("design:type", Object)
], MediaTagRawUpdateArgs.prototype, "frames", void 0);
MediaTagRawUpdateArgs = __decorate([
    ObjParamsType()
], MediaTagRawUpdateArgs);
export { MediaTagRawUpdateArgs };
let RawTagUpdateArgs = class RawTagUpdateArgs {
};
__decorate([
    ObjField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], RawTagUpdateArgs.prototype, "id", void 0);
__decorate([
    ObjField(() => MediaTagRawUpdateArgs, { description: 'Raw tag to store in the track (e.g. id3v2/vorbis)' }),
    __metadata("design:type", MediaTagRawUpdateArgs)
], RawTagUpdateArgs.prototype, "tag", void 0);
RawTagUpdateArgs = __decorate([
    ObjParamsType()
], RawTagUpdateArgs);
export { RawTagUpdateArgs };
let TrackFilterArgs = class TrackFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'these' }),
    __metadata("design:type", String)
], TrackFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Track Title', example: 'These Days' }),
    __metadata("design:type", String)
], TrackFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    ObjField({ nullable: true, description: 'filter if track is in folder id (or its child folders)', isID: true }),
    __metadata("design:type", String)
], TrackFilterArgs.prototype, "childOfID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by artist name', example: 'Nico' }),
    __metadata("design:type", String)
], TrackFilterArgs.prototype, "artist", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by album name', example: 'Chelsea Girl' }),
    __metadata("design:type", String)
], TrackFilterArgs.prototype, "album", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by genres', example: ['Folk Pop'] }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "genres", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "genreIDs", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], TrackFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "seriesIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "albumIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "artistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Album Artist Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "albumArtistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "rootIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Bookmark Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterArgs.prototype, "bookmarkIDs", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by since year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], TrackFilterArgs.prototype, "fromYear", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by until year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], TrackFilterArgs.prototype, "toYear", void 0);
TrackFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], TrackFilterArgs);
export { TrackFilterArgs };
let TrackFilterArgsQL = class TrackFilterArgsQL extends TrackFilterArgs {
};
TrackFilterArgsQL = __decorate([
    InputType()
], TrackFilterArgsQL);
export { TrackFilterArgsQL };
let TrackOrderArgs = class TrackOrderArgs extends OrderByArgs {
};
__decorate([
    Field(() => TrackOrderFields, { nullable: true }),
    ObjField(() => TrackOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], TrackOrderArgs.prototype, "orderBy", void 0);
TrackOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], TrackOrderArgs);
export { TrackOrderArgs };
let TrackOrderArgsQL = class TrackOrderArgsQL extends TrackOrderArgs {
};
TrackOrderArgsQL = __decorate([
    InputType()
], TrackOrderArgsQL);
export { TrackOrderArgsQL };
let TrackPageArgsQL = class TrackPageArgsQL extends PaginatedFilterArgs(TrackFilterArgsQL, TrackOrderArgsQL) {
};
TrackPageArgsQL = __decorate([
    ArgsType()
], TrackPageArgsQL);
export { TrackPageArgsQL };
let TracksArgsQL = class TracksArgsQL extends TrackPageArgsQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], TracksArgsQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], TracksArgsQL.prototype, "seed", void 0);
TracksArgsQL = __decorate([
    ArgsType()
], TracksArgsQL);
export { TracksArgsQL };
//# sourceMappingURL=track.args.js.map