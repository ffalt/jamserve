var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Field, ID, Int, ObjectType } from 'type-graphql';
import { Entity, PrimaryKey } from '../../modules/orm';
let Base = class Base {
};
__decorate([
    Field(() => ID),
    PrimaryKey(),
    __metadata("design:type", String)
], Base.prototype, "id", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], Base.prototype, "createdAt", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], Base.prototype, "updatedAt", void 0);
Base = __decorate([
    ObjectType(),
    Entity({ isAbstract: true })
], Base);
export { Base };
export function IndexGroup(EntityClass, EntityQLClass) {
    let IndexResultResponseClass = class IndexResultResponseClass {
    };
    __decorate([
        Field(() => [EntityQLClass]),
        __metadata("design:type", Array)
    ], IndexResultResponseClass.prototype, "items", void 0);
    __decorate([
        Field(() => String),
        __metadata("design:type", String)
    ], IndexResultResponseClass.prototype, "name", void 0);
    IndexResultResponseClass = __decorate([
        ObjectType({ isAbstract: true })
    ], IndexResultResponseClass);
    return IndexResultResponseClass;
}
export function Index(EntityQLClass) {
    let IndexResponseClass = class IndexResponseClass {
    };
    __decorate([
        Field(() => [EntityQLClass]),
        __metadata("design:type", Array)
    ], IndexResponseClass.prototype, "groups", void 0);
    IndexResponseClass = __decorate([
        ObjectType({ isAbstract: true })
    ], IndexResponseClass);
    return IndexResponseClass;
}
export function PaginatedResponse(EntityClass, EntityQLClass) {
    let PaginatedResponseClass = class PaginatedResponseClass {
    };
    __decorate([
        Field(() => [EntityQLClass]),
        __metadata("design:type", Array)
    ], PaginatedResponseClass.prototype, "items", void 0);
    __decorate([
        Field(() => Int),
        __metadata("design:type", Number)
    ], PaginatedResponseClass.prototype, "total", void 0);
    __decorate([
        Field(() => Int, { nullable: true }),
        __metadata("design:type", Number)
    ], PaginatedResponseClass.prototype, "take", void 0);
    __decorate([
        Field(() => Int, { nullable: true }),
        __metadata("design:type", Number)
    ], PaginatedResponseClass.prototype, "skip", void 0);
    PaginatedResponseClass = __decorate([
        ObjectType({ isAbstract: true })
    ], PaginatedResponseClass);
    return PaginatedResponseClass;
}
export class OrderHelper {
    static direction(args) {
        return args?.orderDesc ? 'DESC' : 'ASC';
    }
    static inverse(order) {
        return order === 'ASC' ? 'DESC' : 'ASC';
    }
}
//# sourceMappingURL=base.js.map