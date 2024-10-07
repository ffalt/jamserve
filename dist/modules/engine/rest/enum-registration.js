import { AlbumOrderFields, AlbumType, ArtistOrderFields, ArtworkImageType, AudioFormatType, BookmarkOrderFields, CoverArtArchiveLookupType, DefaultOrderFields, DownloadFormatType, EpisodeOrderFields, GenreOrderFields, FolderHealthID, FolderOrderFields, FolderType, ImageFormatType, JamObjectType, LastFMLookupType, ListType, MusicBrainzLookupType, MusicBrainzSearchType, PlaylistEntryOrderFields, PlayQueueEntryOrderFields, PodcastOrderFields, PodcastStatus, RootScanStrategy, SessionMode, SessionOrderFields, TagFormatType, TrackHealthID, TrackOrderFields, UserRole, WaveformFormatType } from '../../../types/enums.js';
import { registerEnumType } from '../../deco/helpers/enums.js';
import { getMetadataStorage } from '../../rest/metadata/getMetadataStorage.js';
export function registerRestEnums() {
    const enums = getMetadataStorage().enums;
    registerEnumType(DefaultOrderFields, { name: 'DefaultOrderFields' }, enums);
    registerEnumType(PodcastOrderFields, { name: 'PodcastOrderFields' }, enums);
    registerEnumType(TrackOrderFields, { name: 'TrackOrderFields' }, enums);
    registerEnumType(ArtistOrderFields, { name: 'ArtistOrderFields' }, enums);
    registerEnumType(FolderOrderFields, { name: 'FolderOrderFields' }, enums);
    registerEnumType(PlaylistEntryOrderFields, { name: 'PlaylistEntryOrderFields' }, enums);
    registerEnumType(PlayQueueEntryOrderFields, { name: 'PlayQueueEntryOrderFields' }, enums);
    registerEnumType(BookmarkOrderFields, { name: 'BookmarkOrderFields' }, enums);
    registerEnumType(SessionOrderFields, { name: 'SessionOrderFields' }, enums);
    registerEnumType(EpisodeOrderFields, { name: 'EpisodeOrderFields' }, enums);
    registerEnumType(GenreOrderFields, { name: 'GenreOrderFields' }, enums);
    registerEnumType(AlbumOrderFields, { name: 'AlbumOrderFields' }, enums);
    registerEnumType(JamObjectType, { name: 'JamObjectType' }, enums);
    registerEnumType(FolderHealthID, { name: 'FolderHealthID' }, enums);
    registerEnumType(TrackHealthID, { name: 'TrackHealthID' }, enums);
    registerEnumType(MusicBrainzSearchType, { name: 'MusicBrainzSearchType' }, enums);
    registerEnumType(MusicBrainzLookupType, { name: 'MusicBrainzLookupType' }, enums);
    registerEnumType(LastFMLookupType, { name: 'LastFMLookupType' }, enums);
    registerEnumType(CoverArtArchiveLookupType, { name: 'CoverArtArchiveLookupType' }, enums);
    registerEnumType(WaveformFormatType, { name: 'WaveformFormatType' }, enums);
    registerEnumType(DownloadFormatType, { name: 'DownloadFormatType' }, enums);
    registerEnumType(ImageFormatType, { name: 'ImageFormatType' }, enums);
    registerEnumType(PodcastStatus, { name: 'PodcastStatus' }, enums);
    registerEnumType(AudioFormatType, { name: 'AudioFormatType' }, enums);
    registerEnumType(ArtworkImageType, { name: 'ArtworkImageType' }, enums);
    registerEnumType(RootScanStrategy, { name: 'RootScanStrategy' }, enums);
    registerEnumType(TagFormatType, { name: 'TagFormatType' }, enums);
    registerEnumType(FolderType, { name: 'FolderType' }, enums);
    registerEnumType(AlbumType, { name: 'AlbumType' }, enums);
    registerEnumType(SessionMode, { name: 'SessionMode' }, enums);
    registerEnumType(UserRole, { name: 'UserRole' }, enums);
    registerEnumType(ListType, { name: 'ListType', description: 'Type of List Request' }, enums);
}
//# sourceMappingURL=enum-registration.js.map