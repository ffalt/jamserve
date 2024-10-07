import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, GenreOrderFields } from '../../types/enums.js';
import { OrderHelper } from '../base/base.js';
import { QHelper } from '../../modules/orm/index.js';
export class GenreRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.genre;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        const direction = OrderHelper.direction(order);
        switch (order?.orderBy) {
            case GenreOrderFields.created:
                return [['createdAt', direction]];
            case GenreOrderFields.updated:
                return [['updatedAt', direction]];
            case GenreOrderFields.name:
            case GenreOrderFields.default:
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
            { name: QHelper.eq(filter.name) }
        ]);
        result.include = QHelper.includeQueries([
            { tracks: [{ id: QHelper.inOrEqual(filter.trackIDs) }] }
        ]);
        return result;
    }
}
//# sourceMappingURL=genre.repository.js.map