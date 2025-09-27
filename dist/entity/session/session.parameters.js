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
import { OrderByParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { SessionMode, SessionOrderFields } from '../../types/enums.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let SessionFilterParameters = class SessionFilterParameters {
};
__decorate([
    Field(() => [ID], { nullable: true }),
    __metadata("design:type", Array)
], SessionFilterParameters.prototype, "ids", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'filter by session timestamp', min: 0, example: examples.timestamp }),
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], SessionFilterParameters.prototype, "since", void 0);
__decorate([
    ObjectField(() => String, { nullable: true, description: 'filter by client name', example: 'Jamberry' }),
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], SessionFilterParameters.prototype, "client", void 0);
__decorate([
    ObjectField(() => String, { nullable: true, description: 'filter by client name', example: 'Amiga' }),
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], SessionFilterParameters.prototype, "agent", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'filter by since expiry date', min: 0, example: examples.timestamp }),
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], SessionFilterParameters.prototype, "expiresFrom", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'filter by to expiry date', min: 0, example: examples.timestamp }),
    Field(() => Int, { nullable: true }),
    __metadata("design:type", Number)
], SessionFilterParameters.prototype, "expiresTo", void 0);
__decorate([
    ObjectField(() => SessionMode, { nullable: true, description: 'filter by session mode', example: SessionMode.browser }),
    Field(() => SessionMode, { nullable: true }),
    __metadata("design:type", String)
], SessionFilterParameters.prototype, "mode", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by User Ids', isID: true }),
    __metadata("design:type", Array)
], SessionFilterParameters.prototype, "userIDs", void 0);
SessionFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], SessionFilterParameters);
export { SessionFilterParameters };
let SessionFilterParametersQL = class SessionFilterParametersQL extends SessionFilterParameters {
};
SessionFilterParametersQL = __decorate([
    InputType()
], SessionFilterParametersQL);
export { SessionFilterParametersQL };
let SessionOrderParameters = class SessionOrderParameters extends OrderByParameters {
};
__decorate([
    Field(() => SessionOrderFields, { nullable: true }),
    ObjectField(() => SessionOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], SessionOrderParameters.prototype, "orderBy", void 0);
SessionOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], SessionOrderParameters);
export { SessionOrderParameters };
let SessionOrderParametersQL = class SessionOrderParametersQL extends SessionOrderParameters {
};
SessionOrderParametersQL = __decorate([
    InputType()
], SessionOrderParametersQL);
export { SessionOrderParametersQL };
let SessionsPageParametersQL = class SessionsPageParametersQL extends PaginatedFilterParameters(SessionFilterParametersQL, SessionOrderParametersQL) {
};
SessionsPageParametersQL = __decorate([
    ArgsType()
], SessionsPageParametersQL);
export { SessionsPageParametersQL };
let SessionsParameters = class SessionsParameters extends SessionsPageParametersQL {
};
SessionsParameters = __decorate([
    ArgsType()
], SessionsParameters);
export { SessionsParameters };
//# sourceMappingURL=session.parameters.js.map