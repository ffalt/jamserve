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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackResolver = void 0;
const type_graphql_1 = require("type-graphql");
const state_1 = require("../state/state");
const enums_1 = require("../../types/enums");
const waveform_1 = require("../waveform/waveform");
const track_1 = require("./track");
const folder_1 = require("../folder/folder");
const album_1 = require("../album/album");
const artist_1 = require("../artist/artist");
const root_1 = require("../root/root");
const tag_1 = require("../tag/tag");
const path_1 = __importDefault(require("path"));
const series_1 = require("../series/series");
const bookmark_1 = require("../bookmark/bookmark");
const track_args_1 = require("./track.args");
let TrackResolver = class TrackResolver {
    async track(id, { orm }) {
        return await orm.Track.oneOrFail(id);
    }
    async tracks({ page, filter, order, list }, { orm, user }) {
        if (list) {
            return await orm.Track.findListFilter(list, filter, order, page, user);
        }
        return await orm.Track.searchFilter(filter, order, page, user);
    }
    async bookmarks(track, { orm }) {
        await orm.Track.populate(track, 'bookmarks');
        return track.bookmarks.getItems();
    }
    async bookmarksCount(track, { orm }) {
        await orm.Track.populate(track, 'bookmarks');
        return track.bookmarks.length;
    }
    fileCreated(track) {
        return new Date(track.statCreated);
    }
    fileModified(track) {
        return new Date(track.statModified);
    }
    async folder(track, { orm }) {
        await orm.Track.populate(track, 'folder');
        return track.folder;
    }
    async tag(track, { orm }) {
        await orm.Track.populate(track, 'tag');
        return track.tag;
    }
    async album(track, { orm }) {
        await orm.Track.populate(track, 'album');
        return track.album;
    }
    async series(track, { orm }) {
        await orm.Track.populate(track, 'series');
        return track.series;
    }
    async albumArtist(track, { orm }) {
        await orm.Track.populate(track, 'albumArtist');
        return track.albumArtist;
    }
    async artist(track, { orm }) {
        await orm.Track.populate(track, 'artist');
        return track.artist;
    }
    async root(track, { orm }) {
        await orm.Track.populate(track, 'root');
        return track.root;
    }
    async waveform(track) {
        return { obj: track, objType: enums_1.DBObjectType.track };
    }
    async lyrics(track, { engine }) {
        return engine.metadataService.lyricsByTrack(track);
    }
    async rawTag(track, { engine }) {
        return (await engine.audioModule.readRawTag(path_1.default.join(track.path, track.fileName))) || {};
    }
    async state(track, { orm, user }) {
        return await orm.State.findOrCreate(track.id, enums_1.DBObjectType.track, user.id);
    }
};
__decorate([
    type_graphql_1.Query(() => track_1.TrackQL),
    __param(0, type_graphql_1.Arg('id', () => type_graphql_1.ID)), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "track", null);
__decorate([
    type_graphql_1.Query(() => track_1.TrackPageQL),
    __param(0, type_graphql_1.Args()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_args_1.TracksArgs, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "tracks", null);
__decorate([
    type_graphql_1.FieldResolver(() => [bookmark_1.BookmarkQL]),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "bookmarks", null);
__decorate([
    type_graphql_1.FieldResolver(() => type_graphql_1.Int),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "bookmarksCount", null);
__decorate([
    type_graphql_1.FieldResolver(() => Date),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track]),
    __metadata("design:returntype", Date)
], TrackResolver.prototype, "fileCreated", null);
__decorate([
    type_graphql_1.FieldResolver(() => Date),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track]),
    __metadata("design:returntype", Date)
], TrackResolver.prototype, "fileModified", null);
__decorate([
    type_graphql_1.FieldResolver(() => folder_1.FolderQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "folder", null);
__decorate([
    type_graphql_1.FieldResolver(() => tag_1.TagQL, { nullable: true }),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "tag", null);
__decorate([
    type_graphql_1.FieldResolver(() => album_1.AlbumQL, { nullable: true }),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "album", null);
__decorate([
    type_graphql_1.FieldResolver(() => series_1.SeriesQL, { nullable: true }),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "series", null);
__decorate([
    type_graphql_1.FieldResolver(() => artist_1.ArtistQL, { nullable: true }),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "albumArtist", null);
__decorate([
    type_graphql_1.FieldResolver(() => artist_1.ArtistQL, { nullable: true }),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "artist", null);
__decorate([
    type_graphql_1.FieldResolver(() => root_1.RootQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "root", null);
__decorate([
    type_graphql_1.FieldResolver(() => waveform_1.WaveformQL),
    __param(0, type_graphql_1.Root()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "waveform", null);
__decorate([
    type_graphql_1.FieldResolver(() => track_1.TrackLyricsQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "lyrics", null);
__decorate([
    type_graphql_1.FieldResolver(() => tag_1.MediaTagRawQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "rawTag", null);
__decorate([
    type_graphql_1.FieldResolver(() => state_1.StateQL),
    __param(0, type_graphql_1.Root()), __param(1, type_graphql_1.Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [track_1.Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "state", null);
TrackResolver = __decorate([
    type_graphql_1.Resolver(track_1.TrackQL)
], TrackResolver);
exports.TrackResolver = TrackResolver;
//# sourceMappingURL=track.resolver.js.map