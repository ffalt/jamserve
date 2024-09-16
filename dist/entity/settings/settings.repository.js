import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
export class SettingsRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.settings;
    }
    buildOrder(_) {
        return [];
    }
    async buildFilter(_, __) {
        return {};
    }
}
//# sourceMappingURL=settings.repository.js.map