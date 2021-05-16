"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookmarkRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
class BookmarkRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.bookmark;
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order?.orderBy) {
            case enums_1.BookmarkOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.BookmarkOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.BookmarkOrderFields.media:
                return [
                    ['trackORM', 'path', direction],
                    ['episodeORM', 'path', direction]
                ];
            case enums_1.BookmarkOrderFields.default:
            case enums_1.BookmarkOrderFields.position:
                return [['position', direction]];
        }
        return [];
    }
    async buildFilter(filter, user) {
        return orm_1.QHelper.buildQuery(filter ?
            [
                { id: filter.ids },
                { comment: orm_1.QHelper.like(filter.query, this.em.dialect) },
                { comment: orm_1.QHelper.eq(filter.comment) },
                { track: orm_1.QHelper.inOrEqual(filter.trackIDs) },
                { episode: orm_1.QHelper.inOrEqual(filter.episodeIDs) },
                { createdAt: orm_1.QHelper.gte(filter.since) },
                { user: orm_1.QHelper.inOrEqual(filter.userIDs) },
                { user: user?.roleAdmin ? undefined : user?.id }
            ]
            : [{ user: user?.roleAdmin ? undefined : user?.id }]);
    }
}
exports.BookmarkRepository = BookmarkRepository;
//# sourceMappingURL=bookmark.repository.js.map