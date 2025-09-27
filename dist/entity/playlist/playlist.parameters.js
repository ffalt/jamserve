var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { ListType } from '../../types/enums.js';
import { DefaultOrderParameters, FilterParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesPlaylistParameters = class IncludesPlaylistParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include entries on playlist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlaylistParameters.prototype, "playlistIncEntries", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include entry ids on playlist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlaylistParameters.prototype, "playlistIncEntriesIDs", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'include user state on playlist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlaylistParameters.prototype, "playlistIncState", void 0);
IncludesPlaylistParameters = __decorate([
    ObjectParametersType()
], IncludesPlaylistParameters);
export { IncludesPlaylistParameters };
let PlaylistMutateParameters = class PlaylistMutateParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'Playlist Name' }),
    __metadata("design:type", String)
], PlaylistMutateParameters.prototype, "name", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Comment', example: 'Awesome!' }),
    __metadata("design:type", String)
], PlaylistMutateParameters.prototype, "comment", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Playlist is public?', example: false }),
    __metadata("design:type", Boolean)
], PlaylistMutateParameters.prototype, "isPublic", void 0);
__decorate([
    ObjectField(() => [String], { nullable: true, description: 'Track/Episode IDs of the playlist, may include duplicates', isID: true }),
    __metadata("design:type", Array)
], PlaylistMutateParameters.prototype, "mediaIDs", void 0);
PlaylistMutateParameters = __decorate([
    ObjectParametersType()
], PlaylistMutateParameters);
export { PlaylistMutateParameters };
let PlaylistFilterParameters = class PlaylistFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], PlaylistFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Playlist' }),
    __metadata("design:type", String)
], PlaylistFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Comment', example: 'Awesome Comment' }),
    __metadata("design:type", String)
], PlaylistFilterParameters.prototype, "comment", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Playlist Ids', isID: true }),
    __metadata("design:type", Array)
], PlaylistFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true }),
    __metadata("design:type", Array)
], PlaylistFilterParameters.prototype, "userIDs", void 0);
__decorate([
    Field(() => Boolean, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by isPublic Flag', example: true }),
    __metadata("design:type", Boolean)
], PlaylistFilterParameters.prototype, "isPublic", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by since Playlist duration', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistFilterParameters.prototype, "durationFrom", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by until Playlist duration', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistFilterParameters.prototype, "durationTo", void 0);
PlaylistFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], PlaylistFilterParameters);
export { PlaylistFilterParameters };
let PlaylistFilterParametersQL = class PlaylistFilterParametersQL extends PlaylistFilterParameters {
};
PlaylistFilterParametersQL = __decorate([
    InputType()
], PlaylistFilterParametersQL);
export { PlaylistFilterParametersQL };
let PlaylistOrderParameters = class PlaylistOrderParameters extends DefaultOrderParameters {
};
PlaylistOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], PlaylistOrderParameters);
export { PlaylistOrderParameters };
let PlaylistOrderParametersQL = class PlaylistOrderParametersQL extends PlaylistOrderParameters {
};
PlaylistOrderParametersQL = __decorate([
    InputType()
], PlaylistOrderParametersQL);
export { PlaylistOrderParametersQL };
let PlaylistIndexParameters = class PlaylistIndexParameters extends FilterParameters(PlaylistFilterParametersQL) {
};
PlaylistIndexParameters = __decorate([
    ArgsType()
], PlaylistIndexParameters);
export { PlaylistIndexParameters };
let PlaylistPageParametersQL = class PlaylistPageParametersQL extends PaginatedFilterParameters(PlaylistFilterParametersQL, PlaylistOrderParametersQL) {
};
PlaylistPageParametersQL = __decorate([
    ArgsType()
], PlaylistPageParametersQL);
export { PlaylistPageParametersQL };
let PlaylistsParameters = class PlaylistsParameters extends PlaylistPageParametersQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], PlaylistsParameters.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PlaylistsParameters.prototype, "seed", void 0);
PlaylistsParameters = __decorate([
    ArgsType()
], PlaylistsParameters);
export { PlaylistsParameters };
//# sourceMappingURL=playlist.parameters.js.map