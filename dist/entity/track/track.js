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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrackHealth = exports.TrackPageQL = exports.TrackHealthHintQL = exports.TrackQL = exports.TrackLyricsQL = exports.Track = void 0;
const root_1 = require("../root/root");
const folder_1 = require("../folder/folder");
const series_1 = require("../series/series");
const album_1 = require("../album/album");
const artist_1 = require("../artist/artist");
const tag_1 = require("../tag/tag");
const bookmark_1 = require("../bookmark/bookmark");
const type_graphql_1 = require("type-graphql");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
const state_1 = require("../state/state");
const waveform_1 = require("../waveform/waveform");
const health_model_1 = require("../health/health.model");
const tag_model_1 = require("../tag/tag.model");
const track_model_1 = require("./track.model");
const playqueue_entry_1 = require("../playqueueentry/playqueue-entry");
const playlist_entry_1 = require("../playlistentry/playlist-entry");
const enums_1 = require("../../types/enums");
let Track = class Track extends base_1.Base {
    constructor() {
        super(...arguments);
        this.series = new orm_1.Reference(this);
        this.album = new orm_1.Reference(this);
        this.folder = new orm_1.Reference(this);
        this.artist = new orm_1.Reference(this);
        this.albumArtist = new orm_1.Reference(this);
        this.root = new orm_1.Reference(this);
        this.bookmarks = new orm_1.Collection(this);
        this.playqueueEntries = new orm_1.Collection(this);
        this.playlistEntries = new orm_1.Collection(this);
        this.tag = new orm_1.Reference(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Track.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Track.prototype, "fileName", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Track.prototype, "path", void 0);
__decorate([
    orm_1.Property(() => orm_1.ORM_DATETIME),
    __metadata("design:type", Date)
], Track.prototype, "statCreated", void 0);
__decorate([
    orm_1.Property(() => orm_1.ORM_DATETIME),
    __metadata("design:type", Date)
], Track.prototype, "statModified", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Float),
    orm_1.Property(() => orm_1.ORM_INT),
    __metadata("design:type", Number)
], Track.prototype, "fileSize", void 0);
__decorate([
    type_graphql_1.Field(() => series_1.SeriesQL, { nullable: true }),
    orm_1.ManyToOne(() => series_1.Series, series => series.tracks),
    __metadata("design:type", Object)
], Track.prototype, "series", void 0);
__decorate([
    type_graphql_1.Field(() => album_1.AlbumQL, { nullable: true }),
    orm_1.ManyToOne(() => album_1.Album, album => album.tracks, { nullable: true }),
    __metadata("design:type", Object)
], Track.prototype, "album", void 0);
__decorate([
    type_graphql_1.Field(() => folder_1.FolderQL),
    orm_1.ManyToOne(() => folder_1.Folder, folder => folder.tracks),
    __metadata("design:type", Object)
], Track.prototype, "folder", void 0);
__decorate([
    type_graphql_1.Field(() => artist_1.ArtistQL, { nullable: true }),
    orm_1.ManyToOne(() => artist_1.Artist, artist => artist.tracks, { nullable: true }),
    __metadata("design:type", Object)
], Track.prototype, "artist", void 0);
__decorate([
    type_graphql_1.Field(() => artist_1.ArtistQL, { nullable: true }),
    orm_1.ManyToOne(() => artist_1.Artist, artist => artist.albumTracks, { nullable: true }),
    __metadata("design:type", Object)
], Track.prototype, "albumArtist", void 0);
__decorate([
    type_graphql_1.Field(() => root_1.RootQL),
    orm_1.ManyToOne(() => root_1.Root, root => root.tracks),
    __metadata("design:type", Object)
], Track.prototype, "root", void 0);
__decorate([
    type_graphql_1.Field(() => [bookmark_1.BookmarkQL]),
    orm_1.OneToMany(() => bookmark_1.Bookmark, bookmark => bookmark.track, { order: [{ orderBy: enums_1.BookmarkOrderFields.default }], onDelete: 'cascade' }),
    __metadata("design:type", orm_1.Collection)
], Track.prototype, "bookmarks", void 0);
__decorate([
    orm_1.OneToMany(() => playqueue_entry_1.PlayQueueEntry, playqueueEntry => playqueueEntry.track),
    __metadata("design:type", orm_1.Collection)
], Track.prototype, "playqueueEntries", void 0);
__decorate([
    orm_1.OneToMany(() => playlist_entry_1.PlaylistEntry, playlistEntry => playlistEntry.track),
    __metadata("design:type", orm_1.Collection)
], Track.prototype, "playlistEntries", void 0);
__decorate([
    type_graphql_1.Field(() => tag_1.TagQL, { nullable: true }),
    orm_1.OneToOne(() => tag_1.Tag, tag => tag.track, { owner: true, nullable: true }),
    __metadata("design:type", orm_1.Reference)
], Track.prototype, "tag", void 0);
Track = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], Track);
exports.Track = Track;
let TrackLyricsQL = class TrackLyricsQL {
};
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], TrackLyricsQL.prototype, "lyrics", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], TrackLyricsQL.prototype, "source", void 0);
TrackLyricsQL = __decorate([
    type_graphql_1.ObjectType()
], TrackLyricsQL);
exports.TrackLyricsQL = TrackLyricsQL;
let TrackQL = class TrackQL extends Track {
};
__decorate([
    type_graphql_1.Field(() => state_1.StateQL),
    __metadata("design:type", state_1.State)
], TrackQL.prototype, "state", void 0);
__decorate([
    type_graphql_1.Field(() => waveform_1.WaveformQL),
    __metadata("design:type", waveform_1.Waveform)
], TrackQL.prototype, "waveform", void 0);
__decorate([
    type_graphql_1.Field(() => tag_1.MediaTagRawQL),
    __metadata("design:type", tag_model_1.MediaTagRaw)
], TrackQL.prototype, "rawTag", void 0);
__decorate([
    type_graphql_1.Field(() => TrackLyricsQL),
    __metadata("design:type", track_model_1.TrackLyrics)
], TrackQL.prototype, "lyrics", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], TrackQL.prototype, "bookmarksCount", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    __metadata("design:type", Date)
], TrackQL.prototype, "fileCreated", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    __metadata("design:type", Date)
], TrackQL.prototype, "fileModified", void 0);
TrackQL = __decorate([
    type_graphql_1.ObjectType()
], TrackQL);
exports.TrackQL = TrackQL;
let TrackHealthHintQL = class TrackHealthHintQL extends health_model_1.TrackHealthHint {
};
TrackHealthHintQL = __decorate([
    type_graphql_1.ObjectType()
], TrackHealthHintQL);
exports.TrackHealthHintQL = TrackHealthHintQL;
let TrackPageQL = class TrackPageQL extends base_1.PaginatedResponse(Track, TrackQL) {
};
TrackPageQL = __decorate([
    type_graphql_1.ObjectType()
], TrackPageQL);
exports.TrackPageQL = TrackPageQL;
let TrackHealth = class TrackHealth {
};
__decorate([
    type_graphql_1.Field(() => TrackQL),
    __metadata("design:type", Track)
], TrackHealth.prototype, "track", void 0);
__decorate([
    type_graphql_1.Field(() => [TrackHealthHintQL]),
    __metadata("design:type", Array)
], TrackHealth.prototype, "health", void 0);
TrackHealth = __decorate([
    type_graphql_1.ObjectType()
], TrackHealth);
exports.TrackHealth = TrackHealth;
//# sourceMappingURL=track.js.map