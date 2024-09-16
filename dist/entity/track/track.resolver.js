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
import { Arg, Args, Ctx, FieldResolver, ID, Int, Query, Resolver, Root as GQLRoot } from 'type-graphql';
import { StateQL } from '../state/state.js';
import { DBObjectType } from '../../types/enums.js';
import { WaveformQL } from '../waveform/waveform.js';
import { Track, TrackLyricsQL, TrackPageQL, TrackQL } from './track.js';
import { FolderQL } from '../folder/folder.js';
import { AlbumQL } from '../album/album.js';
import { ArtistQL } from '../artist/artist.js';
import { RootQL } from '../root/root.js';
import { MediaTagRawQL, TagQL } from '../tag/tag.js';
import { SeriesQL } from '../series/series.js';
import { BookmarkQL } from '../bookmark/bookmark.js';
import { TracksArgsQL } from './track.args.js';
import { GenreQL } from '../genre/genre.js';
let TrackResolver = class TrackResolver {
    async track(id, { orm }) {
        return await orm.Track.oneOrFailByID(id);
    }
    async tracks({ page, filter, order, list, seed }, { orm, user }) {
        if (list) {
            return await orm.Track.findListFilter(list, seed, filter, order, page, user);
        }
        return await orm.Track.searchFilter(filter, order, page, user);
    }
    async bookmarks(track) {
        return track.bookmarks.getItems();
    }
    async genres(track) {
        return track.genres.getItems();
    }
    async bookmarksCount(track) {
        return track.bookmarks.count();
    }
    fileCreated(track) {
        return track.statCreated;
    }
    fileModified(track) {
        return track.statModified;
    }
    async folder(track) {
        return track.folder.getOrFail();
    }
    async tag(track) {
        return track.tag.get();
    }
    async album(track) {
        return track.album.get();
    }
    async series(track) {
        return track.series.get();
    }
    async albumArtist(track) {
        return track.albumArtist.get();
    }
    async artist(track) {
        return track.artist.get();
    }
    async root(track) {
        return track.root.getOrFail();
    }
    async waveform(track) {
        return { obj: track, objType: DBObjectType.track };
    }
    async lyrics(track, { engine, orm }) {
        return engine.metadata.lyricsByTrack(orm, track);
    }
    async rawTag(track, { engine }) {
        return (await engine.track.getRawTag(track)) || {};
    }
    async state(track, { orm, user }) {
        return await orm.State.findOrCreate(track.id, DBObjectType.track, user.id);
    }
};
__decorate([
    Query(() => TrackQL),
    __param(0, Arg('id', () => ID)),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "track", null);
__decorate([
    Query(() => TrackPageQL),
    __param(0, Args()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [TracksArgsQL, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "tracks", null);
__decorate([
    FieldResolver(() => [BookmarkQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "bookmarks", null);
__decorate([
    FieldResolver(() => [GenreQL]),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "genres", null);
__decorate([
    FieldResolver(() => Int),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "bookmarksCount", null);
__decorate([
    FieldResolver(() => Date),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Date)
], TrackResolver.prototype, "fileCreated", null);
__decorate([
    FieldResolver(() => Date),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Date)
], TrackResolver.prototype, "fileModified", null);
__decorate([
    FieldResolver(() => FolderQL),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "folder", null);
__decorate([
    FieldResolver(() => TagQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "tag", null);
__decorate([
    FieldResolver(() => AlbumQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "album", null);
__decorate([
    FieldResolver(() => SeriesQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "series", null);
__decorate([
    FieldResolver(() => ArtistQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "albumArtist", null);
__decorate([
    FieldResolver(() => ArtistQL, { nullable: true }),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "artist", null);
__decorate([
    FieldResolver(() => RootQL),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "root", null);
__decorate([
    FieldResolver(() => WaveformQL),
    __param(0, GQLRoot()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "waveform", null);
__decorate([
    FieldResolver(() => TrackLyricsQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "lyrics", null);
__decorate([
    FieldResolver(() => MediaTagRawQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "rawTag", null);
__decorate([
    FieldResolver(() => StateQL),
    __param(0, GQLRoot()),
    __param(1, Ctx()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Track, Object]),
    __metadata("design:returntype", Promise)
], TrackResolver.prototype, "state", null);
TrackResolver = __decorate([
    Resolver(TrackQL)
], TrackResolver);
export { TrackResolver };
//# sourceMappingURL=track.resolver.js.map