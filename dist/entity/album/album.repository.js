"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
const sequelize_1 = __importDefault(require("sequelize"));
class AlbumRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.album;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.AlbumOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.AlbumOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.AlbumOrderFields.name:
                return [['name', direction]];
            case enums_1.AlbumOrderFields.duration:
                return [['duration', direction]];
            case enums_1.AlbumOrderFields.albumType:
                return [['albumType', direction]];
            case enums_1.AlbumOrderFields.artist:
                return [['artistORM', 'name', direction]];
            case enums_1.AlbumOrderFields.year:
                return [['year', direction]];
            case enums_1.AlbumOrderFields.seriesNr: {
                switch (this.em.sequelize.getDialect()) {
                    case 'sqlite': {
                        return [[sequelize_1.default.literal(`substr('0000000000'||\`Album\`.\`seriesNr\`, -10, 10)`), direction]];
                    }
                    case 'postgres': {
                        return [[sequelize_1.default.literal(`LPAD("Album"."seriesNr"::text, 10, '0')`), direction]];
                    }
                    default: {
                        throw new Error(`Implement LPAD request for dialect ${this.em.sequelize.getDialect()}`);
                    }
                }
            }
            case enums_1.AlbumOrderFields.default:
                return [
                    ['artistORM', 'name', direction],
                    ['albumType', direction],
                    ['year', direction === 'ASC' ? 'DESC' : 'ASC'],
                    ['name', direction]
                ];
        }
        return [];
    }
    async buildFilter(filter, _) {
        if (!filter) {
            return {};
        }
        const result = orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: orm_1.QHelper.like(filter.query) },
            { name: orm_1.QHelper.eq(filter.name) },
            { mbReleaseID: orm_1.QHelper.inOrEqual(filter.mbReleaseIDs) },
            { mbArtistID: orm_1.QHelper.inOrEqual(filter.mbArtistIDs) },
            { mbArtistID: orm_1.QHelper.neq(filter.notMbArtistID) },
            { albumType: orm_1.QHelper.inOrEqual(filter.albumTypes) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { artist: orm_1.QHelper.inOrEqual(filter.artistIDs) },
            { year: orm_1.QHelper.lte(filter.toYear) },
            { year: orm_1.QHelper.gte(filter.fromYear) },
            ...orm_1.QHelper.inStringArray('genres', filter.genres)
        ]);
        result.include = orm_1.QHelper.includeQueries([
            { tracks: [{ id: orm_1.QHelper.inOrEqual(filter.trackIDs) }] },
            { series: [{ id: orm_1.QHelper.inOrEqual(filter.seriesIDs) }] },
            { artist: [{ name: orm_1.QHelper.eq(filter.artist) }] },
            { folders: [{ id: orm_1.QHelper.inOrEqual(filter.folderIDs) }] },
            { roots: [{ id: orm_1.QHelper.inOrEqual(filter.rootIDs) }] }
        ]);
        return result;
    }
}
exports.AlbumRepository = AlbumRepository;
//# sourceMappingURL=album.repository.js.map