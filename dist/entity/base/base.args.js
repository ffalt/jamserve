var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { DefaultOrderFields, ListType } from '../../types/enums';
import { ObjField, ObjParamsType } from '../../modules/rest';
import { ArgsType, Field, InputType, Int } from 'type-graphql';
import { Max, Min } from 'class-validator';
let ListArgs = class ListArgs {
};
__decorate([
    ObjField(() => ListType, { nullable: true, description: 'filter by special list', example: ListType.faved }),
    __metadata("design:type", String)
], ListArgs.prototype, "list", void 0);
__decorate([
    ObjField(() => String, { nullable: true, description: 'seed for random list', example: 'jksfb23jhsdf' }),
    __metadata("design:type", String)
], ListArgs.prototype, "seed", void 0);
ListArgs = __decorate([
    ObjParamsType()
], ListArgs);
export { ListArgs };
let OrderByArgs = class OrderByArgs {
};
__decorate([
    Field(() => Boolean, { nullable: true }),
    ObjField({ nullable: true, description: 'order direction ascending or descending', example: true }),
    __metadata("design:type", Boolean)
], OrderByArgs.prototype, "orderDesc", void 0);
OrderByArgs = __decorate([
    InputType(),
    ObjParamsType()
], OrderByArgs);
export { OrderByArgs };
let DefaultOrderArgs = class DefaultOrderArgs extends OrderByArgs {
};
__decorate([
    Field(() => DefaultOrderFields, { nullable: true }),
    ObjField(() => DefaultOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], DefaultOrderArgs.prototype, "orderBy", void 0);
DefaultOrderArgs = __decorate([
    InputType(),
    ObjParamsType()
], DefaultOrderArgs);
export { DefaultOrderArgs };
let PageArgs = class PageArgs {
    constructor() {
        this.skip = 0;
    }
};
__decorate([
    ObjField({ nullable: true, description: 'return items starting from offset position', defaultValue: 0, min: 0, example: 0 }),
    Field(() => Int, { nullable: true, description: 'return items starting from offset position' }),
    Min(0),
    __metadata("design:type", Number)
], PageArgs.prototype, "skip", void 0);
__decorate([
    Field(() => Int, { nullable: true, description: 'amount of returned items' }),
    Min(0),
    Max(100),
    ObjField({ nullable: true, description: 'amount of returned items', min: 1, example: 25 }),
    __metadata("design:type", Number)
], PageArgs.prototype, "take", void 0);
PageArgs = __decorate([
    InputType(),
    ObjParamsType(),
    ArgsType()
], PageArgs);
export { PageArgs };
let PageArgsQL = class PageArgsQL extends PageArgs {
};
PageArgsQL = __decorate([
    ArgsType(),
    InputType()
], PageArgsQL);
export { PageArgsQL };
export function PaginatedFilterArgs(TFilterClass, TOrderClass) {
    let PaginatedArgsClass = class PaginatedArgsClass {
    };
    __decorate([
        Field(() => PageArgsQL, { nullable: true }),
        __metadata("design:type", PageArgs)
    ], PaginatedArgsClass.prototype, "page", void 0);
    __decorate([
        Field(() => TFilterClass, { nullable: true }),
        __metadata("design:type", Object)
    ], PaginatedArgsClass.prototype, "filter", void 0);
    __decorate([
        Field(() => [TOrderClass], { nullable: true }),
        __metadata("design:type", Array)
    ], PaginatedArgsClass.prototype, "order", void 0);
    PaginatedArgsClass = __decorate([
        ArgsType()
    ], PaginatedArgsClass);
    return PaginatedArgsClass;
}
export function FilterArgs(TFilterClass) {
    let FilterArgsClass = class FilterArgsClass {
    };
    __decorate([
        Field(() => TFilterClass, { nullable: true }),
        __metadata("design:type", Object)
    ], FilterArgsClass.prototype, "filter", void 0);
    FilterArgsClass = __decorate([
        ArgsType()
    ], FilterArgsClass);
    return FilterArgsClass;
}
//# sourceMappingURL=base.args.js.map