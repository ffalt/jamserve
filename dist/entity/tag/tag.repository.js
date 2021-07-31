import { BaseRepository } from '../base/base.repository';
import { DBObjectType } from '../../types/enums';
import { basenameStripExt } from '../../utils/fs-utils';
export class TagRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.tag;
    }
    createByScan(data, filename) {
        return this.create({ ...data, title: data.title || basenameStripExt(filename), chapters: data.chapters ? JSON.stringify(data.chapters) : undefined });
    }
    buildOrder(_) {
        return [];
    }
    async buildFilter(_, __) {
        return {};
    }
}
//# sourceMappingURL=tag.repository.js.map