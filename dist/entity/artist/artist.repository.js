"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const artist_1 = require("./artist");
const base_1 = require("../base/base");
let ArtistRepository = class ArtistRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.artist;
        this.indexProperty = 'nameSort';
    }
    applyOrderByEntry(result, direction, order) {
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.ArtistOrderFields.created:
                result.createdAt = direction;
                break;
            case enums_1.ArtistOrderFields.updated:
                result.updatedAt = direction;
                break;
            case enums_1.ArtistOrderFields.name:
                result.name = direction;
                break;
            case enums_1.ArtistOrderFields.default:
            case enums_1.ArtistOrderFields.nameSort:
                result.nameSort = direction;
                break;
        }
    }
    async buildFilter(filter, user) {
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: base_1.QHelper.like(filter.query) },
            { slug: base_1.QHelper.eq(filter.slug) },
            { name: base_1.QHelper.eq(filter.name) },
            { mbArtistID: base_1.QHelper.inOrEqual(filter.mbArtistIDs) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { roots: base_1.QHelper.foreignKeys(filter.rootIDs) },
            { folders: base_1.QHelper.foreignKeys(filter.folderIDs) },
            { albums: base_1.QHelper.foreignKeys(filter.albumIDs) },
            { series: base_1.QHelper.foreignKey(filter.seriesIDs) },
            { tracks: base_1.QHelper.foreignKeys(filter.trackIDs) },
            { albumTracks: base_1.QHelper.foreignKeys(filter.albumTrackIDs) },
            ...base_1.QHelper.inStringArray('genres', filter.genres),
            ...base_1.QHelper.inStringArray('albumTypes', filter.albumTypes)
        ]) : {};
    }
};
ArtistRepository = __decorate([
    mikro_orm_1.Repository(artist_1.Artist)
], ArtistRepository);
exports.ArtistRepository = ArtistRepository;
//# sourceMappingURL=artist.repository.js.map