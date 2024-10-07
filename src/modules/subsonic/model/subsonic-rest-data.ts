import { SubsonicResultType } from '../decorators/SubsonicResultType.js';
import { SubsonicObjField } from '../decorators/SubsonicObjField.js';

export class SubsonicResponse {
	album?: SubsonicAlbumWithSongsID3;
	albumInfo?: SubsonicAlbumInfo;
	albumList2?: SubsonicAlbumList2;
	albumList?: SubsonicAlbumList;
	artist?: SubsonicArtistWithAlbumsID3;
	artistInfo2?: SubsonicArtistInfo2;
	artistInfo?: SubsonicArtistInfo;
	artists?: SubsonicArtistsID3;
	bookmarks?: SubsonicBookmarks;
	chatMessages?: SubsonicChatMessages;
	directory?: SubsonicDirectory;
	genres?: SubsonicGenres;
	indexes?: SubsonicIndexes;
	internetRadioStations?: SubsonicInternetRadioStations;
	jukeboxPlaylist?: SubsonicJukeboxPlaylist;
	jukeboxStatus?: SubsonicJukeboxStatus;
	license?: SubsonicLicense;
	lyrics?: SubsonicLyrics;
	musicFolders?: SubsonicMusicFolders;
	newestPodcasts?: SubsonicNewestPodcasts;
	nowPlaying?: SubsonicNowPlaying;
	playlist?: SubsonicPlaylistWithSongs;
	playlists?: SubsonicPlaylists;
	playQueue?: SubsonicPlayQueue;
	podcasts?: SubsonicPodcasts;
	randomSongs?: SubsonicSongs;
	scanStatus?: SubsonicScanStatus;
	searchResult2?: SubsonicSearchResult2;
	searchResult3?: SubsonicSearchResult3;
	searchResult?: SubsonicSearchResult;
	shares?: SubsonicShares;
	similarSongs2?: SubsonicSimilarSongs2;
	similarSongs?: SubsonicSimilarSongs;
	song?: SubsonicChild;
	songsByGenre?: SubsonicSongs;
	starred2?: SubsonicStarred2;
	starred?: SubsonicStarred;
	topSongs?: SubsonicTopSongs;
	user?: SubsonicUser;
	users?: SubsonicUsers;
	videoInfo?: SubsonicVideoInfo;
	videos?: SubsonicVideos;

	error?: SubsonicError;
	status?: SubsonicResponseStatus;
	version?: SubsonicVersion;
	type!: string;
	serverVersion!: string;
	openSubsonic!: boolean;
}

export type SubsonicID = string;
export type SubsonicDateTime = string; // -?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?
export type SubsonicResponseStatus = 'ok' | 'failed';
export type SubsonicVersion = string; // \d+\.\d+\.\d+
export type SubsonicMediaType = 'music' | 'podcast' | 'audiobook' | 'video';
export type SubsonicUserRating = number; // 1 <= x <= 5
export type SubsonicAverageRating = number; // 1.0 <= x <= 5.0
export type SubsonicPodcastStatus = 'new' | 'downloading' | 'completed' | 'error' | 'deleted' | 'skipped';

@SubsonicResultType()
export class SubsonicMusicFolders {
	@SubsonicObjField(() => [SubsonicMusicFolder])
	musicFolder?: Array<SubsonicMusicFolder>;
}

@SubsonicResultType()
export class SubsonicMusicFolder {
	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	name?: string;
}

@SubsonicResultType()
export class SubsonicIndexes {
	@SubsonicObjField(() => [SubsonicArtist])
	shortcut?: Array<SubsonicArtist>;

	@SubsonicObjField(() => [SubsonicIndex])
	index?: Array<SubsonicIndex>;

	@SubsonicObjField(() => [SubsonicChild])
	child?: Array<SubsonicChild>; //  Added in 1.7.0

	@SubsonicObjField()
	lastModified!: number;

	@SubsonicObjField()
	ignoredArticles!: string; //  Added in 1.10.0
}

@SubsonicResultType()
export class SubsonicIndex {
	@SubsonicObjField(() => [SubsonicArtist])
	artist?: Array<SubsonicArtist>;

	@SubsonicObjField()
	name!: string;
}

@SubsonicResultType()
export class SubsonicArtist {
	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	name!: string;

	@SubsonicObjField()
	starred?: SubsonicDateTime; //  Added in 1.10.1

	@SubsonicObjField()
	userRating?: SubsonicUserRating; //  Added in 1.13.0

	@SubsonicObjField()
	averageRating?: SubsonicAverageRating; //  Added in 1.13.0

	@SubsonicObjField()
	albumCount?: number; // OpenSubsonic

	@SubsonicObjField()
	musicBrainzId?: string; // OpenSubsonic

