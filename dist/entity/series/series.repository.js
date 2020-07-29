"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeriesRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const orm_1 = require("../../modules/orm");
class SeriesRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.series;
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
            { artist: orm_1.QHelper.inOrEqual(filter.artistIDs) },
            ...orm_1.QHelper.inStringArray('albumTypes', filter.albumTypes)
        ]);
        result.include = orm_1.QHelper.includeQueries([
            { tracks: [{ id: orm_1.QHelper.inOrEqual(filter.trackIDs) }] },
            { albums: [{ id: orm_1.QHelper.inOrEqual(filter.albumIDs) }] },
            { folders: [{ id: orm_1.QHelper.inOrEqual(filter.folderIDs) }] },
            { roots: [{ id: orm_1.QHelper.inOrEqual(filter.rootIDs) }] },
        ]);
        return result;
    }
}
exports.SeriesRepository = SeriesRepository;
//# sourceMappingURL=series.repository.js.map