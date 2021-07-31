var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Podcast, PodcastQL } from '../podcast/podcast';
import { Tag, TagQL } from '../tag/tag';
import { Bookmark, BookmarkQL } from '../bookmark/bookmark';
import { BookmarkOrderFields, PodcastStatus } from '../../types/enums';
import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, ManyToOne, OneToMany, OneToOne, ORM_DATETIME, ORM_INT, Property, Reference } from '../../modules/orm';
import { Base, PaginatedResponse } from '../base/base';
import { State, StateQL } from '../state/state';
import { Waveform, WaveformQL } from '../waveform/waveform';
import { PlayQueueEntry } from '../playqueueentry/playqueue-entry';
import { PlaylistEntry } from '../playlistentry/playlist-entry';
let EpisodeChapter = class EpisodeChapter {
};
__decorate([
    Field(() => Float),
    __metadata("design:type", Number)
], EpisodeChapter.prototype, "start", void 0);
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], EpisodeChapter.prototype, "title", void 0);
EpisodeChapter = __decorate([
    ObjectType()
], EpisodeChapter);
export { EpisodeChapter };
let EpisodeEnclosure = class EpisodeEnclosure {
};
__decorate([
    Field(() => String),
    __metadata("design:type", String)
], EpisodeEnclosure.prototype, "url", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], EpisodeEnclosure.prototype, "type", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    __metadata("design:type", Number)
], EpisodeEnclosure.prototype, "length", void 0);
EpisodeEnclosure = __decorate([
    ObjectType()
], EpisodeEnclosure);
export { EpisodeEnclosure };
let EpisodeChapterQL = class EpisodeChapterQL extends EpisodeChapter {
};
EpisodeChapterQL = __decorate([
    ObjectType()
], EpisodeChapterQL);
export { EpisodeChapterQL };
let EpisodeEnclosureQL = class EpisodeEnclosureQL extends EpisodeEnclosure {
};
EpisodeEnclosureQL = __decorate([
    ObjectType()
], EpisodeEnclosureQL);
export { EpisodeEnclosureQL };
let Episode = class Episode extends Base {
    constructor() {
        super(...arguments);
        this.tag = new Reference(this);
        this.podcast = new Reference(this);
        this.bookmarks = new Collection(this);
        this.playqueueEntries = new Collection(this);
        this.playlistEntries = new Collection(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Episode.prototype, "name", void 0);
__decorate([
    Field(() => PodcastStatus),
    Property(() => PodcastStatus),
    __metadata("design:type", String)
], Episode.prototype, "status", void 0);
__decorate([
    Field(() => Int, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Episode.prototype, "fileSize", void 0);
__decorate([
    Property(() => ORM_DATETIME, { nullable: true }),
    __metadata("design:type", Date)
], Episode.prototype, "statCreated", void 0);
__decorate([
    Property(() => ORM_DATETIME, { nullable: true }),
    __metadata("design:type", Date)
], Episode.prototype, "statModified", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "error", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "path", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "link", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "summary", void 0);
__decorate([
    Property(() => ORM_DATETIME),
    __metadata("design:type", Date)
], Episode.prototype, "date", void 0);
__decorate([
    Field(() => Float, { nullable: true }),
    Property(() => ORM_INT, { nullable: true }),
    __metadata("design:type", Number)
], Episode.prototype, "duration", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "guid", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "author", void 0);
__decorate([
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "chaptersJSON", void 0);
__decorate([
    Property(() => String, { nullable: true }),
    __metadata("design:type", String)
], Episode.prototype, "enclosuresJSON", void 0);
__decorate([
    Field(() => TagQL, { nullable: true }),
    OneToOne(() => Tag, tag => tag.episode, { owner: true, nullable: true }),
    __metadata("design:type", Reference)
], Episode.prototype, "tag", void 0);
__decorate([
    Field(() => PodcastQL),
    ManyToOne(() => Podcast, podcast => podcast.episodes),
    __metadata("design:type", Reference)
], Episode.prototype, "podcast", void 0);
__decorate([
    Field(() => [BookmarkQL]),
    OneToMany(() => Bookmark, bookmark => bookmark.episode, { order: [{ orderBy: BookmarkOrderFields.default }] }),
    __metadata("design:type", Collection)
], Episode.prototype, "bookmarks", void 0);
__decorate([
    OneToMany(() => PlayQueueEntry, playqueueEntry => playqueueEntry.episode),
    __metadata("design:type", Collection)
], Episode.prototype, "playqueueEntries", void 0);
__decorate([
    OneToMany(() => PlaylistEntry, playlistEntry => playlistEntry.episode),
    __metadata("design:type", Collection)
], Episode.prototype, "playlistEntries", void 0);
Episode = __decorate([
    ObjectType(),
    Entity()
], Episode);
export { Episode };
let EpisodeQL = class EpisodeQL extends Episode {
};
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], EpisodeQL.prototype, "bookmarksCount", void 0);
__decorate([
    Field(() => StateQL),
    __metadata("design:type", State)
], EpisodeQL.prototype, "state", void 0);
__decorate([
    Field(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], EpisodeQL.prototype, "fileCreated", void 0);
__decorate([
    Field(() => Date, { nullable: true }),
    __metadata("design:type", Date)
], EpisodeQL.prototype, "fileModified", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], EpisodeQL.prototype, "date", void 0);
__decorate([
    Field(() => [EpisodeChapterQL], { nullable: true }),
    __metadata("design:type", Array)
], EpisodeQL.prototype, "chapters", void 0);
__decorate([
    Field(() => [EpisodeEnclosureQL], { nullable: true }),
    __metadata("design:type", Array)
], EpisodeQL.prototype, "enclosures", void 0);
__decorate([
    Field(() => WaveformQL),
    __metadata("design:type", Waveform)
], EpisodeQL.prototype, "waveform", void 0);
EpisodeQL = __decorate([
    ObjectType()
], EpisodeQL);
export { EpisodeQL };
let EpisodePageQL = class EpisodePageQL extends PaginatedResponse(Episode, EpisodeQL) {
};
EpisodePageQL = __decorate([
    ObjectType()
], EpisodePageQL);
export { EpisodePageQL };
//# sourceMappingURL=episode.js.map