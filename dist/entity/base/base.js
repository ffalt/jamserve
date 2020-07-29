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
exports.OrderHelper = exports.PaginatedResponse = exports.Index = exports.IndexGroup = exports.Base = void 0;
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
const orm_1 = require("../../modules/orm");
let Base = class Base {
    constructor() {
        this.id = uuid_1.v4();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    orm_1.PrimaryKey(),
    __metadata("design:type", String)
], Base.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    __metadata("design:type", Date)
], Base.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    __metadata("design:type", Date)
], Base.prototype, "updatedAt", void 0);
Base = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity({ isAbstract: true })
], Base);
exports.Base = Base;
function IndexGroup(EntityClass, EntityQLClass) {
    let IndexResultResponseClass = class IndexResultResponseClass {
    };
    __decorate([
        type_graphql_1.Field(() => [EntityQLClass]),
        __metadata("design:type", Array)
    ], IndexResultResponseClass.prototype, "items", void 0);
    __decorate([
        type_graphql_1.Field(() => String),
        __metadata("design:type", String)
    ], IndexResultResponseClass.prototype, "name", void 0);
    IndexResultResponseClass = __decorate([
        type_graphql_1.ObjectType({ isAbstract: true })
    ], IndexResultResponseClass);
    return IndexResultResponseClass;
}
exports.IndexGroup = IndexGroup;
function Index(EntityQLClass) {
    let IndexResponseClass = class IndexResponseClass {
    };
    __decorate([
        type_graphql_1.Field(() => [EntityQLClass]),
        __metadata("design:type", Array)
    ], IndexResponseClass.prototype, "groups", void 0);
    IndexResponseClass = __decorate([
        type_graphql_1.ObjectType({ isAbstract: true })
    ], IndexResponseClass);
    return IndexResponseClass;
}
exports.Index = Index;
function PaginatedResponse(EntityClass, EntityQLClass) {
    let PaginatedResponseClass = class PaginatedResponseClass {
    };
    __decorate([
        type_graphql_1.Field(() => [EntityQLClass]),
        __metadata("design:type", Array)
    ], PaginatedResponseClass.prototype, "items", void 0);
    __decorate([
        type_graphql_1.Field(() => type_graphql_1.Int),
        __metadata("design:type", Number)
    ], PaginatedResponseClass.prototype, "total", void 0);
    __decorate([
        type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
        __metadata("design:type", Number)
    ], PaginatedResponseClass.prototype, "take", void 0);
    __decorate([
        type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
        __metadata("design:type", Number)
    ], PaginatedResponseClass.prototype, "skip", void 0);
    PaginatedResponseClass = __decorate([
        type_graphql_1.ObjectType({ isAbstract: true })
    ], PaginatedResponseClass);
    return PaginatedResponseClass;
}
exports.PaginatedResponse = PaginatedResponse;
class OrderHelper {
    static direction(args) {
        return (args === null || args === void 0 ? void 0 : args.orderDesc) ? 'DESC' : 'ASC';
    }
}
exports.OrderHelper = OrderHelper;
//# sourceMappingURL=base.js.map