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
exports.QHelper = exports.PaginatedResponse = exports.Index = exports.IndexGroup = exports.Base = void 0;
const type_graphql_1 = require("type-graphql");
const uuid_1 = require("uuid");
const mikro_orm_1 = require("mikro-orm");
let Base = class Base {
    constructor() {
        this.id = uuid_1.v4();
        this.createdAt = new Date();
        this.updatedAt = new Date();
    }
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.ID),
    mikro_orm_1.PrimaryKey(),
    __metadata("design:type", String)
], Base.prototype, "id", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    mikro_orm_1.Property(),
    __metadata("design:type", Date)
], Base.prototype, "createdAt", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    mikro_orm_1.Property({ onUpdate: () => new Date() }),
    __metadata("design:type", Date)
], Base.prototype, "updatedAt", void 0);
Base = __decorate([
    type_graphql_1.ObjectType()
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
class QHelper {
    static eq(value) {
        return (value !== undefined) ? { $eq: value } : undefined;
    }
    static like(value) {
        return (value) ? { $like: `%${value}%` } : undefined;
    }
    static gte(value) {
        return (value !== undefined) ? { $gte: value } : undefined;
    }
    static lte(value) {
        return (value !== undefined) ? { $lte: value } : undefined;
    }
    static inStringArray(propertyName, list) {
        if (!list || list.length === 0) {
            return [];
        }
        const expressions = list.map(entry => {
            const o = {};
            o[propertyName] = { $like: `%|${entry.replace(/%/g, '')}|%` };
            return o;
        });
        if (expressions.length === 1) {
            return expressions;
        }
        return [{ $or: expressions }];
    }
    static packageForeignQuery(field, query) {
        if (!query) {
            return;
        }
        const o = {};
        o[field] = query;
        return o;
    }
    static foreignGTE(field, value) {
        return QHelper.packageForeignQuery(field, QHelper.gte(value));
    }
    static foreignLTE(field, value) {
        return QHelper.packageForeignQuery(field, QHelper.lte(value));
    }
    static foreignEQ(field, value) {
        return QHelper.packageForeignQuery(field, QHelper.eq(value));
    }
    static foreignLike(field, value) {
        return QHelper.packageForeignQuery(field, QHelper.like(value));
    }
    static foreignStringArray(property, field, list) {
        if (!list || list.length === 0) {
            return [];
        }
        const result = QHelper.inStringArray(field, list).map(r => QHelper.packageForeignQuery(property, r));
        return result.filter(r => !!r);
    }
    static inOrEqual(list) {
        if (!list || list.length === 0) {
            return;
        }
        return list.length > 1 ? { $in: list } : { $eq: list[0] };
    }
    static foreignKeys(list) {
        if (!list || list.length === 0) {
            return;
        }
        return { id: QHelper.inOrEqual(list) };
    }
    static foreignKey(list) {
        if (!list || list.length === 0) {
            return;
        }
        return { id: QHelper.inOrEqual(list) };
    }
    static foreignValue(field, list) {
        if (!list || list.length === 0) {
            return;
        }
        const o = {};
        o[field] = QHelper.inOrEqual(list);
        return o;
    }
    static buildBool(list) {
        const result = list.filter(q => q[Object.keys(q)[0]]);
        return result.length > 0 ? result : undefined;
    }
    static buildQuery(list) {
        if (!list || list.length === 0) {
            return {};
        }
        const result = list.filter(q => q[Object.keys(q)[0]]);
        return result.length > 0 ? { $and: result } : {};
    }
}
exports.QHelper = QHelper;
//# sourceMappingURL=base.js.map