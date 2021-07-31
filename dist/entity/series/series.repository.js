import { BaseRepository } from '../base/base.repository';
import { DBObjectType } from '../../types/enums';
import { QHelper } from '../../modules/orm';
export class SeriesRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.series;
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
            { artist: QHelper.inOrEqual(filter.artistIDs) },
            ...QHelper.inStringArray('albumTypes', filter.albumTypes)
        ]);
        result.include = QHelper.includeQueries([
            { tracks: [{ id: QHelper.inOrEqual(filter.trackIDs) }] },
            { albums: [{ id: QHelper.inOrEqual(filter.albumIDs) }] },
            { folders: [{ id: QHelper.inOrEqual(filter.folderIDs) }] },
            { roots: [{ id: QHelper.inOrEqual(filter.rootIDs) }] },
        ]);
        return result;
    }
}
//# sourceMappingURL=series.repository.js.map