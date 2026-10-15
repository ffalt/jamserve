import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, FolderOrderFields } from '../../types/enums.js';
import { OrderHelper } from '../base/base.js';
import { QHelper } from '../../modules/orm/index.js';
import { Op } from 'sequelize';
export class FolderRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.folder;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        const direction = OrderHelper.direction(order);
        switch (order?.orderBy) {
            case FolderOrderFields.created: {
                return [['createdAt', direction]];
            }
            case FolderOrderFields.updated: {
                return [['updatedAt', direction]];
            }
            case FolderOrderFields.year: {
                return [['year', direction]];
            }
            case FolderOrderFields.level: {
                return [['level', direction]];
            }
            case FolderOrderFields.title: {
                return [
                    ['title', direction],
                    ['path', direction]
                ];
            }
            case FolderOrderFields.default:
            case FolderOrderFields.name: {
                return [['path', direction]];
            }
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
            parentIDs = [...parentIDs, ...await this.findAllDescendantsIds(folder)];
            if (parentIDs.length === 0) {
                parentIDs.push('__non_existing_');
            }
        }
        if (filter.parentIDs) {
            parentIDs = [...parentIDs, ...filter.parentIDs];
        }
        const result = QHelper.buildQuery([
            { id: filter.ids },
            { title: QHelper.like(filter.query, this.em.dialect) },
            { name: QHelper.eq(filter.name) },
            { album: QHelper.eq(filter.album) },
            { artist: QHelper.eq(filter.artist) },
            { artistSort: QHelper.eq(filter.artistSort) },
            { title: QHelper.eq(filter.title) },
            { createdAt: QHelper.gte(filter.since) },
            { parent: QHelper.inOrEqual(parentIDs.length > 0 ? parentIDs : undefined) },
            { level: QHelper.eq(filter.level) },
            { albumType: QHelper.inOrEqual(filter.albumTypes) },
            { folderType: QHelper.inOrEqual(filter.folderTypes) },
            { mbReleaseID: QHelper.inOrEqual(filter.mbReleaseIDs) },
            { mbReleaseGroupID: QHelper.inOrEqual(filter.mbReleaseGroupIDs) },
            { mbAlbumType: QHelper.inOrEqual(filter.mbAlbumTypes) },
            { mbArtistID: QHelper.inOrEqual(filter.mbArtistIDs) },
            { year: QHelper.lte(filter.toYear) },
            { year: QHelper.gte(filter.fromYear) },
            { root: QHelper.inOrEqual(filter.rootIDs) },
            { createdAt: QHelper.gte(filter.since) },
            ...QHelper.inStringArray('genres', filter.genres)
        ]);
        if (filter.inSubtreeOfID) {
            const folder = await this.oneOrFailByID(filter.inSubtreeOfID);
            const subtreeParentIDs = await this.findAllDescendantsIds(folder);
            const subtreeWhere = {
                [Op.or]: [
                    { id: filter.inSubtreeOfID },
                    { parent: QHelper.inOrEqual(subtreeParentIDs.length > 0 ? subtreeParentIDs : ['__non_existing_']) }
                ]
            };
            result.where = result.where ? { [Op.and]: [result.where, subtreeWhere] } : subtreeWhere;
        }
        result.include = QHelper.includeQueries([
            { tracks: [{ id: QHelper.inOrEqual(filter.trackIDs) }] },
            { artworks: [{ id: QHelper.inOrEqual(filter.artworksIDs) }] },
            { series: [{ id: QHelper.inOrEqual(filter.seriesIDs) }] },
            { albums: [{ id: QHelper.inOrEqual(filter.albumIDs) }] },
            { artists: [{ id: QHelper.inOrEqual(filter.artistIDs) }] },
            { genres: [{ id: QHelper.inOrEqual(filter.genreIDs) }] }
        ]);
        return result;
    }
    async findAllDescendants(folder) {
        const result = [folder];
        const seen = new Set([folder.id]);
        let parentIDs = [folder.id];
        while (parentIDs.length > 0) {
            const children = await this.find({ where: { parent: QHelper.inOrEqual(parentIDs) } });
            const unseen = children.filter(child => !seen.has(child.id));
            for (const child of unseen) {
                seen.add(child.id);
                result.push(child);
            }
            parentIDs = unseen.map(child => child.id);
        }
        return result;
    }
    async findAllDescendantsIds(folder) {
        const result = [folder.id];
        const seen = new Set([folder.id]);
        let parentIDs = [folder.id];
        while (parentIDs.length > 0) {
            const ids = await this.findIDs({ where: { parent: QHelper.inOrEqual(parentIDs) } });
            const unseen = ids.filter(id => !seen.has(id));
            for (const id of unseen) {
                seen.add(id);
            }
            result.push(...unseen);
            parentIDs = unseen;
        }
        return result;
    }
}
//# sourceMappingURL=folder.repository.js.map