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
exports.UsersArgs = exports.UserIndexArgs = exports.UserOrderArgsQL = exports.UserOrderArgs = exports.UserFilterArgsQL = exports.UserFilterArgs = exports.UserGenerateImageArgs = exports.UserEmailUpdateArgs = exports.UserPasswordUpdateArgs = exports.UserMutateArgs = exports.IncludesUserArgs = void 0;
const decorators_1 = require("../../modules/rest/decorators");
const type_graphql_1 = require("type-graphql");
const base_args_1 = require("../base/base.args");
const example_consts_1 = require("../../modules/engine/rest/example.consts");
const enums_1 = require("../../types/enums");
let IncludesUserArgs = class IncludesUserArgs {
};
IncludesUserArgs = __decorate([
    decorators_1.ObjParamsType()
], IncludesUserArgs);
exports.IncludesUserArgs = IncludesUserArgs;
let UserMutateArgs = class UserMutateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Password of calling admin user is required to create an user. this is NOT the user password!' }),
    __metadata("design:type", String)
], UserMutateArgs.prototype, "password", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User Name' }),
    __metadata("design:type", String)
], UserMutateArgs.prototype, "name", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User Email' }),
    __metadata("design:type", String)
], UserMutateArgs.prototype, "email", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User has admin rights?', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], UserMutateArgs.prototype, "roleAdmin", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User has podcast admin rights?', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], UserMutateArgs.prototype, "rolePodcast", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User has api rights?', defaultValue: true, example: true }),
    __metadata("design:type", Boolean)
], UserMutateArgs.prototype, "roleStream", void 0);
__decorate([
    decorators_1.ObjField({ description: 'User has upload rights?', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], UserMutateArgs.prototype, "roleUpload", void 0);
UserMutateArgs = __decorate([
    decorators_1.ObjParamsType()
], UserMutateArgs);
exports.UserMutateArgs = UserMutateArgs;
let UserPasswordUpdateArgs = class UserPasswordUpdateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Password of calling user (or admin) is required to change the password' }),
    __metadata("design:type", String)
], UserPasswordUpdateArgs.prototype, "password", void 0);
__decorate([
    decorators_1.ObjField({ description: 'New Password' }),
    __metadata("design:type", String)
], UserPasswordUpdateArgs.prototype, "newPassword", void 0);
UserPasswordUpdateArgs = __decorate([
    decorators_1.ObjParamsType()
], UserPasswordUpdateArgs);
exports.UserPasswordUpdateArgs = UserPasswordUpdateArgs;
let UserEmailUpdateArgs = class UserEmailUpdateArgs {
};
__decorate([
    decorators_1.ObjField({ description: 'Password of calling user (or admin) is required to change the email' }),
    __metadata("design:type", String)
], UserEmailUpdateArgs.prototype, "password", void 0);
__decorate([
    decorators_1.ObjField({ description: 'New email' }),
    __metadata("design:type", String)
], UserEmailUpdateArgs.prototype, "email", void 0);
UserEmailUpdateArgs = __decorate([
    decorators_1.ObjParamsType()
], UserEmailUpdateArgs);
exports.UserEmailUpdateArgs = UserEmailUpdateArgs;
let UserGenerateImageArgs = class UserGenerateImageArgs {
};
__decorate([
    decorators_1.ObjField({ nullable: true, description: 'Random Seed String' }),
    __metadata("design:type", String)
], UserGenerateImageArgs.prototype, "seed", void 0);
UserGenerateImageArgs = __decorate([
    decorators_1.ObjParamsType()
], UserGenerateImageArgs);
exports.UserGenerateImageArgs = UserGenerateImageArgs;
let UserFilterArgs = class UserFilterArgs {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Search Query', example: 'admin' }),
    __metadata("design:type", String)
], UserFilterArgs.prototype, "query", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by User name', example: 'user' }),
    __metadata("design:type", String)
], UserFilterArgs.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => [type_graphql_1.ID], { nullable: true }),
    decorators_1.ObjField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true }),
    __metadata("design:type", Array)
], UserFilterArgs.prototype, "ids", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: example_consts_1.examples.timestamp }),
    __metadata("design:type", Number)
], UserFilterArgs.prototype, "since", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    decorators_1.ObjField({ nullable: true, description: 'filter by User email', example: 'user@example.com' }),
    __metadata("design:type", String)
], UserFilterArgs.prototype, "email", void 0);
__decorate([
    type_graphql_1.Field(() => [enums_1.UserRole], { nullable: true }),
    decorators_1.ObjField(() => [enums_1.UserRole], { nullable: true, description: 'filter by User roles', example: [enums_1.UserRole.admin] }),
    __metadata("design:type", Array)
], UserFilterArgs.prototype, "roles", void 0);
UserFilterArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], UserFilterArgs);
exports.UserFilterArgs = UserFilterArgs;
let UserFilterArgsQL = class UserFilterArgsQL extends UserFilterArgs {
};
UserFilterArgsQL = __decorate([
    type_graphql_1.InputType()
], UserFilterArgsQL);
exports.UserFilterArgsQL = UserFilterArgsQL;
let UserOrderArgs = class UserOrderArgs extends base_args_1.DefaultOrderArgs {
};
UserOrderArgs = __decorate([
    type_graphql_1.InputType(),
    decorators_1.ObjParamsType()
], UserOrderArgs);
exports.UserOrderArgs = UserOrderArgs;
let UserOrderArgsQL = class UserOrderArgsQL extends UserOrderArgs {
};
UserOrderArgsQL = __decorate([
    type_graphql_1.InputType()
], UserOrderArgsQL);
exports.UserOrderArgsQL = UserOrderArgsQL;
let UserIndexArgs = class UserIndexArgs extends base_args_1.FilterArgs(UserFilterArgsQL) {
};
UserIndexArgs = __decorate([
    type_graphql_1.ArgsType()
], UserIndexArgs);
exports.UserIndexArgs = UserIndexArgs;
let UsersArgs = class UsersArgs extends base_args_1.PaginatedFilterArgs(UserFilterArgsQL, UserOrderArgsQL) {
};
UsersArgs = __decorate([
    type_graphql_1.ArgsType()
], UsersArgs);
exports.UsersArgs = UsersArgs;
//# sourceMappingURL=user.args.js.map