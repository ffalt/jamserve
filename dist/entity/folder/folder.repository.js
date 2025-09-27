import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, FolderOrderFields } from '../../types/enums.js';
import { OrderHelper } from '../base/base.js';
import { QHelper } from '../../modules/orm/index.js';
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
        const options = QHelper.buildQuery([{ path: QHelper.like(folder.path) }]);
        return this.find(options);
    }
    async findAllDescendantsIds(folder) {
        const options = QHelper.buildQuery([{ path: QHelper.like(folder.path) }]);
        return this.findIDs(options);
    }
}
//# sourceMappingURL=folder.repository.js.map