	@SubsonicObjField()
	artistImageUrl?: string; // OpenSubsonic
}

@SubsonicResultType()
export class SubsonicGenres {
	@SubsonicObjField(() => [SubsonicGenre])
	genre?: Array<SubsonicGenre>;
}

@SubsonicResultType()
export class SubsonicGenre {
	@SubsonicObjField()
	value!: string;

	@SubsonicObjField()
	songCount!: number; //  Added in 1.10.2

	@SubsonicObjField()
	albumCount!: number; //  Added in 1.10.2

	@SubsonicObjField()
	artistCount!: number; //  undocumented?
}

@SubsonicResultType()
export class SubsonicArtistsID3 {
	@SubsonicObjField(() => [SubsonicIndexID3])
	index?: Array<SubsonicIndexID3>;

	@SubsonicObjField()
	ignoredArticles!: string; //  Added in 1.10.0
}

@SubsonicResultType()
export class SubsonicIndexID3 {
	@SubsonicObjField(() => [SubsonicArtistID3])
	artist?: Array<SubsonicArtistID3>;

	@SubsonicObjField()
	name!: string;
}

@SubsonicResultType()
export class SubsonicArtistID3 {
	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	name!: string;

	@SubsonicObjField()
	albumCount!: number;

	@SubsonicObjField()
	userRating?: number;

	@SubsonicObjField()
	coverArt?: SubsonicID;

	@SubsonicObjField()
	starred?: SubsonicDateTime;

	@SubsonicObjField()
	artistImageUrl?: string;

	@SubsonicObjField()
	musicBrainzId?: string; // OpenSubsonic

	@SubsonicObjField()
	sortName?: string; // OpenSubsonic

	@SubsonicObjField(() => [String])
	roles?: Array<string>; // OpenSubsonic
}

@SubsonicResultType()
export class SubsonicArtistWithAlbumsID3 extends SubsonicArtistID3 {
	@SubsonicObjField(() => [SubsonicAlbumID3])
	album?: Array<SubsonicAlbumID3>;
}

@SubsonicResultType()
export class SubsonicListDiscTitle {
	@SubsonicObjField()
	disc?: number;

	@SubsonicObjField()
	title?: string;
}

@SubsonicResultType()
export class SubsonicListDate {
	@SubsonicObjField()
	year?: number;

	@SubsonicObjField()
	month?: number;

	@SubsonicObjField()
	day?: number;
}

@SubsonicResultType()
export class SubsonicListArtist {
	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	name!: string;
}

@SubsonicResultType()
export class SubsonicAlbumID3 {
	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	name!: string;

	@SubsonicObjField()
	artist?: string;

	@SubsonicObjField()
	artistId?: SubsonicID;

	@SubsonicObjField()
	coverArt?: SubsonicID;

	@SubsonicObjField()
	songCount!: number;

	@SubsonicObjField()
	duration!: number;

	@SubsonicObjField()
	playCount?: number; //  Added in 1.14.0

	@SubsonicObjField()
	created!: SubsonicDateTime;

	@SubsonicObjField()
	starred?: SubsonicDateTime;

	@SubsonicObjField()
	year?: number; //  Added in 1.10.1

	@SubsonicObjField()
	genre?: string; //  Added in 1.10.1

	@SubsonicObjField()
	played?: string; // OpenSubsonic

	@SubsonicObjField()
	userRating?: number; // OpenSubsonic

	@SubsonicObjField(() => [SubsonicListRecordLabel])
	recordLabels?: Array<SubsonicListRecordLabel>; // OpenSubsonic

	@SubsonicObjField()
	musicBrainzId?: string; // OpenSubsonic

	@SubsonicObjField(() => [SubsonicListGenre])
	genres?: Array<SubsonicListGenre>; // OpenSubsonic

	@SubsonicObjField(() => [SubsonicListArtist])
	artists?: Array<SubsonicListArtist>; // OpenSubsonic

	@SubsonicObjField()
	displayArtist?: string; // OpenSubsonic

	@SubsonicObjField(() => [String])
	releaseTypes?: Array<string>; // OpenSubsonic

	@SubsonicObjField(() => [String])
	moods?: Array<string>; // OpenSubsonic

	@SubsonicObjField()
	sortName?: string; // OpenSubsonic

	@SubsonicObjField(() => SubsonicListDate)
	originalReleaseDate?: SubsonicListDate; // OpenSubsonic

	@SubsonicObjField(() => SubsonicListDate)
	releaseDate?: SubsonicListDate; // OpenSubsonic

	@SubsonicObjField()
	isCompilation?: boolean; // OpenSubsonic

	@SubsonicObjField(() => [SubsonicListDiscTitle])
	discTitles?: Array<SubsonicListDiscTitle>; // OpenSubsonic
}

