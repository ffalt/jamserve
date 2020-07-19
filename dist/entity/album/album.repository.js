"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlbumRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const album_1 = require("./album");
const base_1 = require("../base/base");
let AlbumRepository = class AlbumRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.album;
        this.indexProperty = 'name';
    }
    applyOrderByEntry(result, direction, order) {
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.AlbumOrderFields.created:
                result.createdAt = direction;
                break;
            case enums_1.AlbumOrderFields.updated:
                result.updatedAt = direction;
                break;
            case enums_1.AlbumOrderFields.name:
                result.name = direction;
                break;
            case enums_1.AlbumOrderFields.duration:
                result.duration = direction;
                break;
            case enums_1.AlbumOrderFields.artist:
                result.artist = result.artist || {};
                result.artist.name = direction;
                break;
            case enums_1.AlbumOrderFields.year:
                result.year = direction;
                break;
            case enums_1.AlbumOrderFields.default:
                result.artist = result.artist || {};
                result.artist.name = direction;
                result.year = direction === mikro_orm_1.QueryOrder.DESC ? mikro_orm_1.QueryOrder.ASC : mikro_orm_1.QueryOrder.DESC;
                result.name = direction;
                break;
        }
    }
    async buildFilter(filter, user) {
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: base_1.QHelper.like(filter.query) },
            { name: base_1.QHelper.eq(filter.name) },
            { mbReleaseID: base_1.QHelper.inOrEqual(filter.mbReleaseIDs) },
            { mbArtistID: base_1.QHelper.inOrEqual(filter.mbArtistIDs) },
            { albumType: base_1.QHelper.inOrEqual(filter.albumTypes) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { roots: base_1.QHelper.foreignKeys(filter.rootIDs) },
            { artist: base_1.QHelper.foreignKey(filter.artistIDs) },
            { series: base_1.QHelper.foreignKey(filter.seriesIDs) },
            { tracks: base_1.QHelper.foreignKeys(filter.trackIDs) },
            { folders: base_1.QHelper.foreignKeys(filter.folderIDs) },
            { year: base_1.QHelper.lte(filter.toYear) },
            { year: base_1.QHelper.gte(filter.fromYear) },
            {
                artist: filter.artist ? {
                    name: base_1.QHelper.eq(filter.artist)
                } : undefined
            },
            ...base_1.QHelper.inStringArray('genres', filter.genres)
        ]) : {};
    }
};
AlbumRepository = __decorate([
    mikro_orm_1.Repository(album_1.Album)
], AlbumRepository);
exports.AlbumRepository = AlbumRepository;
//# sourceMappingURL=album.repository.js.map