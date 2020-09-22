"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
class ArtistRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.artist;
        this.indexProperty = 'nameSort';
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.ArtistOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.ArtistOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.ArtistOrderFields.name:
                return [['name', direction]];
            case enums_1.ArtistOrderFields.default:
            case enums_1.ArtistOrderFields.nameSort:
                return [['nameSort', direction]];
        }
        return [];
    }
    async buildFilter(filter, _) {
        if (!filter) {
            return {};
        }
        const result = orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: orm_1.QHelper.like(filter.query, this.em.dialect) },
            { slug: orm_1.QHelper.eq(filter.slug) },
            { name: orm_1.QHelper.eq(filter.name) },
            { mbArtistID: orm_1.QHelper.inOrEqual(filter.mbArtistIDs) },
            { mbArtistID: orm_1.QHelper.neq(filter.notMbArtistID) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            ...orm_1.QHelper.inStringArray('albumTypes', filter.albumTypes)
        ]);
        result.include = orm_1.QHelper.includeQueries([
            { genres: [{ name: orm_1.QHelper.inOrEqual(filter.genres) }] },
            { genres: [{ id: orm_1.QHelper.inOrEqual(filter.genreIDs) }] },
            { tracks: [{ id: orm_1.QHelper.inOrEqual(filter.trackIDs) }] },
            { albumTracks: [{ id: orm_1.QHelper.inOrEqual(filter.albumTrackIDs) }] },
            { series: [{ id: orm_1.QHelper.inOrEqual(filter.seriesIDs) }] },
            { albums: [{ id: orm_1.QHelper.inOrEqual(filter.albumIDs) }] },
            { folders: [{ id: orm_1.QHelper.inOrEqual(filter.folderIDs) }] },
            { roots: [{ id: orm_1.QHelper.inOrEqual(filter.rootIDs) }] }
        ]);
        return result;
    }
}
exports.ArtistRepository = ArtistRepository;
//# sourceMappingURL=artist.repository.js.map