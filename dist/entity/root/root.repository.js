import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { QHelper } from '../../modules/orm/index.js';
export class RootRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.root;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        return this.buildDefaultOrder(order);
    }
    async buildFilter(filter, _) {
        if (!filter) {
            return {};
        }
        const result = QHelper.buildQuery([
            { id: filter.ids },
            { name: QHelper.like(filter.query, this.em.dialect) },
            { name: QHelper.eq(filter.name) },
            { createdAt: QHelper.gte(filter.since) },
            { strategy: QHelper.inOrEqual(filter.strategies) }
        ]);
        result.include = QHelper.includeQueries([
            { tracks: [{ id: QHelper.inOrEqual(filter.trackIDs) }] },
            { folders: [{ id: QHelper.inOrEqual(filter.folderIDs) }] },
            { albums: [{ id: QHelper.inOrEqual(filter.albumIDs) }] },
            { artists: [{ id: QHelper.inOrEqual(filter.artistIDs) }] },
            { series: [{ id: QHelper.inOrEqual(filter.seriesIDs) }] }
        ]);
        return result;
    }
}
//# sourceMappingURL=root.repository.js.map