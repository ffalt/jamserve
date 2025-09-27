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
import { ListType } from '../../types/enums.js';
import { DefaultOrderParameters, FilterParameters, PaginatedFilterParameters } from '../base/base.parameters.js';
import { examples } from '../../modules/engine/rest/example.consts.js';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let IncludesRadioParameters = class IncludesRadioParameters {
};
__decorate([
    ObjectField({ nullable: true, description: 'include state (fav,rate) on radio(s)', defaultValue: false, example: false }),
    __metadata("design:type", Boolean)
], IncludesRadioParameters.prototype, "radioState", void 0);
IncludesRadioParameters = __decorate([
    ObjectParametersType()
], IncludesRadioParameters);
export { IncludesRadioParameters };
let RadioMutateParameters = class RadioMutateParameters {
};
__decorate([
    ObjectField({ description: 'Radio Name' }),
    __metadata("design:type", String)
], RadioMutateParameters.prototype, "name", void 0);
__decorate([
    ObjectField({ description: 'URL', example: 'https://radio.example.com/stream.m3u' }),
    __metadata("design:type", String)
], RadioMutateParameters.prototype, "url", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Homepage', example: 'https://radio.example.com' }),
    __metadata("design:type", String)
], RadioMutateParameters.prototype, "homepage", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'Disabled', example: false }),
    __metadata("design:type", Boolean)
], RadioMutateParameters.prototype, "disabled", void 0);
RadioMutateParameters = __decorate([
    ObjectParametersType()
], RadioMutateParameters);
export { RadioMutateParameters };
let RadioFilterParameters = class RadioFilterParameters {
};
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Search Query', example: 'awesome' }),
    __metadata("design:type", String)
], RadioFilterParameters.prototype, "query", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Name', example: 'Awesome Radio' }),
    __metadata("design:type", String)
], RadioFilterParameters.prototype, "name", void 0);
__decorate([
    Field(() => [ID], { nullable: true }),
    ObjectField(() => [String], { nullable: true, description: 'filter by Radio Ids', isID: true }),
    __metadata("design:type", Array)
], RadioFilterParameters.prototype, "ids", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by URL', example: 'https://radio.example.com/stream.m3u' }),
    __metadata("design:type", String)
], RadioFilterParameters.prototype, "url", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Homepage URL', example: 'https://radio.example.com' }),
    __metadata("design:type", String)
], RadioFilterParameters.prototype, "homepage", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Creation timestamp', min: 0, example: examples.timestamp }),
    __metadata("design:type", Number)
], RadioFilterParameters.prototype, "since", void 0);
__decorate([
    Field(() => Boolean, { nullable: true }),
    ObjectField({ nullable: true, description: 'filter by Disabled Flag', example: true }),
    __metadata("design:type", Boolean)
], RadioFilterParameters.prototype, "disabled", void 0);
RadioFilterParameters = __decorate([
    InputType(),
    ObjectParametersType()
], RadioFilterParameters);
export { RadioFilterParameters };
let RadioFilterParametersQL = class RadioFilterParametersQL extends RadioFilterParameters {
};
RadioFilterParametersQL = __decorate([
    InputType()
], RadioFilterParametersQL);
export { RadioFilterParametersQL };
let RadioOrderParameters = class RadioOrderParameters extends DefaultOrderParameters {
};
RadioOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], RadioOrderParameters);
export { RadioOrderParameters };
let RadioOrderParametersQL = class RadioOrderParametersQL extends RadioOrderParameters {
};
RadioOrderParametersQL = __decorate([
    InputType()
], RadioOrderParametersQL);
export { RadioOrderParametersQL };
let RadioIndexParameters = class RadioIndexParameters extends FilterParameters(RadioFilterParametersQL) {
};
RadioIndexParameters = __decorate([
    ArgsType()
], RadioIndexParameters);
export { RadioIndexParameters };
let RadiosParameters = class RadiosParameters extends PaginatedFilterParameters(RadioFilterParametersQL, RadioOrderParametersQL) {
};
__decorate([
    Field(() => ListType, { nullable: true }),
    __metadata("design:type", String)
], RadiosParameters.prototype, "list", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], RadiosParameters.prototype, "seed", void 0);
RadiosParameters = __decorate([
    ArgsType()
], RadiosParameters);
export { RadiosParameters };
//# sourceMappingURL=radio.parameters.js.map