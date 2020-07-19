"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const user_1 = require("./user");
const base_1 = require("../base/base");
let UserRepository = class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.user;
        this.indexProperty = 'name';
    }
    applyOrderByEntry(result, direction, order) {
        this.applyDefaultOrderByEntry(result, direction, order === null || order === void 0 ? void 0 : order.orderBy);
    }
    async buildFilter(filter, user) {
        var _a, _b, _c, _d;
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: base_1.QHelper.like(filter.query) },
            { name: base_1.QHelper.eq(filter.name) },
            { email: base_1.QHelper.eq(filter.email) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { roleAdmin: base_1.QHelper.eq(((_a = filter.roles) === null || _a === void 0 ? void 0 : _a.includes(enums_1.UserRole.admin)) ? true : undefined) },
            { rolePodcast: base_1.QHelper.eq(((_b = filter.roles) === null || _b === void 0 ? void 0 : _b.includes(enums_1.UserRole.podcast)) ? true : undefined) },
            { roleStream: base_1.QHelper.eq(((_c = filter.roles) === null || _c === void 0 ? void 0 : _c.includes(enums_1.UserRole.stream)) ? true : undefined) },
            { roleUpload: base_1.QHelper.eq(((_d = filter.roles) === null || _d === void 0 ? void 0 : _d.includes(enums_1.UserRole.upload)) ? true : undefined) },
            { user: (user === null || user === void 0 ? void 0 : user.roleAdmin) ? undefined : user === null || user === void 0 ? void 0 : user.id }
        ]) : {};
    }
};
UserRepository = __decorate([
    mikro_orm_1.Repository(user_1.User)
], UserRepository);
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map