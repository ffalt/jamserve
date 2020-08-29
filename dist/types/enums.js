"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArtistOrderFields = exports.AlbumOrderFields = exports.PodcastOrderFields = exports.PlayQueueEntryOrderFields = exports.PlaylistEntryOrderFields = exports.FolderOrderFields = exports.SessionOrderFields = exports.DefaultOrderFields = exports.BookmarkOrderFields = exports.EpisodeOrderFields = exports.TrackOrderFields = exports.JamObjectType = exports.MusicBrainzSearchType = exports.MusicBrainzLookupType = exports.CoverArtArchiveLookupType = exports.LastFMLookupType = exports.DownloadFormatTypes = exports.DownloadFormatType = exports.FolderHealthID = exports.ListType = exports.WaveformFormatTypes = exports.WaveformFormatType = exports.FileTyp = exports.TrackHealthID = exports.UserRole = exports.TagFormatType = exports.AudioFormatType = exports.DBObjectType = exports.SessionMode = exports.MetaDataType = exports.FolderTypesAlbum = exports.FolderType = exports.PodcastStatus = exports.ArtworkImageType = exports.ImageFormatType = exports.AlbumTypesArtistMusic = exports.AlbumType = exports.RootScanStrategy = void 0;
var RootScanStrategy;
(function (RootScanStrategy) {
    RootScanStrategy["auto"] = "auto";
    RootScanStrategy["artistalbum"] = "artistalbum";
    RootScanStrategy["compilation"] = "compilation";
    RootScanStrategy["audiobook"] = "audiobook";
})(RootScanStrategy = exports.RootScanStrategy || (exports.RootScanStrategy = {}));
var AlbumType;
(function (AlbumType) {
    AlbumType["unknown"] = "unknown";
    AlbumType["album"] = "album";
    AlbumType["compilation"] = "compilation";
    AlbumType["live"] = "live";
    AlbumType["bootleg"] = "bootleg";
    AlbumType["soundtrack"] = "soundtrack";
    AlbumType["audiobook"] = "audiobook";
    AlbumType["ep"] = "ep";
    AlbumType["single"] = "single";
    AlbumType["series"] = "series";
})(AlbumType = exports.AlbumType || (exports.AlbumType = {}));
exports.AlbumTypesArtistMusic = [AlbumType.album, AlbumType.live, AlbumType.bootleg, AlbumType.ep, AlbumType.single];
var ImageFormatType;
(function (ImageFormatType) {
    ImageFormatType["png"] = "png";
    ImageFormatType["jpeg"] = "jpeg";
    ImageFormatType["tiff"] = "tiff";
})(ImageFormatType = exports.ImageFormatType || (exports.ImageFormatType = {}));
var ArtworkImageType;
(function (ArtworkImageType) {
    ArtworkImageType["front"] = "front";
    ArtworkImageType["back"] = "back";
    ArtworkImageType["booklet"] = "booklet";
    ArtworkImageType["medium"] = "medium";
    ArtworkImageType["tray"] = "tray";
    ArtworkImageType["obi"] = "obi";
    ArtworkImageType["spine"] = "spine";
    ArtworkImageType["track"] = "track";
    ArtworkImageType["liner"] = "liner";
    ArtworkImageType["sticker"] = "sticker";
    ArtworkImageType["poster"] = "poster";
    ArtworkImageType["watermark"] = "watermark";
    ArtworkImageType["raw"] = "raw";
    ArtworkImageType["unedited"] = "unedited";
    ArtworkImageType["other"] = "other";
    ArtworkImageType["artist"] = "artist";
})(ArtworkImageType = exports.ArtworkImageType || (exports.ArtworkImageType = {}));
var PodcastStatus;
(function (PodcastStatus) {
    PodcastStatus["new"] = "new";
    PodcastStatus["downloading"] = "downloading";
    PodcastStatus["completed"] = "completed";
    PodcastStatus["error"] = "error";
    PodcastStatus["deleted"] = "deleted";
})(PodcastStatus = exports.PodcastStatus || (exports.PodcastStatus = {}));
var FolderType;
(function (FolderType) {
    FolderType["unknown"] = "unknown";
    FolderType["artist"] = "artist";
    FolderType["collection"] = "collection";
    FolderType["album"] = "album";
    FolderType["multialbum"] = "multialbum";
    FolderType["extras"] = "extras";
})(FolderType = exports.FolderType || (exports.FolderType = {}));
exports.FolderTypesAlbum = [FolderType.album, FolderType.multialbum];
var MetaDataType;
(function (MetaDataType) {
    MetaDataType["musicbrainz"] = "musicbrainz";
    MetaDataType["wikipedia"] = "wikipedia";
    MetaDataType["wikidata"] = "wikidata";
    MetaDataType["acoustid"] = "acoustid";
    MetaDataType["acousticbrainz"] = "acousticbrainz";
    MetaDataType["coverartarchive"] = "coverartarchive";
    MetaDataType["lastfm"] = "lastfm";
    MetaDataType["lyrics"] = "lyrics";
})(MetaDataType = exports.MetaDataType || (exports.MetaDataType = {}));
var SessionMode;
(function (SessionMode) {
    SessionMode["browser"] = "browser";
    SessionMode["jwt"] = "jwt";
})(SessionMode = exports.SessionMode || (exports.SessionMode = {}));
var DBObjectType;
(function (DBObjectType) {
    DBObjectType["root"] = "root";
    DBObjectType["user"] = "user";
    DBObjectType["folder"] = "folder";
    DBObjectType["artwork"] = "artwork";
    DBObjectType["track"] = "track";
    DBObjectType["state"] = "state";
    DBObjectType["playlist"] = "playlist";
    DBObjectType["playlistentry"] = "playlistentry";
    DBObjectType["podcast"] = "podcast";
    DBObjectType["episode"] = "episode";
    DBObjectType["bookmark"] = "bookmark";
    DBObjectType["album"] = "album";
    DBObjectType["artist"] = "artist";
    DBObjectType["playqueue"] = "playqueue";
    DBObjectType["playqueueentry"] = "playqueueentry";
    DBObjectType["radio"] = "radio";
    DBObjectType["metadata"] = "metadata";
    DBObjectType["settings"] = "settings";
    DBObjectType["session"] = "session";
    DBObjectType["tag"] = "tag";
    DBObjectType["series"] = "series";
})(DBObjectType = exports.DBObjectType || (exports.DBObjectType = {}));
var AudioFormatType;
(function (AudioFormatType) {
    AudioFormatType["mp3"] = "mp3";
    AudioFormatType["m4a"] = "m4a";
    AudioFormatType["mp4"] = "mp4";
    AudioFormatType["ogg"] = "ogg";
    AudioFormatType["oga"] = "oga";
    AudioFormatType["flv"] = "flv";
    AudioFormatType["flac"] = "flac";
    AudioFormatType["webma"] = "webma";
    AudioFormatType["wav"] = "wav";
})(AudioFormatType = exports.AudioFormatType || (exports.AudioFormatType = {}));
var TagFormatType;
(function (TagFormatType) {
    TagFormatType["none"] = "none";
    TagFormatType["ffmpeg"] = "ffmpeg";
    TagFormatType["id3v20"] = "id3v20";
    TagFormatType["id3v21"] = "id3v21";
    TagFormatType["id3v22"] = "id3v22";
    TagFormatType["id3v23"] = "id3v23";
    TagFormatType["id3v24"] = "id3v24";
    TagFormatType["id3v1"] = "id3v1";
    TagFormatType["vorbis"] = "vorbis";
})(TagFormatType = exports.TagFormatType || (exports.TagFormatType = {}));
var UserRole;
(function (UserRole) {
    UserRole["admin"] = "admin";
    UserRole["stream"] = "stream";
    UserRole["upload"] = "upload";
    UserRole["podcast"] = "podcast";
})(UserRole = exports.UserRole || (exports.UserRole = {}));
var TrackHealthID;
(function (TrackHealthID) {
    TrackHealthID["tagValuesExists"] = "track.tag.values.exists";
    TrackHealthID["id3v2Exists"] = "track.mp3.id3v2.exists";
    TrackHealthID["id3v2Valid"] = "track.mp3.id3v2.valid";
    TrackHealthID["id3v2Garbage"] = "track.mp3.id3v2.garbage.frames";
    TrackHealthID["mp3HeaderExists"] = "track.mp3.vbr.header.exists";
    TrackHealthID["mp3HeaderValid"] = "track.mp3.vbr.header.valid";
    TrackHealthID["mp3MediaValid"] = "track.mp3.media.valid";
    TrackHealthID["flacMediaValid"] = "track.flac.media.valid";
    TrackHealthID["id3v2NoId3v1"] = "track.mp3.id3v2.no.id3v1";
    TrackHealthID["mp3Garbage"] = "track.mp3.garbage.data";
})(TrackHealthID = exports.TrackHealthID || (exports.TrackHealthID = {}));
var FileTyp;
(function (FileTyp) {
    FileTyp["unknown"] = "unknown";
    FileTyp["audio"] = "audio";
    FileTyp["image"] = "image";
    FileTyp["tag"] = "tag";
    FileTyp["backup"] = "backup";
    FileTyp["other"] = "other";
})(FileTyp = exports.FileTyp || (exports.FileTyp = {}));
var WaveformFormatType;
(function (WaveformFormatType) {
    WaveformFormatType["svg"] = "svg";
    WaveformFormatType["json"] = "json";
    WaveformFormatType["dat"] = "dat";
})(WaveformFormatType = exports.WaveformFormatType || (exports.WaveformFormatType = {}));
exports.WaveformFormatTypes = [WaveformFormatType.svg, WaveformFormatType.json, WaveformFormatType.dat];
var ListType;
(function (ListType) {
    ListType["random"] = "random";
    ListType["highest"] = "highest";
    ListType["avghighest"] = "avghighest";
    ListType["frequent"] = "frequent";
    ListType["faved"] = "faved";
    ListType["recent"] = "recent";
})(ListType = exports.ListType || (exports.ListType = {}));
var FolderHealthID;
(function (FolderHealthID) {
    FolderHealthID["albumTagsExists"] = "folder.album.tags.exists";
    FolderHealthID["albumMBIDExists"] = "folder.album.mbid.exists";
    FolderHealthID["albumTracksComplete"] = "folder.album.tracks.complete";
    FolderHealthID["albumNameConform"] = "folder.album.name.conform";
    FolderHealthID["albumImageExists"] = "folder.album.image.exists";
    FolderHealthID["albumImageValid"] = "folder.album.image.valid";
    FolderHealthID["albumImageQuality"] = "folder.album.image.quality";
    FolderHealthID["artistNameConform"] = "folder.artist.name.conform";
    FolderHealthID["artistImageExists"] = "folder.artist.image.exists";
    FolderHealthID["artistImageValid"] = "folder.artist.image.valid";
})(FolderHealthID = exports.FolderHealthID || (exports.FolderHealthID = {}));
var DownloadFormatType;
(function (DownloadFormatType) {
    DownloadFormatType["zip"] = "zip";
    DownloadFormatType["tar"] = "tar";
})(DownloadFormatType = exports.DownloadFormatType || (exports.DownloadFormatType = {}));
exports.DownloadFormatTypes = [DownloadFormatType.zip, DownloadFormatType.tar];
var LastFMLookupType;
(function (LastFMLookupType) {
    LastFMLookupType["album"] = "album";
    LastFMLookupType["albumToptracks"] = "album-toptracks";
    LastFMLookupType["artist"] = "artist";
    LastFMLookupType["track"] = "track";
    LastFMLookupType["trackSimilar"] = "track-similar";
    LastFMLookupType["artistToptracks"] = "artist-toptracks";
})(LastFMLookupType = exports.LastFMLookupType || (exports.LastFMLookupType = {}));
var CoverArtArchiveLookupType;
(function (CoverArtArchiveLookupType) {
    CoverArtArchiveLookupType["release"] = "release";
    CoverArtArchiveLookupType["releaseGroup"] = "release-group";
})(CoverArtArchiveLookupType = exports.CoverArtArchiveLookupType || (exports.CoverArtArchiveLookupType = {}));
var MusicBrainzLookupType;
(function (MusicBrainzLookupType) {
    MusicBrainzLookupType["area"] = "area";
    MusicBrainzLookupType["artist"] = "artist";
    MusicBrainzLookupType["collection"] = "collection";
    MusicBrainzLookupType["event"] = "event";
    MusicBrainzLookupType["instrument"] = "instrument";
    MusicBrainzLookupType["label"] = "label";
    MusicBrainzLookupType["place"] = "place";
    MusicBrainzLookupType["recording"] = "recording";
    MusicBrainzLookupType["release"] = "release";
    MusicBrainzLookupType["releaseGroup"] = "release-group";
    MusicBrainzLookupType["series"] = "series";
    MusicBrainzLookupType["work"] = "work";
    MusicBrainzLookupType["url"] = "url";
})(MusicBrainzLookupType = exports.MusicBrainzLookupType || (exports.MusicBrainzLookupType = {}));
var MusicBrainzSearchType;
(function (MusicBrainzSearchType) {
    MusicBrainzSearchType["artist"] = "artist";
    MusicBrainzSearchType["label"] = "label";
    MusicBrainzSearchType["recording"] = "recording";
    MusicBrainzSearchType["release"] = "release";
    MusicBrainzSearchType["releaseGroup"] = "release-group";
    MusicBrainzSearchType["work"] = "work";
    MusicBrainzSearchType["area"] = "area";
})(MusicBrainzSearchType = exports.MusicBrainzSearchType || (exports.MusicBrainzSearchType = {}));
var JamObjectType;
(function (JamObjectType) {
    JamObjectType["root"] = "root";
    JamObjectType["user"] = "user";
    JamObjectType["folder"] = "folder";
    JamObjectType["track"] = "track";
    JamObjectType["state"] = "state";
    JamObjectType["artwork"] = "artwork";
    JamObjectType["playlist"] = "playlist";
    JamObjectType["podcast"] = "podcast";
    JamObjectType["episode"] = "episode";
    JamObjectType["series"] = "series";
    JamObjectType["bookmark"] = "bookmark";
    JamObjectType["album"] = "album";
    JamObjectType["artist"] = "artist";
    JamObjectType["playqueue"] = "playqueue";
    JamObjectType["radio"] = "radio";
})(JamObjectType = exports.JamObjectType || (exports.JamObjectType = {}));
var TrackOrderFields;
(function (TrackOrderFields) {
    TrackOrderFields["default"] = "default";
    TrackOrderFields["created"] = "created";
    TrackOrderFields["updated"] = "updated";
    TrackOrderFields["trackNr"] = "trackNr";
    TrackOrderFields["discNr"] = "discNr";
    TrackOrderFields["seriesNr"] = "seriesNr";
    TrackOrderFields["album"] = "album";
    TrackOrderFields["title"] = "title";
    TrackOrderFields["parent"] = "parent";
    TrackOrderFields["filename"] = "filename";
})(TrackOrderFields = exports.TrackOrderFields || (exports.TrackOrderFields = {}));
var EpisodeOrderFields;
(function (EpisodeOrderFields) {
    EpisodeOrderFields["default"] = "default";
    EpisodeOrderFields["created"] = "created";
    EpisodeOrderFields["updated"] = "updated";
    EpisodeOrderFields["name"] = "name";
    EpisodeOrderFields["status"] = "status";
    EpisodeOrderFields["date"] = "date";
})(EpisodeOrderFields = exports.EpisodeOrderFields || (exports.EpisodeOrderFields = {}));
var BookmarkOrderFields;
(function (BookmarkOrderFields) {
    BookmarkOrderFields["default"] = "default";
    BookmarkOrderFields["created"] = "created";
    BookmarkOrderFields["updated"] = "updated";
    BookmarkOrderFields["media"] = "media";
    BookmarkOrderFields["position"] = "position";
})(BookmarkOrderFields = exports.BookmarkOrderFields || (exports.BookmarkOrderFields = {}));
var DefaultOrderFields;
(function (DefaultOrderFields) {
    DefaultOrderFields["default"] = "default";
    DefaultOrderFields["created"] = "created";
    DefaultOrderFields["updated"] = "updated";
    DefaultOrderFields["name"] = "name";
})(DefaultOrderFields = exports.DefaultOrderFields || (exports.DefaultOrderFields = {}));
var SessionOrderFields;
(function (SessionOrderFields) {
    SessionOrderFields["default"] = "default";
    SessionOrderFields["expires"] = "expires";
})(SessionOrderFields = exports.SessionOrderFields || (exports.SessionOrderFields = {}));
var FolderOrderFields;
(function (FolderOrderFields) {
    FolderOrderFields["default"] = "default";
    FolderOrderFields["created"] = "created";
    FolderOrderFields["updated"] = "updated";
    FolderOrderFields["level"] = "level";
    FolderOrderFields["name"] = "name";
    FolderOrderFields["title"] = "title";
    FolderOrderFields["year"] = "year";
})(FolderOrderFields = exports.FolderOrderFields || (exports.FolderOrderFields = {}));
var PlaylistEntryOrderFields;
(function (PlaylistEntryOrderFields) {
    PlaylistEntryOrderFields["default"] = "default";
    PlaylistEntryOrderFields["created"] = "created";
    PlaylistEntryOrderFields["updated"] = "updated";
    PlaylistEntryOrderFields["position"] = "position";
})(PlaylistEntryOrderFields = exports.PlaylistEntryOrderFields || (exports.PlaylistEntryOrderFields = {}));
var PlayQueueEntryOrderFields;
(function (PlayQueueEntryOrderFields) {
    PlayQueueEntryOrderFields["default"] = "default";
    PlayQueueEntryOrderFields["created"] = "created";
    PlayQueueEntryOrderFields["updated"] = "updated";
    PlayQueueEntryOrderFields["position"] = "position";
})(PlayQueueEntryOrderFields = exports.PlayQueueEntryOrderFields || (exports.PlayQueueEntryOrderFields = {}));
var PodcastOrderFields;
(function (PodcastOrderFields) {
    PodcastOrderFields["default"] = "default";
    PodcastOrderFields["created"] = "created";
    PodcastOrderFields["updated"] = "updated";
    PodcastOrderFields["name"] = "name";
    PodcastOrderFields["lastCheck"] = "lastCheck";
})(PodcastOrderFields = exports.PodcastOrderFields || (exports.PodcastOrderFields = {}));
var AlbumOrderFields;
(function (AlbumOrderFields) {
    AlbumOrderFields["default"] = "default";
    AlbumOrderFields["created"] = "created";
    AlbumOrderFields["updated"] = "updated";
    AlbumOrderFields["name"] = "name";
    AlbumOrderFields["artist"] = "artist";
    AlbumOrderFields["year"] = "year";
    AlbumOrderFields["seriesNr"] = "seriesNr";
    AlbumOrderFields["duration"] = "duration";
    AlbumOrderFields["albumType"] = "albumType";
})(AlbumOrderFields = exports.AlbumOrderFields || (exports.AlbumOrderFields = {}));
var ArtistOrderFields;
(function (ArtistOrderFields) {
    ArtistOrderFields["default"] = "default";
    ArtistOrderFields["created"] = "created";
    ArtistOrderFields["updated"] = "updated";
    ArtistOrderFields["name"] = "name";
    ArtistOrderFields["nameSort"] = "nameSort";
})(ArtistOrderFields = exports.ArtistOrderFields || (exports.ArtistOrderFields = {}));
//# sourceMappingURL=enums.js.map