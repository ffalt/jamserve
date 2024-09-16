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
import { ArgsType, Field, Float, ID, InputType } from 'type-graphql';
import { DefaultOrderArgs, FilterArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { UserRole } from '../../types/enums.js';
let IncludesUserArgs = class IncludesUserArgs {
};
IncludesUserArgs = __decorate([
    ObjParamsType()
], IncludesUserArgs);
export { IncludesUserArgs };
let UserMutateArgs = class UserMutateArgs {
};
__decorate([
    ObjField({ description: 'Password of calling admin user is required to create an user. this is NOT the user password!' }),
    __metadata("design:type", String)
], UserMutateArgs.prototype, "password", void 0);
__decorate([
    ObjField({ description: 'User Name' }),
    __metadata("design:type", String)
], UserMutateArgs.prototype, "name", void 0);
__decorate([
    ObjField({ description: 'User Email' }),
    __metadata("design:type", String)
], UserMutateArgs.prototype, "email", void 0);
__decorate([
    ObjField({ description: 'User has admin rights?', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], UserMutateArgs.prototype, "roleAdmin", void 0);
__decorate([
    ObjField({ description: 'User has podcast admin rights?', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], UserMutateArgs.prototype, "rolePodcast", void 0);
__decorate([
    ObjField({ description: 'User has api rights?', defaultValue: true, example: true }),
    __metadata("design:type", Boolean)
], UserMutateArgs.prototype, "roleStream", void 0);
__decorate([
    ObjField({ description: 'User has upload rights?', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], UserMutateArgs.prototype, "roleUpload", void 0);
UserMutateArgs = __decorate([
    ObjParamsType()
], UserMutateArgs);
export { UserMutateArgs };
let UserPasswordUpdateArgs = class UserPasswordUpdateArgs {
};
__decorate([
    ObjField({ description: 'Password of calling user (or admin) is required to change the password' }),
    __metadata("design:type", String)
], UserPasswordUpdateArgs.prototype, "password", void 0);
__decorate([
    ObjField({ description: 'New Password' }),
    __metadata("design:type", String)
], UserPasswordUpdateArgs.prototype, "newPassword", void 0);
UserPasswordUpdateArgs = __decorate([
    ObjParamsType()
], UserPasswordUpdateArgs);
export { UserPasswordUpdateArgs };
let UserEmailUpdateArgs = class UserEmailUpdateArgs {
};
__decorate([
    ObjField({ description: 'Password of calling user (or admin) is required to change the email' }),
    __metadata("design:type", String)
], UserEmailUpdateArgs.prototype, "password", void 0);
__decorate([
    ObjField({ description: 'New email' }),
    __metadata("design:type", String)
], UserEmailUpdateArgs.prototype, "email", void 0);
UserEmailUpdateArgs = __decorate([
    ObjParamsType()
], UserEmailUpdateArgs);
export { UserEmailUpdateArgs };
let UserGenerateImageArgs = class UserGenerateImageArgs {
};
__decorate([
    ObjField({ nullable: true, description: 'Random Seed String' }),
    __metadata("design:type", String)
], UserGenerateImageArgs.prototype, "seed", void 0);
UserGenerateImageArgs = __decorate([
    ObjParamsType()
], UserGenerateImageArgs);
export { UserGenerateImageArgs };
let UserFilterArgs = class UserFilterArgs {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Search Query', example: 'admin' }),
    __metadata("design:type", String)
], UserFilterArgs.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by User name', example: 'user' }),
    __metadata("design:type", String)
], UserFilterArgs.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true }),
    __metadata("design:type", Array)
], UserFilterArgs.prototype, "ids", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], UserFilterArgs.prototype, "since", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjField({ nullable: true, description: 'filter by User email', example: 'user@example.com' }),
    __metadata("design:type", String)
], UserFilterArgs.prototype, "email", void 0);
__decorate([
    Field(() => [UserRole], { nullable: true }),
    ObjField(() => [UserRole], { nullable: true, description: 'filter by User roles', example: [UserRole.admin] }),
    __metadata("design:type", Array)
], UserFilterArgs.prototype, "roles", void 0);
UserFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], UserFilterArgs);
export { UserFilterArgs };
let UserFilterArgsQL = class UserFilterArgsQL extends UserFilterArgs {
};
UserFilterArgsQL = __decorate([
    InputType()
], UserFilterArgsQL);
export { UserFilterArgsQL };
let UserOrderArgs = class UserOrderArgs extends DefaultOrderArgs {
};
UserOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], UserOrderArgs);
export { UserOrderArgs };
let UserOrderArgsQL = class UserOrderArgsQL extends UserOrderArgs {
};
UserOrderArgsQL = __decorate([
    InputType()
], UserOrderArgsQL);
export { UserOrderArgsQL };
let UserIndexArgs = class UserIndexArgs extends FilterArgs(UserFilterArgsQL) {
};
UserIndexArgs = __decorate([
    ArgsType()
], UserIndexArgs);
export { UserIndexArgs };
let UsersArgs = class UsersArgs extends PaginatedFilterArgs(UserFilterArgsQL, UserOrderArgsQL) {
};
UsersArgs = __decorate([
    ArgsType()
], UsersArgs);
export { UsersArgs };
//# sourceMappingURL=user.args.js.map