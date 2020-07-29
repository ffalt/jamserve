"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RootRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const orm_1 = require("../../modules/orm");
class RootRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.root;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        return this.buildDefaultOrder(order);
    }
    async buildFilter(filter, user) {
        if (!filter) {
            return {};
        }
        const result = orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: orm_1.QHelper.like(filter.query) },
            { name: orm_1.QHelper.eq(filter.name) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { strategy: orm_1.QHelper.inOrEqual(filter.strategies) },
        ]);
        result.include = orm_1.QHelper.includeQueries([
            { tracks: [{ id: orm_1.QHelper.inOrEqual(filter.trackIDs) }] },
            { folders: [{ id: orm_1.QHelper.inOrEqual(filter.folderIDs) }] },
            { albums: [{ id: orm_1.QHelper.inOrEqual(filter.albumIDs) }] },
            { artists: [{ id: orm_1.QHelper.inOrEqual(filter.artistIDs) }] },
            { series: [{ id: orm_1.QHelper.inOrEqual(filter.seriesIDs) }] }
        ]);
        return result;
    }
}
exports.RootRepository = RootRepository;
//# sourceMappingURL=root.repository.js.map