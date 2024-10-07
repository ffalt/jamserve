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
import { DefaultOrderArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let IncludesRootArgs = class IncludesRootArgs {
};
IncludesRootArgs = __decorate([
    ObjParamsType()
], IncludesRootArgs);
export { IncludesRootArgs };
let RootMutateArgs = class RootMutateArgs {
};
__decorate([
    ObjField({ description: 'Root Name', example: 'Compilations' }),
    __metadata("design:type", String)
], RootMutateArgs.prototype, "name", void 0);
__decorate([
    ObjField({ description: 'Absolute Path for Root ', example: '/var/media/compilations' }),
    __metadata("design:type", String)
], RootMutateArgs.prototype, "path", void 0);
__decorate([
    ObjField(() => RootScanStrategy, { description: 'Scan Strategy', example: RootScanStrategy.compilation }),
    __metadata("design:type", String)
], RootMutateArgs.prototype, "strategy", void 0);
RootMutateArgs = __decorate([
    ObjParamsType()
], RootMutateArgs);
export { RootMutateArgs };
let RootRefreshArgs = class RootRefreshArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'Root ID to refresh (empty for refreshing all)', isID: true }),
    __metadata("design:type", String)
], RootRefreshArgs.prototype, "id", void 0);
RootRefreshArgs = __decorate([
    ObjParamsType()
], RootRefreshArgs);
export { RootRefreshArgs };
let RootFilterArgs = class RootFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'compilations' }),
    __metadata("design:type", String)
], RootFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Artist Name', example: 'Compilations' }),
    __metadata("design:type", String)
], RootFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Root Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], RootFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => [RootScanStrategy]),
    ObjField(() => [RootScanStrategy], { nullable: true, description: 'filter by Scan Strategy', example: [RootScanStrategy.auto] }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "strategies", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Track Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "trackIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Folder Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "folderIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Album Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "albumIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Artist Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "artistIDs", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Series Ids', isID: true }),
    __metadata("design:type", Array)
], RootFilterArgs.prototype, "seriesIDs", void 0);
RootFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], RootFilterArgs);
export { RootFilterArgs };
let RootFilterArgsQL = class RootFilterArgsQL extends RootFilterArgs {
};
RootFilterArgsQL = __decorate([
    InputType()
], RootFilterArgsQL);
export { RootFilterArgsQL };
let RootOrderArgs = class RootOrderArgs extends DefaultOrderArgs {
};
RootOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], RootOrderArgs);
export { RootOrderArgs };
let RootOrderArgsQL = class RootOrderArgsQL extends RootOrderArgs {
};
RootOrderArgsQL = __decorate([
    InputType()
], RootOrderArgsQL);
export { RootOrderArgsQL };
let RootsArgs = class RootsArgs extends PaginatedFilterArgs(RootFilterArgsQL, RootOrderArgsQL) {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], RootsArgs.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RootsArgs.prototype, "seed", void 0);
RootsArgs = __decorate([
    ArgsType()
], RootsArgs);
export { RootsArgs };
//# sourceMappingURL=root.args.js.map