var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AlbumType, FolderOrderFields, FolderType, ListType } from '../../types/enums.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { FilterParameters, OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesFolderParameters = class IncludesFolderParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include tag on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncTag", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include state (fav,rate) on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncState", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include child folder count on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncChildFolderCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include track count on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncTrackCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include genre on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncGenres", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include artwork count on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncArtworkCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include a list of all parent folder ids/names on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncParents", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include extended meta data on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncInfo", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include similar folders list on folder(s) - only for folders of type artist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncSimilar", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include artwork images Ids on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncArtworkIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include track Ids on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncTrackIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include children folder Ids on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderParameters.prototype, "folderIncFolderIDs", void 0);
IncludesFolderParameters = __decorate([
    ObjectParametersType()
], IncludesFolderParameters);
export { IncludesFolderParameters };
let IncludesFolderChildrenParameters = class IncludesFolderChildrenParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include artwork images list on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderIncArtworks", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include tracks and sub folders on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderIncChildren", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include child folders on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderIncFolders", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include tracks on folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderIncTracks", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include tag on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncTag", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include state (fav,rate) on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncState", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include child folder count on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncChildFolderCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include track count on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncTrackCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include artwork count on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncArtworkCount", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include a list of all parent folder ids/names on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncParents", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include extended meta data on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncInfo", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include similar folders list on child folder(s) - only for folders of type artist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncSimilar", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include artwork images Ids on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncArtworkIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include track Ids on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncTrackIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include children folder Ids on child folder(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesFolderChildrenParameters.prototype, "folderChildIncFolderIDs", void 0);
IncludesFolderChildrenParameters = __decorate([
    ObjectParametersType()
], IncludesFolderChildrenParameters);
export { IncludesFolderChildrenParameters };
let FolderCreateParameters = class FolderCreateParameters {
};
__decorate([
    ObjectField({ description: 'Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderCreateParameters.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'New Folder Name', example: 'Collection' }),
    __metadata("design:type", String)
], FolderCreateParameters.prototype, "name", void 0);
FolderCreateParameters = __decorate([
    ObjectParametersType()
], FolderCreateParameters);
export { FolderCreateParameters };
let FolderRenameParameters = class FolderRenameParameters {
};
__decorate([
    ObjectField({ description: 'Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderRenameParameters.prototype, "id", void 0);
__decorate([
    ObjectField({ description: 'New Folder Name', example: 'Collection' }),
    __metadata("design:type", String)
], FolderRenameParameters.prototype, "name", void 0);
FolderRenameParameters = __decorate([
    ObjectParametersType()
], FolderRenameParameters);
export { FolderRenameParameters };
let FolderMoveParameters = class FolderMoveParameters {
};
__decorate([
    ObjectField(() => [String], { description: 'Folder Ids', isID: true }),
    __metadata("design:type", Array)
], FolderMoveParameters.prototype, "ids", void 0);
__decorate([
    ObjectField({ description: 'Destination Parent Folder Id', isID: true }),
    __metadata("design:type", String)
], FolderMoveParameters.prototype, "newParentID", void 0);
FolderMoveParameters = __decorate([
    ObjectParametersType()
], FolderMoveParameters);
export { FolderMoveParameters };
let FolderFilterParameters = class FolderFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], FolderFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Collection' }),
    __metadata("design:type", String)
], FolderFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], FolderFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Folder Parent Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "parentIDs", void 0);
__decorate([
    Field(() => ID, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter if folder is in folder id (or its child folders)', isID: true }),
    __metadata("design:type", String)
], FolderFilterParameters.prototype, "childOfID", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Folder Tree Level', min: 0, example: 4 }),
    __metadata("design:type", Number)
], FolderFilterParameters.prototype, "level", void 0);
__decorate([
    Field(() => [AlbumType], { nullable: true }),
    ObjectField(() => [AlbumType], { nullable: true, description: 'filter by Album Types', example: [AlbumType.live] }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "albumTypes", void 0);
__decorate([
    Field(() => [FolderType], { nullable: true }),
    ObjectField(() => [FolderType], { nullable: true, description: 'filter by Folder Types', example: [FolderType.collection] }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "folderTypes", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Genres', example: examples.genres }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "genres", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Album Name', example: ['The Awesome Album'] }),
    __metadata("design:type", String)
], FolderFilterParameters.prototype, "album", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artist Name', example: ['The Awesome Artist'] }),
    __metadata("design:type", String)
], FolderFilterParameters.prototype, "artist", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artist Sort Name', example: ['Awesome Artist, The'] }),
    __metadata("design:type", String)
], FolderFilterParameters.prototype, "artistSort", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Title', example: 'Awesome Folder' }),
    __metadata("design:type", String)
], FolderFilterParameters.prototype, "title", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by since year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], FolderFilterParameters.prototype, "fromYear", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by until year', min: 0, example: examples.year }),
    __metadata("design:type", Number)
], FolderFilterParameters.prototype, "toYear", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by MusicBrainz Release Ids', example: [examples.mbReleaseID] }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "mbReleaseIDs", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by MusicBrainz Release Group Ids', example: [examples.mbReleaseGroupID] }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "mbReleaseGroupIDs", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by MusicBrainz Album Type', example: ['album'] }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "mbAlbumTypes", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by MusicBrainz Artist Ids', example: [examples.mbArtistID] }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "mbArtistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artwork Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "artworksIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "rootIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "albumIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "artistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "seriesIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Genre Ids', isID: true }),
    __metadata("design:type", Array)
], FolderFilterParameters.prototype, "genreIDs", void 0);
FolderFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], FolderFilterParameters);
export { FolderFilterParameters };
let FolderFilterParametersQL = class FolderFilterParametersQL extends FolderFilterParameters {
};
FolderFilterParametersQL = __decorate([
    InputType()
], FolderFilterParametersQL);
export { FolderFilterParametersQL };
let FolderOrderParameters = class FolderOrderParameters extends OrderByParameters {
};
__decorate([
    Field(() => FolderOrderFields, { nullable: true }),
    ObjectField(() => FolderOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], FolderOrderParameters.prototype, "orderBy", void 0);
FolderOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], FolderOrderParameters);
export { FolderOrderParameters };
let FolderOrderParametersQL = class FolderOrderParametersQL extends FolderOrderParameters {
};
FolderOrderParametersQL = __decorate([
    InputType()
], FolderOrderParametersQL);
export { FolderOrderParametersQL };
let FolderIndexParameters = class FolderIndexParameters extends FilterParameters(FolderFilterParametersQL) {
};
FolderIndexParameters = __decorate([
    ArgsType()
], FolderIndexParameters);
export { FolderIndexParameters };
let FolderPageParametersQL = class FolderPageParametersQL extends PaginatedFilterParameters(FolderFilterParametersQL, FolderOrderParametersQL) {
};
FolderPageParametersQL = __decorate([
    ArgsType()
], FolderPageParametersQL);
export { FolderPageParametersQL };
let FoldersParametersQL = class FoldersParametersQL extends FolderPageParametersQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], FoldersParametersQL.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], FoldersParametersQL.prototype, "seed", void 0);
FoldersParametersQL = __decorate([
    ArgsType()
], FoldersParametersQL);
export { FoldersParametersQL };
//# sourceMappingURL=folder.parameters.js.map