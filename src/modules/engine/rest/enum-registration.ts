import {
	AlbumOrderFields,
	AlbumType,
	ArtistOrderFields,
	ArtworkImageType,
	AudioFormatType,
	BookmarkOrderFields,
	CoverArtArchiveLookupType,
	DefaultOrderFields,
	DownloadFormatType,
	EpisodeOrderFields,
	GenreOrderFields,
	FolderHealthID,
	FolderOrderFields,
	FolderType,
	ImageFormatType,
	JamObjectType,
	LastFMLookupType,
	ListType,
	MusicBrainzLookupType,
	MusicBrainzSearchType,
	PlaylistEntryOrderFields, PlayQueueEntryOrderFields,
	PodcastOrderFields,
	PodcastStatus,
	RootScanStrategy,
	SessionMode, SessionOrderFields,
	TagFormatType,
	TrackHealthID,
	TrackOrderFields,
	UserRole,
	WaveformFormatType
} from '../../../types/enums.js';
import {registerEnumType} from '../../rest/helpers/enums.js';

export function registerRestEnums(): void {

	registerEnumType(DefaultOrderFields, {name: 'DefaultOrderFields'});
	registerEnumType(PodcastOrderFields, {name: 'PodcastOrderFields'});
	registerEnumType(TrackOrderFields, {name: 'TrackOrderFields'});
	registerEnumType(ArtistOrderFields, {name: 'ArtistOrderFields'});
	registerEnumType(FolderOrderFields, {name: 'FolderOrderFields'});
	registerEnumType(PlaylistEntryOrderFields, {name: 'PlaylistEntryOrderFields'});
	registerEnumType(PlayQueueEntryOrderFields, {name: 'PlayQueueEntryOrderFields'});
	registerEnumType(BookmarkOrderFields, {name: 'BookmarkOrderFields'});
	registerEnumType(SessionOrderFields, {name: 'SessionOrderFields'});
	registerEnumType(EpisodeOrderFields, {name: 'EpisodeOrderFields'});
	registerEnumType(GenreOrderFields, {name: 'GenreOrderFields'});
	registerEnumType(AlbumOrderFields, {name: 'AlbumOrderFields'});
	registerEnumType(JamObjectType, {name: 'JamObjectType'});
	registerEnumType(FolderHealthID, {name: 'FolderHealthID'});
	registerEnumType(TrackHealthID, {name: 'TrackHealthID'});
	registerEnumType(MusicBrainzSearchType, {name: 'MusicBrainzSearchType'});
	registerEnumType(MusicBrainzLookupType, {name: 'MusicBrainzLookupType'});
	registerEnumType(LastFMLookupType, {name: 'LastFMLookupType'});
	registerEnumType(CoverArtArchiveLookupType, {name: 'CoverArtArchiveLookupType'});
	registerEnumType(WaveformFormatType, {name: 'WaveformFormatType'});
	registerEnumType(DownloadFormatType, {name: 'DownloadFormatType'});
	registerEnumType(ImageFormatType, {name: 'ImageFormatType'});
	registerEnumType(PodcastStatus, {name: 'PodcastStatus'});
	registerEnumType(AudioFormatType, {name: 'AudioFormatType'});
	registerEnumType(ArtworkImageType, {name: 'ArtworkImageType'});
	registerEnumType(RootScanStrategy, {name: 'RootScanStrategy'});
	registerEnumType(TagFormatType, {name: 'TagFormatType'});
	registerEnumType(FolderType, {name: 'FolderType'});
	registerEnumType(AlbumType, {name: 'AlbumType'});
	registerEnumType(SessionMode, {name: 'SessionMode'});
	registerEnumType(UserRole, {name: 'UserRole'});
	registerEnumType(ListType, {name: 'ListType', description: 'Type of List Request'});

}
