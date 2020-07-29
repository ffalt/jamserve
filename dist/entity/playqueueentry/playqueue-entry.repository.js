"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayQueueEntryRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
class PlayQueueEntryRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.playqueueentry;
    }
    buildOrder(order) {
        return [];
    }
    async buildFilter(filter, user) {
        return {};
    }
}
exports.PlayQueueEntryRepository = PlayQueueEntryRepository;
//# sourceMappingURL=playqueue-entry.repository.js.map