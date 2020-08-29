"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StateRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
class StateRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.state;
    }
    buildOrder(_) {
        return [];
    }
    async buildFilter(_, __) {
        return {};
    }
    async findOrCreate(destID, destType, userID) {
        const state = await this.findOne({ where: { user: userID, destID, destType } });
        return state || this.create({});
    }
    async findMany(destIDs, destType, userID) {
        return await this.find({ where: { user: userID, destID: destIDs, destType } });
    }
}
exports.StateRepository = StateRepository;
//# sourceMappingURL=state.repository.js.map