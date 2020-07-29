"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PodcastRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
class PodcastRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.podcast;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.PodcastOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.PodcastOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.PodcastOrderFields.lastCheck:
                return [['lastCheck', direction]];
            case enums_1.PodcastOrderFields.default:
            case enums_1.PodcastOrderFields.name:
                return [['name', direction]];
        }
        return [];
    }
    async buildFilter(filter, user) {
        if (!filter) {
            return {};
        }
        const result = orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: orm_1.QHelper.like(filter.query) },
            { name: orm_1.QHelper.eq(filter.name) },
            { description: orm_1.QHelper.eq(filter.description) },
            { url: orm_1.QHelper.eq(filter.url) },
            { author: orm_1.QHelper.eq(filter.author) },
            { title: orm_1.QHelper.eq(filter.title) },
            { generator: orm_1.QHelper.eq(filter.generator) },
            { status: orm_1.QHelper.inOrEqual(filter.statuses) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { lastCheck: orm_1.QHelper.lte(filter.lastCheckTo) },
            { lastCheck: orm_1.QHelper.gte(filter.lastCheckFrom) },
            ...orm_1.QHelper.inStringArray('categories', filter.categories)
        ]);
        result.include = orm_1.QHelper.includeQueries([
            { episodes: [{ id: orm_1.QHelper.inOrEqual(filter.episodeIDs) }] }
        ]);
        return result;
    }
}
exports.PodcastRepository = PodcastRepository;
//# sourceMappingURL=podcast.repository.js.map