import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType } from '../../types/enums.js';
import { Folder } from '../folder/folder.js';
import { QHelper } from '../../modules/orm/index.js';
export class ArtworkRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.artwork;
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
            const folderRepo = this.em.getRepository(Folder);
            const folder = await folderRepo.oneOrFailByID(filter.childOfID);
            folderIDs = folderIDs.concat(await folderRepo.findAllDescendantsIds(folder));
            folderIDs.push(filter.childOfID);
        }
        if (filter?.folderIDs) {
            folderIDs = folderIDs.concat(filter.folderIDs);
        }
        return QHelper.buildQuery([
            { id: filter.ids },
            { name: QHelper.like(filter.query, this.em.dialect) },
            { name: QHelper.eq(filter.name) },
            { format: QHelper.inOrEqual(filter.formats) },
            { createdAt: QHelper.gte(filter.since) },
            { folder: QHelper.inOrEqual(folderIDs) },
            { createdAt: QHelper.gte(filter.since) },
            { fileSize: QHelper.gte(filter.sizeFrom) },
            { fileSize: QHelper.lte(filter.sizeTo) },
            { width: QHelper.gte(filter.widthFrom) },
            { width: QHelper.lte(filter.widthTo) },
            { height: QHelper.gte(filter.heightFrom) },
            { height: QHelper.lte(filter.heightTo) },
            ...QHelper.inStringArray('types', filter.types)
        ]);
    }
}
//# sourceMappingURL=artwork.repository.js.map