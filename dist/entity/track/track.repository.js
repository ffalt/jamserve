"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
const folder_1 = require("../folder/folder");
const orm_1 = require("../../modules/orm");
class TrackRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.track;
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.TrackOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.TrackOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.TrackOrderFields.parent:
                return [['path', direction]];
            case enums_1.TrackOrderFields.trackNr:
                return [['tagORM', 'trackNr', direction]];
            case enums_1.TrackOrderFields.discNr:
                return [['tagORM', 'disc', direction]];
            case enums_1.TrackOrderFields.title:
                return [['tagORM', 'title', direction]];
            case enums_1.TrackOrderFields.default:
                return [
                    ['path', direction],
                    ['tagORM', 'disc', direction],
                    ['tagORM', 'trackNr', direction]
                ];
        }
        return [];
    }
    async buildFilter(filter, user) {
        if (!filter) {
            return {};
        }
        let folderIDs = [];
        if (filter === null || filter === void 0 ? void 0 : filter.childOfID) {
            const folderRepo = this.em.getRepository(folder_1.Folder);
            const folder = await folderRepo.oneOrFailByID(filter.childOfID);
            folderIDs = folderIDs.concat(await folderRepo.findAllDescendantsIds(folder));
            folderIDs.push(filter.childOfID);
        }
        if (filter === null || filter === void 0 ? void 0 : filter.folderIDs) {
            folderIDs = folderIDs.concat(filter.folderIDs);
        }
        const result = orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { series: orm_1.QHelper.inOrEqual(filter.seriesIDs) },
            { album: orm_1.QHelper.inOrEqual(filter.albumIDs) },
            { artist: orm_1.QHelper.inOrEqual(filter.artistIDs) },
            { albumArtist: orm_1.QHelper.inOrEqual(filter.albumArtistIDs) },
            { root: orm_1.QHelper.inOrEqual(filter.rootIDs) },
            { folder: orm_1.QHelper.inOrEqual(folderIDs.length > 0 ? folderIDs : undefined) }
        ]);
        result.include = orm_1.QHelper.includeQueries([
            { bookmarks: [{ id: orm_1.QHelper.inOrEqual(filter.bookmarkIDs) }] },
            { artist: [{ name: orm_1.QHelper.eq(filter.artist) }] },
            { album: [{ name: orm_1.QHelper.eq(filter.album) }] },
            {
                tag: [
                    ...orm_1.QHelper.inStringArray('genres', filter.genres),
                    { title: orm_1.QHelper.like(filter.name) },
                    { title: orm_1.QHelper.eq(filter.query) },
                    { year: orm_1.QHelper.lte(filter.toYear) },
                    { year: orm_1.QHelper.gte(filter.fromYear) }
                ]
            }
        ]);
        return result;
    }
}
exports.TrackRepository = TrackRepository;
//# sourceMappingURL=track.repository.js.map