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
exports.FilterArgs = exports.PaginatedArgs = exports.PageArgsQL = exports.PageArgs = exports.DefaultOrderArgs = exports.OrderByArgs = exports.ListArgs = void 0;
const enums_1 = require("../../types/enums");
const rest_1 = require("../../modules/rest");
const type_graphql_1 = require("type-graphql");
const class_validator_1 = require("class-validator");
let ListArgs = class ListArgs {
};
__decorate([
    rest_1.ObjField(() => enums_1.ListType, { nullable: true, description: 'filter by special list', example: enums_1.ListType.faved }),
    __metadata("design:type", String)
], ListArgs.prototype, "list", void 0);
ListArgs = __decorate([
    rest_1.ObjParamsType()
], ListArgs);
exports.ListArgs = ListArgs;
let OrderByArgs = class OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => Boolean, { nullable: true }),
    rest_1.ObjField({ nullable: true, description: 'order direction ascending or descending', example: true }),
    __metadata("design:type", Boolean)
], OrderByArgs.prototype, "orderDesc", void 0);
OrderByArgs = __decorate([
    type_graphql_1.InputType(),
    rest_1.ObjParamsType()
], OrderByArgs);
exports.OrderByArgs = OrderByArgs;
let DefaultOrderArgs = class DefaultOrderArgs extends OrderByArgs {
};
__decorate([
    type_graphql_1.Field(() => enums_1.DefaultOrderFields, { nullable: true }),
    rest_1.ObjField(() => enums_1.DefaultOrderFields, { nullable: true, description: 'order by field' }),
    __metadata("design:type", String)
], DefaultOrderArgs.prototype, "orderBy", void 0);
DefaultOrderArgs = __decorate([
    type_graphql_1.InputType(),
    rest_1.ObjParamsType()
], DefaultOrderArgs);
exports.DefaultOrderArgs = DefaultOrderArgs;
let PageArgs = class PageArgs {
    constructor() {
        this.skip = 0;
    }
};
__decorate([
    rest_1.ObjField({ nullable: true, description: 'return items starting from offset position', defaultValue: 0, min: 0, example: 0 }),
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true, description: 'return items starting from offset position' }),
    class_validator_1.Min(0),
    __metadata("design:type", Number)
], PageArgs.prototype, "skip", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true, description: 'amount of returned items' }),
    class_validator_1.Min(0),
    class_validator_1.Max(100),
    rest_1.ObjField({ nullable: true, description: 'amount of returned items', min: 1, example: 25 }),
    __metadata("design:type", Number)
], PageArgs.prototype, "take", void 0);
PageArgs = __decorate([
    type_graphql_1.InputType(),
    rest_1.ObjParamsType()
], PageArgs);
exports.PageArgs = PageArgs;
let PageArgsQL = class PageArgsQL extends PageArgs {
};
PageArgsQL = __decorate([
    type_graphql_1.InputType()
], PageArgsQL);
exports.PageArgsQL = PageArgsQL;
function PaginatedArgs(TFilterClass, TOrderClass) {
    let PaginatedArgsClass = class PaginatedArgsClass {
    };
    __decorate([
        type_graphql_1.Field(() => PageArgsQL, { nullable: true }),
        __metadata("design:type", PageArgs)
    ], PaginatedArgsClass.prototype, "page", void 0);
    __decorate([
        type_graphql_1.Field(() => TFilterClass, { nullable: true }),
        __metadata("design:type", Object)
    ], PaginatedArgsClass.prototype, "filter", void 0);
    __decorate([
        type_graphql_1.Field(() => [TOrderClass], { nullable: true }),
        __metadata("design:type", Array)
    ], PaginatedArgsClass.prototype, "order", void 0);
    PaginatedArgsClass = __decorate([
        type_graphql_1.ArgsType()
    ], PaginatedArgsClass);
    return PaginatedArgsClass;
}
exports.PaginatedArgs = PaginatedArgs;
function FilterArgs(TFilterClass) {
    let FilterArgsClass = class FilterArgsClass {
    };
    __decorate([
        type_graphql_1.Field(() => TFilterClass, { nullable: true }),
        __metadata("design:type", Object)
    ], FilterArgsClass.prototype, "filter", void 0);
    FilterArgsClass = __decorate([
        type_graphql_1.ArgsType()
    ], FilterArgsClass);
    return FilterArgsClass;
}
exports.FilterArgs = FilterArgs;
//# sourceMappingURL=base.args.js.map