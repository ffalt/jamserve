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
import { AlbumType, FolderOrderFields, FolderType, ListType } from '../../types/enums.js';
import { ArgsType, Field, Float, ID, InputType, Int } from 'type-graphql';
import { FilterArgs, OrderByArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
let IncludesFolderArgs = class IncludesFolderArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include tag on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncTag", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include state (fav,rate) on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncState", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include child folder count on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncChildFolderCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include track count on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncTrackCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include genre on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncGenres", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include artwork count on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncArtworkCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include a list of all parent folder ids/names on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncParents", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include extended meta data on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncInfo", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include similar folders list on folder(s) - only for folders of type artist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncSimilar", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include artwork images Ids on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncArtworkIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include track Ids on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncTrackIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include children folder Ids on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderArgs.prototype, "folderIncFolderIDs", void 0);
IncludesFolderArgs = __decorate([
    ObjParamsType()
], IncludesFolderArgs);
export { IncludesFolderArgs };
let IncludesFolderChildrenArgs = class IncludesFolderChildrenArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include artwork images list on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderIncArtworks", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include tracks and sub folders on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderIncChildren", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include child folders on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderIncFolders", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include tracks on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderIncTracks", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include tag on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncTag", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include state (fav,rate) on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncState", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include child folder count on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncChildFolderCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include track count on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncTrackCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include artwork count on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncArtworkCount", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include a list of all parent folder ids/names on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncParents", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include extended meta data on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncInfo", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include similar folders list on child folder(s) - only for folders of type artist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncSimilar", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include artwork images Ids on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncArtworkIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include track Ids on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncTrackIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include children folder Ids on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenArgs.prototype, "folderChildIncFolderIDs", void 0);
IncludesFolderChildrenArgs = __decorate([
    ObjParamsType()
], IncludesFolderChildrenArgs);
export { IncludesFolderChildrenArgs };
let FolderCreateArgs = class FolderCreateArgs {
};
__decorate([
    ObjField({ description: 'Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderCreateArgs.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'New Folder Name', example: 'Collection' }),
    __metadata("design:type", String)
], FolderCreateArgs.prototype, "name", void 0);
FolderCreateArgs = __decorate([
    ObjParamsType()
], FolderCreateArgs);
export { FolderCreateArgs };
let FolderRenameArgs = class FolderRenameArgs {
};
__decorate([
    ObjField({ description: 'Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderRenameArgs.prototype, "id", void 0);
__decorate([
    ObjField({ description: 'New Folder Name', example: 'Collection' }),
    __metadata("design:type", String)
], FolderRenameArgs.prototype, "name", void 0);
FolderRenameArgs = __decorate([
    ObjParamsType()
], FolderRenameArgs);
export { FolderRenameArgs };
let FolderMoveArgs = class FolderMoveArgs {
};
__decorate([
    ObjField(() => [String], { description: 'Folder Ids', isID: true }),
    __metadata("design:type", Array)
], FolderMoveArgs.prototype, "ids", void 0);
__decorate([
    ObjField({ description: 'Destination Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderMoveArgs.prototype, "newParentID", void 0);
FolderMoveArgs = __decorate([
    ObjParamsType()
], FolderMoveArgs);
export { FolderMoveArgs };
let FolderFilterArgs = class FolderFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Collection' }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], FolderFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Folder Parent Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "parentIDs", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    ObjField({ nullable: true, description: 'filter if folder is in folder id (or its child folders)', isID: true }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "childOfID", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Folder Tree Level', min: 0, example: 4 }),
    __metadata("design:type", Number)
], FolderFilterArgs.prototype, "level", void 0);
__decorate([
    Field(() => [AlbumType], { nullable: true }),
    ObjField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.live] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "albumTypes", void 0);
__decorate([
    Field(() => [FolderType], { nullable: true }),
    ObjField(() => [FolderType], { nullable: true, description: 'filter by Folder Types', example: [FolderType.collection] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "folderTypes", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Genres', example: examples.genres }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "genres", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Album Name', example: ['The Awesome Album'] }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "album", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artist Name', example: ['The Awesome Artist'] }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "artist", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artist Sort Name', example: ['Awesome Artist, The'] }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "artistSort", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Title', example: 'Awesome Folder' }),
    __metadata("design:type", String)
], FolderFilterArgs.prototype, "title", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by since year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], FolderFilterArgs.prototype, "fromYear", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by until year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], FolderFilterArgs.prototype, "toYear", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Release Ids', example: [examples.mbReleaseID] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "mbReleaseIDs", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Release Group Ids', example: [examples.mbReleaseGroupID] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "mbReleaseGroupIDs", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Album Type', example: ['album'] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "mbAlbumTypes", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID] }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "mbArtistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artwork Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "artworksIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "rootIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "albumIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "artistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "seriesIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterArgs.prototype, "genreIDs", void 0);
FolderFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], FolderFilterArgs);
export { FolderFilterArgs };
let FolderFilterArgsQL = class FolderFilterArgsQL extends FolderFilterArgs {
};
FolderFilterArgsQL = __decorate([
    InputType()
], FolderFilterArgsQL);
export { FolderFilterArgsQL };
let FolderOrderArgs = class FolderOrderArgs extends OrderByArgs {
};
__decorate([
    Field(() => FolderOrderFields, { nullable: true }),
    ObjField(() => FolderOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], FolderOrderArgs.prototype, "orderBy", void 0);
FolderOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], FolderOrderArgs);
export { FolderOrderArgs };
let FolderOrderArgsQL = class FolderOrderArgsQL extends FolderOrderArgs {
};
FolderOrderArgsQL = __decorate([
    InputType()
], FolderOrderArgsQL);
export { FolderOrderArgsQL };
let FolderIndexArgs = class FolderIndexArgs extends FilterArgs(FolderFilterArgsQL) {
};
FolderIndexArgs = __decorate([
    ArgsType()
], FolderIndexArgs);
export { FolderIndexArgs };
let FolderPageArgsQL = class FolderPageArgsQL extends PaginatedFilterArgs(FolderFilterArgsQL, FolderOrderArgsQL) {
};
FolderPageArgsQL = __decorate([
    ArgsType()
], FolderPageArgsQL);
export { FolderPageArgsQL };
let FoldersArgsQL = class FoldersArgsQL extends FolderPageArgsQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], FoldersArgsQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], FoldersArgsQL.prototype, "seed", void 0);
FoldersArgsQL = __decorate([
    ArgsType()
], FoldersArgsQL);
export { FoldersArgsQL };
//# sourceMappingURL=folder.args.js.map