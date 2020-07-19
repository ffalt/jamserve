"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FolderRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const folder_1 = require("./folder");
const base_1 = require("../base/base");
let FolderRepository = class FolderRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.folder;
        this.indexProperty = 'title';
    }
    applyOrderByEntry(result, direction, order) {
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.FolderOrderFields.created:
                result.createdAt = direction;
                break;
            case enums_1.FolderOrderFields.updated:
                result.updatedAt = direction;
                break;
            case enums_1.FolderOrderFields.year:
                result.year = direction;
                break;
            case enums_1.FolderOrderFields.title:
                result.title = direction;
                result.path = direction;
                break;
            case enums_1.FolderOrderFields.default:
            case enums_1.FolderOrderFields.name:
                result.path = direction;
                break;
        }
    }
    async buildFilter(filter, user) {
        let parentIDs = [];
        if (filter === null || filter === void 0 ? void 0 : filter.childOfID) {
            const folder = await this.oneOrFail({ id: filter.childOfID });
            parentIDs = parentIDs.concat(await this.findAllDescendantsIds(folder));
            if (parentIDs.length === 0) {
                parentIDs.push('__non_existing_');
            }
        }
        if (filter === null || filter === void 0 ? void 0 : filter.parentIDs) {
            parentIDs = parentIDs.concat(filter === null || filter === void 0 ? void 0 : filter.parentIDs);
        }
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { title: base_1.QHelper.like(filter.query) },
            { name: base_1.QHelper.eq(filter.name) },
            { album: base_1.QHelper.eq(filter.album) },
            { artist: base_1.QHelper.eq(filter.artist) },
            { artistSort: base_1.QHelper.eq(filter.artistSort) },
            { title: base_1.QHelper.eq(filter.title) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { parent: base_1.QHelper.foreignKey(parentIDs.length > 0 ? parentIDs : undefined) },
            { level: base_1.QHelper.eq(filter.level) },
            { albumType: base_1.QHelper.inOrEqual(filter.albumTypes) },
            { folderType: base_1.QHelper.inOrEqual(filter.folderTypes) },
            { mbReleaseID: base_1.QHelper.inOrEqual(filter.mbReleaseIDs) },
            { mbReleaseGroupID: base_1.QHelper.inOrEqual(filter.mbReleaseGroupIDs) },
            { mbAlbumType: base_1.QHelper.inOrEqual(filter.mbAlbumTypes) },
            { mbArtistID: base_1.QHelper.inOrEqual(filter.mbArtistIDs) },
            { year: base_1.QHelper.lte(filter.toYear) },
            { year: base_1.QHelper.gte(filter.fromYear) },
            { root: base_1.QHelper.foreignKey(filter.rootIDs) },
            { artworks: base_1.QHelper.foreignKeys(filter.artworksIDs) },
            { tracks: base_1.QHelper.foreignKeys(filter.trackIDs) },
            { series: base_1.QHelper.foreignKeys(filter.seriesIDs) },
            { albums: base_1.QHelper.foreignKeys(filter.albumIDs) },
            { artists: base_1.QHelper.foreignKeys(filter.artistIDs) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            ...base_1.QHelper.inStringArray('genres', filter.genres)
        ]) : {};
    }
    async findAllDescendants(folder) {
        return this.find({ path: { $like: `%${folder.path}%` } });
    }
    async findAllDescendantsIds(folder) {
        return this.findIDs({ path: { $like: `%${folder.path}%` } });
    }
};
FolderRepository = __decorate([
    mikro_orm_1.Repository(folder_1.Folder)
], FolderRepository);
exports.FolderRepository = FolderRepository;
//# sourceMappingURL=folder.repository.js.map