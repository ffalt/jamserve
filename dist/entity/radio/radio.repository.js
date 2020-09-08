"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RadioRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const orm_1 = require("../../modules/orm");
class RadioRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.radio;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        return this.buildDefaultOrder(order);
    }
    async buildFilter(filter, _) {
        return filter ? orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: orm_1.QHelper.like(filter.query, this.em.dialect) },
            { name: orm_1.QHelper.eq(filter.name) },
            { url: orm_1.QHelper.eq(filter.url) },
            { homepage: orm_1.QHelper.eq(filter.homepage) },
            { disabled: orm_1.QHelper.eq(filter.disabled) },
            { createdAt: orm_1.QHelper.gte(filter.since) }
        ]) : {};
    }
}
exports.RadioRepository = RadioRepository;
//# sourceMappingURL=radio.repository.js.map