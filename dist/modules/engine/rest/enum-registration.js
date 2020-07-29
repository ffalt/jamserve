"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerRestEnums = void 0;
const enums_1 = require("../../../types/enums");
const enums_2 = require("../../rest/helpers/enums");
function registerRestEnums() {
    enums_2.registerEnumType(enums_1.DefaultOrderFields, { name: 'DefaultOrderFields' });
    enums_2.registerEnumType(enums_1.PodcastOrderFields, { name: 'PodcastOrderFields' });
    enums_2.registerEnumType(enums_1.TrackOrderFields, { name: 'TrackOrderFields' });
    enums_2.registerEnumType(enums_1.ArtistOrderFields, { name: 'ArtistOrderFields' });
    enums_2.registerEnumType(enums_1.FolderOrderFields, { name: 'FolderOrderFields' });
    enums_2.registerEnumType(enums_1.PlaylistEntryOrderFields, { name: 'PlaylistEntryOrderFields' });
    enums_2.registerEnumType(enums_1.BookmarkOrderFields, { name: 'BookmarkOrderFields' });
    enums_2.registerEnumType(enums_1.EpisodeOrderFields, { name: 'EpisodeOrderFields' });
    enums_2.registerEnumType(enums_1.AlbumOrderFields, { name: 'AlbumOrderFields' });
    enums_2.registerEnumType(enums_1.JamObjectType, { name: 'JamObjectType' });
    enums_2.registerEnumType(enums_1.FolderHealthID, { name: 'FolderHealthID' });
    enums_2.registerEnumType(enums_1.TrackHealthID, { name: 'TrackHealthID' });
    enums_2.registerEnumType(enums_1.MusicBrainzSearchType, { name: 'MusicBrainzSearchType' });
    enums_2.registerEnumType(enums_1.MusicBrainzLookupType, { name: 'MusicBrainzLookupType' });
    enums_2.registerEnumType(enums_1.LastFMLookupType, { name: 'LastFMLookupType' });
    enums_2.registerEnumType(enums_1.CoverArtArchiveLookupType, { name: 'CoverArtArchiveLookupType' });
    enums_2.registerEnumType(enums_1.WaveformFormatType, { name: 'WaveformFormatType' });
    enums_2.registerEnumType(enums_1.DownloadFormatType, { name: 'DownloadFormatType' });
    enums_2.registerEnumType(enums_1.ImageFormatType, { name: 'ImageFormatType' });
    enums_2.registerEnumType(enums_1.PodcastStatus, { name: 'PodcastStatus' });
    enums_2.registerEnumType(enums_1.AudioFormatType, { name: 'AudioFormatType' });
    enums_2.registerEnumType(enums_1.ArtworkImageType, { name: 'ArtworkImageType' });
    enums_2.registerEnumType(enums_1.RootScanStrategy, { name: 'RootScanStrategy' });
    enums_2.registerEnumType(enums_1.TagFormatType, { name: 'TagFormatType' });
    enums_2.registerEnumType(enums_1.FolderType, { name: 'FolderType' });
    enums_2.registerEnumType(enums_1.AlbumType, { name: 'AlbumType' });
    enums_2.registerEnumType(enums_1.SessionMode, { name: 'SessionMode' });
    enums_2.registerEnumType(enums_1.UserRole, { name: 'UserRole' });
    enums_2.registerEnumType(enums_1.ListType, { name: 'ListType', description: 'Type of List Request' });
}
exports.registerRestEnums = registerRestEnums;
//# sourceMappingURL=enum-registration.js.map