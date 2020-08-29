"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayQueueEntryRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
class PlayQueueEntryRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.playqueueentry;
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.PlayQueueEntryOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.PlayQueueEntryOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.PlayQueueEntryOrderFields.default:
            case enums_1.PlayQueueEntryOrderFields.position:
                return [['position', direction]];
        }
        return [];
    }
    async buildFilter(_, __) {
        return {};
    }
}
exports.PlayQueueEntryRepository = PlayQueueEntryRepository;
//# sourceMappingURL=playqueue-entry.repository.js.map