import { QHelper } from '../../modules/orm';
import { BaseRepository } from '../base/base.repository';
import { DBObjectType, UserRole } from '../../types/enums';
export class UserRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.user;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        return this.buildDefaultOrder(order);
    }
    async buildFilter(filter, user) {
        return filter ? QHelper.buildQuery([
            { id: filter.ids },
            { name: QHelper.like(filter.query, this.em.dialect) },
            { name: QHelper.eq(filter.name) },
            { email: QHelper.eq(filter.email) },
            { createdAt: QHelper.gte(filter.since) },
            { roleAdmin: QHelper.eq(filter.roles?.includes(UserRole.admin) ? true : undefined) },
            { rolePodcast: QHelper.eq(filter.roles?.includes(UserRole.podcast) ? true : undefined) },
            { roleStream: QHelper.eq(filter.roles?.includes(UserRole.stream) ? true : undefined) },
            { roleUpload: QHelper.eq(filter.roles?.includes(UserRole.upload) ? true : undefined) },
            { id: user?.roleAdmin ? undefined : user?.id }
        ]) : {};
    }
}
//# sourceMappingURL=user.repository.js.map