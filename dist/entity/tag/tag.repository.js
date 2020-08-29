"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const fs_utils_1 = require("../../utils/fs-utils");
class TagRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.tag;
    }
    createByScan(data, filename) {
        return this.create({ ...data, title: data.title || fs_utils_1.basenameStripExt(filename), chapters: data.chapters ? JSON.stringify(data.chapters) : undefined });
    }
    buildOrder(_) {
        return [];
    }
    async buildFilter(_, __) {
        return {};
    }
}
exports.TagRepository = TagRepository;
//# sourceMappingURL=tag.repository.js.map