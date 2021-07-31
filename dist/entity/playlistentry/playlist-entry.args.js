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
import { PlaylistEntryOrderFields } from '../../types/enums';
import { OrderByArgs } from '../base/base.args';
import { Field, ID, InputType } from 'type-graphql';
let PlaylistEntryOrderArgs = class PlaylistEntryOrderArgs extends OrderByArgs {
};
__decorate([
    ObjField(() => PlaylistEntryOrderFields, { nullable: true, description: 'order by field' }),
    Field(() => PlaylistEntryOrderFields, { nullable: true }),
    __metadata("design:type", String)
], PlaylistEntryOrderArgs.prototype, "orderBy", void 0);
PlaylistEntryOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], PlaylistEntryOrderArgs);
export { PlaylistEntryOrderArgs };
let PlaylistEntryOrderArgsQL = class PlaylistEntryOrderArgsQL extends PlaylistEntryOrderArgs {
};
PlaylistEntryOrderArgsQL = __decorate([
    InputType()
], PlaylistEntryOrderArgsQL);
export { PlaylistEntryOrderArgsQL };
let PlaylistEntryFilterArgs = class PlaylistEntryFilterArgs {
};
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Playlist Ids', isID: true }),
    __metadata("design:type", Array)
], PlaylistEntryFilterArgs.prototype, "playlistIDs", void 0);
PlaylistEntryFilterArgs = __decorate([
    ObjParamsType(),
    InputType()
], PlaylistEntryFilterArgs);
export { PlaylistEntryFilterArgs };
//# sourceMappingURL=playlist-entry.args.js.map