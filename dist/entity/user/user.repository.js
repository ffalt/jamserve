"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const orm_1 = require("../../modules/orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
class UserRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.user;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        return this.buildDefaultOrder(order);
    }
    async buildFilter(filter, user) {
        var _a, _b, _c, _d;
        return filter ? orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: orm_1.QHelper.like(filter.query, this.em.dialect) },
            { name: orm_1.QHelper.eq(filter.name) },
            { email: orm_1.QHelper.eq(filter.email) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { roleAdmin: orm_1.QHelper.eq(((_a = filter.roles) === null || _a === void 0 ? void 0 : _a.includes(enums_1.UserRole.admin)) ? true : undefined) },
            { rolePodcast: orm_1.QHelper.eq(((_b = filter.roles) === null || _b === void 0 ? void 0 : _b.includes(enums_1.UserRole.podcast)) ? true : undefined) },
            { roleStream: orm_1.QHelper.eq(((_c = filter.roles) === null || _c === void 0 ? void 0 : _c.includes(enums_1.UserRole.stream)) ? true : undefined) },
            { roleUpload: orm_1.QHelper.eq(((_d = filter.roles) === null || _d === void 0 ? void 0 : _d.includes(enums_1.UserRole.upload)) ? true : undefined) },
            { id: (user === null || user === void 0 ? void 0 : user.roleAdmin) ? undefined : user === null || user === void 0 ? void 0 : user.id }
        ]) : {};
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map