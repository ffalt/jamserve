"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRestEnums = void 0;
const enums_1 = require("../../rest/decorators/enums");
const enums_2 = require("../../../types/enums");
function registerRestEnums() {
    enums_1.registerEnumType(enums_2.DefaultOrderFields, { name: 'DefaultOrderFields' });
    enums_1.registerEnumType(enums_2.PodcastOrderFields, { name: 'PodcastOrderFields' });
    enums_1.registerEnumType(enums_2.TrackOrderFields, { name: 'TrackOrderFields' });
    enums_1.registerEnumType(enums_2.ArtistOrderFields, { name: 'ArtistOrderFields' });
    enums_1.registerEnumType(enums_2.FolderOrderFields, { name: 'FolderOrderFields' });
    enums_1.registerEnumType(enums_2.PlaylistEntryOrderFields, { name: 'PlaylistEntryOrderFields' });
    enums_1.registerEnumType(enums_2.BookmarkOrderFields, { name: 'BookmarkOrderFields' });
    enums_1.registerEnumType(enums_2.EpisodeOrderFields, { name: 'EpisodeOrderFields' });
    enums_1.registerEnumType(enums_2.AlbumOrderFields, { name: 'AlbumOrderFields' });
    enums_1.registerEnumType(enums_2.JamObjectType, { name: 'JamObjectType' });
    enums_1.registerEnumType(enums_2.FolderHealthID, { name: 'FolderHealthID' });
    enums_1.registerEnumType(enums_2.TrackHealthID, { name: 'TrackHealthID' });
    enums_1.registerEnumType(enums_2.MusicBrainzSearchType, { name: 'MusicBrainzSearchType' });
    enums_1.registerEnumType(enums_2.MusicBrainzLookupType, { name: 'MusicBrainzLookupType' });
    enums_1.registerEnumType(enums_2.LastFMLookupType, { name: 'LastFMLookupType' });
    enums_1.registerEnumType(enums_2.CoverArtArchiveLookupType, { name: 'CoverArtArchiveLookupType' });
    enums_1.registerEnumType(enums_2.WaveformFormatType, { name: 'WaveformFormatType' });
    enums_1.registerEnumType(enums_2.DownloadFormatType, { name: 'DownloadFormatType' });
    enums_1.registerEnumType(enums_2.ImageFormatType, { name: 'ImageFormatType' });
    enums_1.registerEnumType(enums_2.PodcastStatus, { name: 'PodcastStatus' });
    enums_1.registerEnumType(enums_2.AudioFormatType, { name: 'AudioFormatType' });
    enums_1.registerEnumType(enums_2.ArtworkImageType, { name: 'ArtworkImageType' });
    enums_1.registerEnumType(enums_2.RootScanStrategy, { name: 'RootScanStrategy' });
    enums_1.registerEnumType(enums_2.TagFormatType, { name: 'TagFormatType' });
    enums_1.registerEnumType(enums_2.FolderType, { name: 'FolderType' });
    enums_1.registerEnumType(enums_2.AlbumType, { name: 'AlbumType' });
    enums_1.registerEnumType(enums_2.SessionMode, { name: 'SessionMode' });
    enums_1.registerEnumType(enums_2.UserRole, { name: 'UserRole' });
    enums_1.registerEnumType(enums_2.ListType, { name: 'ListType', description: 'Type of List Request' });
}
exports.registerRestEnums = registerRestEnums;
//# sourceMappingURL=enum-registration.js.map