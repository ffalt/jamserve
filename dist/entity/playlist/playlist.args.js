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
import { DefaultOrderArgs, FilterArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let IncludesPlaylistArgs = class IncludesPlaylistArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include entries on playlist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlaylistArgs.prototype, "playlistIncEntries", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include entry ids on playlist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlaylistArgs.prototype, "playlistIncEntriesIDs", void 0);
__decorate([
    ObjField({ nullable: true, description: 'include user state on playlist', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesPlaylistArgs.prototype, "playlistIncState", void 0);
IncludesPlaylistArgs = __decorate([
    ObjParamsType()
], IncludesPlaylistArgs);
export { IncludesPlaylistArgs };
let PlaylistMutateArgs = class PlaylistMutateArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'Playlist Name' }),
    __metadata("design:type", String)
], PlaylistMutateArgs.prototype, "name", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Comment', example: 'Awesome!' }),
    __metadata("design:type", String)
], PlaylistMutateArgs.prototype, "comment", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Playlist is public?', example: false }),
    __metadata("design:type", Boolean)
], PlaylistMutateArgs.prototype, "isPublic", void 0);
__decorate([
    ObjField(() => [String], { nullable: true, description: 'Track/Episode IDs of the playlist, may include duplicates', isID: true }),
    __metadata("design:type", Array)
], PlaylistMutateArgs.prototype, "mediaIDs", void 0);
PlaylistMutateArgs = __decorate([
    ObjParamsType()
], PlaylistMutateArgs);
export { PlaylistMutateArgs };
let PlaylistFilterArgs = class PlaylistFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], PlaylistFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Playlist' }),
    __metadata("design:type", String)
], PlaylistFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Comment', example: 'Awesome Comment' }),
    __metadata("design:type", String)
], PlaylistFilterArgs.prototype, "comment", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Playlist Ids', isID: true }),
    __metadata("design:type", Array)
], PlaylistFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true }),
    __metadata("design:type", Array)
], PlaylistFilterArgs.prototype, "userIDs", void 0);
__decorate([
    Field(() => Boolean, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by isPublic Flag', example: true }),
    __metadata("design:type", Boolean)
], PlaylistFilterArgs.prototype, "isPublic", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by since Playlist duration', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistFilterArgs.prototype, "durationFrom", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by until Playlist duration', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], PlaylistFilterArgs.prototype, "durationTo", void 0);
PlaylistFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], PlaylistFilterArgs);
export { PlaylistFilterArgs };
let PlaylistFilterArgsQL = class PlaylistFilterArgsQL extends PlaylistFilterArgs {
};
PlaylistFilterArgsQL = __decorate([
    InputType()
], PlaylistFilterArgsQL);
export { PlaylistFilterArgsQL };
let PlaylistOrderArgs = class PlaylistOrderArgs extends DefaultOrderArgs {
};
PlaylistOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], PlaylistOrderArgs);
export { PlaylistOrderArgs };
let PlaylistOrderArgsQL = class PlaylistOrderArgsQL extends PlaylistOrderArgs {
};
PlaylistOrderArgsQL = __decorate([
    InputType()
], PlaylistOrderArgsQL);
export { PlaylistOrderArgsQL };
let PlaylistIndexArgs = class PlaylistIndexArgs extends FilterArgs(PlaylistFilterArgsQL) {
};
PlaylistIndexArgs = __decorate([
    ArgsType()
], PlaylistIndexArgs);
export { PlaylistIndexArgs };
let PlaylistPageArgsQL = class PlaylistPageArgsQL extends PaginatedFilterArgs(PlaylistFilterArgsQL, PlaylistOrderArgsQL) {
};
PlaylistPageArgsQL = __decorate([
    ArgsType()
], PlaylistPageArgsQL);
export { PlaylistPageArgsQL };
let PlaylistsArgs = class PlaylistsArgs extends PlaylistPageArgsQL {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], PlaylistsArgs.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], PlaylistsArgs.prototype, "seed", void 0);
PlaylistsArgs = __decorate([
    ArgsType()
], PlaylistsArgs);
export { PlaylistsArgs };
//# sourceMappingURL=playlist.args.js.map