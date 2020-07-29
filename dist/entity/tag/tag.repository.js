"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
class TagRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.tag;
    }
    buildOrder(order) {
        return [];
    }
    async buildFilter(filter, user) {
        return {};
    }
}
exports.TagRepository = TagRepository;
//# sourceMappingURL=tag.repository.js.map