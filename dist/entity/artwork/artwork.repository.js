"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtworkRepository = void 0;
const mikro_orm_1 = require("mikro-orm");
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const artwork_1 = require("./artwork");
const base_1 = require("../base/base");
const folder_1 = require("../folder/folder");
let ArtworkRepository = class ArtworkRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.artwork;
    }
    applyOrderByEntry(result, direction, order) {
        this.applyDefaultOrderByEntry(result, direction, order === null || order === void 0 ? void 0 : order.orderBy);
    }
    async buildFilter(filter, user) {
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
        return filter ? base_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: base_1.QHelper.like(filter.query) },
            { name: base_1.QHelper.eq(filter.name) },
            { format: base_1.QHelper.inOrEqual(filter.formats) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { folder: base_1.QHelper.foreignKeys(folderIDs) },
            { createdAt: base_1.QHelper.gte(filter.since) },
            { fileSize: base_1.QHelper.gte(filter.sizeFrom) },
            { fileSize: base_1.QHelper.lte(filter.sizeTo) },
            { width: base_1.QHelper.gte(filter.widthFrom) },
            { width: base_1.QHelper.lte(filter.widthTo) },
            { height: base_1.QHelper.gte(filter.heightFrom) },
            { height: base_1.QHelper.lte(filter.heightTo) },
            ...base_1.QHelper.inStringArray('types', filter.types)
        ]) : {};
    }
};
ArtworkRepository = __decorate([
    mikro_orm_1.Repository(artwork_1.Artwork)
], ArtworkRepository);
exports.ArtworkRepository = ArtworkRepository;
//# sourceMappingURL=artwork.repository.js.map