import { BaseRepository } from '../base/base.repository.js';
import { DBObjectType, TrackOrderFields } from '../../types/enums.js';
import { OrderHelper } from '../base/base.js';
import { Folder } from '../folder/folder.js';
import { QHelper } from '../../modules/orm/index.js';
export class TrackRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.track;
    }
    buildOrder(order) {
        const direction = OrderHelper.direction(order);
        switch (order?.orderBy) {
            case TrackOrderFields.created: {
                return [['createdAt', direction]];
            }
            case TrackOrderFields.updated: {
                return [['updatedAt', direction]];
            }
            case TrackOrderFields.parent: {
                return [['path', direction]];
            }
            case TrackOrderFields.filename: {
                return [['path', direction], ['fileName', direction]];
            }
            case TrackOrderFields.album: {
                return [['albumORM', 'name', direction]];
            }
            case TrackOrderFields.trackNr: {
                return [['tagORM', 'trackNr', direction]];
            }
            case TrackOrderFields.discNr: {
                return [['tagORM', 'disc', direction]];
            }
            case TrackOrderFields.seriesNr: {
                return [['tagORM', 'seriesNr', direction]];
            }
            case TrackOrderFields.title: {
                return [['tagORM', 'title', direction]];
            }
            case TrackOrderFields.default: {
                return [
                    ['tagORM', 'disc', direction],
                    ['path', OrderHelper.inverse(direction)],
                    ['tagORM', 'trackNr', direction],
                    ['tagORM', 'title', direction]
                ];
            }
        }
        return [];
    }
    async buildFilter(filter, _) {
        if (!filter) {
            return {};
        }
        let folderIDs = [];
        if (filter.childOfID) {
            const folderRepo = this.em.getRepository(Folder);
            const folder = await folderRepo.oneOrFailByID(filter.childOfID);
            folderIDs = [...folderIDs, ...await folderRepo.findAllDescendantsIds(folder), filter.childOfID];
        }
        if (filter.folderIDs) {
            folderIDs = [...folderIDs, ...filter.folderIDs];
        }
        const result = QHelper.buildQuery([
            { id: filter.ids },
            { createdAt: QHelper.gte(filter.since) },
            { series: QHelper.inOrEqual(filter.seriesIDs) },
            { album: QHelper.inOrEqual(filter.albumIDs) },
            { artist: QHelper.inOrEqual(filter.artistIDs) },
            { albumArtist: QHelper.inOrEqual(filter.albumArtistIDs) },
            { root: QHelper.inOrEqual(filter.rootIDs) },
            { folder: QHelper.inOrEqual(folderIDs.length > 0 ? folderIDs : undefined) }
        ]);
        result.include = QHelper.includeQueries([
            { bookmarks: [{ id: QHelper.inOrEqual(filter.bookmarkIDs) }] },
            { genres: [{ id: QHelper.inOrEqual(filter.genreIDs) }] },
            { artist: [{ name: QHelper.eq(filter.artist) }] },
            { album: [{ name: QHelper.eq(filter.album) }] },
            {
                tag: [
                    ...QHelper.inStringArray('genres', filter.genres),
                    { title: QHelper.like(filter.query, this.em.dialect) },
                    { title: QHelper.eq(filter.name) },
                    { year: QHelper.lte(filter.toYear) },
                    { year: QHelper.gte(filter.fromYear) }
                ]
            }
        ]);
        return result;
    }
}
//# sourceMappingURL=track.repository.js.map