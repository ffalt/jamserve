import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { basenameStripExtension } from '../../utils/fs-utils.js';
export class TagRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.tag;
    }
    createByScan(data, filename) {
        return this.create({ ...data, title: data.title ?? basenameStripExtension(filename), chapters: data.chapters ? JSON.stringify(data.chapters) : undefined });
    }
    buildOrder(_) {
        return [];
    }
    async buildFilter(_, __) {
        return {};
    }
}
//# sourceMappingURL=tag.repository.js.map