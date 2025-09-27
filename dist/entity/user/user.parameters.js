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
import { DefaultOrderParameters, FilterParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { UserRole } from '../../types/enums.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesUserParameters = class IncludesUserParameters {
};
IncludesUserParameters = __decorate([
    ObjectParametersType()
], IncludesUserParameters);
export { IncludesUserParameters };
let UserMutateParameters = class UserMutateParameters {
};
__decorate([
    ObjectField({ description: 'Password of calling admin user is required to create an user. this is NOT the user password!' }),
    __metadata("design:type", String)
], UserMutateParameters.prototype, "password", void 0);
__decorate([
    ObjectField({ description: 'User Name' }),
    __metadata("design:type", String)
], UserMutateParameters.prototype, "name", void 0);
__decorate([
    ObjectField({ description: 'User Email' }),
    __metadata("design:type", String)
], UserMutateParameters.prototype, "email", void 0);
__decorate([
    ObjectField({ description: 'User has admin rights?', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], UserMutateParameters.prototype, "roleAdmin", void 0);
__decorate([
    ObjectField({ description: 'User has podcast admin rights?', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], UserMutateParameters.prototype, "rolePodcast", void 0);
__decorate([
    ObjectField({ description: 'User has api rights?', defaultValue: true, example: true }),
    __metadata("design:type", Boolean)
], UserMutateParameters.prototype, "roleStream", void 0);
__decorate([
    ObjectField({ description: 'User has upload rights?', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], UserMutateParameters.prototype, "roleUpload", void 0);
UserMutateParameters = __decorate([
    ObjectParametersType()
], UserMutateParameters);
export { UserMutateParameters };
let UserPasswordUpdateParameters = class UserPasswordUpdateParameters {
};
__decorate([
    ObjectField({ description: 'Password of calling user (or admin) is required to change the password' }),
    __metadata("design:type", String)
], UserPasswordUpdateParameters.prototype, "password", void 0);
__decorate([
    ObjectField({ description: 'New Password' }),
    __metadata("design:type", String)
], UserPasswordUpdateParameters.prototype, "newPassword", void 0);
UserPasswordUpdateParameters = __decorate([
    ObjectParametersType()
], UserPasswordUpdateParameters);
export { UserPasswordUpdateParameters };
let UserSubsonicTokenGenerateParameters = class UserSubsonicTokenGenerateParameters {
};
__decorate([
    ObjectField({ description: 'Password of calling user (or admin) is required to generate/update the Subsonic token' }),
    __metadata("design:type", String)
], UserSubsonicTokenGenerateParameters.prototype, "password", void 0);
UserSubsonicTokenGenerateParameters = __decorate([
    ObjectParametersType()
], UserSubsonicTokenGenerateParameters);
export { UserSubsonicTokenGenerateParameters };
let UserEmailUpdateParameters = class UserEmailUpdateParameters {
};
__decorate([
    ObjectField({ description: 'Password of calling user (or admin) is required to change the email' }),
    __metadata("design:type", String)
], UserEmailUpdateParameters.prototype, "password", void 0);
__decorate([
    ObjectField({ description: 'New email' }),
    __metadata("design:type", String)
], UserEmailUpdateParameters.prototype, "email", void 0);
UserEmailUpdateParameters = __decorate([
    ObjectParametersType()
], UserEmailUpdateParameters);
export { UserEmailUpdateParameters };
let UserGenerateImageParameters = class UserGenerateImageParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'Random Seed String' }),
    __metadata("design:type", String)
], UserGenerateImageParameters.prototype, "seed", void 0);
UserGenerateImageParameters = __decorate([
    ObjectParametersType()
], UserGenerateImageParameters);
export { UserGenerateImageParameters };
let UserFilterParameters = class UserFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'admin' }),
    __metadata("design:type", String)
], UserFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by User name', example: 'user' }),
    __metadata("design:type", String)
], UserFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true }),
    __metadata("design:type", Array)
], UserFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], UserFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by User email', example: 'user@example.com' }),
    __metadata("design:type", String)
], UserFilterParameters.prototype, "email", void 0);
__decorate([
    Field(() => [UserRole], { nullable: true }),
    ObjectField(() => [UserRole], { nullable: true, description: 'filter by User roles', example: [UserRole.admin] }),
    __metadata("design:type", Array)
], UserFilterParameters.prototype, "roles", void 0);
UserFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], UserFilterParameters);
export { UserFilterParameters };
let UserFilterParametersQL = class UserFilterParametersQL extends UserFilterParameters {
};
UserFilterParametersQL = __decorate([
    InputType()
], UserFilterParametersQL);
export { UserFilterParametersQL };
let UserOrderParameters = class UserOrderParameters extends DefaultOrderParameters {
};
UserOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], UserOrderParameters);
export { UserOrderParameters };
let UserOrderParametersQL = class UserOrderParametersQL extends UserOrderParameters {
};
UserOrderParametersQL = __decorate([
    InputType()
], UserOrderParametersQL);
export { UserOrderParametersQL };
let UserIndexParameters = class UserIndexParameters extends FilterParameters(UserFilterParametersQL) {
};
UserIndexParameters = __decorate([
    ArgsType()
], UserIndexParameters);
export { UserIndexParameters };
let UsersParameters = class UsersParameters extends PaginatedFilterParameters(UserFilterParametersQL, UserOrderParametersQL) {
};
UsersParameters = __decorate([
    ArgsType()
], UsersParameters);
export { UsersParameters };
//# sourceMappingURL=user.parameters.js.map