"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MetaDataRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
class MetaDataRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.metadata;
    }
    buildOrder(_) {
        return [];
    }
    async buildFilter(_, __) {
        return {};
    }
}
exports.MetaDataRepository = MetaDataRepository;
//# sourceMappingURL=metadata.repository.js.map