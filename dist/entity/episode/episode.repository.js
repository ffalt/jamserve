import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, EpisodeOrderFields } from '../../types/enums.js';
import { OrderHelper } from '../base/base.js';
import { QHelper } from '../../modules/orm/index.js';
export class EpisodeRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.episode;
    }
    buildOrder(order) {
        const direction = OrderHelper.direction(order);
        switch (order?.orderBy) {
            case EpisodeOrderFields.created:
                return [['createdAt', direction]];
            case EpisodeOrderFields.updated:
                return [['updatedAt', direction]];
            case EpisodeOrderFields.status:
                return [['status', direction]];
            case EpisodeOrderFields.name:
                return [['name', direction]];
            case EpisodeOrderFields.default:
            case EpisodeOrderFields.date:
                return [['date', direction]];
        }
        return [];
    }
    async buildFilter(filter, _) {
        return filter ?
            QHelper.buildQuery([
                { id: filter.ids },
                { name: QHelper.like(filter.query, this.em.dialect) },
                { name: QHelper.eq(filter.name) },
                { status: QHelper.inOrEqual(filter.statuses) },
                { guid: QHelper.inOrEqual(filter.guids) },
                { author: QHelper.inOrEqual(filter.authors) },
                { createdAt: QHelper.gte(filter.since) },
                { podcast: QHelper.inOrEqual(filter.podcastIDs) }
            ]) :
            {};
    }
}
//# sourceMappingURL=episode.repository.js.map