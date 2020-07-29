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
exports.EpisodePageQL = exports.EpisodeQL = exports.Episode = exports.EpisodeEnclosureQL = exports.EpisodeChapterQL = exports.EpisodeEnclosure = exports.EpisodeChapter = void 0;
const podcast_1 = require("../podcast/podcast");
const tag_1 = require("../tag/tag");
const bookmark_1 = require("../bookmark/bookmark");
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
const state_1 = require("../state/state");
const waveform_1 = require("../waveform/waveform");
const playqueue_entry_1 = require("../playqueueentry/playqueue-entry");
const playlist_entry_1 = require("../playlistentry/playlist-entry");
let EpisodeChapter = class EpisodeChapter {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], EpisodeChapter.prototype, "start", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], EpisodeChapter.prototype, "title", void 0);
EpisodeChapter = __decorate([
    type_graphql_1.ObjectType()
], EpisodeChapter);
exports.EpisodeChapter = EpisodeChapter;
let EpisodeEnclosure = class EpisodeEnclosure {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], EpisodeEnclosure.prototype, "url", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], EpisodeEnclosure.prototype, "type", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    __metadata("design:type", Number)
], EpisodeEnclosure.prototype, "length", void 0);
EpisodeEnclosure = __decorate([
    type_graphql_1.ObjectType()
], EpisodeEnclosure);
exports.EpisodeEnclosure = EpisodeEnclosure;
let EpisodeChapterQL = class EpisodeChapterQL extends EpisodeChapter {
};
EpisodeChapterQL = __decorate([
    type_graphql_1.ObjectType()
], EpisodeChapterQL);
exports.EpisodeChapterQL = EpisodeChapterQL;
let EpisodeEnclosureQL = class EpisodeEnclosureQL extends EpisodeEnclosure {
};
EpisodeEnclosureQL = __decorate([
    type_graphql_1.ObjectType()
], EpisodeEnclosureQL);
exports.EpisodeEnclosureQL = EpisodeEnclosureQL;
let Episode = class Episode extends base_1.Base {
    constructor() {
        super(...arguments);
        this.tag = new orm_1.Reference(this);
        this.podcast = new orm_1.Reference(this);
        this.bookmarks = new orm_1.Collection(this);
        this.playqueueEntries = new orm_1.Collection(this);
        this.playlistEntries = new orm_1.Collection(this);
    }
};
__decorate([
    type_graphql_1.Field(() => String),
    orm_1.Property(() => String),
    __metadata("design:type", String)
], Episode.prototype, "name", void 0);
__decorate([
    type_graphql_1.Field(() => enums_1.PodcastStatus),
    orm_1.Property(() => enums_1.PodcastStatus),
    __metadata("design:type", String)
], Episode.prototype, "status", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Episode.prototype, "fileSize", void 0);
__decorate([
    orm_1.Property(() => orm_1.ORM_TIMESTAMP, { nullable: true }),
    __metadata("design:type", Number)
], Episode.prototype, "statCreated", void 0);
__decorate([
    orm_1.Property(() => orm_1.ORM_TIMESTAMP, { nullable: true }),
    __metadata("design:type", Number)
], Episode.prototype, "statModified", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "error", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "path", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "link", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "summary", void 0);
__decorate([
    orm_1.Property(() => orm_1.ORM_TIMESTAMP),
    __metadata("design:type", Number)
], Episode.prototype, "date", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Episode.prototype, "duration", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "guid", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "author", void 0);
__decorate([
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "chaptersJSON", void 0);
__decorate([
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "enclosuresJSON", void 0);
__decorate([
    type_graphql_1.Field(() => tag_1.TagQL, { nullable: true }),
    orm_1.OneToOne(() => tag_1.Tag, tag => tag.episode, { owner: true, nullable: true }),
    __metadata("design:type", orm_1.Reference)
], Episode.prototype, "tag", void 0);
__decorate([
    type_graphql_1.Field(() => podcast_1.PodcastQL),
    orm_1.ManyToOne(() => podcast_1.Podcast, podcast => podcast.episodes),
    __metadata("design:type", orm_1.Reference)
], Episode.prototype, "podcast", void 0);
__decorate([
    type_graphql_1.Field(() => [bookmark_1.BookmarkQL]),
    orm_1.OneToMany(() => bookmark_1.Bookmark, bookmark => bookmark.episode, { orderBy: { position: orm_1.QueryOrder.ASC } }),
    __metadata("design:type", orm_1.Collection)
], Episode.prototype, "bookmarks", void 0);
__decorate([
    orm_1.OneToMany(() => playqueue_entry_1.PlayQueueEntry, playqueueEntry => playqueueEntry.episode),
    __metadata("design:type", orm_1.Collection)
], Episode.prototype, "playqueueEntries", void 0);
__decorate([
    orm_1.OneToMany(() => playlist_entry_1.PlaylistEntry, playlistEntry => playlistEntry.episode),
    __metadata("design:type", orm_1.Collection)
], Episode.prototype, "playlistEntries", void 0);
Episode = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], Episode);
exports.Episode = Episode;
let EpisodeQL = class EpisodeQL extends Episode {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], EpisodeQL.prototype, "bookmarksCount", void 0);
__decorate([
    type_graphql_1.Field(() => state_1.StateQL),
    __metadata("design:type", state_1.State)
], EpisodeQL.prototype, "state", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], EpisodeQL.prototype, "fileCreated", void 0);
__decorate([
    type_graphql_1.Field(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], EpisodeQL.prototype, "fileModified", void 0);
__decorate([
    type_graphql_1.Field(() => Date),
    __metadata("design:type", Number)
], EpisodeQL.prototype, "date", void 0);
__decorate([
    type_graphql_1.Field(() => [EpisodeChapterQL], { nullable: true }),
    __metadata("design:type", Array)
], EpisodeQL.prototype, "chapters", void 0);
__decorate([
    type_graphql_1.Field(() => [EpisodeEnclosureQL], { nullable: true }),
    __metadata("design:type", Array)
], EpisodeQL.prototype, "enclosures", void 0);
__decorate([
    type_graphql_1.Field(() => waveform_1.WaveformQL),
    __metadata("design:type", waveform_1.Waveform)
], EpisodeQL.prototype, "waveform", void 0);
EpisodeQL = __decorate([
    type_graphql_1.ObjectType()
], EpisodeQL);
exports.EpisodeQL = EpisodeQL;
let EpisodePageQL = class EpisodePageQL extends base_1.PaginatedResponse(Episode, EpisodeQL) {
};
EpisodePageQL = __decorate([
    type_graphql_1.ObjectType()
], EpisodePageQL);
exports.EpisodePageQL = EpisodePageQL;
//# sourceMappingURL=episode.js.map