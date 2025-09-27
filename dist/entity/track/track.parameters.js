var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ListType, TrackHealthID, TrackOrderFields } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesTrackParameters = class IncludesTrackParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include media information on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackParameters.prototype, "trackIncMedia", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include tag on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackParameters.prototype, "trackIncTag", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include raw tag on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackParameters.prototype, "trackIncRawTag", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include genre on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackParameters.prototype, "trackIncGenres", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include user states (fav,rate) on track(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesTrackParameters.prototype, "trackIncState", void 0);
IncludesTrackParameters = __decorate([
    ObjectParametersType()
], IncludesTrackParameters);
export { IncludesTrackParameters };
let MediaHealthParameters = class MediaHealthParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'check media file integrity', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], MediaHealthParameters.prototype, "healthMedia", void 0);
MediaHealthParameters = __decorate([
    ObjectParametersType()
], MediaHealthParameters);
export { MediaHealthParameters };
let TrackRenameParameters = class TrackRenameParameters {
};
__decorate([
    ObjectField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], TrackRenameParameters.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'New track file name', isID: true }),
    __metadata("design:type", String)
], TrackRenameParameters.prototype, "name", void 0);
TrackRenameParameters = __decorate([
    ObjectParametersType()
], TrackRenameParameters);
export { TrackRenameParameters };
let TrackMoveParameters = class TrackMoveParameters {
};
__decorate([
    ObjectField(() => [String], { description: 'Track Ids', isID: true }),
    __metadata("design:type", Array)
], TrackMoveParameters.prototype, "ids", void 0);
__decorate([
    ObjectField({ description: 'ID of the destination folder', isID: true }),
    __metadata("design:type", String)
], TrackMoveParameters.prototype, "folderID", void 0);
TrackMoveParameters = __decorate([
    ObjectParametersType()
], TrackMoveParameters);
export { TrackMoveParameters };
let TrackFixParameters = class TrackFixParameters {
};
__decorate([
    ObjectField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], TrackFixParameters.prototype, "id", void 0);
__decorate([
    ObjectField(() => TrackHealthID, { description: 'Which issue to fix with the track' }),
    __metadata("design:type", String)
], TrackFixParameters.prototype, "fixID", void 0);
TrackFixParameters = __decorate([
    ObjectParametersType()
], TrackFixParameters);
export { TrackFixParameters };
let MediaTagRawUpdateParameters = class MediaTagRawUpdateParameters {
};
__decorate([
    ObjectField({ description: 'Tag Version' }),
    __metadata("design:type", Number)
], MediaTagRawUpdateParameters.prototype, "version", void 0);
__decorate([
    ObjectField(() => Object, { description: 'Tag Frames', generic: true }),
    __metadata("design:type", Object)
], MediaTagRawUpdateParameters.prototype, "frames", void 0);
MediaTagRawUpdateParameters = __decorate([
    ObjectParametersType()
], MediaTagRawUpdateParameters);
export { MediaTagRawUpdateParameters };
let RawTagUpdateParameters = class RawTagUpdateParameters {
};
__decorate([
    ObjectField({ description: 'Track Id', isID: true }),
    __metadata("design:type", String)
], RawTagUpdateParameters.prototype, "id", void 0);
__decorate([
    ObjectField(() => MediaTagRawUpdateParameters, { description: 'Raw tag to store in the track (e.g. id3v2/vorbis)' }),
    __metadata("design:type", MediaTagRawUpdateParameters)
], RawTagUpdateParameters.prototype, "tag", void 0);
RawTagUpdateParameters = __decorate([
    ObjectParametersType()
], RawTagUpdateParameters);
export { RawTagUpdateParameters };
let TrackFilterParameters = class TrackFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'these' }),
    __metadata("design:type", String)
], TrackFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Track Title', example: 'These Days' }),
    __metadata("design:type", String)
], TrackFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter if track is in folder id (or its child folders)', isID: true }),
    __metadata("design:type", String)
], TrackFilterParameters.prototype, "childOfID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by artist name', example: 'Nico' }),
    __metadata("design:type", String)
], TrackFilterParameters.prototype, "artist", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by album name', example: 'Chelsea Girl' }),
    __metadata("design:type", String)
], TrackFilterParameters.prototype, "album", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by genres', example: ['Folk Pop'] }),
    __metadata("design:type", Array)
], TrackFilterParameters.prototype, "genres", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterParameters.prototype, "genreIDs", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], TrackFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterParameters.prototype, "seriesIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterParameters.prototype, "albumIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterParameters.prototype, "artistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Album Artist Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterParameters.prototype, "albumArtistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterParameters.prototype, "rootIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterParameters.prototype, "folderIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Bookmark Ids', isID: true }),
    __metadata("design:type", Array)
], TrackFilterParameters.prototype, "bookmarkIDs", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by since year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], TrackFilterParameters.prototype, "fromYear", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by until year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], TrackFilterParameters.prototype, "toYear", void 0);
TrackFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], TrackFilterParameters);
export { TrackFilterParameters };
let TrackFilterParametersQL = class TrackFilterParametersQL extends TrackFilterParameters {
};
TrackFilterParametersQL = __decorate([
    InputType()
], TrackFilterParametersQL);
export { TrackFilterParametersQL };
let TrackOrderParameters = class TrackOrderParameters extends OrderByParameters {
};
__decorate([
    Field(() => TrackOrderFields, { nullable: true }),
    ObjectField(() => TrackOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], TrackOrderParameters.prototype, "orderBy", void 0);
TrackOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], TrackOrderParameters);
export { TrackOrderParameters };
let TrackOrderParametersQL = class TrackOrderParametersQL extends TrackOrderParameters {
};
TrackOrderParametersQL = __decorate([
    InputType()
], TrackOrderParametersQL);
export { TrackOrderParametersQL };
let TrackPageParametersQL = class TrackPageParametersQL extends PaginatedFilterParameters(TrackFilterParametersQL, TrackOrderParametersQL) {
};
TrackPageParametersQL = __decorate([
    ArgsType()
], TrackPageParametersQL);
export { TrackPageParametersQL };
let TracksParametersQL = class TracksParametersQL extends TrackPageParametersQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], TracksParametersQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], TracksParametersQL.prototype, "seed", void 0);
TracksParametersQL = __decorate([
    ArgsType()
], TracksParametersQL);
export { TracksParametersQL };
//# sourceMappingURL=track.parameters.js.map