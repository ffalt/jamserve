var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { DBObjectType } from '../../types/enums.js';
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { StateQL } from '../state/state.js';
import { Series, SeriesIndexQL, SeriesPageQL, SeriesQL } from './series.js';
import { SeriesArgsQL, SeriesIndexArgsQL } from './series.args.js';
import { AlbumQL } from '../album/album.js';
import { TrackQL } from '../track/track.js';
import { FolderQL } from '../folder/folder.js';
import { RootQL } from '../root/root.js';
import { ArtistQL } from '../artist/artist.js';
let SeriesResolver = class SeriesResolver {
    async series(id, { orm }) {
        return await orm.Series.oneOrFailByID(id);
    }
    async serieses({ page, filter, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Series.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Series.searchFilter(filter, order, page, user);
    }
    async seriesIndex({ filter }, { orm, user }) {
        return await orm.Series.indexFilter(filter, user);
    }
    async roots(series) {
        return series.roots.getItems();
    }
    async rootsCount(series) {
        return series.roots.count();
    }
    async folders(series) {
        return series.folders.getItems();
    }
    async foldersCount(series) {
        return series.folders.count();
    }
    async tracks(series) {
        return series.tracks.getItems();
    }
    async tracksCount(series) {
        return series.tracks.count();
    }
    async albums(series) {
        return series.albums.getItems();
    }
    async albumsCount(series) {
        return series.albums.count();
    }
    async genresCount(series) {
        return series.genres.count();
    }
    async artist(series) {
        return series.artist.get();
    }
    async state(series, { orm, user }) {
        return await orm.State.findOrCreate(series.id, DBObjectType.series, user.id);
    }
};
__decorate([
    Query(() => SeriesQL, { description: 'Get a Series by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "series", null);
__decorate([
    Query(() => SeriesPageQL, { description: 'Search Series' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SeriesArgsQL, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "serieses", null);
__decorate([
    Query(() => SeriesIndexQL, { description: 'Get the Navigation Index for Series' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SeriesIndexArgsQL, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "seriesIndex", null);
__decorate([
    FieldResolver(() => [RootQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "roots", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "rootsCount", null);
__decorate([
    FieldResolver(() => [FolderQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "folders", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "foldersCount", null);
__decorate([
    FieldResolver(() => [TrackQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "tracks", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "tracksCount", null);
__decorate([
    FieldResolver(() => [AlbumQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "albums", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "albumsCount", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "genresCount", null);
__decorate([
    FieldResolver(() => ArtistQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "artist", null);
__decorate([
    FieldResolver(() => StateQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Series, Object]),
    __metadata("design:returntype", Promise)
], SeriesResolver.prototype, "state", null);
SeriesResolver = __decorate([
    Resolver(SeriesQL)
], SeriesResolver);
export { SeriesResolver };
//# sourceMappingURL=series.resolver.js.map