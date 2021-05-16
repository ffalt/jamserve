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
        return filter ? orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: orm_1.QHelper.like(filter.query, this.em.dialect) },
            { name: orm_1.QHelper.eq(filter.name) },
            { email: orm_1.QHelper.eq(filter.email) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { roleAdmin: orm_1.QHelper.eq(filter.roles?.includes(enums_1.UserRole.admin) ? true : undefined) },
            { rolePodcast: orm_1.QHelper.eq(filter.roles?.includes(enums_1.UserRole.podcast) ? true : undefined) },
            { roleStream: orm_1.QHelper.eq(filter.roles?.includes(enums_1.UserRole.stream) ? true : undefined) },
            { roleUpload: orm_1.QHelper.eq(filter.roles?.includes(enums_1.UserRole.upload) ? true : undefined) },
            { id: user?.roleAdmin ? undefined : user?.id }
        ]) : {};
    }
}
exports.UserRepository = UserRepository;
//# sourceMappingURL=user.repository.js.map