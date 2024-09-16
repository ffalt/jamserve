import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { QHelper } from '../../modules/orm/index.js';
export class RadioRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.radio;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        return this.buildDefaultOrder(order);
    }
    async buildFilter(filter, _) {
        return filter ? QHelper.buildQuery([
            { id: filter.ids },
            { name: QHelper.like(filter.query, this.em.dialect) },
            { name: QHelper.eq(filter.name) },
            { url: QHelper.eq(filter.url) },
            { homepage: QHelper.eq(filter.homepage) },
            { disabled: QHelper.eq(filter.disabled) },
            { createdAt: QHelper.gte(filter.since) }
        ]) : {};
    }
}
//# sourceMappingURL=radio.repository.js.map