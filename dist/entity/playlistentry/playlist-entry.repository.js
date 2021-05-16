"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaylistEntryRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
class PlaylistEntryRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.playlistentry;
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order?.orderBy) {
            case enums_1.PlaylistEntryOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.PlaylistEntryOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.PlaylistEntryOrderFields.default:
            case enums_1.PlaylistEntryOrderFields.position:
                return [['position', direction]];
        }
        return [];
    }
    async buildFilter(filter, __) {
        if (!filter) {
            return {};
        }
        return orm_1.QHelper.buildQuery([
            { playlist: orm_1.QHelper.inOrEqual(filter.playlistIDs) },
        ]);
    }
}
exports.PlaylistEntryRepository = PlaylistEntryRepository;
//# sourceMappingURL=playlist-entry.repository.js.map