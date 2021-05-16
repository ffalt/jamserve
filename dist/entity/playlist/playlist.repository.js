"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const orm_1 = require("../../modules/orm");
class PlaylistRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.playlist;
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
            { comment: orm_1.QHelper.eq(filter.comment) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { user: orm_1.QHelper.inOrEqual(filter.userIDs) },
            orm_1.QHelper.or([
                { isPublic: true },
                { user: user?.id }
            ])
        ]) : {};
    }
}
exports.PlaylistRepository = PlaylistRepository;
//# sourceMappingURL=playlist.repository.js.map