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
exports.FoldersArgsQL = exports.FolderPageArgsQL = exports.FolderIndexArgs = exports.FolderOrderArgsQL = exports.FolderOrderArgs = exports.FolderFilterArgsQL = exports.FolderFilterArgs = exports.FolderMoveArgs = exports.FolderRenameArgs = exports.FolderCreateArgs = exports.IncludesFolderChildrenArgs = exports.IncludesFolderArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let IncludesFolderArgs = class IncludesFolderArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include tag on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncTag", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include state (fav,rate) on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncState", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include child folder count on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncChildFolderCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track count on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncTrackCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include artwork count on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncArtworkCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include a list of all parent folder ids/names on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncParents", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include extended meta data on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncInfo", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include similar folders list on folder(s) - only for folders of type artist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncSimilar", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include artwork images Ids on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncArtworkIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track Ids on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncTrackIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include children folder Ids on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncFolderIDs", void 0);
IncludesFolderArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesFolderArgs);
exports.IncludesFolderArgs = IncludesFolderArgs;
let IncludesFolderChildrenArgs = class IncludesFolderChildrenArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include artwork images list on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderIncArtworks", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include tracks and sub folders on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderIncChildren", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include child folders on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderIncFolders", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include tracks on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderIncTracks", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include tag on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncTag", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include state (fav,rate) on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncState", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include child folder count on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncChildFolderCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track count on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncTrackCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include artwork count on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncArtworkCount", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include a list of all parent folder ids/names on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncParents", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include extended meta data on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncInfo", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include similar folders list on child folder(s) - only for folders of type artist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncSimilar", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include artwork images Ids on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncArtworkIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include track Ids on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncTrackIDs", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include children folder Ids on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncFolderIDs", void 0);
IncludesFolderChildrenArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesFolderChildrenArgs);
exports.IncludesFolderChildrenArgs = IncludesFolderChildrenArgs;
let FolderCreateArgs = class FolderCreateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderCreateArgs.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'New Folder Name', example: 'Collection' }),
    __metadata("design:type", String)
], FolderCreateArgs.prototype, "name", void 0);
FolderCreateArgs = __decorate([
    decorators_1.ObjParamsType()
], FolderCreateArgs);
exports.FolderCreateArgs = FolderCreateArgs;
let FolderRenameArgs = class FolderRenameArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderRenameArgs.prototype, "id", void 0);
__decorate([
    decorators_1.ObjField({ description: 'New Folder Name', example: 'Collection' }),
    __metadata("design:type", String)
], FolderRenameArgs.prototype, "name", void 0);
FolderRenameArgs = __decorate([
    decorators_1.ObjParamsType()
], FolderRenameArgs);
exports.FolderRenameArgs = FolderRenameArgs;
let FolderMoveArgs = class FolderMoveArgs {
};
__decorate([
    decorators_1.ObjField(() => [String], { description: 'Folder Ids', isID: true }),
    __metadata("design:type", Array)
], FolderMoveArgs.prototype, "ids", void 0);
__decorate([
    decorators_1.ObjField({ description: 'Destination Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderMoveArgs.prototype, "newParentID", void 0);
FolderMoveArgs = __decorate([
    decorators_1.ObjParamsType()
], FolderMoveArgs);
exports.FolderMoveArgs = FolderMoveArgs;
let FolderFilterArgs = class FolderFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Collection' }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], FolderFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Folder Parent Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "parentIDs", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter if folder is in folder id (or its child folders)', isID: true }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "childOfID", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Folder Tree Level', min: 0, example: 4 }),
    __metadata("design:type", Number)
], FolderFilterArgs.prototype, "level", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.AlbumType], { nullable: true }),
    decorators_1.ObjField(() => [enums_1.AlbumType], { nullable: true, description: 'filter by Album Types', example: [enums_1.AlbumType.live] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "albumTypes", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.FolderType], { nullable: true }),
    decorators_1.ObjField(() => [enums_1.FolderType], { nullable: true, description: 'filter by Folder Types', example: [enums_1.FolderType.collection] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "folderTypes", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Genres', example: example_consts_1.examples.genres }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "genres", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Album Name', example: ['The Awesome Album'] }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "album", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artist Name', example: ['The Awesome Artist'] }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "artist", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artist Sort Name', example: ['Awesome Artist, The'] }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "artistSort", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Title', example: 'Awesome Folder' }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by since year', min: 0, example: example_consts_1.examples.year }),
    __metadata("design:type", Number)
], FolderFilterArgs.prototype, "fromYear", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by until year', min: 0, example: example_consts_1.examples.year }),
    __metadata("design:type", Number)
], FolderFilterArgs.prototype, "toYear", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Release Ids', example: [example_consts_1.examples.mbReleaseID] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "mbReleaseIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Release Group Ids', example: [example_consts_1.examples.mbReleaseGroupID] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "mbReleaseGroupIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Album Type', example: ['album'] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "mbAlbumTypes", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [example_consts_1.examples.mbArtistID] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "mbArtistIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artwork Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "artworksIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "rootIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "albumIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "artistIDs", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "seriesIDs", void 0);
FolderFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], FolderFilterArgs);
exports.FolderFilterArgs = FolderFilterArgs;
let FolderFilterArgsQL = class FolderFilterArgsQL extends FolderFilterArgs {
};
FolderFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], FolderFilterArgsQL);
exports.FolderFilterArgsQL = FolderFilterArgsQL;
let FolderOrderArgs = class FolderOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => enums_1.FolderOrderFields, { nullable: true }),
    decorators_1.ObjField(() => enums_1.FolderOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], FolderOrderArgs.prototype, "orderBy", void 0);
FolderOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], FolderOrderArgs);
exports.FolderOrderArgs = FolderOrderArgs;
let FolderOrderArgsQL = class FolderOrderArgsQL extends FolderOrderArgs {
};
FolderOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], FolderOrderArgsQL);
exports.FolderOrderArgsQL = FolderOrderArgsQL;
let FolderIndexArgs = class FolderIndexArgs extends base_args_1.FilterArgs(FolderFilterArgsQL) {
};
FolderIndexArgs = __decorate([
    type_graphql_1.ArgsType()
], FolderIndexArgs);
exports.FolderIndexArgs = FolderIndexArgs;
let FolderPageArgsQL = class FolderPageArgsQL extends base_args_1.PaginatedFilterArgs(FolderFilterArgsQL, FolderOrderArgsQL) {
};
FolderPageArgsQL = __decorate([
    type_graphql_1.ArgsType()
], FolderPageArgsQL);
exports.FolderPageArgsQL = FolderPageArgsQL;
let FoldersArgsQL = class FoldersArgsQL extends FolderPageArgsQL {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], FoldersArgsQL.prototype, "list", void 0);
FoldersArgsQL = __decorate([
    type_graphql_1.ArgsType()
], FoldersArgsQL);
exports.FoldersArgsQL = FoldersArgsQL;
//# sourceMappingURL=folder.args.js.map