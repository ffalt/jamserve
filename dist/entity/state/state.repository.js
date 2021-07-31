import { BaseRepository } from '../base/base.repository';
import { DBObjectType } from '../../types/enums';
export class StateRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.state;
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
//# sourceMappingURL=state.repository.js.map