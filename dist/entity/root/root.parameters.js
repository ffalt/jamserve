var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { ListType, RootScanStrategy } from '../../types/enums.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { DefaultOrderParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesRootParameters = class IncludesRootParameters {
};
IncludesRootParameters = __decorate([
    ObjectParametersType()
], IncludesRootParameters);
export { IncludesRootParameters };
let RootMutateParameters = class RootMutateParameters {
};
__decorate([
    ObjectField({ description: 'Root Name', example: 'Compilations' }),
    __metadata("design:type", String)
], RootMutateParameters.prototype, "name", void 0);
__decorate([
    ObjectField({ description: 'Absolute Path for Root ', example: '/var/media/compilations' }),
    __metadata("design:type", String)
], RootMutateParameters.prototype, "path", void 0);
__decorate([
    ObjectField(() => RootScanStrategy, { description: 'Scan Strategy', example: RootScanStrategy.compilation }),
    __metadata("design:type", String)
], RootMutateParameters.prototype, "strategy", void 0);
RootMutateParameters = __decorate([
    ObjectParametersType()
], RootMutateParameters);
export { RootMutateParameters };
let RootRefreshParameters = class RootRefreshParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'Root ID to refresh (empty for refreshing all)', isID: true }),
    __metadata("design:type", String)
], RootRefreshParameters.prototype, "id", void 0);
RootRefreshParameters = __decorate([
    ObjectParametersType()
], RootRefreshParameters);
export { RootRefreshParameters };
let RootFilterParameters = class RootFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'compilations' }),
    __metadata("design:type", String)
], RootFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Artist Name', example: 'Compilations' }),
    __metadata("design:type", String)
], RootFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], RootFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => [RootScanStrategy]),
    ObjectField(() => [RootScanStrategy], { nullable: true, description: 'filter by Scan Strategy', example: [RootScanStrategy.auto] }),
    __metadata("design:type", Array)
], RootFilterParameters.prototype, "strategies", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterParameters.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterParameters.prototype, "folderIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterParameters.prototype, "albumIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterParameters.prototype, "artistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterParameters.prototype, "seriesIDs", void 0);
RootFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], RootFilterParameters);
export { RootFilterParameters };
let RootFilterParametersQL = class RootFilterParametersQL extends RootFilterParameters {
};
RootFilterParametersQL = __decorate([
    InputType()
], RootFilterParametersQL);
export { RootFilterParametersQL };
let RootOrderParameters = class RootOrderParameters extends DefaultOrderParameters {
};
RootOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], RootOrderParameters);
export { RootOrderParameters };
let RootOrderParametersQL = class RootOrderParametersQL extends RootOrderParameters {
};
RootOrderParametersQL = __decorate([
    InputType()
], RootOrderParametersQL);
export { RootOrderParametersQL };
let RootsParameters = class RootsParameters extends PaginatedFilterParameters(RootFilterParametersQL, RootOrderParametersQL) {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], RootsParameters.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RootsParameters.prototype, "seed", void 0);
RootsParameters = __decorate([
    ArgsType()
], RootsParameters);
export { RootsParameters };
//# sourceMappingURL=root.parameters.js.map