"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SessionRepository = void 0;
const orm_1 = require("../../modules/orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
class SessionRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.session;
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.SessionOrderFields.expires:
            case enums_1.SessionOrderFields.default:
                return [['expires', direction]];
        }
        return [];
    }
    async buildFilter(filter, user) {
        return filter ? orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { client: orm_1.QHelper.eq(filter.client) },
            { agent: orm_1.QHelper.eq(filter.agent) },
            { mode: orm_1.QHelper.eq(filter.mode) },
            { expires: orm_1.QHelper.lte(filter.expiresTo) },
            { expires: orm_1.QHelper.gte(filter.expiresFrom) },
            { user: orm_1.QHelper.inOrEqual(filter.userIDs) },
            { user: user === null || user === void 0 ? void 0 : user.id }
        ]) : {};
    }
    async byUserID(userID) {
        return await this.find({ where: { user: userID } });
    }
}
exports.SessionRepository = SessionRepository;
//# sourceMappingURL=session.repository.js.map