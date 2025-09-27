var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DefaultOrderFields, ListType } from '../../types/enums.js';
import { ArgsType, Field, InputType, Int } from 'type-graphql';
import { Max, Min } from 'class-validator';
import { ObjectParametersType } from '../../modules/rest/decorators/object-parameters-type.js';
import { ObjectField } from '../../modules/rest/decorators/object-field.js';
let ListParameters = class ListParameters {
};
__decorate([
    ObjectField(() => ListType, { nullable: true, description: 'filter by special list', example: ListType.faved }),
    __metadata("design:type", String)
], ListParameters.prototype, "list", void 0);
__decorate([
    ObjectField({ nullable: true, description: 'seed for random list', example: 'jksfb23jhsdf' }),
    __metadata("design:type", String)
], ListParameters.prototype, "seed", void 0);
ListParameters = __decorate([
    ObjectParametersType()
], ListParameters);
export { ListParameters };
let OrderByParameters = class OrderByParameters {
};
__decorate([
    Field(() => Boolean, { nullable: true }),
    ObjectField({ nullable: true, description: 'order direction ascending or descending', example: true }),
    __metadata("design:type", Boolean)
], OrderByParameters.prototype, "orderDesc", void 0);
OrderByParameters = __decorate([
    InputType(),
    ObjectParametersType()
], OrderByParameters);
export { OrderByParameters };
let DefaultOrderParameters = class DefaultOrderParameters extends OrderByParameters {
};
__decorate([
    Field(() => DefaultOrderFields, { nullable: true }),
    ObjectField(() => DefaultOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], DefaultOrderParameters.prototype, "orderBy", void 0);
DefaultOrderParameters = __decorate([
    InputType(),
    ObjectParametersType()
], DefaultOrderParameters);
export { DefaultOrderParameters };
let PageParameters = class PageParameters {
    constructor() {
        this.skip = 0;
    }
};
__decorate([
    ObjectField({ nullable: true, description: 'return items starting from offset position', defaultValue: 0, min: 0, example: 0 }),
    Field(() => Int, { nullable: true, description: 'return items starting from offset position' }),
    Min(0),
    __metadata("design:type", Number)
], PageParameters.prototype, "skip", void 0);
__decorate([
    Field(() => Int, { nullable: true, description: 'amount of returned items' }),
    Min(0),
    Max(100),
    ObjectField({ nullable: true, description: 'amount of returned items', min: 1, example: 25 }),
    __metadata("design:type", Number)
], PageParameters.prototype, "take", void 0);
PageParameters = __decorate([
    InputType(),
    ObjectParametersType(),
    ArgsType()
], PageParameters);
export { PageParameters };
let PageParametersQL = class PageParametersQL extends PageParameters {
};
PageParametersQL = __decorate([
    ArgsType(),
    InputType()
], PageParametersQL);
export { PageParametersQL };
export function PaginatedFilterParameters(TFilterClass, TOrderClass) {
    let PaginatedParametersClass = class PaginatedParametersClass {
    };
    __decorate([
        Field(() => PageParametersQL, { nullable: true }),
        __metadata("design:type", PageParameters)
    ], PaginatedParametersClass.prototype, "page", void 0);
    __decorate([
        Field(() => TFilterClass, { nullable: true }),
        __metadata("design:type", Object)
    ], PaginatedParametersClass.prototype, "filter", void 0);
    __decorate([
        Field(() => [TOrderClass], { nullable: true }),
        __metadata("design:type", Array)
    ], PaginatedParametersClass.prototype, "order", void 0);
    PaginatedParametersClass = __decorate([
        ArgsType()
    ], PaginatedParametersClass);
    return PaginatedParametersClass;
}
export function FilterParameters(TFilterClass) {
    let FilterParametersClass = class FilterParametersClass {
    };
    __decorate([
        Field(() => TFilterClass, { nullable: true }),
        __metadata("design:type", Object)
    ], FilterParametersClass.prototype, "filter", void 0);
    FilterParametersClass = __decorate([
        ArgsType()
    ], FilterParametersClass);
    return FilterParametersClass;
}
//# sourceMappingURL=base.parameters.js.map