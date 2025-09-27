var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { PlaylistEntryOrderFields } from '../../types/enums.js';
import { OrderByParameters } from '../base/base.parameters.js';
import { Field, ID, InputType } from 'type-graphql';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let PlaylistEntryOrderParameters = class PlaylistEntryOrderParameters extends OrderByParameters {
};
__decorate([
    ObjectField(() => PlaylistEntryOrderFields, { nullable: true, description: 'order by field' }),
    Field(() => PlaylistEntryOrderFields, { nullable: true }),
    __metadata("design:type", String)
], PlaylistEntryOrderParameters.prototype, "orderBy", void 0);
PlaylistEntryOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], PlaylistEntryOrderParameters);
export { PlaylistEntryOrderParameters };
let PlaylistEntryOrderParametersQL = class PlaylistEntryOrderParametersQL extends PlaylistEntryOrderParameters {
};
PlaylistEntryOrderParametersQL = __decorate([
    InputType()
], PlaylistEntryOrderParametersQL);
export { PlaylistEntryOrderParametersQL };
let PlaylistEntryFilterParameters = class PlaylistEntryFilterParameters {
};
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Playlist Ids', isID: true }),
    __metadata("design:type", Array)
], PlaylistEntryFilterParameters.prototype, "playlistIDs", void 0);
PlaylistEntryFilterParameters = __decorate([
    ObjectParametersType(),
    InputType()
], PlaylistEntryFilterParameters);
export { PlaylistEntryFilterParameters };
//# sourceMappingURL=playlist-entry.parameters.js.map