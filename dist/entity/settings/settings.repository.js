"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
class SettingsRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.settings;
    }
    buildOrder(order) {
        return [];
    }
    async buildFilter(filter, user) {
        return {};
    }
}
exports.SettingsRepository = SettingsRepository;
//# sourceMappingURL=settings.repository.js.map