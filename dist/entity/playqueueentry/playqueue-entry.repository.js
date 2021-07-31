import { BaseRepository } from '../base/base.repository';
import { DBObjectType, PlayQueueEntryOrderFields } from '../../types/enums';
import { OrderHelper } from '../base/base';
export class PlayQueueEntryRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.playqueueentry;
    }
    buildOrder(order) {
        const direction = OrderHelper.direction(order);
        switch (order?.orderBy) {
            case PlayQueueEntryOrderFields.created:
                return [['createdAt', direction]];
            case PlayQueueEntryOrderFields.updated:
                return [['updatedAt', direction]];
            case PlayQueueEntryOrderFields.default:
            case PlayQueueEntryOrderFields.position:
                return [['position', direction]];
        }
        return [];
    }
    async buildFilter(_, __) {
        return {};
    }
}
//# sourceMappingURL=playqueue-entry.repository.js.map