var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { SubsonicResultType } from '../decorators/SubsonicResultType.js';
import { SubsonicObjField } from '../decorators/SubsonicObjField.js';
export class SubsonicResponse {
}
let SubsonicMusicFolders = class SubsonicMusicFolders {
};
__decorate([
    SubsonicObjField(() => [SubsonicMusicFolder]),
    __metadata("design:type", Array)
], SubsonicMusicFolders.prototype, "musicFolder", void 0);
SubsonicMusicFolders = __decorate([
    SubsonicResultType()
], SubsonicMusicFolders);
export { SubsonicMusicFolders };
let SubsonicMusicFolder = class SubsonicMusicFolder {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicMusicFolder.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicMusicFolder.prototype, "name", void 0);
SubsonicMusicFolder = __decorate([
    SubsonicResultType()
], SubsonicMusicFolder);
export { SubsonicMusicFolder };
let SubsonicIndexes = class SubsonicIndexes {
};
__decorate([
    SubsonicObjField(() => [SubsonicArtist]),
    __metadata("design:type", Array)
], SubsonicIndexes.prototype, "shortcut", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicIndex]),
    __metadata("design:type", Array)
], SubsonicIndexes.prototype, "index", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicIndexes.prototype, "child", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicIndexes.prototype, "lastModified", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicIndexes.prototype, "ignoredArticles", void 0);
SubsonicIndexes = __decorate([
    SubsonicResultType()
], SubsonicIndexes);
export { SubsonicIndexes };
let SubsonicIndex = class SubsonicIndex {
};
__decorate([
    SubsonicObjField(() => [SubsonicArtist]),
    __metadata("design:type", Array)
], SubsonicIndex.prototype, "artist", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicIndex.prototype, "name", void 0);
SubsonicIndex = __decorate([
    SubsonicResultType()
], SubsonicIndex);
export { SubsonicIndex };
let SubsonicArtist = class SubsonicArtist {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtist.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtist.prototype, "name", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtist.prototype, "starred", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicArtist.prototype, "userRating", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicArtist.prototype, "averageRating", void 0);
SubsonicArtist = __decorate([
    SubsonicResultType()
], SubsonicArtist);
export { SubsonicArtist };
let SubsonicGenres = class SubsonicGenres {
};
__decorate([
    SubsonicObjField(() => [SubsonicGenre]),
    __metadata("design:type", Array)
], SubsonicGenres.prototype, "genre", void 0);
SubsonicGenres = __decorate([
    SubsonicResultType()
], SubsonicGenres);
export { SubsonicGenres };
let SubsonicGenre = class SubsonicGenre {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicGenre.prototype, "value", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicGenre.prototype, "songCount", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicGenre.prototype, "albumCount", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicGenre.prototype, "artistCount", void 0);
SubsonicGenre = __decorate([
    SubsonicResultType()
], SubsonicGenre);
export { SubsonicGenre };
let SubsonicArtistsID3 = class SubsonicArtistsID3 {
};
__decorate([
    SubsonicObjField(() => [SubsonicIndexID3]),
    __metadata("design:type", Array)
], SubsonicArtistsID3.prototype, "index", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistsID3.prototype, "ignoredArticles", void 0);
SubsonicArtistsID3 = __decorate([
    SubsonicResultType()
], SubsonicArtistsID3);
export { SubsonicArtistsID3 };
let SubsonicIndexID3 = class SubsonicIndexID3 {
};
__decorate([
    SubsonicObjField(() => [SubsonicArtistID3]),
    __metadata("design:type", Array)
], SubsonicIndexID3.prototype, "artist", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicIndexID3.prototype, "name", void 0);
SubsonicIndexID3 = __decorate([
    SubsonicResultType()
], SubsonicIndexID3);
export { SubsonicIndexID3 };
let SubsonicArtistID3 = class SubsonicArtistID3 {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistID3.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistID3.prototype, "name", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicArtistID3.prototype, "albumCount", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicArtistID3.prototype, "userRating", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistID3.prototype, "coverArt", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistID3.prototype, "starred", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistID3.prototype, "artistImageUrl", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistID3.prototype, "musicBrainzId", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistID3.prototype, "sortName", void 0);
__decorate([
    SubsonicObjField(() => [String]),
    __metadata("design:type", Array)
], SubsonicArtistID3.prototype, "roles", void 0);
SubsonicArtistID3 = __decorate([
    SubsonicResultType()
], SubsonicArtistID3);
export { SubsonicArtistID3 };
let SubsonicArtistWithAlbumsID3 = class SubsonicArtistWithAlbumsID3 extends SubsonicArtistID3 {
};
__decorate([
    SubsonicObjField(() => [SubsonicAlbumID3]),
    __metadata("design:type", Array)
], SubsonicArtistWithAlbumsID3.prototype, "album", void 0);
SubsonicArtistWithAlbumsID3 = __decorate([
    SubsonicResultType()
], SubsonicArtistWithAlbumsID3);
export { SubsonicArtistWithAlbumsID3 };
let SubsonicListDiscTitle = class SubsonicListDiscTitle {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicListDiscTitle.prototype, "disc", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicListDiscTitle.prototype, "title", void 0);
SubsonicListDiscTitle = __decorate([
    SubsonicResultType()
], SubsonicListDiscTitle);
export { SubsonicListDiscTitle };
let SubsonicListDate = class SubsonicListDate {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicListDate.prototype, "year", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicListDate.prototype, "month", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicListDate.prototype, "day", void 0);
SubsonicListDate = __decorate([
    SubsonicResultType()
], SubsonicListDate);
export { SubsonicListDate };
let SubsonicListArtist = class SubsonicListArtist {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicListArtist.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicListArtist.prototype, "name", void 0);
SubsonicListArtist = __decorate([
    SubsonicResultType()
], SubsonicListArtist);
export { SubsonicListArtist };
let SubsonicAlbumID3 = class SubsonicAlbumID3 {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "name", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "artist", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "artistId", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "coverArt", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicAlbumID3.prototype, "songCount", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicAlbumID3.prototype, "duration", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicAlbumID3.prototype, "playCount", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "created", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "starred", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicAlbumID3.prototype, "year", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "genre", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "played", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicAlbumID3.prototype, "userRating", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicListRecordLabel]),
    __metadata("design:type", Array)
], SubsonicAlbumID3.prototype, "recordLabels", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "musicBrainzId", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicListGenre]),
    __metadata("design:type", Array)
], SubsonicAlbumID3.prototype, "genres", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicListArtist]),
    __metadata("design:type", Array)
], SubsonicAlbumID3.prototype, "artists", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "displayArtist", void 0);
__decorate([
    SubsonicObjField(() => [String]),
    __metadata("design:type", Array)
], SubsonicAlbumID3.prototype, "releaseTypes", void 0);
__decorate([
    SubsonicObjField(() => [String]),
    __metadata("design:type", Array)
], SubsonicAlbumID3.prototype, "moods", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumID3.prototype, "sortName", void 0);
__decorate([
    SubsonicObjField(() => SubsonicListDate),
    __metadata("design:type", SubsonicListDate)
], SubsonicAlbumID3.prototype, "originalReleaseDate", void 0);
__decorate([
    SubsonicObjField(() => SubsonicListDate),
    __metadata("design:type", SubsonicListDate)
], SubsonicAlbumID3.prototype, "releaseDate", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicAlbumID3.prototype, "isCompilation", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicListDiscTitle]),
    __metadata("design:type", Array)
], SubsonicAlbumID3.prototype, "discTitles", void 0);
SubsonicAlbumID3 = __decorate([
    SubsonicResultType()
], SubsonicAlbumID3);
export { SubsonicAlbumID3 };
let SubsonicListGenre = class SubsonicListGenre {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicListGenre.prototype, "name", void 0);
SubsonicListGenre = __decorate([
    SubsonicResultType()
], SubsonicListGenre);
export { SubsonicListGenre };
let SubsonicListRecordLabel = class SubsonicListRecordLabel {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicListRecordLabel.prototype, "name", void 0);
SubsonicListRecordLabel = __decorate([
    SubsonicResultType()
], SubsonicListRecordLabel);
export { SubsonicListRecordLabel };
let SubsonicAlbumWithSongsID3 = class SubsonicAlbumWithSongsID3 extends SubsonicAlbumID3 {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicAlbumWithSongsID3.prototype, "song", void 0);
SubsonicAlbumWithSongsID3 = __decorate([
    SubsonicResultType()
], SubsonicAlbumWithSongsID3);
export { SubsonicAlbumWithSongsID3 };
let SubsonicVideos = class SubsonicVideos {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicVideos.prototype, "video", void 0);
SubsonicVideos = __decorate([
    SubsonicResultType()
], SubsonicVideos);
export { SubsonicVideos };
let SubsonicVideoInfo = class SubsonicVideoInfo {
};
__decorate([
    SubsonicObjField(() => [SubsonicCaptions]),
    __metadata("design:type", Array)
], SubsonicVideoInfo.prototype, "captions", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicAudioTrack]),
    __metadata("design:type", Array)
], SubsonicVideoInfo.prototype, "audioTrack", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicVideoConversion]),
    __metadata("design:type", Array)
], SubsonicVideoInfo.prototype, "conversion", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicVideoInfo.prototype, "id", void 0);
SubsonicVideoInfo = __decorate([
    SubsonicResultType()
], SubsonicVideoInfo);
export { SubsonicVideoInfo };
let SubsonicCaptions = class SubsonicCaptions {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicCaptions.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicCaptions.prototype, "name", void 0);
SubsonicCaptions = __decorate([
    SubsonicResultType()
], SubsonicCaptions);
export { SubsonicCaptions };
let SubsonicAudioTrack = class SubsonicAudioTrack {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAudioTrack.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAudioTrack.prototype, "name", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAudioTrack.prototype, "languageCode", void 0);
SubsonicAudioTrack = __decorate([
    SubsonicResultType()
], SubsonicAudioTrack);
export { SubsonicAudioTrack };
let SubsonicVideoConversion = class SubsonicVideoConversion {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicVideoConversion.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicVideoConversion.prototype, "bitRate", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicVideoConversion.prototype, "audioTrackId", void 0);
SubsonicVideoConversion = __decorate([
    SubsonicResultType()
], SubsonicVideoConversion);
export { SubsonicVideoConversion };
let SubsonicDirectory = class SubsonicDirectory {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicDirectory.prototype, "child", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicDirectory.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicDirectory.prototype, "parent", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicDirectory.prototype, "name", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicDirectory.prototype, "starred", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicDirectory.prototype, "userRating", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicDirectory.prototype, "averageRating", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicDirectory.prototype, "playCount", void 0);
SubsonicDirectory = __decorate([
    SubsonicResultType()
], SubsonicDirectory);
export { SubsonicDirectory };
let SubSonicReplayGain = class SubSonicReplayGain {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubSonicReplayGain.prototype, "trackGain", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubSonicReplayGain.prototype, "albumGain", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubSonicReplayGain.prototype, "trackPeak", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubSonicReplayGain.prototype, "albumPeak", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubSonicReplayGain.prototype, "baseGain", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubSonicReplayGain.prototype, "fallbackGain", void 0);
SubSonicReplayGain = __decorate([
    SubsonicResultType()
], SubSonicReplayGain);
export { SubSonicReplayGain };
let SubsonicChild = class SubsonicChild {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "parent", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicChild.prototype, "isDir", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "title", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "album", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "artist", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "track", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "year", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "genre", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "coverArt", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "size", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "contentType", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "suffix", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "transcodedContentType", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "transcodedSuffix", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "duration", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "bitRate", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "path", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicChild.prototype, "isVideo", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "userRating", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "averageRating", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "playCount", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "discNumber", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "created", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "starred", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "albumId", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "artistId", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "type", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "bookmarkPosition", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "originalWidth", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "originalHeight", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "bitDepth", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "samplingRate", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "channelCount", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "mediaType", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "played", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChild.prototype, "bpm", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "comment", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "sortName", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "musicBrainzId", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicListGenre]),
    __metadata("design:type", Array)
], SubsonicChild.prototype, "genres", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicArtistsID3]),
    __metadata("design:type", Array)
], SubsonicChild.prototype, "artists", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicArtistsID3]),
    __metadata("design:type", Array)
], SubsonicChild.prototype, "albumArtists", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicContributor]),
    __metadata("design:type", Array)
], SubsonicChild.prototype, "contributors", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "displayArtist", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "displayAlbumArtist", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChild.prototype, "displayComposer", void 0);
__decorate([
    SubsonicObjField(() => [String]),
    __metadata("design:type", Array)
], SubsonicChild.prototype, "moods", void 0);
__decorate([
    SubsonicObjField(() => SubSonicReplayGain),
    __metadata("design:type", SubSonicReplayGain)
], SubsonicChild.prototype, "replayGain", void 0);
SubsonicChild = __decorate([
    SubsonicResultType()
], SubsonicChild);
export { SubsonicChild };
let SubsonicContributor = class SubsonicContributor {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicContributor.prototype, "role", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicContributor.prototype, "subRole", void 0);
__decorate([
    SubsonicObjField(() => SubsonicArtistID3),
    __metadata("design:type", SubsonicArtistID3)
], SubsonicContributor.prototype, "artist", void 0);
SubsonicContributor = __decorate([
    SubsonicResultType()
], SubsonicContributor);
export { SubsonicContributor };
let SubsonicNowPlaying = class SubsonicNowPlaying {
};
__decorate([
    SubsonicObjField(() => [SubsonicNowPlayingEntry]),
    __metadata("design:type", Array)
], SubsonicNowPlaying.prototype, "entry", void 0);
SubsonicNowPlaying = __decorate([
    SubsonicResultType()
], SubsonicNowPlaying);
export { SubsonicNowPlaying };
let SubsonicNowPlayingEntry = class SubsonicNowPlayingEntry extends SubsonicChild {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicNowPlayingEntry.prototype, "username", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicNowPlayingEntry.prototype, "minutesAgo", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicNowPlayingEntry.prototype, "playerId", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicNowPlayingEntry.prototype, "playerName", void 0);
SubsonicNowPlayingEntry = __decorate([
    SubsonicResultType()
], SubsonicNowPlayingEntry);
export { SubsonicNowPlayingEntry };
let SubsonicSearchResult = class SubsonicSearchResult {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicSearchResult.prototype, "match", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicSearchResult.prototype, "offset", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicSearchResult.prototype, "totalHits", void 0);
SubsonicSearchResult = __decorate([
    SubsonicResultType()
], SubsonicSearchResult);
export { SubsonicSearchResult };
let SubsonicSearchResult2 = class SubsonicSearchResult2 {
};
__decorate([
    SubsonicObjField(() => [SubsonicArtist]),
    __metadata("design:type", Array)
], SubsonicSearchResult2.prototype, "artist", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicSearchResult2.prototype, "album", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicSearchResult2.prototype, "song", void 0);
SubsonicSearchResult2 = __decorate([
    SubsonicResultType()
], SubsonicSearchResult2);
export { SubsonicSearchResult2 };
let SubsonicSearchResult3 = class SubsonicSearchResult3 {
};
__decorate([
    SubsonicObjField(() => [SubsonicArtistID3]),
    __metadata("design:type", Array)
], SubsonicSearchResult3.prototype, "artist", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicAlbumID3]),
    __metadata("design:type", Array)
], SubsonicSearchResult3.prototype, "album", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicSearchResult3.prototype, "song", void 0);
SubsonicSearchResult3 = __decorate([
    SubsonicResultType()
], SubsonicSearchResult3);
export { SubsonicSearchResult3 };
let SubsonicPlaylists = class SubsonicPlaylists {
};
__decorate([
    SubsonicObjField(() => [SubsonicPlaylist]),
    __metadata("design:type", Array)
], SubsonicPlaylists.prototype, "playlist", void 0);
SubsonicPlaylists = __decorate([
    SubsonicResultType()
], SubsonicPlaylists);
export { SubsonicPlaylists };
let SubsonicPlaylist = class SubsonicPlaylist {
};
__decorate([
    SubsonicObjField(() => [String]),
    __metadata("design:type", Array)
], SubsonicPlaylist.prototype, "allowedUser", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlaylist.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlaylist.prototype, "name", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlaylist.prototype, "comment", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlaylist.prototype, "owner", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicPlaylist.prototype, "public", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicPlaylist.prototype, "songCount", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicPlaylist.prototype, "duration", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlaylist.prototype, "created", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlaylist.prototype, "changed", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlaylist.prototype, "coverArt", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlaylist.prototype, "starred", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicPlaylist.prototype, "userRating", void 0);
SubsonicPlaylist = __decorate([
    SubsonicResultType()
], SubsonicPlaylist);
export { SubsonicPlaylist };
let SubsonicPlaylistWithSongs = class SubsonicPlaylistWithSongs extends SubsonicPlaylist {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicPlaylistWithSongs.prototype, "entry", void 0);
SubsonicPlaylistWithSongs = __decorate([
    SubsonicResultType()
], SubsonicPlaylistWithSongs);
export { SubsonicPlaylistWithSongs };
let SubsonicJukeboxStatus = class SubsonicJukeboxStatus {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicJukeboxStatus.prototype, "currentIndex", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicJukeboxStatus.prototype, "playing", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicJukeboxStatus.prototype, "gain", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicJukeboxStatus.prototype, "position", void 0);
SubsonicJukeboxStatus = __decorate([
    SubsonicResultType()
], SubsonicJukeboxStatus);
export { SubsonicJukeboxStatus };
let SubsonicJukeboxPlaylist = class SubsonicJukeboxPlaylist extends SubsonicJukeboxStatus {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicJukeboxPlaylist.prototype, "entry", void 0);
SubsonicJukeboxPlaylist = __decorate([
    SubsonicResultType()
], SubsonicJukeboxPlaylist);
export { SubsonicJukeboxPlaylist };
let SubsonicChatMessages = class SubsonicChatMessages {
};
__decorate([
    SubsonicObjField(() => [SubsonicChatMessage]),
    __metadata("design:type", Array)
], SubsonicChatMessages.prototype, "chatMessage", void 0);
SubsonicChatMessages = __decorate([
    SubsonicResultType()
], SubsonicChatMessages);
export { SubsonicChatMessages };
let SubsonicChatMessage = class SubsonicChatMessage {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChatMessage.prototype, "username", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicChatMessage.prototype, "time", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicChatMessage.prototype, "message", void 0);
SubsonicChatMessage = __decorate([
    SubsonicResultType()
], SubsonicChatMessage);
export { SubsonicChatMessage };
let SubsonicAlbumList = class SubsonicAlbumList {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicAlbumList.prototype, "album", void 0);
SubsonicAlbumList = __decorate([
    SubsonicResultType()
], SubsonicAlbumList);
export { SubsonicAlbumList };
let SubsonicAlbumList2 = class SubsonicAlbumList2 {
};
__decorate([
    SubsonicObjField(() => [SubsonicAlbumID3]),
    __metadata("design:type", Array)
], SubsonicAlbumList2.prototype, "album", void 0);
SubsonicAlbumList2 = __decorate([
    SubsonicResultType()
], SubsonicAlbumList2);
export { SubsonicAlbumList2 };
let SubsonicSongs = class SubsonicSongs {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicSongs.prototype, "song", void 0);
SubsonicSongs = __decorate([
    SubsonicResultType()
], SubsonicSongs);
export { SubsonicSongs };
let SubsonicLyrics = class SubsonicLyrics {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicLyrics.prototype, "value", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicLyrics.prototype, "artist", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicLyrics.prototype, "title", void 0);
SubsonicLyrics = __decorate([
    SubsonicResultType()
], SubsonicLyrics);
export { SubsonicLyrics };
let SubsonicLyricsLine = class SubsonicLyricsLine {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicLyricsLine.prototype, "value", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicLyricsLine.prototype, "start", void 0);
SubsonicLyricsLine = __decorate([
    SubsonicResultType()
], SubsonicLyricsLine);
export { SubsonicLyricsLine };
let SubsonicStructuredLyrics = class SubsonicStructuredLyrics {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicStructuredLyrics.prototype, "lang", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicStructuredLyrics.prototype, "synced", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicLyricsLine]),
    __metadata("design:type", Array)
], SubsonicStructuredLyrics.prototype, "line", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicStructuredLyrics.prototype, "displayArtist", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicStructuredLyrics.prototype, "displayTitle", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicStructuredLyrics.prototype, "offset", void 0);
SubsonicStructuredLyrics = __decorate([
    SubsonicResultType()
], SubsonicStructuredLyrics);
export { SubsonicStructuredLyrics };
let SubsonicPodcasts = class SubsonicPodcasts {
};
__decorate([
    SubsonicObjField(() => [SubsonicPodcastChannel]),
    __metadata("design:type", Array)
], SubsonicPodcasts.prototype, "channel", void 0);
SubsonicPodcasts = __decorate([
    SubsonicResultType()
], SubsonicPodcasts);
export { SubsonicPodcasts };
let SubsonicPodcastChannel = class SubsonicPodcastChannel {
};
__decorate([
    SubsonicObjField(() => [SubsonicPodcastEpisode]),
    __metadata("design:type", Array)
], SubsonicPodcastChannel.prototype, "episode", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastChannel.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastChannel.prototype, "url", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastChannel.prototype, "title", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastChannel.prototype, "description", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastChannel.prototype, "coverArt", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastChannel.prototype, "originalImageUrl", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastChannel.prototype, "status", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastChannel.prototype, "errorMessage", void 0);
SubsonicPodcastChannel = __decorate([
    SubsonicResultType()
], SubsonicPodcastChannel);
export { SubsonicPodcastChannel };
let SubsonicNewestPodcasts = class SubsonicNewestPodcasts {
};
__decorate([
    SubsonicObjField(() => [SubsonicPodcastEpisode]),
    __metadata("design:type", Array)
], SubsonicNewestPodcasts.prototype, "episode", void 0);
SubsonicNewestPodcasts = __decorate([
    SubsonicResultType()
], SubsonicNewestPodcasts);
export { SubsonicNewestPodcasts };
let SubsonicPodcastEpisode = class SubsonicPodcastEpisode extends SubsonicChild {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastEpisode.prototype, "streamId", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastEpisode.prototype, "channelId", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastEpisode.prototype, "description", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastEpisode.prototype, "status", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPodcastEpisode.prototype, "publishDate", void 0);
SubsonicPodcastEpisode = __decorate([
    SubsonicResultType()
], SubsonicPodcastEpisode);
export { SubsonicPodcastEpisode };
let SubsonicInternetRadioStations = class SubsonicInternetRadioStations {
};
__decorate([
    SubsonicObjField(() => [SubsonicInternetRadioStation]),
    __metadata("design:type", Array)
], SubsonicInternetRadioStations.prototype, "internetRadioStation", void 0);
SubsonicInternetRadioStations = __decorate([
    SubsonicResultType()
], SubsonicInternetRadioStations);
export { SubsonicInternetRadioStations };
let SubsonicInternetRadioStation = class SubsonicInternetRadioStation {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicInternetRadioStation.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicInternetRadioStation.prototype, "name", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicInternetRadioStation.prototype, "streamUrl", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicInternetRadioStation.prototype, "homePageUrl", void 0);
SubsonicInternetRadioStation = __decorate([
    SubsonicResultType()
], SubsonicInternetRadioStation);
export { SubsonicInternetRadioStation };
let SubsonicBookmarks = class SubsonicBookmarks {
};
__decorate([
    SubsonicObjField(() => [SubsonicBookmark]),
    __metadata("design:type", Array)
], SubsonicBookmarks.prototype, "bookmark", void 0);
SubsonicBookmarks = __decorate([
    SubsonicResultType()
], SubsonicBookmarks);
export { SubsonicBookmarks };
let SubsonicBookmark = class SubsonicBookmark {
};
__decorate([
    SubsonicObjField(() => SubsonicChild),
    __metadata("design:type", SubsonicChild)
], SubsonicBookmark.prototype, "entry", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicBookmark.prototype, "position", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicBookmark.prototype, "username", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicBookmark.prototype, "comment", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicBookmark.prototype, "created", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicBookmark.prototype, "changed", void 0);
SubsonicBookmark = __decorate([
    SubsonicResultType()
], SubsonicBookmark);
export { SubsonicBookmark };
let SubsonicPlayQueue = class SubsonicPlayQueue {
};
__decorate([
    SubsonicObjField(() => SubsonicChild),
    __metadata("design:type", Array)
], SubsonicPlayQueue.prototype, "entry", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicPlayQueue.prototype, "current", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicPlayQueue.prototype, "position", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlayQueue.prototype, "username", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlayQueue.prototype, "changed", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicPlayQueue.prototype, "changedBy", void 0);
SubsonicPlayQueue = __decorate([
    SubsonicResultType()
], SubsonicPlayQueue);
export { SubsonicPlayQueue };
let SubsonicShares = class SubsonicShares {
};
__decorate([
    SubsonicObjField(() => [SubsonicShare]),
    __metadata("design:type", Array)
], SubsonicShares.prototype, "share", void 0);
SubsonicShares = __decorate([
    SubsonicResultType()
], SubsonicShares);
export { SubsonicShares };
let SubsonicShare = class SubsonicShare {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicShare.prototype, "entry", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicShare.prototype, "id", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicShare.prototype, "url", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicShare.prototype, "description", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicShare.prototype, "username", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicShare.prototype, "created", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicShare.prototype, "expires", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicShare.prototype, "lastVisited", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicShare.prototype, "visitCount", void 0);
SubsonicShare = __decorate([
    SubsonicResultType()
], SubsonicShare);
export { SubsonicShare };
let SubsonicStarred = class SubsonicStarred {
};
__decorate([
    SubsonicObjField(() => [SubsonicArtist]),
    __metadata("design:type", Array)
], SubsonicStarred.prototype, "artist", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicStarred.prototype, "album", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicStarred.prototype, "song", void 0);
SubsonicStarred = __decorate([
    SubsonicResultType()
], SubsonicStarred);
export { SubsonicStarred };
let SubsonicAlbumInfo = class SubsonicAlbumInfo {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumInfo.prototype, "notes", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumInfo.prototype, "musicBrainzId", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumInfo.prototype, "lastFmUrl", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumInfo.prototype, "smallImageUrl", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumInfo.prototype, "mediumImageUrl", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicAlbumInfo.prototype, "largeImageUrl", void 0);
SubsonicAlbumInfo = __decorate([
    SubsonicResultType()
], SubsonicAlbumInfo);
export { SubsonicAlbumInfo };
let SubsonicArtistInfoBase = class SubsonicArtistInfoBase {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistInfoBase.prototype, "biography", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistInfoBase.prototype, "musicBrainzId", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistInfoBase.prototype, "lastFmUrl", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistInfoBase.prototype, "smallImageUrl", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistInfoBase.prototype, "mediumImageUrl", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicArtistInfoBase.prototype, "largeImageUrl", void 0);
SubsonicArtistInfoBase = __decorate([
    SubsonicResultType()
], SubsonicArtistInfoBase);
export { SubsonicArtistInfoBase };
let SubsonicArtistInfo = class SubsonicArtistInfo extends SubsonicArtistInfoBase {
};
__decorate([
    SubsonicObjField(() => [SubsonicArtist]),
    __metadata("design:type", Array)
], SubsonicArtistInfo.prototype, "similarArtist", void 0);
SubsonicArtistInfo = __decorate([
    SubsonicResultType()
], SubsonicArtistInfo);
export { SubsonicArtistInfo };
let SubsonicArtistInfo2 = class SubsonicArtistInfo2 extends SubsonicArtistInfoBase {
};
__decorate([
    SubsonicObjField(() => [SubsonicArtistID3]),
    __metadata("design:type", Array)
], SubsonicArtistInfo2.prototype, "similarArtist", void 0);
SubsonicArtistInfo2 = __decorate([
    SubsonicResultType()
], SubsonicArtistInfo2);
export { SubsonicArtistInfo2 };
let SubsonicSimilarSongs = class SubsonicSimilarSongs {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicSimilarSongs.prototype, "song", void 0);
SubsonicSimilarSongs = __decorate([
    SubsonicResultType()
], SubsonicSimilarSongs);
export { SubsonicSimilarSongs };
let SubsonicSimilarSongs2 = class SubsonicSimilarSongs2 {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicSimilarSongs2.prototype, "song", void 0);
SubsonicSimilarSongs2 = __decorate([
    SubsonicResultType()
], SubsonicSimilarSongs2);
export { SubsonicSimilarSongs2 };
let SubsonicTopSongs = class SubsonicTopSongs {
};
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicTopSongs.prototype, "song", void 0);
SubsonicTopSongs = __decorate([
    SubsonicResultType()
], SubsonicTopSongs);
export { SubsonicTopSongs };
let SubsonicStarred2 = class SubsonicStarred2 {
};
__decorate([
    SubsonicObjField(() => [SubsonicArtistID3]),
    __metadata("design:type", Array)
], SubsonicStarred2.prototype, "artist", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicAlbumID3]),
    __metadata("design:type", Array)
], SubsonicStarred2.prototype, "album", void 0);
__decorate([
    SubsonicObjField(() => [SubsonicChild]),
    __metadata("design:type", Array)
], SubsonicStarred2.prototype, "song", void 0);
SubsonicStarred2 = __decorate([
    SubsonicResultType()
], SubsonicStarred2);
export { SubsonicStarred2 };
let SubsonicLicense = class SubsonicLicense {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicLicense.prototype, "valid", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicLicense.prototype, "email", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicLicense.prototype, "licenseExpires", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicLicense.prototype, "trialExpires", void 0);
SubsonicLicense = __decorate([
    SubsonicResultType()
], SubsonicLicense);
export { SubsonicLicense };
let SubsonicScanStatus = class SubsonicScanStatus {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicScanStatus.prototype, "scanning", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicScanStatus.prototype, "count", void 0);
SubsonicScanStatus = __decorate([
    SubsonicResultType()
], SubsonicScanStatus);
export { SubsonicScanStatus };
let SubsonicUsers = class SubsonicUsers {
};
__decorate([
    SubsonicObjField(() => [SubsonicUser]),
    __metadata("design:type", Array)
], SubsonicUsers.prototype, "user", void 0);
SubsonicUsers = __decorate([
    SubsonicResultType()
], SubsonicUsers);
export { SubsonicUsers };
let SubsonicUser = class SubsonicUser {
};
__decorate([
    SubsonicObjField(() => [String]),
    __metadata("design:type", Array)
], SubsonicUser.prototype, "folder", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicUser.prototype, "username", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicUser.prototype, "email", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "scrobblingEnabled", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicUser.prototype, "maxBitRate", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "adminRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "settingsRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "downloadRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "uploadRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "playlistRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "coverArtRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "commentRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "podcastRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "streamRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "jukeboxRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "shareRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Boolean)
], SubsonicUser.prototype, "videoConversionRole", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicUser.prototype, "avatarLastChanged", void 0);
SubsonicUser = __decorate([
    SubsonicResultType()
], SubsonicUser);
export { SubsonicUser };
let SubsonicError = class SubsonicError {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", Number)
], SubsonicError.prototype, "code", void 0);
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicError.prototype, "message", void 0);
SubsonicError = __decorate([
    SubsonicResultType()
], SubsonicError);
export { SubsonicError };
let SubsonicResponseBookmarks = class SubsonicResponseBookmarks {
};
__decorate([
    SubsonicObjField(() => SubsonicBookmarks),
    __metadata("design:type", SubsonicBookmarks)
], SubsonicResponseBookmarks.prototype, "bookmarks", void 0);
SubsonicResponseBookmarks = __decorate([
    SubsonicResultType()
], SubsonicResponseBookmarks);
export { SubsonicResponseBookmarks };
let SubsonicResponsePlayQueue = class SubsonicResponsePlayQueue {
};
__decorate([
    SubsonicObjField(() => SubsonicPlayQueue),
    __metadata("design:type", SubsonicPlayQueue)
], SubsonicResponsePlayQueue.prototype, "playQueue", void 0);
SubsonicResponsePlayQueue = __decorate([
    SubsonicResultType()
], SubsonicResponsePlayQueue);
export { SubsonicResponsePlayQueue };
let SubsonicResponseArtistWithAlbumsID3 = class SubsonicResponseArtistWithAlbumsID3 {
};
__decorate([
    SubsonicObjField(() => SubsonicArtistWithAlbumsID3),
    __metadata("design:type", SubsonicArtistWithAlbumsID3)
], SubsonicResponseArtistWithAlbumsID3.prototype, "artist", void 0);
SubsonicResponseArtistWithAlbumsID3 = __decorate([
    SubsonicResultType()
], SubsonicResponseArtistWithAlbumsID3);
export { SubsonicResponseArtistWithAlbumsID3 };
let SubsonicResponseAlbumWithSongsID3 = class SubsonicResponseAlbumWithSongsID3 {
};
__decorate([
    SubsonicObjField(() => SubsonicAlbumWithSongsID3),
    __metadata("design:type", SubsonicAlbumWithSongsID3)
], SubsonicResponseAlbumWithSongsID3.prototype, "album", void 0);
SubsonicResponseAlbumWithSongsID3 = __decorate([
    SubsonicResultType()
], SubsonicResponseAlbumWithSongsID3);
export { SubsonicResponseAlbumWithSongsID3 };
let SubsonicResponseArtistInfo = class SubsonicResponseArtistInfo {
};
__decorate([
    SubsonicObjField(() => SubsonicArtistInfo),
    __metadata("design:type", SubsonicArtistInfo)
], SubsonicResponseArtistInfo.prototype, "artistInfo", void 0);
SubsonicResponseArtistInfo = __decorate([
    SubsonicResultType()
], SubsonicResponseArtistInfo);
export { SubsonicResponseArtistInfo };
let SubsonicResponseArtistInfo2 = class SubsonicResponseArtistInfo2 {
};
__decorate([
    SubsonicObjField(() => SubsonicArtistInfo2),
    __metadata("design:type", SubsonicArtistInfo2)
], SubsonicResponseArtistInfo2.prototype, "artistInfo2", void 0);
SubsonicResponseArtistInfo2 = __decorate([
    SubsonicResultType()
], SubsonicResponseArtistInfo2);
export { SubsonicResponseArtistInfo2 };
let SubsonicResponseAlbumInfo = class SubsonicResponseAlbumInfo {
};
__decorate([
    SubsonicObjField(() => SubsonicAlbumInfo),
    __metadata("design:type", SubsonicAlbumInfo)
], SubsonicResponseAlbumInfo.prototype, "albumInfo", void 0);
SubsonicResponseAlbumInfo = __decorate([
    SubsonicResultType()
], SubsonicResponseAlbumInfo);
export { SubsonicResponseAlbumInfo };
let SubsonicResponseIndexes = class SubsonicResponseIndexes {
};
__decorate([
    SubsonicObjField(() => SubsonicIndexes),
    __metadata("design:type", SubsonicIndexes)
], SubsonicResponseIndexes.prototype, "indexes", void 0);
SubsonicResponseIndexes = __decorate([
    SubsonicResultType()
], SubsonicResponseIndexes);
export { SubsonicResponseIndexes };
let SubsonicResponseArtistsID3 = class SubsonicResponseArtistsID3 {
};
__decorate([
    SubsonicObjField(() => SubsonicArtistsID3),
    __metadata("design:type", SubsonicArtistsID3)
], SubsonicResponseArtistsID3.prototype, "artists", void 0);
SubsonicResponseArtistsID3 = __decorate([
    SubsonicResultType()
], SubsonicResponseArtistsID3);
export { SubsonicResponseArtistsID3 };
let SubsonicResponseDirectory = class SubsonicResponseDirectory {
};
__decorate([
    SubsonicObjField(() => SubsonicDirectory),
    __metadata("design:type", SubsonicDirectory)
], SubsonicResponseDirectory.prototype, "directory", void 0);
SubsonicResponseDirectory = __decorate([
    SubsonicResultType()
], SubsonicResponseDirectory);
export { SubsonicResponseDirectory };
let SubsonicResponseGenres = class SubsonicResponseGenres {
};
__decorate([
    SubsonicObjField(() => SubsonicGenres),
    __metadata("design:type", SubsonicGenres)
], SubsonicResponseGenres.prototype, "genres", void 0);
SubsonicResponseGenres = __decorate([
    SubsonicResultType()
], SubsonicResponseGenres);
export { SubsonicResponseGenres };
let SubsonicResponseMusicFolders = class SubsonicResponseMusicFolders {
};
__decorate([
    SubsonicObjField(() => SubsonicMusicFolders),
    __metadata("design:type", SubsonicMusicFolders)
], SubsonicResponseMusicFolders.prototype, "musicFolders", void 0);
SubsonicResponseMusicFolders = __decorate([
    SubsonicResultType()
], SubsonicResponseMusicFolders);
export { SubsonicResponseMusicFolders };
let SubsonicResponseSimilarSongs = class SubsonicResponseSimilarSongs {
};
__decorate([
    SubsonicObjField(() => SubsonicSimilarSongs),
    __metadata("design:type", SubsonicSimilarSongs)
], SubsonicResponseSimilarSongs.prototype, "similarSongs", void 0);
SubsonicResponseSimilarSongs = __decorate([
    SubsonicResultType()
], SubsonicResponseSimilarSongs);
export { SubsonicResponseSimilarSongs };
let SubsonicResponseSimilarSongs2 = class SubsonicResponseSimilarSongs2 {
};
__decorate([
    SubsonicObjField(() => SubsonicSimilarSongs2),
    __metadata("design:type", SubsonicSimilarSongs2)
], SubsonicResponseSimilarSongs2.prototype, "similarSongs2", void 0);
SubsonicResponseSimilarSongs2 = __decorate([
    SubsonicResultType()
], SubsonicResponseSimilarSongs2);
export { SubsonicResponseSimilarSongs2 };
let SubsonicResponseSong = class SubsonicResponseSong {
};
__decorate([
    SubsonicObjField(() => SubsonicChild),
    __metadata("design:type", SubsonicChild)
], SubsonicResponseSong.prototype, "song", void 0);
SubsonicResponseSong = __decorate([
    SubsonicResultType()
], SubsonicResponseSong);
export { SubsonicResponseSong };
let SubsonicResponseTopSongs = class SubsonicResponseTopSongs {
};
__decorate([
    SubsonicObjField(() => SubsonicTopSongs),
    __metadata("design:type", SubsonicTopSongs)
], SubsonicResponseTopSongs.prototype, "topSongs", void 0);
SubsonicResponseTopSongs = __decorate([
    SubsonicResultType()
], SubsonicResponseTopSongs);
export { SubsonicResponseTopSongs };
let SubsonicResponseVideos = class SubsonicResponseVideos {
};
__decorate([
    SubsonicObjField(() => SubsonicVideos),
    __metadata("design:type", SubsonicVideos)
], SubsonicResponseVideos.prototype, "videos", void 0);
SubsonicResponseVideos = __decorate([
    SubsonicResultType()
], SubsonicResponseVideos);
export { SubsonicResponseVideos };
let SubsonicResponseVideoInfo = class SubsonicResponseVideoInfo {
};
__decorate([
    SubsonicObjField(() => SubsonicVideoInfo),
    __metadata("design:type", SubsonicVideoInfo)
], SubsonicResponseVideoInfo.prototype, "videoInfo", void 0);
SubsonicResponseVideoInfo = __decorate([
    SubsonicResultType()
], SubsonicResponseVideoInfo);
export { SubsonicResponseVideoInfo };
let SubsonicResponseChatMessages = class SubsonicResponseChatMessages {
};
__decorate([
    SubsonicObjField(() => SubsonicChatMessages),
    __metadata("design:type", SubsonicChatMessages)
], SubsonicResponseChatMessages.prototype, "chatMessages", void 0);
SubsonicResponseChatMessages = __decorate([
    SubsonicResultType()
], SubsonicResponseChatMessages);
export { SubsonicResponseChatMessages };
let SubsonicResponseInternetRadioStations = class SubsonicResponseInternetRadioStations {
};
__decorate([
    SubsonicObjField(() => SubsonicInternetRadioStations),
    __metadata("design:type", SubsonicInternetRadioStations)
], SubsonicResponseInternetRadioStations.prototype, "internetRadioStations", void 0);
SubsonicResponseInternetRadioStations = __decorate([
    SubsonicResultType()
], SubsonicResponseInternetRadioStations);
export { SubsonicResponseInternetRadioStations };
let SubsonicResponseScanStatus = class SubsonicResponseScanStatus {
};
__decorate([
    SubsonicObjField(() => SubsonicScanStatus),
    __metadata("design:type", SubsonicScanStatus)
], SubsonicResponseScanStatus.prototype, "scanStatus", void 0);
SubsonicResponseScanStatus = __decorate([
    SubsonicResultType()
], SubsonicResponseScanStatus);
export { SubsonicResponseScanStatus };
let SubsonicResponseRandomSongs = class SubsonicResponseRandomSongs {
};
__decorate([
    SubsonicObjField(() => SubsonicSongs),
    __metadata("design:type", SubsonicSongs)
], SubsonicResponseRandomSongs.prototype, "randomSongs", void 0);
SubsonicResponseRandomSongs = __decorate([
    SubsonicResultType()
], SubsonicResponseRandomSongs);
export { SubsonicResponseRandomSongs };
let SubsonicResponseNowPlaying = class SubsonicResponseNowPlaying {
};
__decorate([
    SubsonicObjField(() => SubsonicNowPlaying),
    __metadata("design:type", SubsonicNowPlaying)
], SubsonicResponseNowPlaying.prototype, "nowPlaying", void 0);
SubsonicResponseNowPlaying = __decorate([
    SubsonicResultType()
], SubsonicResponseNowPlaying);
export { SubsonicResponseNowPlaying };
let SubsonicResponseAlbumList = class SubsonicResponseAlbumList {
};
__decorate([
    SubsonicObjField(() => SubsonicAlbumList),
    __metadata("design:type", SubsonicAlbumList)
], SubsonicResponseAlbumList.prototype, "albumList", void 0);
SubsonicResponseAlbumList = __decorate([
    SubsonicResultType()
], SubsonicResponseAlbumList);
export { SubsonicResponseAlbumList };
let SubsonicResponseAlbumList2 = class SubsonicResponseAlbumList2 {
};
__decorate([
    SubsonicObjField(() => SubsonicAlbumList2),
    __metadata("design:type", SubsonicAlbumList2)
], SubsonicResponseAlbumList2.prototype, "albumList2", void 0);
SubsonicResponseAlbumList2 = __decorate([
    SubsonicResultType()
], SubsonicResponseAlbumList2);
export { SubsonicResponseAlbumList2 };
let SubsonicResponseSongsByGenre = class SubsonicResponseSongsByGenre {
};
__decorate([
    SubsonicObjField(() => SubsonicSongs),
    __metadata("design:type", SubsonicSongs)
], SubsonicResponseSongsByGenre.prototype, "songsByGenre", void 0);
SubsonicResponseSongsByGenre = __decorate([
    SubsonicResultType()
], SubsonicResponseSongsByGenre);
export { SubsonicResponseSongsByGenre };
let SubsonicResponseStarred = class SubsonicResponseStarred {
};
__decorate([
    SubsonicObjField(() => SubsonicStarred),
    __metadata("design:type", SubsonicStarred)
], SubsonicResponseStarred.prototype, "starred", void 0);
SubsonicResponseStarred = __decorate([
    SubsonicResultType()
], SubsonicResponseStarred);
export { SubsonicResponseStarred };
let SubsonicResponseStarred2 = class SubsonicResponseStarred2 {
};
__decorate([
    SubsonicObjField(() => SubsonicStarred2),
    __metadata("design:type", SubsonicStarred2)
], SubsonicResponseStarred2.prototype, "starred2", void 0);
SubsonicResponseStarred2 = __decorate([
    SubsonicResultType()
], SubsonicResponseStarred2);
export { SubsonicResponseStarred2 };
let SubsonicResponseLyrics = class SubsonicResponseLyrics {
};
__decorate([
    SubsonicObjField(() => SubsonicLyrics),
    __metadata("design:type", SubsonicLyrics)
], SubsonicResponseLyrics.prototype, "lyrics", void 0);
SubsonicResponseLyrics = __decorate([
    SubsonicResultType()
], SubsonicResponseLyrics);
export { SubsonicResponseLyrics };
let SubsonicStructuredLyricsList = class SubsonicStructuredLyricsList {
};
__decorate([
    SubsonicObjField(() => SubsonicStructuredLyrics),
    __metadata("design:type", Array)
], SubsonicStructuredLyricsList.prototype, "structuredLyrics", void 0);
SubsonicStructuredLyricsList = __decorate([
    SubsonicResultType()
], SubsonicStructuredLyricsList);
export { SubsonicStructuredLyricsList };
let SubsonicResponseLyricsList = class SubsonicResponseLyricsList {
};
__decorate([
    SubsonicObjField(() => SubsonicStructuredLyricsList),
    __metadata("design:type", SubsonicStructuredLyricsList)
], SubsonicResponseLyricsList.prototype, "lyricsList", void 0);
SubsonicResponseLyricsList = __decorate([
    SubsonicResultType()
], SubsonicResponseLyricsList);
export { SubsonicResponseLyricsList };
let SubsonicResponsePlaylistWithSongs = class SubsonicResponsePlaylistWithSongs {
};
__decorate([
    SubsonicObjField(() => SubsonicPlaylistWithSongs),
    __metadata("design:type", SubsonicPlaylistWithSongs)
], SubsonicResponsePlaylistWithSongs.prototype, "playlist", void 0);
SubsonicResponsePlaylistWithSongs = __decorate([
    SubsonicResultType()
], SubsonicResponsePlaylistWithSongs);
export { SubsonicResponsePlaylistWithSongs };
let SubsonicResponsePlaylists = class SubsonicResponsePlaylists {
};
__decorate([
    SubsonicObjField(() => SubsonicPlaylists),
    __metadata("design:type", SubsonicPlaylists)
], SubsonicResponsePlaylists.prototype, "playlists", void 0);
SubsonicResponsePlaylists = __decorate([
    SubsonicResultType()
], SubsonicResponsePlaylists);
export { SubsonicResponsePlaylists };
let SubsonicResponsePlaylist = class SubsonicResponsePlaylist {
};
__decorate([
    SubsonicObjField(() => SubsonicPlaylist),
    __metadata("design:type", SubsonicPlaylist)
], SubsonicResponsePlaylist.prototype, "playlist", void 0);
SubsonicResponsePlaylist = __decorate([
    SubsonicResultType()
], SubsonicResponsePlaylist);
export { SubsonicResponsePlaylist };
let SubsonicResponsePodcasts = class SubsonicResponsePodcasts {
};
__decorate([
    SubsonicObjField(() => SubsonicPodcasts),
    __metadata("design:type", SubsonicPodcasts)
], SubsonicResponsePodcasts.prototype, "podcasts", void 0);
SubsonicResponsePodcasts = __decorate([
    SubsonicResultType()
], SubsonicResponsePodcasts);
export { SubsonicResponsePodcasts };
let SubsonicResponseNewestPodcasts = class SubsonicResponseNewestPodcasts {
};
__decorate([
    SubsonicObjField(() => SubsonicNewestPodcasts),
    __metadata("design:type", SubsonicNewestPodcasts)
], SubsonicResponseNewestPodcasts.prototype, "newestPodcasts", void 0);
SubsonicResponseNewestPodcasts = __decorate([
    SubsonicResultType()
], SubsonicResponseNewestPodcasts);
export { SubsonicResponseNewestPodcasts };
let SubsonicResponseSearchResult = class SubsonicResponseSearchResult {
};
__decorate([
    SubsonicObjField(() => SubsonicSearchResult),
    __metadata("design:type", SubsonicSearchResult)
], SubsonicResponseSearchResult.prototype, "searchResult", void 0);
SubsonicResponseSearchResult = __decorate([
    SubsonicResultType()
], SubsonicResponseSearchResult);
export { SubsonicResponseSearchResult };
let SubsonicResponseSearchResult2 = class SubsonicResponseSearchResult2 {
};
__decorate([
    SubsonicObjField(() => SubsonicSearchResult2),
    __metadata("design:type", SubsonicSearchResult2)
], SubsonicResponseSearchResult2.prototype, "searchResult2", void 0);
SubsonicResponseSearchResult2 = __decorate([
    SubsonicResultType()
], SubsonicResponseSearchResult2);
export { SubsonicResponseSearchResult2 };
let SubsonicResponseSearchResult3 = class SubsonicResponseSearchResult3 {
};
__decorate([
    SubsonicObjField(() => SubsonicSearchResult3),
    __metadata("design:type", SubsonicSearchResult3)
], SubsonicResponseSearchResult3.prototype, "searchResult3", void 0);
SubsonicResponseSearchResult3 = __decorate([
    SubsonicResultType()
], SubsonicResponseSearchResult3);
export { SubsonicResponseSearchResult3 };
let SubsonicResponseShares = class SubsonicResponseShares {
};
__decorate([
    SubsonicObjField(() => SubsonicShares),
    __metadata("design:type", SubsonicShares)
], SubsonicResponseShares.prototype, "shares", void 0);
SubsonicResponseShares = __decorate([
    SubsonicResultType()
], SubsonicResponseShares);
export { SubsonicResponseShares };
let SubsonicResponseLicense = class SubsonicResponseLicense {
};
__decorate([
    SubsonicObjField(() => SubsonicLicense),
    __metadata("design:type", SubsonicLicense)
], SubsonicResponseLicense.prototype, "license", void 0);
SubsonicResponseLicense = __decorate([
    SubsonicResultType()
], SubsonicResponseLicense);
export { SubsonicResponseLicense };
let SubsonicResponseJukeboxStatus = class SubsonicResponseJukeboxStatus {
};
__decorate([
    SubsonicObjField(() => SubsonicJukeboxStatus),
    __metadata("design:type", SubsonicJukeboxStatus)
], SubsonicResponseJukeboxStatus.prototype, "jukeboxStatus", void 0);
SubsonicResponseJukeboxStatus = __decorate([
    SubsonicResultType()
], SubsonicResponseJukeboxStatus);
export { SubsonicResponseJukeboxStatus };
let SubsonicResponseUsers = class SubsonicResponseUsers {
};
__decorate([
    SubsonicObjField(() => SubsonicUsers),
    __metadata("design:type", SubsonicUsers)
], SubsonicResponseUsers.prototype, "users", void 0);
SubsonicResponseUsers = __decorate([
    SubsonicResultType()
], SubsonicResponseUsers);
export { SubsonicResponseUsers };
let SubsonicResponseUser = class SubsonicResponseUser {
};
__decorate([
    SubsonicObjField(() => SubsonicUser),
    __metadata("design:type", SubsonicUser)
], SubsonicResponseUser.prototype, "user", void 0);
SubsonicResponseUser = __decorate([
    SubsonicResultType()
], SubsonicResponseUser);
export { SubsonicResponseUser };
let SubsonicOKResponse = class SubsonicOKResponse {
};
SubsonicOKResponse = __decorate([
    SubsonicResultType()
], SubsonicOKResponse);
export { SubsonicOKResponse };
let SubsonicOpenSubsonicExt = class SubsonicOpenSubsonicExt {
};
__decorate([
    SubsonicObjField(),
    __metadata("design:type", String)
], SubsonicOpenSubsonicExt.prototype, "name", void 0);
__decorate([
    SubsonicObjField(() => [Number]),
    __metadata("design:type", Array)
], SubsonicOpenSubsonicExt.prototype, "versions", void 0);
SubsonicOpenSubsonicExt = __decorate([
    SubsonicResultType()
], SubsonicOpenSubsonicExt);
export { SubsonicOpenSubsonicExt };
let SubsonicOpenSubsonicResponse = class SubsonicOpenSubsonicResponse {
};
__decorate([
    SubsonicObjField(() => [SubsonicOpenSubsonicExt]),
    __metadata("design:type", Array)
], SubsonicOpenSubsonicResponse.prototype, "openSubsonicExtensions", void 0);
SubsonicOpenSubsonicResponse = __decorate([
    SubsonicResultType()
], SubsonicOpenSubsonicResponse);
export { SubsonicOpenSubsonicResponse };
//# sourceMappingURL=subsonic-rest-data.js.map