var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AudioFormatType, TagFormatType } from '../../types/enums.js';
import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Entity, OneToOne, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base } from '../base/base.js';
import { GraphQLJSON } from 'graphql-type-json';
import { Episode } from '../episode/episode.js';
import { Track } from '../track/track.js';
let Tag = class Tag extends Base {
    constructor() {
        super(...arguments);
        this.episode = new Reference(this);
        this.track = new Reference(this);
    }
};
__decorate([
    Field(() => TagFormatType),
    Property(() => TagFormatType),
    __metadata("design:type", String)
], Tag.prototype, "format", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "album", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "albumSort", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "albumArtist", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "albumArtistSort", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "artist", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "artistSort", void 0);
__decorate([
    Field(() => [String], { nullable: true }),
    Property(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], Tag.prototype, "genres", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "disc", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "discTotal", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "title", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "titleSort", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "trackNr", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "trackTotal", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "year", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "nrTagImages", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbTrackID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbAlbumType", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbAlbumArtistID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbArtistID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbReleaseID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbReleaseTrackID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbReleaseGroupID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbRecordingID", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbAlbumStatus", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mbReleaseCountry", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "series", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "seriesNr", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "lyrics", void 0);
__decorate([
    Field(() => [TagChapterQL], { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "chapters", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "mediaDuration", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "mediaBitRate", void 0);
__decorate([
    Field(() => AudioFormatType, { nullable: true }),
    Property(() => AudioFormatType, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mediaFormat", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "mediaSampleRate", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Tag.prototype, "mediaChannels", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mediaEncoded", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mediaMode", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Tag.prototype, "mediaVersion", void 0);
__decorate([
    OneToOne(() => Episode, episode => episode.tag, { nullable: true }),
    __metadata("design:type", Object)
], Tag.prototype, "episode", void 0);
__decorate([
    OneToOne(() => Track, track => track.tag, { nullable: true }),
    __metadata("design:type", Object)
], Tag.prototype, "track", void 0);
Tag = __decorate([
    ObjectType(),
    Entity()
], Tag);
export { Tag };
let TagChapterQL = class TagChapterQL {
};
__decorate([
    Field(() => Float),
    __metadata("design:type", Number)
], TagChapterQL.prototype, "start", void 0);
__decorate([
    Field(() => Float),
    __metadata("design:type", Number)
], TagChapterQL.prototype, "end", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], TagChapterQL.prototype, "title", void 0);
TagChapterQL = __decorate([
    ObjectType()
], TagChapterQL);
export { TagChapterQL };
let TagQL = class TagQL extends Tag {
};
TagQL = __decorate([
    ObjectType()
], TagQL);
export { TagQL };
let MediaTagRawQL = class MediaTagRawQL {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], MediaTagRawQL.prototype, "version", void 0);
__decorate([
    Field(() => GraphQLJSON),
    __metadata("design:type", Object)
], MediaTagRawQL.prototype, "frames", void 0);
MediaTagRawQL = __decorate([
    ObjectType()
], MediaTagRawQL);
export { MediaTagRawQL };
//# sourceMappingURL=tag.js.map