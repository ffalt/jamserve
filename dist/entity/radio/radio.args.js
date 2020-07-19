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
exports.RadiosArgs = exports.RadioIndexArgs = exports.RadioOrderArgsQL = exports.RadioOrderArgs = exports.RadioFilterArgsQL = exports.RadioFilterArgs = exports.RadioMutateArgs = exports.IncludesRadioArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const type_graphql_1 = require("type-graphql");
const enums_1 = require("../../types/enums");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let IncludesRadioArgs = class IncludesRadioArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'include state (fav,rate) on radio(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesRadioArgs.prototype, "radioState", void 0);
IncludesRadioArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesRadioArgs);
exports.IncludesRadioArgs = IncludesRadioArgs;
let RadioMutateArgs = class RadioMutateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Radio Name' }),
    __metadata("design:type", String)
], RadioMutateArgs.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' }),
    __metadata("design:type", String)
], RadioMutateArgs.prototype, "url", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Homepage', example: 'https://radio.example.com' }),
    __metadata("design:type", String)
], RadioMutateArgs.prototype, "homepage", void 0);
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Disabled', example: false }),
    __metadata("design:type", Boolean)
], RadioMutateArgs.prototype, "disabled", void 0);
RadioMutateArgs = __decorate([
    decorators_1.ObjParamsType()
], RadioMutateArgs);
exports.RadioMutateArgs = RadioMutateArgs;
let RadioFilterArgs = class RadioFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], RadioFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Name', example: 'Awesome Radio' }),
    __metadata("design:type", String)
], RadioFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by Radio Ids', isID: true }),
    __metadata("design:type", Array)
], RadioFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by URL', example: 'https://radio.example.com/stream.m3u' }),
    __metadata("design:type", String)
], RadioFilterArgs.prototype, "url", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Homepage URL', example: 'https://radio.example.com' }),
    __metadata("design:type", String)
], RadioFilterArgs.prototype, "homepage", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], RadioFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => Boolean, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Disabled Flag', example: true }),
    __metadata("design:type", Boolean)
], RadioFilterArgs.prototype, "disabled", void 0);
RadioFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], RadioFilterArgs);
exports.RadioFilterArgs = RadioFilterArgs;
let RadioFilterArgsQL = class RadioFilterArgsQL extends RadioFilterArgs {
};
RadioFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], RadioFilterArgsQL);
exports.RadioFilterArgsQL = RadioFilterArgsQL;
let RadioOrderArgs = class RadioOrderArgs extends base_args_1.DefaultOrderArgs {
};
RadioOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], RadioOrderArgs);
exports.RadioOrderArgs = RadioOrderArgs;
let RadioOrderArgsQL = class RadioOrderArgsQL extends RadioOrderArgs {
};
RadioOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], RadioOrderArgsQL);
exports.RadioOrderArgsQL = RadioOrderArgsQL;
let RadioIndexArgs = class RadioIndexArgs extends base_args_1.FilterArgs(RadioFilterArgsQL) {
};
RadioIndexArgs = __decorate([
    type_graphql_1.ArgsType()
], RadioIndexArgs);
exports.RadioIndexArgs = RadioIndexArgs;
let RadiosArgs = class RadiosArgs extends base_args_1.PaginatedArgs(RadioFilterArgsQL, RadioOrderArgsQL) {
};
__decorate([
    type_graphql_1.Field(() => enums_1.ListType, { nullable: true }),
    __metadata("design:type", String)
], RadiosArgs.prototype, "list", void 0);
RadiosArgs = __decorate([
    type_graphql_1.ArgsType()
], RadiosArgs);
exports.RadiosArgs = RadiosArgs;
//# sourceMappingURL=radio.args.js.map