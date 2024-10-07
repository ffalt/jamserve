import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { QHelper } from '../../modules/orm/index.js';
export class PlaylistRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.playlist;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        return this.buildDefaultOrder(order);
    }
    async buildFilter(filter, user) {
        return filter ?
            QHelper.buildQuery([
                { id: filter.ids },
                { name: QHelper.like(filter.query, this.em.dialect) },
                { name: QHelper.eq(filter.name) },
                { comment: QHelper.eq(filter.comment) },
                { createdAt: QHelper.gte(filter.since) },
                { user: QHelper.inOrEqual(filter.userIDs) },
                QHelper.or([
                    { isPublic: true },
                    { user: user?.id }
                ])
            ]) :
            {};
    }
}
//# sourceMappingURL=playlist.repository.js.map