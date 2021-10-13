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
import { DBObjectType } from '../../types/enums';
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { StateQL } from '../state/state';
import { Artist, ArtistIndexQL, ArtistPageQL, ArtistQL } from './artist';
import { TrackQL } from '../track/track';
import { AlbumQL } from '../album/album';
import { RootQL } from '../root/root';
import { FolderQL } from '../folder/folder';
import { SeriesQL } from '../series/series';
import { ArtistIndexArgsQL, ArtistsArgsQL } from './artist.args';
import { GenreQL } from '../genre/genre';
let ArtistResolver = class ArtistResolver {
    async artist(id, { orm }) {
        return await orm.Artist.oneOrFailByID(id);
    }
    async artists({ page, filter, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Artist.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Artist.searchFilter(filter, order, page, user);
    }
    async artistIndex({ filter }, { orm, engine, user }) {
        return await orm.Artist.indexFilter(filter, user, engine.settings.settings.index.ignoreArticles);
    }
    async state(artist, { orm, user }) {
        return await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
    }
    async tracks(artist) {
        return artist.tracks.getItems();
    }
    async genres(artist) {
        return artist.genres.getItems();
    }
    async tracksCount(artist) {
        return artist.tracks.count();
    }
    async albumTracks(artist) {
        return artist.albumTracks.getItems();
    }
    async albumsTracksCount(artist) {
        return artist.albumTracks.count();
    }
    async albums(artist) {
        return artist.albums.getItems();
    }
    async albumsCount(artist) {
        return artist.albums.count();
    }
    async genresCount(artist) {
        return artist.genres.count();
    }
    async roots(artist) {
        return artist.roots.getItems();
    }
    async rootsCount(artist) {
        return artist.roots.count();
    }
    async folders(artist) {
        return artist.folders.getItems();
    }
    async foldersCount(artist) {
        return artist.folders.count();
    }
    async series(artist) {
        return artist.series.getItems();
    }
    async seriesCount(artist) {
        return artist.series.count();
    }
};
__decorate([
    Query(() => ArtistQL, { description: 'Get an Artist by Id' }),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "artist", null);
__decorate([
    Query(() => ArtistPageQL, { description: 'Search Artists' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtistsArgsQL, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "artists", null);
__decorate([
    Query(() => ArtistIndexQL, { description: 'Get the Navigation Index for Albums' }),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ArtistIndexArgsQL, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "artistIndex", null);
__decorate([
    FieldResolver(() => StateQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "state", null);
__decorate([
    FieldResolver(() => [TrackQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "tracks", null);
__decorate([
    FieldResolver(() => [GenreQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "genres", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "tracksCount", null);
__decorate([
    FieldResolver(() => [TrackQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "albumTracks", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "albumsTracksCount", null);
__decorate([
    FieldResolver(() => [AlbumQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "albums", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "albumsCount", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "genresCount", null);
__decorate([
    FieldResolver(() => [RootQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "roots", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "rootsCount", null);
__decorate([
    FieldResolver(() => [FolderQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "folders", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "foldersCount", null);
__decorate([
    FieldResolver(() => [SeriesQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "series", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Artist]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "seriesCount", null);
ArtistResolver = __decorate([
    Resolver(ArtistQL)
], ArtistResolver);
export { ArtistResolver };
//# sourceMappingURL=artist.resolver.js.map