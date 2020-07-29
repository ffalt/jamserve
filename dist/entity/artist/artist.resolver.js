"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistResolver = void 0;
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const artist_1 = require("./artist");
const track_1 = require("../track/track");
const album_1 = require("../album/album");
const root_1 = require("../root/root");
const folder_1 = require("../folder/folder");
const series_1 = require("../series/series");
const artist_args_1 = require("./artist.args");
let ArtistResolver = class ArtistResolver {
    async artist(id, { orm }) {
        return await orm.Artist.oneOrFailByID(id);
    }
    async artists({ page, filter, order, list }, { orm, user }) {
        if (list) {
            return await orm.Artist.findListFilter(list, filter, order, page, user);
        }
        return await orm.Artist.searchFilter(filter, order, page, user);
    }
    async artistIndex({ filter }, { orm }) {
        return await orm.Artist.indexFilter(filter);
    }
    async state(artist, { orm, user }) {
        return await orm.State.findOrCreate(artist.id, enums_1.DBObjectType.artist, user.id);
    }
    async tracks(artist, { orm }) {
        return artist.tracks.getItems();
    }
    async tracksCount(artist, { orm }) {
        return artist.tracks.count();
    }
    async albumTracks(artist, { orm }) {
        return artist.albumTracks.getItems();
    }
    async albumsTracksCount(artist, { orm }) {
        return artist.albumTracks.count();
    }
    async albums(artist, { orm }) {
        return artist.albums.getItems();
    }
    async albumsCount(artist, { orm }) {
        return artist.albums.count();
    }
    async roots(artist, { orm }) {
        return artist.roots.getItems();
    }
    async rootsCount(artist, { orm }) {
        return artist.roots.count();
    }
    async folders(artist, { orm }) {
        return artist.folders.getItems();
    }
    async foldersCount(artist, { orm }) {
        return artist.folders.count();
    }
    async series(artist, { orm }) {
        return artist.series.getItems();
    }
    async seriesCount(artist, { orm }) {
        return artist.series.count();
    }
};
__decorate([
    type_graphql_1.Query(() => artist_1.ArtistQL, { description: 'Get an Artist by Id' }),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "artist", null);
__decorate([
    type_graphql_1.Query(() => artist_1.ArtistPageQL, { description: 'Search Artists' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_args_1.ArtistsArgsQL, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "artists", null);
__decorate([
    type_graphql_1.Query(() => artist_1.ArtistIndexQL, { description: 'Get the Navigation Index for Albums' }),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_args_1.ArtistIndexArgsQL, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "artistIndex", null);
__decorate([
    type_graphql_1.FieldResolver(() => state_1.StateQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "state", null);
__decorate([
    type_graphql_1.FieldResolver(() => [track_1.TrackQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "tracks", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "tracksCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => [track_1.TrackQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "albumTracks", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "albumsTracksCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => [album_1.AlbumQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "albums", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "albumsCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => [root_1.RootQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "roots", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "rootsCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => [folder_1.FolderQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "folders", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "foldersCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => [series_1.SeriesQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "series", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [artist_1.Artist, Object]),
    __metadata("design:returntype", Promise)
], ArtistResolver.prototype, "seriesCount", null);
ArtistResolver = __decorate([
    type_graphql_1.Resolver(artist_1.ArtistQL)
], ArtistResolver);
exports.ArtistResolver = ArtistResolver;
//# sourceMappingURL=artist.resolver.js.map