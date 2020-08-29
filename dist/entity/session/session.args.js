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
exports.SessionsArgs = exports.SessionOrderArgsQL = exports.SessionOrderArgs = exports.SessionFilterArgsQL = exports.SessionFilterArgs = void 0;
const type_graphql_1 = require("type-graphql");
const base_args_1 = require("../base/base.args");
const enums_1 = require("../../types/enums");
const decorators_1 = require("../../modules/rest/decorators");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
let SessionFilterArgs = class SessionFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], SessionFilterArgs.prototype, "ids", void 0);
__decorate([
    decorators_1.ObjField(() => Number, { nullable: true, description: 'filter by session timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], SessionFilterArgs.prototype, "since", void 0);
__decorate([
    decorators_1.ObjField(() => String, { nullable: true, description: 'filter by client name', example: 'Jamberry' }),
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], SessionFilterArgs.prototype, "client", void 0);
__decorate([
    decorators_1.ObjField(() => String, { nullable: true, description: 'filter by client name', example: 'Amiga' }),
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], SessionFilterArgs.prototype, "agent", void 0);
__decorate([
    decorators_1.ObjField(() => Number, { nullable: true, description: 'filter by since expiry date', min: 0, example: example_consts_1.examples.timestamp }),
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], SessionFilterArgs.prototype, "expiresFrom", void 0);
__decorate([
    decorators_1.ObjField(() => Number, { nullable: true, description: 'filter by to expiry date', min: 0, example: example_consts_1.examples.timestamp }),
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    __metadata("design:type", Number)
], SessionFilterArgs.prototype, "expiresTo", void 0);
__decorate([
    decorators_1.ObjField(() => enums_1.SessionMode, { nullable: true, description: 'filter by session mode', example: enums_1.SessionMode.browser }),
    type_graphql_1.Field(() => enums_1.SessionMode, { nullable: true }),
    __metadata("design:type", String)
], SessionFilterArgs.prototype, "mode", void 0);
SessionFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], SessionFilterArgs);
exports.SessionFilterArgs = SessionFilterArgs;
let SessionFilterArgsQL = class SessionFilterArgsQL extends SessionFilterArgs {
};
SessionFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], SessionFilterArgsQL);
exports.SessionFilterArgsQL = SessionFilterArgsQL;
let SessionOrderArgs = class SessionOrderArgs extends base_args_1.OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => enums_1.SessionOrderFields, { nullable: true }),
    decorators_1.ObjField(() => enums_1.SessionOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], SessionOrderArgs.prototype, "orderBy", void 0);
SessionOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], SessionOrderArgs);
exports.SessionOrderArgs = SessionOrderArgs;
let SessionOrderArgsQL = class SessionOrderArgsQL extends SessionOrderArgs {
};
SessionOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], SessionOrderArgsQL);
exports.SessionOrderArgsQL = SessionOrderArgsQL;
let SessionsArgs = class SessionsArgs extends base_args_1.PaginatedArgs(SessionFilterArgsQL, SessionOrderArgsQL) {
};
SessionsArgs = __decorate([
    type_graphql_1.ArgsType()
], SessionsArgs);
exports.SessionsArgs = SessionsArgs;
//# sourceMappingURL=session.args.js.map