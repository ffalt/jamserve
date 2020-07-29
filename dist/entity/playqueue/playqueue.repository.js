"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlayQueueRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
class PlayQueueRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.playqueue;
    }
    buildOrder(order) {
        return [];
    }
    async buildFilter(filter, user) {
        return {};
    }
}
exports.PlayQueueRepository = PlayQueueRepository;
//# sourceMappingURL=playqueue.repository.js.map