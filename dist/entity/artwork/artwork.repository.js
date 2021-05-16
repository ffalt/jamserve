"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtworkRepository = void 0;
const base_repository_1 = require("../base/base.repository");
const enums_1 = require("../../types/enums");
const folder_1 = require("../folder/folder");
const orm_1 = require("../../modules/orm");
class ArtworkRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = enums_1.DBObjectType.artwork;
    }
    buildOrder(order) {
        return this.buildDefaultOrder(order);
    }
    async buildFilter(filter, _) {
        if (!filter) {
            return {};
        }
        let folderIDs = [];
        if (filter?.childOfID) {
            const folderRepo = this.em.getRepository(folder_1.Folder);
            const folder = await folderRepo.oneOrFailByID(filter.childOfID);
            folderIDs = folderIDs.concat(await folderRepo.findAllDescendantsIds(folder));
            folderIDs.push(filter.childOfID);
        }
        if (filter?.folderIDs) {
            folderIDs = folderIDs.concat(filter.folderIDs);
        }
        return orm_1.QHelper.buildQuery([
            { id: filter.ids },
            { name: orm_1.QHelper.like(filter.query, this.em.dialect) },
            { name: orm_1.QHelper.eq(filter.name) },
            { format: orm_1.QHelper.inOrEqual(filter.formats) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { folder: orm_1.QHelper.inOrEqual(folderIDs) },
            { createdAt: orm_1.QHelper.gte(filter.since) },
            { fileSize: orm_1.QHelper.gte(filter.sizeFrom) },
            { fileSize: orm_1.QHelper.lte(filter.sizeTo) },
            { width: orm_1.QHelper.gte(filter.widthFrom) },
            { width: orm_1.QHelper.lte(filter.widthTo) },
            { height: orm_1.QHelper.gte(filter.heightFrom) },
            { height: orm_1.QHelper.lte(filter.heightTo) },
            ...orm_1.QHelper.inStringArray('types', filter.types)
        ]);
    }
}
exports.ArtworkRepository = ArtworkRepository;
//# sourceMappingURL=artwork.repository.js.map