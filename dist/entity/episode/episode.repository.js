"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EpisodeRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
class EpisodeRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.episode;
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order?.orderBy) {
            case enums_1.EpisodeOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.EpisodeOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.EpisodeOrderFields.status:
                return [['status', direction]];
            case enums_1.EpisodeOrderFields.name:
                return [['name', direction]];
            case enums_1.EpisodeOrderFields.default:
            case enums_1.EpisodeOrderFields.date:
                return [['date', direction]];
        }
        return [];
    }
    async buildFilter(filter, _) {
        return filter ? orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: orm_1.QHelper.like(filter.query, this.em.dialect) },
            { name: orm_1.QHelper.eq(filter.name) },
            { status: orm_1.QHelper.inOrEqual(filter.statuses) },
            { guid: orm_1.QHelper.inOrEqual(filter.guids) },
            { author: orm_1.QHelper.inOrEqual(filter.authors) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { podcast: orm_1.QHelper.inOrEqual(filter.podcastIDs) }
        ]) : {};
    }
}
exports.EpisodeRepository = EpisodeRepository;
//# sourceMappingURL=episode.repository.js.map