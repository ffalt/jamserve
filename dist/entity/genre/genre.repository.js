"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GenreRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
class GenreRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.genre;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.GenreOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.GenreOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.GenreOrderFields.name:
            case enums_1.GenreOrderFields.default:
                return [['name', direction]];
        }
        return [];
    }
    async buildFilter(filter, _) {
        if (!filter) {
            return {};
        }
        const result = orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: orm_1.QHelper.like(filter.query, this.em.dialect) },
            { name: orm_1.QHelper.eq(filter.name) }
        ]);
        result.include = orm_1.QHelper.includeQueries([
            { tracks: [{ id: orm_1.QHelper.inOrEqual(filter.trackIDs) }] },
        ]);
        return result;
    }
}
exports.GenreRepository = GenreRepository;
//# sourceMappingURL=genre.repository.js.map