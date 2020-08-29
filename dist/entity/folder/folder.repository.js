"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const base_1 = require("../base/base");
const orm_1 = require("../../modules/orm");
class FolderRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.folder;
        this.indexProperty = 'title';
    }
    buildOrder(order) {
        const direction = base_1.OrderHelper.direction(order);
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.FolderOrderFields.created:
                return [['createdAt', direction]];
            case enums_1.FolderOrderFields.updated:
                return [['updatedAt', direction]];
            case enums_1.FolderOrderFields.year:
                return [['year', direction]];
            case enums_1.FolderOrderFields.level:
                return [['level', direction]];
            case enums_1.FolderOrderFields.title:
                return [
                    ['title', direction],
                    ['path', direction]
                ];
            case enums_1.FolderOrderFields.default:
            case enums_1.FolderOrderFields.name:
                return [['path', direction]];
        }
        return [];
    }
    async buildFilter(filter, _) {
        if (!filter) {
            return {};
        }
        let parentIDs = [];
        if (filter.childOfID) {
            const folder = await this.oneOrFailByID(filter.childOfID);
            parentIDs = parentIDs.concat(await this.findAllDescendantsIds(folder));
            if (parentIDs.length === 0) {
                parentIDs.push('__non_existing_');
            }
        }
        if (filter.parentIDs) {
            parentIDs = parentIDs.concat(filter === null || filter === void 0 ? void 0 : filter.parentIDs);
        }
        const result = orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { title: orm_1.QHelper.like(filter.query) },
            { name: orm_1.QHelper.eq(filter.name) },
            { album: orm_1.QHelper.eq(filter.album) },
            { artist: orm_1.QHelper.eq(filter.artist) },
            { artistSort: orm_1.QHelper.eq(filter.artistSort) },
            { title: orm_1.QHelper.eq(filter.title) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { parent: orm_1.QHelper.inOrEqual(parentIDs.length > 0 ? parentIDs : undefined) },
            { level: orm_1.QHelper.eq(filter.level) },
            { albumType: orm_1.QHelper.inOrEqual(filter.albumTypes) },
            { folderType: orm_1.QHelper.inOrEqual(filter.folderTypes) },
            { mbReleaseID: orm_1.QHelper.inOrEqual(filter.mbReleaseIDs) },
            { mbReleaseGroupID: orm_1.QHelper.inOrEqual(filter.mbReleaseGroupIDs) },
            { mbAlbumType: orm_1.QHelper.inOrEqual(filter.mbAlbumTypes) },
            { mbArtistID: orm_1.QHelper.inOrEqual(filter.mbArtistIDs) },
            { year: orm_1.QHelper.lte(filter.toYear) },
            { year: orm_1.QHelper.gte(filter.fromYear) },
            { root: orm_1.QHelper.inOrEqual(filter.rootIDs) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            ...orm_1.QHelper.inStringArray('genres', filter.genres)
        ]);
        result.include = orm_1.QHelper.includeQueries([
            { tracks: [{ id: orm_1.QHelper.inOrEqual(filter.trackIDs) }] },
            { artworks: [{ id: orm_1.QHelper.inOrEqual(filter.artworksIDs) }] },
            { series: [{ id: orm_1.QHelper.inOrEqual(filter.seriesIDs) }] },
            { albums: [{ id: orm_1.QHelper.inOrEqual(filter.albumIDs) }] },
            { artists: [{ id: orm_1.QHelper.inOrEqual(filter.artistIDs) }] }
        ]);
        return result;
    }
    async findAllDescendants(folder) {
        const options = orm_1.QHelper.buildQuery([{ path: orm_1.QHelper.like(folder.path) }]);
        return this.find(options);
    }
    async findAllDescendantsIds(folder) {
        const options = orm_1.QHelper.buildQuery([{ path: orm_1.QHelper.like(folder.path) }]);
        return this.findIDs(options);
    }
}
exports.FolderRepository = FolderRepository;
//# sourceMappingURL=folder.repository.js.map