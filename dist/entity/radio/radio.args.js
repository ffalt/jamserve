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
import { ArgsType, Field, ID, InputType, Int } from 'type-graphql';
import { ListType } from '../../types/enums.js';
import { DefaultOrderArgs, FilterArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
let IncludesRadioArgs = class IncludesRadioArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'include state (fav,rate) on radio(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesRadioArgs.prototype, "radioState", void 0);
IncludesRadioArgs = __decorate([
    ObjParamsType()
], IncludesRadioArgs);
export { IncludesRadioArgs };
let RadioMutateArgs = class RadioMutateArgs {
};
__decorate([
    ObjField({ description: 'Radio Name' }),
    __metadata("design:type", String)
], RadioMutateArgs.prototype, "name", void 0);
__decorate([
    ObjField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' }),
    __metadata("design:type", String)
], RadioMutateArgs.prototype, "url", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Homepage', example: 'https://radio.example.com' }),
    __metadata("design:type", String)
], RadioMutateArgs.prototype, "homepage", void 0);
__decorate([
    ObjField({ nullable: true, description: 'Disabled', example: false }),
    __metadata("design:type", Boolean)
], RadioMutateArgs.prototype, "disabled", void 0);
RadioMutateArgs = __decorate([
    ObjParamsType()
], RadioMutateArgs);
export { RadioMutateArgs };
let RadioFilterArgs = class RadioFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], RadioFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Radio' }),
    __metadata("design:type", String)
], RadioFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by Radio Ids', isID: true }),
    __metadata("design:type", Array)
], RadioFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by URL', example: 'https://radio.example.com/stream.m3u' }),
    __metadata("design:type", String)
], RadioFilterArgs.prototype, "url", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Homepage URL', example: 'https://radio.example.com' }),
    __metadata("design:type", String)
], RadioFilterArgs.prototype, "homepage", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], RadioFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => Boolean, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Disabled Flag', example: true }),
    __metadata("design:type", Boolean)
], RadioFilterArgs.prototype, "disabled", void 0);
RadioFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], RadioFilterArgs);
export { RadioFilterArgs };
let RadioFilterArgsQL = class RadioFilterArgsQL extends RadioFilterArgs {
};
RadioFilterArgsQL = __decorate([
    InputType()
], RadioFilterArgsQL);
export { RadioFilterArgsQL };
let RadioOrderArgs = class RadioOrderArgs extends DefaultOrderArgs {
};
RadioOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], RadioOrderArgs);
export { RadioOrderArgs };
let RadioOrderArgsQL = class RadioOrderArgsQL extends RadioOrderArgs {
};
RadioOrderArgsQL = __decorate([
    InputType()
], RadioOrderArgsQL);
export { RadioOrderArgsQL };
let RadioIndexArgs = class RadioIndexArgs extends FilterArgs(RadioFilterArgsQL) {
};
RadioIndexArgs = __decorate([
    ArgsType()
], RadioIndexArgs);
export { RadioIndexArgs };
let RadiosArgs = class RadiosArgs extends PaginatedFilterArgs(RadioFilterArgsQL, RadioOrderArgsQL) {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], RadiosArgs.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RadiosArgs.prototype, "seed", void 0);
RadiosArgs = __decorate([
    ArgsType()
], RadiosArgs);
export { RadiosArgs };
//# sourceMappingURL=radio.args.js.map