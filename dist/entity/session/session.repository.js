import { QHelper } from '../../modules/orm/index.js';
import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, SessionOrderFields } from '../../types/enums.js';
import { OrderHelper } from '../base/base.js';
export class SessionRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.session;
    }
    buildOrder(order) {
        const direction = OrderHelper.direction(order);
        switch (order?.orderBy) {
            case SessionOrderFields.expires:
            case SessionOrderFields.default: {
                return [['expires', direction]];
            }
        }
        return [];
    }
    async buildFilter(filter, user) {
        return filter ?
            QHelper.buildQuery([
                { id: filter.ids },
                { createdAt: QHelper.gte(filter.since) },
                { client: QHelper.eq(filter.client) },
                { agent: QHelper.eq(filter.agent) },
                { mode: QHelper.eq(filter.mode) },
                { expires: QHelper.lte(filter.expiresTo) },
                { expires: QHelper.gte(filter.expiresFrom) },
                { user: QHelper.inOrEqual(filter.userIDs) },
                { user: user?.id }
            ]) :
            {};
    }
    async byUserID(userID) {
        return await this.find({ where: { user: userID } });
    }
}
//# sourceMappingURL=session.repository.js.map