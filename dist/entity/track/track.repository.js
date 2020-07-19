"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const track_1 = require("./track");
const base_1 = require("../base/base");
const folder_1 = require("../folder/folder");
let TrackRepository = class TrackRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.track;
    }
    applyOrderByEntry(result, direction, order) {
        switch (order === null || order === void 0 ? void 0 : order.orderBy) {
            case enums_1.TrackOrderFields.created:
                result.createdAt = direction;
                break;
            case enums_1.TrackOrderFields.updated:
                result.updatedAt = direction;
                break;
            case enums_1.TrackOrderFields.parent:
                result.path = direction;
                break;
            case enums_1.TrackOrderFields.trackNr:
                result.tag = result.tag || {};
                result.tag.trackNr = direction;
                break;
            case enums_1.TrackOrderFields.discNr:
                result.tag = result.tag || {};
                result.tag.disc = direction;
                break;
            case enums_1.TrackOrderFields.title:
                result.tag = result.tag || {};
                result.tag.title = direction;
                break;
            case enums_1.TrackOrderFields.default:
                result.path = direction;
                result.tag = result.tag || {};
                result.tag.disc = direction;
                result.tag.trackNr = direction;
                break;
        }
    }
    async buildFilter(filter, user) {
        if (!filter) {
            return {};
        }
        let folderIDs = [];
        if (filter === null || filter === void 0 ? void 0 : filter.childOfID) {
            const folderRepo = this.em.getRepository(folder_1.Folder);
            const folder = await folderRepo.oneOrFail({ id: filter.childOfID });
            folderIDs = folderIDs.concat(await folderRepo.findAllDescendantsIds(folder));
            folderIDs.push(filter.childOfID);
        }
        if (filter === null || filter === void 0 ? void 0 : filter.folderIDs) {
            folderIDs = folderIDs.concat(filter.folderIDs);
        }
        return base_1.QHelper.buildQuery([
            { id: filter.ids },
            { tag: base_1.QHelper.foreignLike('title', filter.query) },
            { tag: base_1.QHelper.foreignEQ('title', filter.name) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { series: base_1.QHelper.foreignKey(filter.seriesIDs) },
            { album: base_1.QHelper.foreignKey(filter.albumIDs) },
            { artist: base_1.QHelper.foreignKey(filter.artistIDs) },
            { albumArtist: base_1.QHelper.foreignKey(filter.albumArtistIDs) },
            { root: base_1.QHelper.foreignKey(filter.rootIDs) },
            { folder: base_1.QHelper.foreignKey(folderIDs.length > 0 ? folderIDs : undefined) },
            { bookmarks: base_1.QHelper.foreignKeys(filter.bookmarkIDs) },
            { artist: base_1.QHelper.foreignValue('name', filter.artist ? [filter.artist] : undefined) },
            { album: base_1.QHelper.foreignValue('name', filter.album ? [filter.album] : undefined) },
            ...base_1.QHelper.foreignStringArray('tag', 'genres', filter.genres),
            { tag: base_1.QHelper.foreignLTE('year', filter.toYear) },
            { tag: base_1.QHelper.foreignGTE('year', filter.fromYear) }
        ]);
    }
};
TrackRepository = __decorate([
    mikro_orm_1.Repository(track_1.Track)
], TrackRepository);
exports.TrackRepository = TrackRepository;
//# sourceMappingURL=track.repository.js.map