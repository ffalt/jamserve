import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
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
    async findOrCreate(destinationID, destinationType, userID) {
        const state = await this.findOne({ where: { user: userID, destID: destinationID, destType: destinationType } });
        return state ?? this.create({});
    }
    async findMany(destinationIDs, destinationType, userID) {
        return await this.find({ where: { user: userID, destID: destinationIDs, destType: destinationType } });
    }
}
//# sourceMappingURL=state.repository.js.map