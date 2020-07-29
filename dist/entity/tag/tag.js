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
exports.MediaTagRawQL = exports.TagQL = exports.TagChapterQL = exports.Tag = void 0;
const enums_1 = require("../../types/enums");
const type_graphql_1 = require("type-graphql");
const orm_1 = require("../../modules/orm");
const base_1 = require("../base/base");
const graphql_type_json_1 = require("graphql-type-json");
const episode_1 = require("../episode/episode");
const track_1 = require("../track/track");
let Tag = class Tag extends base_1.Base {
    constructor() {
        super(...arguments);
        this.episode = new orm_1.Reference(this);
        this.track = new orm_1.Reference(this);
    }
};
__decorate([
    type_graphql_1.Field(() => enums_1.TagFormatType),
    orm_1.Property(() => enums_1.TagFormatType),
    __metadata("design:type", String)
], Tag.prototype, "format", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "album", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "albumSort", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "albumArtist", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "albumArtistSort", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "artist", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "artistSort", void 0);
__decorate([
    type_graphql_1.Field(() => [String], { nullable: true }),
    orm_1.Property(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Tag.prototype, "genres", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "disc", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "discTotal", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "title", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "titleSort", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "trackNr", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "trackTotal", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "year", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "nrTagImages", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbTrackID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbAlbumType", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbAlbumArtistID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbArtistID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbReleaseID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbReleaseTrackID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbReleaseGroupID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbRecordingID", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbAlbumStatus", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbReleaseCountry", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "series", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "seriesNr", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "lyrics", void 0);
__decorate([
    type_graphql_1.Field(() => [TagChapterQL], { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "chapters", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "mediaDuration", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "mediaBitRate", void 0);
__decorate([
    type_graphql_1.Field(() => enums_1.AudioFormatType, { nullable: true }),
    orm_1.Property(() => enums_1.AudioFormatType, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mediaFormat", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "mediaSampleRate", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int, { nullable: true }),
    orm_1.Property(() => orm_1.ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "mediaChannels", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mediaEncoded", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mediaMode", void 0);
__decorate([
    type_graphql_1.Field(() => String, { nullable: true }),
    orm_1.Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mediaVersion", void 0);
__decorate([
    orm_1.OneToOne(() => episode_1.Episode, episode => episode.tag, { nullable: true }),
    __metadata("design:type", Object)
], Tag.prototype, "episode", void 0);
__decorate([
    orm_1.OneToOne(() => track_1.Track, track => track.tag, { nullable: true }),
    __metadata("design:type", Object)
], Tag.prototype, "track", void 0);
Tag = __decorate([
    type_graphql_1.ObjectType(),
    orm_1.Entity()
], Tag);
exports.Tag = Tag;
let TagChapterQL = class TagChapterQL {
};
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], TagChapterQL.prototype, "start", void 0);
__decorate([
    type_graphql_1.Field(() => type_graphql_1.Int),
    __metadata("design:type", Number)
], TagChapterQL.prototype, "end", void 0);
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], TagChapterQL.prototype, "title", void 0);
TagChapterQL = __decorate([
    type_graphql_1.ObjectType()
], TagChapterQL);
exports.TagChapterQL = TagChapterQL;
let TagQL = class TagQL extends Tag {
};
TagQL = __decorate([
    type_graphql_1.ObjectType()
], TagQL);
exports.TagQL = TagQL;
let MediaTagRawQL = class MediaTagRawQL {
};
__decorate([
    type_graphql_1.Field(() => String),
    __metadata("design:type", String)
], MediaTagRawQL.prototype, "version", void 0);
__decorate([
    type_graphql_1.Field(() => graphql_type_json_1.GraphQLJSON),
    __metadata("design:type", Object)
], MediaTagRawQL.prototype, "frames", void 0);
MediaTagRawQL = __decorate([
    type_graphql_1.ObjectType()
], MediaTagRawQL);
exports.MediaTagRawQL = MediaTagRawQL;
//# sourceMappingURL=tag.js.map