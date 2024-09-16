import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
export class PlayQueueRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.playqueue;
    }
    buildOrder(_) {
        return [];
    }
    async buildFilter(_, __) {
        return {};
    }
}
//# sourceMappingURL=playqueue.repository.js.map