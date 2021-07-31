import { BaseRepository } from '../base/base.repository';
import { DBObjectType } from '../../types/enums';
export class MetaDataRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.metadata;
    }
    buildOrder(_) {
        return [];
    }
    async buildFilter(_, __) {
        return {};
    }
}
//# sourceMappingURL=metadata.repository.js.map