@SubsonicResultType()
export class SubsonicListGenre {
	@SubsonicObjField()
	name!: string;
}

@SubsonicResultType()
export class SubsonicListRecordLabel {
	@SubsonicObjField()
	name!: string;
}

@SubsonicResultType()
export class SubsonicAlbumWithSongsID3 extends SubsonicAlbumID3 {
	@SubsonicObjField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicVideos {
	@SubsonicObjField(() => [SubsonicChild])
	video?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicVideoInfo {
	@SubsonicObjField(() => [SubsonicCaptions])
	captions?: Array<SubsonicCaptions>;

	@SubsonicObjField(() => [SubsonicAudioTrack])
	audioTrack?: Array<SubsonicAudioTrack>;

	@SubsonicObjField(() => [SubsonicVideoConversion])
	conversion?: Array<SubsonicVideoConversion>;

	@SubsonicObjField()
	id!: SubsonicID;
}

@SubsonicResultType()
export class SubsonicCaptions {
	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	name?: string;
}

@SubsonicResultType()
export class SubsonicAudioTrack {
	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	name?: string;

	@SubsonicObjField()
	languageCode?: string;
}

@SubsonicResultType()
export class SubsonicVideoConversion {
	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	bitRate?: number; //  In Kbps

	@SubsonicObjField()
	audioTrackId?: number;
}

@SubsonicResultType()
export class SubsonicDirectory {
	@SubsonicObjField(() => [SubsonicChild])
	child?: Array<SubsonicChild>;

	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	parent?: SubsonicID;

	@SubsonicObjField()
	name!: string;

	@SubsonicObjField()
	starred?: SubsonicDateTime; //  Added in 1.10.1

	@SubsonicObjField()
	userRating?: SubsonicUserRating; //  Added in 1.13.0

	@SubsonicObjField()
	averageRating?: SubsonicAverageRating; //  Added in 1.13.0

	@SubsonicObjField()
	playCount?: number; //  Added in 1.14.0
}

@SubsonicResultType()
export class SubSonicReplayGain {
	@SubsonicObjField()
	trackGain!: number;

	@SubsonicObjField()
	albumGain!: number;

	@SubsonicObjField()
	trackPeak!: number;

	@SubsonicObjField()
	albumPeak!: number;

	@SubsonicObjField()
	baseGain!: number;

	@SubsonicObjField()
	fallbackGain!: number;
}

@SubsonicResultType()
export class SubsonicChild {
	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	parent?: SubsonicID;

	@SubsonicObjField()
	isDir!: boolean;

	@SubsonicObjField()
	title!: string;

	@SubsonicObjField()
	album?: string;

	@SubsonicObjField()
	artist?: string;

	@SubsonicObjField()
	track?: number;

	@SubsonicObjField()
	year?: number;

	@SubsonicObjField()
	genre?: string;

	@SubsonicObjField()
	coverArt?: SubsonicID;

	@SubsonicObjField()
	size?: number;

	@SubsonicObjField()
	contentType?: string;

	@SubsonicObjField()
	suffix?: string;

	@SubsonicObjField()
	transcodedContentType?: string;

	@SubsonicObjField()
	transcodedSuffix?: string;

	@SubsonicObjField()
	duration?: number;

	@SubsonicObjField()
	bitRate?: number;

	@SubsonicObjField()
	path?: string;

	@SubsonicObjField()
	isVideo?: boolean; //  Added in 1.4.1

	@SubsonicObjField()
	userRating?: SubsonicUserRating; //  Added in 1.6.0

	@SubsonicObjField()
	averageRating?: SubsonicAverageRating; //  Added in 1.6.0

	@SubsonicObjField()
	playCount?: number; //  Added in 1.14.0

	@SubsonicObjField()
	discNumber?: number; //  Added in 1.8.0

	@SubsonicObjField()
	created?: SubsonicDateTime; //  Added in 1.8.0

	@SubsonicObjField()
	starred?: SubsonicDateTime; //  Added in 1.8.0

	@SubsonicObjField()
	albumId?: SubsonicID; //  Added in 1.8.0

	@SubsonicObjField()
	artistId?: SubsonicID; //  Added in 1.8.0

	@SubsonicObjField()
	type?: SubsonicMediaType; //  Added in 1.8.0

	@SubsonicObjField()
	bookmarkPosition?: number; //  In millis. Added in 1.10.1

	@SubsonicObjField()
	originalWidth?: number; //  Added in 1.13.0

	@SubsonicObjField()
	originalHeight?: number; //  Added in 1.13.0

	@SubsonicObjField()
	bitDepth?: number; //  OpenSubsonic

	@SubsonicObjField()
	samplingRate?: number; //  OpenSubsonic

	@SubsonicObjField()
	channelCount?: number; //  OpenSubsonic

	@SubsonicObjField()
	mediaType?: string; //  OpenSubsonic

	@SubsonicObjField()
	played?: string; //  OpenSubsonic

	@SubsonicObjField()
	bpm?: number; //  OpenSubsonic

	@SubsonicObjField()
	comment?: string; //  OpenSubsonic

	@SubsonicObjField()
	sortName?: string; //  OpenSubsonic

	@SubsonicObjField()
	musicBrainzId?: string; //  OpenSubsonic

	@SubsonicObjField(() => [SubsonicListGenre])
	genres?: Array<SubsonicListGenre>; //  OpenSubsonic

	@SubsonicObjField(() => [SubsonicArtistsID3])
	artists?: Array<SubsonicArtistsID3>; //  OpenSubsonic

	@SubsonicObjField(() => [SubsonicArtistsID3])
	albumArtists?: Array<SubsonicArtistsID3>; //  OpenSubsonic

	@SubsonicObjField(() => [SubsonicContributor])
	contributors?: Array<SubsonicContributor>; //  OpenSubsonic

	@SubsonicObjField()
	displayArtist?: string; //  OpenSubsonic

	@SubsonicObjField()
	displayAlbumArtist?: string; //  OpenSubsonic

	@SubsonicObjField()
	displayComposer?: string; //  OpenSubsonic

	@SubsonicObjField(() => [String])
	moods?: Array<string>; // OpenSubsonic

	@SubsonicObjField(() => SubSonicReplayGain)
	replayGain?: SubSonicReplayGain; // OpenSubsonic
}

@SubsonicResultType()
export class SubsonicContributor {
	@SubsonicObjField()
	role!: string;

	@SubsonicObjField()
	subRole?: string;

	@SubsonicObjField(() => SubsonicArtistID3)
	artist?: SubsonicArtistID3;
}

@SubsonicResultType()
export class SubsonicNowPlaying {
	@SubsonicObjField(() => [SubsonicNowPlayingEntry])
	entry?: Array<SubsonicNowPlayingEntry>;
}

@SubsonicResultType()
export class SubsonicNowPlayingEntry extends SubsonicChild {
	@SubsonicObjField()
	username!: string;

	@SubsonicObjField()
	minutesAgo!: number;

	@SubsonicObjField()
	playerId!: number;

	@SubsonicObjField()
	playerName?: string;
}

@SubsonicResultType()
export class SubsonicSearchResult {
	@SubsonicObjField(() => [SubsonicChild])
	match?: Array<SubsonicChild>;

	@SubsonicObjField()
	offset!: number;

	@SubsonicObjField()
	totalHits!: number;
}

@SubsonicResultType()
export class SubsonicSearchResult2 {
	@SubsonicObjField(() => [SubsonicArtist])
	artist?: Array<SubsonicArtist>;

	@SubsonicObjField(() => [SubsonicChild])
	album?: Array<SubsonicChild>;

	@SubsonicObjField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicSearchResult3 {
	@SubsonicObjField(() => [SubsonicArtistID3])
	artist?: Array<SubsonicArtistID3>;

	@SubsonicObjField(() => [SubsonicAlbumID3])
	album?: Array<SubsonicAlbumID3>;

	@SubsonicObjField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicPlaylists {
	@SubsonicObjField(() => [SubsonicPlaylist])
	playlist?: Array<SubsonicPlaylist>;
}

@SubsonicResultType()
export class SubsonicPlaylist {
	@SubsonicObjField(() => [String])
	allowedUser?: Array<string>; // Added in 1.8.0

	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	name!: string;

	@SubsonicObjField()
	comment?: string; // Added in 1.8.0

	@SubsonicObjField()
	owner?: SubsonicID; // Added in 1.8.0

	@SubsonicObjField()
	public?: boolean; // Added in 1.8.0

	@SubsonicObjField()
	songCount!: number; // Added in 1.8.0

	@SubsonicObjField()
	duration!: number; // Added in 1.8.0

	@SubsonicObjField()
	created!: SubsonicDateTime; // Added in 1.8.0

	@SubsonicObjField()
	changed!: SubsonicDateTime; // Added in 1.13.0

	@SubsonicObjField()
	coverArt?: string; // Added in 1.11.0

	@SubsonicObjField()
	starred?: SubsonicDateTime;

	@SubsonicObjField()
	userRating?: number;
}

@SubsonicResultType()
export class SubsonicPlaylistWithSongs extends SubsonicPlaylist {
	@SubsonicObjField(() => [SubsonicChild])
	entry?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicJukeboxStatus {
	@SubsonicObjField()
	currentIndex!: number;

	@SubsonicObjField()
	playing!: boolean;

	@SubsonicObjField()
	gain!: number;

	@SubsonicObjField()
	position?: number; // Added in 1.7.0
}

@SubsonicResultType()
export class SubsonicJukeboxPlaylist extends SubsonicJukeboxStatus {
	@SubsonicObjField(() => [SubsonicChild])
	entry?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicChatMessages {
	@SubsonicObjField(() => [SubsonicChatMessage])
	chatMessage?: Array<SubsonicChatMessage>;
}

@SubsonicResultType()
export class SubsonicChatMessage {
	@SubsonicObjField()
	username!: string;

	@SubsonicObjField()
	time!: number;

	@SubsonicObjField()
	message!: string;
}

@SubsonicResultType()
export class SubsonicAlbumList {
	@SubsonicObjField(() => [SubsonicChild])
	album?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicAlbumList2 {
	@SubsonicObjField(() => [SubsonicAlbumID3])
	album?: Array<SubsonicAlbumID3>;
}

@SubsonicResultType()
export class SubsonicSongs {
	@SubsonicObjField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicLyrics {
	@SubsonicObjField()
	value!: string;

	@SubsonicObjField()
	artist?: string;

	@SubsonicObjField()
	title?: string;
}

@SubsonicResultType()
export class SubsonicLyricsLine {
	@SubsonicObjField()
	value!: string;

	@SubsonicObjField()
	start?: number;
}

@SubsonicResultType()
export class SubsonicStructuredLyrics {
	@SubsonicObjField()
	lang!: string;

	@SubsonicObjField()
	synced!: boolean;

	@SubsonicObjField(() => [SubsonicLyricsLine])
	line?: Array<SubsonicLyricsLine>;

	@SubsonicObjField()
	displayArtist?: string;

	@SubsonicObjField()
	displayTitle?: string;

	@SubsonicObjField()
	offset?: number;
}

@SubsonicResultType()
export class SubsonicPodcasts {
	@SubsonicObjField(() => [SubsonicPodcastChannel])
	channel?: Array<SubsonicPodcastChannel>;
}

@SubsonicResultType()
export class SubsonicPodcastChannel {
	@SubsonicObjField(() => [SubsonicPodcastEpisode])
	episode?: Array<SubsonicPodcastEpisode>;

	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	url!: string;

	@SubsonicObjField()
	title?: string;

	@SubsonicObjField()
	description?: string;

	@SubsonicObjField()
	coverArt?: string; //  Added in 1.13.0

	@SubsonicObjField()
	originalImageUrl?: string; //  Added in 1.13.0

	@SubsonicObjField()
	status!: SubsonicPodcastStatus;

	@SubsonicObjField()
	errorMessage?: string;
}

@SubsonicResultType()
export class SubsonicNewestPodcasts {
	@SubsonicObjField(() => [SubsonicPodcastEpisode])
	episode?: Array<SubsonicPodcastEpisode>;
}

@SubsonicResultType()
export class SubsonicPodcastEpisode extends SubsonicChild {
	@SubsonicObjField()
	streamId?: SubsonicID; //  Use this ID for streaming the podcast.

	@SubsonicObjField()
	channelId!: SubsonicID; //  Added in 1.13.0

	@SubsonicObjField()
	description?: string;

	@SubsonicObjField()
	status!: SubsonicPodcastStatus;

	@SubsonicObjField()
	publishDate?: SubsonicDateTime;
}

@SubsonicResultType()
export class SubsonicInternetRadioStations {
	@SubsonicObjField(() => [SubsonicInternetRadioStation])
	internetRadioStation?: Array<SubsonicInternetRadioStation>;
}

@SubsonicResultType()
export class SubsonicInternetRadioStation {
	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	name!: string;

	@SubsonicObjField()
	streamUrl!: string;

	@SubsonicObjField()
	homePageUrl?: string;
}

@SubsonicResultType()
export class SubsonicBookmarks {
	@SubsonicObjField(() => [SubsonicBookmark])
	bookmark?: Array<SubsonicBookmark>;
}

@SubsonicResultType()
export class SubsonicBookmark {
	@SubsonicObjField(() => SubsonicChild)
	entry!: SubsonicChild;

	@SubsonicObjField()
	position!: number; //  In milliseconds

	@SubsonicObjField()
	username!: string;

	@SubsonicObjField()
	comment?: string;

	@SubsonicObjField()
	created!: SubsonicDateTime;

	@SubsonicObjField()
	changed!: SubsonicDateTime;
}

@SubsonicResultType()
export class SubsonicPlayQueue {
	@SubsonicObjField(() => SubsonicChild)
	entry?: Array<SubsonicChild>;

	@SubsonicObjField()
	current?: number; //  ID of currently playing track

	@SubsonicObjField()
	position?: number; //  Position in milliseconds of currently playing track

	@SubsonicObjField()
	username!: string;

	@SubsonicObjField()
	changed!: SubsonicDateTime;

	@SubsonicObjField()
	changedBy!: string; //  Name of client app
}

@SubsonicResultType()
export class SubsonicShares {
	@SubsonicObjField(() => [SubsonicShare])
	share?: Array<SubsonicShare>;
}

@SubsonicResultType()
export class SubsonicShare {
	@SubsonicObjField(() => [SubsonicChild])
	entry?: Array<SubsonicChild>;

	@SubsonicObjField()
	id!: SubsonicID;

	@SubsonicObjField()
	url!: string;

	@SubsonicObjField()
	description?: string;

	@SubsonicObjField()
	username!: string;

	@SubsonicObjField()
	created!: SubsonicDateTime;

	@SubsonicObjField()
	expires?: SubsonicDateTime;

	@SubsonicObjField()
	lastVisited?: SubsonicDateTime;

	@SubsonicObjField()
	visitCount!: number;
}

@SubsonicResultType()
export class SubsonicStarred {
	@SubsonicObjField(() => [SubsonicArtist])
	artist?: Array<SubsonicArtist>;

	@SubsonicObjField(() => [SubsonicChild])
	album?: Array<SubsonicChild>;

	@SubsonicObjField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicAlbumInfo {
	@SubsonicObjField()
	notes?: string;

	@SubsonicObjField()
	musicBrainzId?: string;

	@SubsonicObjField()
	lastFmUrl?: string;

	@SubsonicObjField()
	smallImageUrl?: string;

	@SubsonicObjField()
	mediumImageUrl?: string;

	@SubsonicObjField()
	largeImageUrl?: string;
}

@SubsonicResultType()
export class SubsonicArtistInfoBase {
	@SubsonicObjField()
	biography?: string;

	@SubsonicObjField()
	musicBrainzId?: string;

	@SubsonicObjField()
	lastFmUrl?: string;

	@SubsonicObjField()
	smallImageUrl?: string;

	@SubsonicObjField()
	mediumImageUrl?: string;

	@SubsonicObjField()
	largeImageUrl?: string;
}

@SubsonicResultType()
export class SubsonicArtistInfo extends SubsonicArtistInfoBase {
	@SubsonicObjField(() => [SubsonicArtist])
	similarArtist?: Array<SubsonicArtist>;
}

@SubsonicResultType()
export class SubsonicArtistInfo2 extends SubsonicArtistInfoBase {
	@SubsonicObjField(() => [SubsonicArtistID3])
	similarArtist?: Array<SubsonicArtistID3>;
}

@SubsonicResultType()
export class SubsonicSimilarSongs {
	@SubsonicObjField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicSimilarSongs2 {
	@SubsonicObjField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicTopSongs {
	@SubsonicObjField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicStarred2 {
	@SubsonicObjField(() => [SubsonicArtistID3])
	artist?: Array<SubsonicArtistID3>;

	@SubsonicObjField(() => [SubsonicAlbumID3])
	album?: Array<SubsonicAlbumID3>;

	@SubsonicObjField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicLicense {
	@SubsonicObjField()
	valid!: boolean;

	@SubsonicObjField()
	email?: string;

	@SubsonicObjField()
	licenseExpires?: SubsonicDateTime;

	@SubsonicObjField()
	trialExpires?: SubsonicDateTime;
}

@SubsonicResultType()
export class SubsonicScanStatus {
	@SubsonicObjField()
	scanning!: boolean;

	@SubsonicObjField()
	count?: number;
}

@SubsonicResultType()
export class SubsonicUsers {
	@SubsonicObjField(() => [SubsonicUser])
	user?: Array<SubsonicUser>;
}

@SubsonicResultType()
export class SubsonicUser {
	@SubsonicObjField(() => [String])
	folder?: Array<SubsonicID>; //  Added in 1.12.0

	@SubsonicObjField()
	username!: string;

	@SubsonicObjField()
	email?: string; //  Added in 1.6.0

	@SubsonicObjField()
	scrobblingEnabled!: boolean; //  Added in 1.7.0

	@SubsonicObjField()
	maxBitRate?: number; //  In Kbps, added in 1.13.0

	@SubsonicObjField()
	adminRole!: boolean;

	@SubsonicObjField()
	settingsRole!: boolean;

	@SubsonicObjField()
	downloadRole!: boolean;

	@SubsonicObjField()
	uploadRole!: boolean;

	@SubsonicObjField()
	playlistRole!: boolean;

	@SubsonicObjField()
	coverArtRole!: boolean;

	@SubsonicObjField()
	commentRole!: boolean;

	@SubsonicObjField()
	podcastRole!: boolean;

	@SubsonicObjField()
	streamRole!: boolean;

	@SubsonicObjField()
	jukeboxRole!: boolean;

	@SubsonicObjField()
	shareRole!: boolean; //  Added in 1.7.0

	@SubsonicObjField()
	videoConversionRole!: boolean; //  Added in 1.14.0

	@SubsonicObjField()
	avatarLastChanged?: SubsonicDateTime; //  Added in 1.14.0
}

@SubsonicResultType()
export class SubsonicError {
	@SubsonicObjField()
	code!: number;

	@SubsonicObjField()
	message?: string;
}

@SubsonicResultType()
export class SubsonicResponseBookmarks {
	@SubsonicObjField(() => SubsonicBookmarks)
	bookmarks!: SubsonicBookmarks;
}

@SubsonicResultType()
export class SubsonicResponsePlayQueue {
	@SubsonicObjField(() => SubsonicPlayQueue)
	playQueue!: SubsonicPlayQueue;
}

@SubsonicResultType()
export class SubsonicResponseArtistWithAlbumsID3 {
	@SubsonicObjField(() => SubsonicArtistWithAlbumsID3)
	artist!: SubsonicArtistWithAlbumsID3;
}

@SubsonicResultType()
export class SubsonicResponseAlbumWithSongsID3 {
	@SubsonicObjField(() => SubsonicAlbumWithSongsID3)
	album!: SubsonicAlbumWithSongsID3;
}

@SubsonicResultType()
export class SubsonicResponseArtistInfo {
	@SubsonicObjField(() => SubsonicArtistInfo)
	artistInfo!: SubsonicArtistInfo;
}

@SubsonicResultType()
export class SubsonicResponseArtistInfo2 {
	@SubsonicObjField(() => SubsonicArtistInfo2)
	artistInfo2!: SubsonicArtistInfo2;
}

@SubsonicResultType()
export class SubsonicResponseAlbumInfo {
	@SubsonicObjField(() => SubsonicAlbumInfo)
	albumInfo!: SubsonicAlbumInfo;
}

@SubsonicResultType()
export class SubsonicResponseIndexes {
	@SubsonicObjField(() => SubsonicIndexes)
	indexes!: SubsonicIndexes;
}

@SubsonicResultType()
export class SubsonicResponseArtistsID3 {
	@SubsonicObjField(() => SubsonicArtistsID3)
	artists!: SubsonicArtistsID3;
}

@SubsonicResultType()
export class SubsonicResponseDirectory {
	@SubsonicObjField(() => SubsonicDirectory)
	directory!: SubsonicDirectory;
}

@SubsonicResultType()
export class SubsonicResponseGenres {
	@SubsonicObjField(() => SubsonicGenres)
	genres!: SubsonicGenres;
}

@SubsonicResultType()
export class SubsonicResponseMusicFolders {
	@SubsonicObjField(() => SubsonicMusicFolders)
	musicFolders!: SubsonicMusicFolders;
}

@SubsonicResultType()
export class SubsonicResponseSimilarSongs {
	@SubsonicObjField(() => SubsonicSimilarSongs)
	similarSongs!: SubsonicSimilarSongs;
}

@SubsonicResultType()
export class SubsonicResponseSimilarSongs2 {
	@SubsonicObjField(() => SubsonicSimilarSongs2)
	similarSongs2!: SubsonicSimilarSongs2;
}

@SubsonicResultType()
export class SubsonicResponseSong {
	@SubsonicObjField(() => SubsonicChild)
	song!: SubsonicChild;
}

@SubsonicResultType()
export class SubsonicResponseTopSongs {
	@SubsonicObjField(() => SubsonicTopSongs)
	topSongs!: SubsonicTopSongs;
}

@SubsonicResultType()
export class SubsonicResponseVideos {
	@SubsonicObjField(() => SubsonicVideos)
	videos!: SubsonicVideos;
}

@SubsonicResultType()
export class SubsonicResponseVideoInfo {
	@SubsonicObjField(() => SubsonicVideoInfo)
	videoInfo!: SubsonicVideoInfo;
}

@SubsonicResultType()
export class SubsonicResponseChatMessages {
	@SubsonicObjField(() => SubsonicChatMessages)
	chatMessages!: SubsonicChatMessages;
}

@SubsonicResultType()
export class SubsonicResponseInternetRadioStations {
	@SubsonicObjField(() => SubsonicInternetRadioStations)
	internetRadioStations!: SubsonicInternetRadioStations;
}

@SubsonicResultType()
export class SubsonicResponseScanStatus {
	@SubsonicObjField(() => SubsonicScanStatus)
	scanStatus!: SubsonicScanStatus;
}

@SubsonicResultType()
export class SubsonicResponseRandomSongs {
	@SubsonicObjField(() => SubsonicSongs)
	randomSongs!: SubsonicSongs;
}

@SubsonicResultType()
export class SubsonicResponseNowPlaying {
	@SubsonicObjField(() => SubsonicNowPlaying)
	nowPlaying!: SubsonicNowPlaying;
}

@SubsonicResultType()
export class SubsonicResponseAlbumList {
	@SubsonicObjField(() => SubsonicAlbumList)
	albumList!: SubsonicAlbumList;
}

@SubsonicResultType()
export class SubsonicResponseAlbumList2 {
	@SubsonicObjField(() => SubsonicAlbumList2)
	albumList2!: SubsonicAlbumList2;
}

@SubsonicResultType()
export class SubsonicResponseSongsByGenre {
	@SubsonicObjField(() => SubsonicSongs)
	songsByGenre!: SubsonicSongs;
}

@SubsonicResultType()
export class SubsonicResponseStarred {
	@SubsonicObjField(() => SubsonicStarred)
	starred!: SubsonicStarred;
}

@SubsonicResultType()
export class SubsonicResponseStarred2 {
	@SubsonicObjField(() => SubsonicStarred2)
	starred2!: SubsonicStarred2;
}

@SubsonicResultType()
export class SubsonicResponseLyrics {
	@SubsonicObjField(() => SubsonicLyrics)
	lyrics!: SubsonicLyrics;
}

@SubsonicResultType()
export class SubsonicStructuredLyricsList {
	@SubsonicObjField(() => SubsonicStructuredLyrics)
	structuredLyrics!: Array<SubsonicStructuredLyrics>;
}

@SubsonicResultType()
export class SubsonicResponseLyricsList {
	@SubsonicObjField(() => SubsonicStructuredLyricsList)
	lyricsList!: SubsonicStructuredLyricsList;
}

@SubsonicResultType()
export class SubsonicResponsePlaylistWithSongs {
	@SubsonicObjField(() => SubsonicPlaylistWithSongs)
	playlist!: SubsonicPlaylistWithSongs;
}

@SubsonicResultType()
export class SubsonicResponsePlaylists {
	@SubsonicObjField(() => SubsonicPlaylists)
	playlists!: SubsonicPlaylists;
}

@SubsonicResultType()
export class SubsonicResponsePlaylist {
	@SubsonicObjField(() => SubsonicPlaylist)
	playlist!: SubsonicPlaylist;
}

@SubsonicResultType()
export class SubsonicResponsePodcasts {
	@SubsonicObjField(() => SubsonicPodcasts)
	podcasts!: SubsonicPodcasts;
}

@SubsonicResultType()
export class SubsonicResponseNewestPodcasts {
	@SubsonicObjField(() => SubsonicNewestPodcasts)
	newestPodcasts!: SubsonicNewestPodcasts;
}

@SubsonicResultType()
export class SubsonicResponseSearchResult {
	@SubsonicObjField(() => SubsonicSearchResult)
	searchResult!: SubsonicSearchResult;
}

@SubsonicResultType()
export class SubsonicResponseSearchResult2 {
	@SubsonicObjField(() => SubsonicSearchResult2)
	searchResult2!: SubsonicSearchResult2;
}

@SubsonicResultType()
export class SubsonicResponseSearchResult3 {
	@SubsonicObjField(() => SubsonicSearchResult3)
	searchResult3!: SubsonicSearchResult3;
}

@SubsonicResultType()
export class SubsonicResponseShares {
	@SubsonicObjField(() => SubsonicShares)
	shares!: SubsonicShares;
}

@SubsonicResultType()
export class SubsonicResponseLicense {
	@SubsonicObjField(() => SubsonicLicense)
	license!: SubsonicLicense;
}

@SubsonicResultType()
export class SubsonicResponseJukeboxStatus {
	@SubsonicObjField(() => SubsonicJukeboxStatus)
	jukeboxStatus!: SubsonicJukeboxStatus;
}

@SubsonicResultType()
export class SubsonicResponseUsers {
	@SubsonicObjField(() => SubsonicUsers)
	users!: SubsonicUsers;
}

@SubsonicResultType()
export class SubsonicResponseUser {
	@SubsonicObjField(() => SubsonicUser)
	user!: SubsonicUser;
}

@SubsonicResultType()
export class SubsonicOKResponse {
}

@SubsonicResultType()
export class SubsonicOpenSubsonicExt {
	@SubsonicObjField()
	name!: string;

	@SubsonicObjField(() => [Number])
	versions!: Array<number>;
}

@SubsonicResultType()
export class SubsonicOpenSubsonicResponse {
	@SubsonicObjField(() => [SubsonicOpenSubsonicExt])
	openSubsonicExtensions!: Array<SubsonicOpenSubsonicExt>;
}
