import { BaseRepository } from '../base/base.repository';
import { DBObjectType } from '../../types/enums';
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