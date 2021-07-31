import { BaseRepository } from '../base/base.repository';
import { DBObjectType, PlaylistEntryOrderFields } from '../../types/enums';
import { QHelper } from '../../modules/orm';
import { OrderHelper } from '../base/base';
export class PlaylistEntryRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.playlistentry;
    }
    buildOrder(order) {
        const direction = OrderHelper.direction(order);
        switch (order?.orderBy) {
            case PlaylistEntryOrderFields.created:
                return [['createdAt', direction]];
            case PlaylistEntryOrderFields.updated:
                return [['updatedAt', direction]];
            case PlaylistEntryOrderFields.default:
            case PlaylistEntryOrderFields.position:
                return [['position', direction]];
        }
        return [];
    }
    async buildFilter(filter, __) {
        if (!filter) {
            return {};
        }
        return QHelper.buildQuery([
            { playlist: QHelper.inOrEqual(filter.playlistIDs) },
        ]);
    }
}
//# sourceMappingURL=playlist-entry.repository.js.map