import { BaseRepository } from '../base/base.repository';
import { DBObjectType, PodcastOrderFields } from '../../types/enums';
import { OrderHelper } from '../base/base';
import { QHelper } from '../../modules/orm';
export class PodcastRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.podcast;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        const direction = OrderHelper.direction(order);
        switch (order?.orderBy) {
            case PodcastOrderFields.created:
                return [['createdAt', direction]];
            case PodcastOrderFields.updated:
                return [['updatedAt', direction]];
            case PodcastOrderFields.lastCheck:
                return [['lastCheck', direction]];
            case PodcastOrderFields.default:
            case PodcastOrderFields.name:
                return [['name', direction]];
        }
        return [];
    }
    async buildFilter(filter, _) {
        if (!filter) {
            return {};
        }
        const result = QHelper.buildQuery([
            { id: filter.ids },
            { name: QHelper.like(filter.query, this.em.dialect) },
            { name: QHelper.eq(filter.name) },
            { description: QHelper.eq(filter.description) },
            { url: QHelper.eq(filter.url) },
            { author: QHelper.eq(filter.author) },
            { title: QHelper.eq(filter.title) },
            { generator: QHelper.eq(filter.generator) },
            { status: QHelper.inOrEqual(filter.statuses) },
            { createdAt: QHelper.gte(filter.since) },
            { lastCheck: QHelper.lte(filter.lastCheckTo) },
            { lastCheck: QHelper.gte(filter.lastCheckFrom) },
            ...QHelper.inStringArray('categories', filter.categories)
        ]);
        result.include = QHelper.includeQueries([
            { episodes: [{ id: QHelper.inOrEqual(filter.episodeIDs) }] }
        ]);
        return result;
    }
}
//# sourceMappingURL=podcast.repository.js.map