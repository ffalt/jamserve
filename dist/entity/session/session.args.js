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
import { OrderByArgs, PaginatedFilterArgs } from '../base/base.args.js';
import { SessionMode, SessionOrderFields } from '../../types/enums.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjParamsType } from '../../modules/rest/decorators/ObjParamsType.js';
import { ObjField } from '../../modules/rest/decorators/ObjField.js';
let SessionFilterArgs = class SessionFilterArgs {
};
__decorate([
    Field(() => [ID], { nullable: true }),
    __metadata("design:type", Array)
], SessionFilterArgs.prototype, "ids", void 0);
__decorate([
    ObjField({ nullable: true, description: 'filter by session timestamp', min: 0, example: examples.timestamp }),
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], SessionFilterArgs.prototype, "since", void 0);
__decorate([
    ObjField(() => String, { nullable: true, description: 'filter by client name', example: 'Jamberry' }),
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], SessionFilterArgs.prototype, "client", void 0);
__decorate([
    ObjField(() => String, { nullable: true, description: 'filter by client name', example: 'Amiga' }),
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], SessionFilterArgs.prototype, "agent", void 0);
__decorate([
    ObjField({ nullable: true, description: 'filter by since expiry date', min: 0, example: examples.timestamp }),
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], SessionFilterArgs.prototype, "expiresFrom", void 0);
__decorate([
    ObjField({ nullable: true, description: 'filter by to expiry date', min: 0, example: examples.timestamp }),
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], SessionFilterArgs.prototype, "expiresTo", void 0);
__decorate([
    ObjField(() => SessionMode, { nullable: true, description: 'filter by session mode', example: SessionMode.browser }),
    Field(() => SessionMode, { nullable: true }),
    __metadata("design:type", String)
], SessionFilterArgs.prototype, "mode", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true }),
    __metadata("design:type", Array)
], SessionFilterArgs.prototype, "userIDs", void 0);
SessionFilterArgs = __decorate([
    InputType(),
    ObjParamsType()
], SessionFilterArgs);
export { SessionFilterArgs };
let SessionFilterArgsQL = class SessionFilterArgsQL extends SessionFilterArgs {
};
SessionFilterArgsQL = __decorate([
    InputType()
], SessionFilterArgsQL);
export { SessionFilterArgsQL };
let SessionOrderArgs = class SessionOrderArgs extends OrderByArgs {
};
__decorate([
    Field(() => SessionOrderFields, { nullable: true }),
    ObjField(() => SessionOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], SessionOrderArgs.prototype, "orderBy", void 0);
SessionOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], SessionOrderArgs);
export { SessionOrderArgs };
let SessionOrderArgsQL = class SessionOrderArgsQL extends SessionOrderArgs {
};
SessionOrderArgsQL = __decorate([
    InputType()
], SessionOrderArgsQL);
export { SessionOrderArgsQL };
let SessionsPageArgsQL = class SessionsPageArgsQL extends PaginatedFilterArgs(SessionFilterArgsQL, SessionOrderArgsQL) {
};
SessionsPageArgsQL = __decorate([
    ArgsType()
], SessionsPageArgsQL);
export { SessionsPageArgsQL };
let SessionsArgs = class SessionsArgs extends SessionsPageArgsQL {
};
SessionsArgs = __decorate([
    ArgsType()
], SessionsArgs);
export { SessionsArgs };
//# sourceMappingURL=session.args.js.map