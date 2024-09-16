import { BaseRepository } from '../base/base.repository.js';
import { AlbumOrderFields, DBObjectType } from '../../types/enums.js';
import { OrderHelper } from '../base/base.js';
import { QHelper } from '../../modules/orm/index.js';
import Sequelize from 'sequelize';
export class AlbumRepository extends BaseRepository {
    constructor() {
        super(...arguments);
        this.objType = DBObjectType.album;
        this.indexProperty = 'name';
    }
    buildOrder(order) {
        const direction = OrderHelper.direction(order);
        switch (order?.orderBy) {
            case AlbumOrderFields.created:
                return [['createdAt', direction]];
            case AlbumOrderFields.updated:
                return [['updatedAt', direction]];
            case AlbumOrderFields.name:
                return [['name', direction]];
            case AlbumOrderFields.duration:
                return [['duration', direction]];
            case AlbumOrderFields.albumType:
                return [['albumType', direction]];
            case AlbumOrderFields.artist:
                return [['artistORM', 'name', direction]];
            case AlbumOrderFields.year:
                return [['year', direction]];
            case AlbumOrderFields.seriesNr:
                return this.seriesNrOrder(direction);
            case AlbumOrderFields.default:
                return AlbumRepository.defaultOrder(direction);
        }
        return [];
    }
    static defaultOrder(direction) {
        return [
            ['artistORM', 'name', direction],
            ['albumType', direction],
            ['year', direction === 'ASC' ? 'DESC' : 'ASC'],
            ['name', direction]
        ];
    }
    seriesNrOrder(direction) {
        switch (this.em.dialect) {
            case 'sqlite': {
                return [[Sequelize.literal(`substr('0000000000'||\`Album\`.\`seriesNr\`, -10, 10)`), direction]];
            }
            case 'postgres': {
                return [[Sequelize.literal(`LPAD("Album"."seriesNr"::text, 10, '0')`), direction]];
            }
            default: {
                throw new Error(`Implement LPAD request for dialect ${this.em.dialect}`);
            }
        }
    }
    async buildFilter(filter, _) {
        if (!filter) {
            return {};
        }
        const result = QHelper.buildQuery([
            { id: filter.ids },
            { name: QHelper.like(filter.query, this.em.dialect) },
            { name: QHelper.eq(filter.name) },
            { mbReleaseID: QHelper.inOrEqual(filter.mbReleaseIDs) },
            { mbArtistID: QHelper.inOrEqual(filter.mbArtistIDs) },
            { mbArtistID: QHelper.neq(filter.notMbArtistID) },
            { albumType: QHelper.inOrEqual(filter.albumTypes) },
            { createdAt: QHelper.gte(filter.since) },
            { artist: QHelper.inOrEqual(filter.artistIDs) },
            { year: QHelper.lte(filter.toYear) },
            { year: QHelper.gte(filter.fromYear) }
        ]);
        result.include = QHelper.includeQueries([
            { genres: [{ id: QHelper.inOrEqual(filter.genreIDs) }] },
            { genres: [{ name: QHelper.inOrEqual(filter.genres) }] },
            { tracks: [{ id: QHelper.inOrEqual(filter.trackIDs) }] },
            { series: [{ id: QHelper.inOrEqual(filter.seriesIDs) }] },
            { artist: [{ name: QHelper.eq(filter.artist) }] },
            { folders: [{ id: QHelper.inOrEqual(filter.folderIDs) }] },
            { roots: [{ id: QHelper.inOrEqual(filter.rootIDs) }] }
        ]);
        return result;
    }
}
//# sourceMappingURL=album.repository.js.map