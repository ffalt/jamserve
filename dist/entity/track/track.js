var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Root, RootQL } from '../root/root.js';
import { Folder, FolderQL } from '../folder/folder.js';
import { Series, SeriesQL } from '../series/series.js';
import { Album, AlbumQL } from '../album/album.js';
import { Artist, ArtistQL } from '../artist/artist.js';
import { MediaTagRawQL, Tag, TagQL } from '../tag/tag.js';
import { Bookmark, BookmarkQL } from '../bookmark/bookmark.js';
import { Field, Float, Int, ObjectType } from 'type-graphql';
import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, OneToOne, ORM_DATETIME, ORM_INT, Property, Reference } from '../../modules/orm/index.js';
import { Base, PaginatedResponse } from '../base/base.js';
import { State, StateQL } from '../state/state.js';
import { Waveform, WaveformQL } from '../waveform/waveform.js';
import { TrackHealthHint } from '../health/health.model.js';
import { MediaTagRaw } from '../tag/tag.model.js';
import { TrackLyrics } from './track.model.js';
import { PlayQueueEntry } from '../playqueueentry/playqueue-entry.js';
import { PlaylistEntry } from '../playlistentry/playlist-entry.js';
import { BookmarkOrderFields } from '../../types/enums.js';
import { Genre, GenreQL } from '../genre/genre.js';
let Track = class Track extends Base {
    constructor() {
        super(...arguments);
        this.series = new Reference(this);
        this.album = new Reference(this);
        this.folder = new Reference(this);
        this.artist = new Reference(this);
        this.albumArtist = new Reference(this);
        this.genres = new Collection(this);
        this.root = new Reference(this);
        this.bookmarks = new Collection(this);
        this.playqueueEntries = new Collection(this);
        this.playlistEntries = new Collection(this);
        this.tag = new Reference(this);
    }
};
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Track.prototype, "name", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Track.prototype, "fileName", void 0);
__decorate([
    Field(() => String),
    Property(() => String),
    __metadata("design:type", String)
], Track.prototype, "path", void 0);
__decorate([
    Property(() => ORM_DATETIME),
    __metadata("design:type", Date)
], Track.prototype, "statCreated", void 0);
__decorate([
    Property(() => ORM_DATETIME),
    __metadata("design:type", Date)
], Track.prototype, "statModified", void 0);
__decorate([
    Field(() => Float),
    Property(() => ORM_INT),
    __metadata("design:type", Number)
], Track.prototype, "fileSize", void 0);
__decorate([
    Field(() => SeriesQL, { nullable: true }),
    ManyToOne(() => Series, series => series.tracks),
    __metadata("design:type", Object)
], Track.prototype, "series", void 0);
__decorate([
    Field(() => AlbumQL, { nullable: true }),
    ManyToOne(() => Album, album => album.tracks, { nullable: true }),
    __metadata("design:type", Object)
], Track.prototype, "album", void 0);
__decorate([
    Field(() => FolderQL),
    ManyToOne(() => Folder, folder => folder.tracks),
    __metadata("design:type", Object)
], Track.prototype, "folder", void 0);
__decorate([
    Field(() => ArtistQL, { nullable: true }),
    ManyToOne(() => Artist, artist => artist.tracks, { nullable: true }),
    __metadata("design:type", Object)
], Track.prototype, "artist", void 0);
__decorate([
    Field(() => ArtistQL, { nullable: true }),
    ManyToOne(() => Artist, artist => artist.albumTracks, { nullable: true }),
    __metadata("design:type", Object)
], Track.prototype, "albumArtist", void 0);
__decorate([
    Field(() => [GenreQL]),
    ManyToMany(() => Genre, genre => genre.tracks),
    __metadata("design:type", Collection)
], Track.prototype, "genres", void 0);
__decorate([
    Field(() => RootQL),
    ManyToOne(() => Root, root => root.tracks),
    __metadata("design:type", Object)
], Track.prototype, "root", void 0);
__decorate([
    Field(() => [BookmarkQL]),
    OneToMany(() => Bookmark, bookmark => bookmark.track, { order: [{ orderBy: BookmarkOrderFields.default }], onDelete: 'cascade' }),
    __metadata("design:type", Collection)
], Track.prototype, "bookmarks", void 0);
__decorate([
    OneToMany(() => PlayQueueEntry, playqueueEntry => playqueueEntry.track),
    __metadata("design:type", Collection)
], Track.prototype, "playqueueEntries", void 0);
__decorate([
    OneToMany(() => PlaylistEntry, playlistEntry => playlistEntry.track),
    __metadata("design:type", Collection)
], Track.prototype, "playlistEntries", void 0);
__decorate([
    Field(() => TagQL, { nullable: true }),
    OneToOne(() => Tag, tag => tag.track, { owner: true, nullable: true }),
    __metadata("design:type", Reference)
], Track.prototype, "tag", void 0);
Track = __decorate([
    ObjectType(),
    Entity()
], Track);
export { Track };
let TrackLyricsQL = class TrackLyricsQL {
};
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], TrackLyricsQL.prototype, "lyrics", void 0);
__decorate([
    Field(() => String, { nullable: true }),
    __metadata("design:type", String)
], TrackLyricsQL.prototype, "source", void 0);
TrackLyricsQL = __decorate([
    ObjectType()
], TrackLyricsQL);
export { TrackLyricsQL };
let TrackQL = class TrackQL extends Track {
};
__decorate([
    Field(() => StateQL),
    __metadata("design:type", State)
], TrackQL.prototype, "state", void 0);
__decorate([
    Field(() => WaveformQL),
    __metadata("design:type", Waveform)
], TrackQL.prototype, "waveform", void 0);
__decorate([
    Field(() => MediaTagRawQL),
    __metadata("design:type", MediaTagRaw)
], TrackQL.prototype, "rawTag", void 0);
__decorate([
    Field(() => TrackLyricsQL),
    __metadata("design:type", TrackLyrics)
], TrackQL.prototype, "lyrics", void 0);
__decorate([
    Field(() => Int),
    __metadata("design:type", Number)
], TrackQL.prototype, "bookmarksCount", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], TrackQL.prototype, "fileCreated", void 0);
__decorate([
    Field(() => Date),
    __metadata("design:type", Date)
], TrackQL.prototype, "fileModified", void 0);
TrackQL = __decorate([
    ObjectType()
], TrackQL);
export { TrackQL };
let TrackHealthHintQL = class TrackHealthHintQL extends TrackHealthHint {
};
TrackHealthHintQL = __decorate([
    ObjectType()
], TrackHealthHintQL);
export { TrackHealthHintQL };
let TrackPageQL = class TrackPageQL extends PaginatedResponse(Track, TrackQL) {
};
TrackPageQL = __decorate([
    ObjectType()
], TrackPageQL);
export { TrackPageQL };
let TrackHealth = class TrackHealth {
};
__decorate([
    Field(() => TrackQL),
    __metadata("design:type", Track)
], TrackHealth.prototype, "track", void 0);
__decorate([
    Field(() => [TrackHealthHintQL]),
    __metadata("design:type", Array)
], TrackHealth.prototype, "health", void 0);
TrackHealth = __decorate([
    ObjectType()
], TrackHealth);
export { TrackHealth };
//# sourceMappingURL=track.js.map