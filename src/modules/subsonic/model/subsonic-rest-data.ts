import { SubsonicResultType } from '../decorators/subsonic-result-type.js';
import { SubsonicObjectField } from '../decorators/subsonic-object-field.js';

export interface SubsonicResponse {
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
	type: string;
	serverVersion: string;
	openSubsonic: boolean;
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
	@SubsonicObjectField(() => [SubsonicMusicFolder])
	musicFolder?: Array<SubsonicMusicFolder>;
}

@SubsonicResultType()
export class SubsonicMusicFolder {
	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	name?: string;
}

@SubsonicResultType()
export class SubsonicIndexes {
	@SubsonicObjectField(() => [SubsonicArtist])
	shortcut?: Array<SubsonicArtist>;

	@SubsonicObjectField(() => [SubsonicIndex])
	index?: Array<SubsonicIndex>;

	@SubsonicObjectField(() => [SubsonicChild])
	child?: Array<SubsonicChild>; //  Added in 1.7.0

	@SubsonicObjectField()
	lastModified!: number;

	@SubsonicObjectField()
	ignoredArticles!: string; //  Added in 1.10.0
}

@SubsonicResultType()
export class SubsonicIndex {
	@SubsonicObjectField(() => [SubsonicArtist])
	artist?: Array<SubsonicArtist>;

	@SubsonicObjectField()
	name!: string;
}

@SubsonicResultType()
export class SubsonicArtist {
	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	name!: string;

	@SubsonicObjectField()
	starred?: SubsonicDateTime; //  Added in 1.10.1

	@SubsonicObjectField()
	userRating?: SubsonicUserRating; //  Added in 1.13.0

	@SubsonicObjectField()
	averageRating?: SubsonicAverageRating; //  Added in 1.13.0

	@SubsonicObjectField()
	albumCount?: number; // OpenSubsonic

	@SubsonicObjectField()
	musicBrainzId?: string; // OpenSubsonic

	@SubsonicObjectField()
	artistImageUrl?: string; // OpenSubsonic
}

@SubsonicResultType()
export class SubsonicGenres {
	@SubsonicObjectField(() => [SubsonicGenre])
	genre?: Array<SubsonicGenre>;
}

@SubsonicResultType()
export class SubsonicGenre {
	@SubsonicObjectField()
	value!: string;

	@SubsonicObjectField()
	songCount!: number; //  Added in 1.10.2

	@SubsonicObjectField()
	albumCount!: number; //  Added in 1.10.2

	@SubsonicObjectField()
	artistCount!: number; //  undocumented?
}

@SubsonicResultType()
export class SubsonicArtistsID3 {
	@SubsonicObjectField(() => [SubsonicIndexID3])
	index?: Array<SubsonicIndexID3>;

	@SubsonicObjectField()
	ignoredArticles!: string; //  Added in 1.10.0
}

@SubsonicResultType()
export class SubsonicIndexID3 {
	@SubsonicObjectField(() => [SubsonicArtistID3])
	artist?: Array<SubsonicArtistID3>;

	@SubsonicObjectField()
	name!: string;
}

@SubsonicResultType()
export class SubsonicArtistID3 {
	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	name!: string;

	@SubsonicObjectField()
	albumCount!: number;

	@SubsonicObjectField()
	userRating?: number;

	@SubsonicObjectField()
	coverArt?: SubsonicID;

	@SubsonicObjectField()
	starred?: SubsonicDateTime;

	@SubsonicObjectField()
	artistImageUrl?: string;

	@SubsonicObjectField()
	musicBrainzId?: string; // OpenSubsonic

	@SubsonicObjectField()
	sortName?: string; // OpenSubsonic

	@SubsonicObjectField(() => [String])
	roles?: Array<string>; // OpenSubsonic
}

@SubsonicResultType()
export class SubsonicArtistWithAlbumsID3 extends SubsonicArtistID3 {
	@SubsonicObjectField(() => [SubsonicAlbumID3])
	album?: Array<SubsonicAlbumID3>;
}

@SubsonicResultType()
export class SubsonicListDiscTitle {
	@SubsonicObjectField()
	disc?: number;

	@SubsonicObjectField()
	title?: string;
}

@SubsonicResultType()
export class SubsonicListDate {
	@SubsonicObjectField()
	year?: number;

	@SubsonicObjectField()
	month?: number;

	@SubsonicObjectField()
	day?: number;
}

@SubsonicResultType()
export class SubsonicListArtist {
	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	name!: string;
}

@SubsonicResultType()
export class SubsonicAlbumID3 {
	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	name!: string;

	@SubsonicObjectField()
	artist?: string;

	@SubsonicObjectField()
	artistId?: SubsonicID;

	@SubsonicObjectField()
	coverArt?: SubsonicID;

	@SubsonicObjectField()
	songCount!: number;

	@SubsonicObjectField()
	duration!: number;

	@SubsonicObjectField()
	playCount?: number; //  Added in 1.14.0

	@SubsonicObjectField()
	created!: SubsonicDateTime;

	@SubsonicObjectField()
	starred?: SubsonicDateTime;

	@SubsonicObjectField()
	year?: number; //  Added in 1.10.1

	@SubsonicObjectField()
	genre?: string; //  Added in 1.10.1

	@SubsonicObjectField()
	played?: string; // OpenSubsonic

	@SubsonicObjectField()
	userRating?: number; // OpenSubsonic

	@SubsonicObjectField(() => [SubsonicListRecordLabel])
	recordLabels?: Array<SubsonicListRecordLabel>; // OpenSubsonic

	@SubsonicObjectField()
	musicBrainzId?: string; // OpenSubsonic

	@SubsonicObjectField(() => [SubsonicListGenre])
	genres?: Array<SubsonicListGenre>; // OpenSubsonic

	@SubsonicObjectField(() => [SubsonicListArtist])
	artists?: Array<SubsonicListArtist>; // OpenSubsonic

	@SubsonicObjectField()
	displayArtist?: string; // OpenSubsonic

	@SubsonicObjectField(() => [String])
	releaseTypes?: Array<string>; // OpenSubsonic

	@SubsonicObjectField(() => [String])
	moods?: Array<string>; // OpenSubsonic

	@SubsonicObjectField()
	sortName?: string; // OpenSubsonic

	@SubsonicObjectField(() => SubsonicListDate)
	originalReleaseDate?: SubsonicListDate; // OpenSubsonic

	@SubsonicObjectField(() => SubsonicListDate)
	releaseDate?: SubsonicListDate; // OpenSubsonic

	@SubsonicObjectField()
	isCompilation?: boolean; // OpenSubsonic

	@SubsonicObjectField(() => [SubsonicListDiscTitle])
	discTitles?: Array<SubsonicListDiscTitle>; // OpenSubsonic
}

@SubsonicResultType()
export class SubsonicListGenre {
	@SubsonicObjectField()
	name!: string;
}

@SubsonicResultType()
export class SubsonicListRecordLabel {
	@SubsonicObjectField()
	name!: string;
}

@SubsonicResultType()
export class SubsonicAlbumWithSongsID3 extends SubsonicAlbumID3 {
	@SubsonicObjectField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicVideos {
	@SubsonicObjectField(() => [SubsonicChild])
	video?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicVideoInfo {
	@SubsonicObjectField(() => [SubsonicCaptions])
	captions?: Array<SubsonicCaptions>;

	@SubsonicObjectField(() => [SubsonicAudioTrack])
	audioTrack?: Array<SubsonicAudioTrack>;

	@SubsonicObjectField(() => [SubsonicVideoConversion])
	conversion?: Array<SubsonicVideoConversion>;

	@SubsonicObjectField()
	id!: SubsonicID;
}

@SubsonicResultType()
export class SubsonicCaptions {
	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	name?: string;
}

@SubsonicResultType()
export class SubsonicAudioTrack {
	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	name?: string;

	@SubsonicObjectField()
	languageCode?: string;
}

@SubsonicResultType()
export class SubsonicVideoConversion {
	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	bitRate?: number; //  In Kbps

	@SubsonicObjectField()
	audioTrackId?: number;
}

@SubsonicResultType()
export class SubsonicDirectory {
	@SubsonicObjectField(() => [SubsonicChild])
	child?: Array<SubsonicChild>;

	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	parent?: SubsonicID;

	@SubsonicObjectField()
	name!: string;

	@SubsonicObjectField()
	starred?: SubsonicDateTime; //  Added in 1.10.1

	@SubsonicObjectField()
	userRating?: SubsonicUserRating; //  Added in 1.13.0

	@SubsonicObjectField()
	averageRating?: SubsonicAverageRating; //  Added in 1.13.0

	@SubsonicObjectField()
	playCount?: number; //  Added in 1.14.0
}

@SubsonicResultType()
export class SubSonicReplayGain {
	@SubsonicObjectField()
	trackGain!: number;

	@SubsonicObjectField()
	albumGain!: number;

	@SubsonicObjectField()
	trackPeak!: number;

	@SubsonicObjectField()
	albumPeak!: number;

	@SubsonicObjectField()
	baseGain!: number;

	@SubsonicObjectField()
	fallbackGain!: number;
}

@SubsonicResultType()
export class SubsonicChild {
	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	parent?: SubsonicID;

	@SubsonicObjectField()
	isDir!: boolean;

	@SubsonicObjectField()
	title!: string;

	@SubsonicObjectField()
	album?: string;

	@SubsonicObjectField()
	artist?: string;

	@SubsonicObjectField()
	track?: number;

	@SubsonicObjectField()
	year?: number;

	@SubsonicObjectField()
	genre?: string;

	@SubsonicObjectField()
	coverArt?: SubsonicID;

	@SubsonicObjectField()
	size?: number;

	@SubsonicObjectField()
	contentType?: string;

	@SubsonicObjectField()
	suffix?: string;

	@SubsonicObjectField()
	transcodedContentType?: string;

	@SubsonicObjectField()
	transcodedSuffix?: string;

	@SubsonicObjectField()
	duration?: number;

	@SubsonicObjectField()
	bitRate?: number;

	@SubsonicObjectField()
	path?: string;

	@SubsonicObjectField()
	isVideo?: boolean; //  Added in 1.4.1

	@SubsonicObjectField()
	userRating?: SubsonicUserRating; //  Added in 1.6.0

	@SubsonicObjectField()
	averageRating?: SubsonicAverageRating; //  Added in 1.6.0

	@SubsonicObjectField()
	playCount?: number; //  Added in 1.14.0

	@SubsonicObjectField()
	discNumber?: number; //  Added in 1.8.0

	@SubsonicObjectField()
	created?: SubsonicDateTime; //  Added in 1.8.0

	@SubsonicObjectField()
	starred?: SubsonicDateTime; //  Added in 1.8.0

	@SubsonicObjectField()
	albumId?: SubsonicID; //  Added in 1.8.0

	@SubsonicObjectField()
	artistId?: SubsonicID; //  Added in 1.8.0

	@SubsonicObjectField()
	type?: SubsonicMediaType; //  Added in 1.8.0

	@SubsonicObjectField()
	bookmarkPosition?: number; //  In millis. Added in 1.10.1

	@SubsonicObjectField()
	originalWidth?: number; //  Added in 1.13.0

	@SubsonicObjectField()
	originalHeight?: number; //  Added in 1.13.0

	@SubsonicObjectField()
	bitDepth?: number; //  OpenSubsonic

	@SubsonicObjectField()
	samplingRate?: number; //  OpenSubsonic

	@SubsonicObjectField()
	channelCount?: number; //  OpenSubsonic

	@SubsonicObjectField()
	mediaType?: string; //  OpenSubsonic

	@SubsonicObjectField()
	played?: string; //  OpenSubsonic

	@SubsonicObjectField()
	bpm?: number; //  OpenSubsonic

	@SubsonicObjectField()
	comment?: string; //  OpenSubsonic

	@SubsonicObjectField()
	sortName?: string; //  OpenSubsonic

	@SubsonicObjectField()
	musicBrainzId?: string; //  OpenSubsonic

	@SubsonicObjectField(() => [SubsonicListGenre])
	genres?: Array<SubsonicListGenre>; //  OpenSubsonic

	@SubsonicObjectField(() => [SubsonicArtistsID3])
	artists?: Array<SubsonicArtistsID3>; //  OpenSubsonic

	@SubsonicObjectField(() => [SubsonicArtistsID3])
	albumArtists?: Array<SubsonicArtistsID3>; //  OpenSubsonic

	@SubsonicObjectField(() => [SubsonicContributor])
	contributors?: Array<SubsonicContributor>; //  OpenSubsonic

	@SubsonicObjectField()
	displayArtist?: string; //  OpenSubsonic

	@SubsonicObjectField()
	displayAlbumArtist?: string; //  OpenSubsonic

	@SubsonicObjectField()
	displayComposer?: string; //  OpenSubsonic

	@SubsonicObjectField(() => [String])
	moods?: Array<string>; // OpenSubsonic

	@SubsonicObjectField(() => SubSonicReplayGain)
	replayGain?: SubSonicReplayGain; // OpenSubsonic
}

@SubsonicResultType()
export class SubsonicContributor {
	@SubsonicObjectField()
	role!: string;

	@SubsonicObjectField()
	subRole?: string;

	@SubsonicObjectField(() => SubsonicArtistID3)
	artist?: SubsonicArtistID3;
}

@SubsonicResultType()
export class SubsonicNowPlaying {
	@SubsonicObjectField(() => [SubsonicNowPlayingEntry])
	entry?: Array<SubsonicNowPlayingEntry>;
}

@SubsonicResultType()
export class SubsonicNowPlayingEntry extends SubsonicChild {
	@SubsonicObjectField()
	username!: string;

	@SubsonicObjectField()
	minutesAgo!: number;

	@SubsonicObjectField()
	playerId!: number;

	@SubsonicObjectField()
	playerName?: string;
}

@SubsonicResultType()
export class SubsonicSearchResult {
	@SubsonicObjectField(() => [SubsonicChild])
	match?: Array<SubsonicChild>;

	@SubsonicObjectField()
	offset!: number;

	@SubsonicObjectField()
	totalHits!: number;
}

@SubsonicResultType()
export class SubsonicSearchResult2 {
	@SubsonicObjectField(() => [SubsonicArtist])
	artist?: Array<SubsonicArtist>;

	@SubsonicObjectField(() => [SubsonicChild])
	album?: Array<SubsonicChild>;

	@SubsonicObjectField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicSearchResult3 {
	@SubsonicObjectField(() => [SubsonicArtistID3])
	artist?: Array<SubsonicArtistID3>;

	@SubsonicObjectField(() => [SubsonicAlbumID3])
	album?: Array<SubsonicAlbumID3>;

	@SubsonicObjectField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicPlaylists {
	@SubsonicObjectField(() => [SubsonicPlaylist])
	playlist?: Array<SubsonicPlaylist>;
}

@SubsonicResultType()
export class SubsonicPlaylist {
	@SubsonicObjectField(() => [String])
	allowedUser?: Array<string>; // Added in 1.8.0

	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	name!: string;

	@SubsonicObjectField()
	comment?: string; // Added in 1.8.0

	@SubsonicObjectField()
	owner?: SubsonicID; // Added in 1.8.0

	@SubsonicObjectField()
	public?: boolean; // Added in 1.8.0

	@SubsonicObjectField()
	songCount!: number; // Added in 1.8.0

	@SubsonicObjectField()
	duration!: number; // Added in 1.8.0

	@SubsonicObjectField()
	created!: SubsonicDateTime; // Added in 1.8.0

	@SubsonicObjectField()
	changed!: SubsonicDateTime; // Added in 1.13.0

	@SubsonicObjectField()
	coverArt?: string; // Added in 1.11.0

	@SubsonicObjectField()
	starred?: SubsonicDateTime;

	@SubsonicObjectField()
	userRating?: number;
}

@SubsonicResultType()
export class SubsonicPlaylistWithSongs extends SubsonicPlaylist {
	@SubsonicObjectField(() => [SubsonicChild])
	entry?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicJukeboxStatus {
	@SubsonicObjectField()
	currentIndex!: number;

	@SubsonicObjectField()
	playing!: boolean;

	@SubsonicObjectField()
	gain!: number;

	@SubsonicObjectField()
	position?: number; // Added in 1.7.0
}

@SubsonicResultType()
export class SubsonicJukeboxPlaylist extends SubsonicJukeboxStatus {
	@SubsonicObjectField(() => [SubsonicChild])
	entry?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicChatMessages {
	@SubsonicObjectField(() => [SubsonicChatMessage])
	chatMessage?: Array<SubsonicChatMessage>;
}

@SubsonicResultType()
export class SubsonicChatMessage {
	@SubsonicObjectField()
	username!: string;

	@SubsonicObjectField()
	time!: number;

	@SubsonicObjectField()
	message!: string;
}

@SubsonicResultType()
export class SubsonicAlbumList {
	@SubsonicObjectField(() => [SubsonicChild])
	album?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicAlbumList2 {
	@SubsonicObjectField(() => [SubsonicAlbumID3])
	album?: Array<SubsonicAlbumID3>;
}

@SubsonicResultType()
export class SubsonicSongs {
	@SubsonicObjectField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicLyrics {
	@SubsonicObjectField()
	value!: string;

	@SubsonicObjectField()
	artist?: string;

	@SubsonicObjectField()
	title?: string;
}

@SubsonicResultType()
export class SubsonicLyricsLine {
	@SubsonicObjectField()
	value!: string;

	@SubsonicObjectField()
	start?: number;
}

@SubsonicResultType()
export class SubsonicStructuredLyrics {
	@SubsonicObjectField()
	lang!: string;

	@SubsonicObjectField()
	synced!: boolean;

	@SubsonicObjectField(() => [SubsonicLyricsLine])
	line?: Array<SubsonicLyricsLine>;

	@SubsonicObjectField()
	displayArtist?: string;

	@SubsonicObjectField()
	displayTitle?: string;

	@SubsonicObjectField()
	offset?: number;
}

@SubsonicResultType()
export class SubsonicPodcasts {
	@SubsonicObjectField(() => [SubsonicPodcastChannel])
	channel?: Array<SubsonicPodcastChannel>;
}

@SubsonicResultType()
export class SubsonicPodcastChannel {
	@SubsonicObjectField(() => [SubsonicPodcastEpisode])
	episode?: Array<SubsonicPodcastEpisode>;

	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	url!: string;

	@SubsonicObjectField()
	title?: string;

	@SubsonicObjectField()
	description?: string;

	@SubsonicObjectField()
	coverArt?: string; //  Added in 1.13.0

	@SubsonicObjectField()
	originalImageUrl?: string; //  Added in 1.13.0

	@SubsonicObjectField()
	status!: SubsonicPodcastStatus;

	@SubsonicObjectField()
	errorMessage?: string;
}

@SubsonicResultType()
export class SubsonicNewestPodcasts {
	@SubsonicObjectField(() => [SubsonicPodcastEpisode])
	episode?: Array<SubsonicPodcastEpisode>;
}

@SubsonicResultType()
export class SubsonicPodcastEpisode extends SubsonicChild {
	@SubsonicObjectField()
	streamId?: SubsonicID; //  Use this ID for streaming the podcast.

	@SubsonicObjectField()
	channelId!: SubsonicID; //  Added in 1.13.0

	@SubsonicObjectField()
	description?: string;

	@SubsonicObjectField()
	status!: SubsonicPodcastStatus;

	@SubsonicObjectField()
	publishDate?: SubsonicDateTime;
}

@SubsonicResultType()
export class SubsonicInternetRadioStations {
	@SubsonicObjectField(() => [SubsonicInternetRadioStation])
	internetRadioStation?: Array<SubsonicInternetRadioStation>;
}

@SubsonicResultType()
export class SubsonicInternetRadioStation {
	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	name!: string;

	@SubsonicObjectField()
	streamUrl!: string;

	@SubsonicObjectField()
	homePageUrl?: string;
}

@SubsonicResultType()
export class SubsonicBookmarks {
	@SubsonicObjectField(() => [SubsonicBookmark])
	bookmark?: Array<SubsonicBookmark>;
}

@SubsonicResultType()
export class SubsonicBookmark {
	@SubsonicObjectField(() => SubsonicChild)
	entry!: SubsonicChild;

	@SubsonicObjectField()
	position!: number; //  In milliseconds

	@SubsonicObjectField()
	username!: string;

	@SubsonicObjectField()
	comment?: string;

	@SubsonicObjectField()
	created!: SubsonicDateTime;

	@SubsonicObjectField()
	changed!: SubsonicDateTime;
}

@SubsonicResultType()
export class SubsonicPlayQueue {
	@SubsonicObjectField(() => SubsonicChild)
	entry?: Array<SubsonicChild>;

	@SubsonicObjectField()
	current?: number; //  ID of currently playing track

	@SubsonicObjectField()
	position?: number; //  Position in milliseconds of currently playing track

	@SubsonicObjectField()
	username!: string;

	@SubsonicObjectField()
	changed!: SubsonicDateTime;

	@SubsonicObjectField()
	changedBy!: string; //  Name of client app
}

@SubsonicResultType()
export class SubsonicShares {
	@SubsonicObjectField(() => [SubsonicShare])
	share?: Array<SubsonicShare>;
}

@SubsonicResultType()
export class SubsonicShare {
	@SubsonicObjectField(() => [SubsonicChild])
	entry?: Array<SubsonicChild>;

	@SubsonicObjectField()
	id!: SubsonicID;

	@SubsonicObjectField()
	url!: string;

	@SubsonicObjectField()
	description?: string;

	@SubsonicObjectField()
	username!: string;

	@SubsonicObjectField()
	created!: SubsonicDateTime;

	@SubsonicObjectField()
	expires?: SubsonicDateTime;

	@SubsonicObjectField()
	lastVisited?: SubsonicDateTime;

	@SubsonicObjectField()
	visitCount!: number;
}

@SubsonicResultType()
export class SubsonicStarred {
	@SubsonicObjectField(() => [SubsonicArtist])
	artist?: Array<SubsonicArtist>;

	@SubsonicObjectField(() => [SubsonicChild])
	album?: Array<SubsonicChild>;

	@SubsonicObjectField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicAlbumInfo {
	@SubsonicObjectField()
	notes?: string;

	@SubsonicObjectField()
	musicBrainzId?: string;

	@SubsonicObjectField()
	lastFmUrl?: string;

	@SubsonicObjectField()
	smallImageUrl?: string;

	@SubsonicObjectField()
	mediumImageUrl?: string;

	@SubsonicObjectField()
	largeImageUrl?: string;
}

@SubsonicResultType()
export class SubsonicArtistInfoBase {
	@SubsonicObjectField()
	biography?: string;

	@SubsonicObjectField()
	musicBrainzId?: string;

	@SubsonicObjectField()
	lastFmUrl?: string;

	@SubsonicObjectField()
	smallImageUrl?: string;

	@SubsonicObjectField()
	mediumImageUrl?: string;

	@SubsonicObjectField()
	largeImageUrl?: string;
}

@SubsonicResultType()
export class SubsonicArtistInfo extends SubsonicArtistInfoBase {
	@SubsonicObjectField(() => [SubsonicArtist])
	similarArtist?: Array<SubsonicArtist>;
}

@SubsonicResultType()
export class SubsonicArtistInfo2 extends SubsonicArtistInfoBase {
	@SubsonicObjectField(() => [SubsonicArtistID3])
	similarArtist?: Array<SubsonicArtistID3>;
}

@SubsonicResultType()
export class SubsonicSimilarSongs {
	@SubsonicObjectField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicSimilarSongs2 {
	@SubsonicObjectField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicTopSongs {
	@SubsonicObjectField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicStarred2 {
	@SubsonicObjectField(() => [SubsonicArtistID3])
	artist?: Array<SubsonicArtistID3>;

	@SubsonicObjectField(() => [SubsonicAlbumID3])
	album?: Array<SubsonicAlbumID3>;

	@SubsonicObjectField(() => [SubsonicChild])
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicLicense {
	@SubsonicObjectField()
	valid!: boolean;

	@SubsonicObjectField()
	email?: string;

	@SubsonicObjectField()
	licenseExpires?: SubsonicDateTime;

	@SubsonicObjectField()
	trialExpires?: SubsonicDateTime;
}

@SubsonicResultType()
export class SubsonicScanStatus {
	@SubsonicObjectField()
	scanning!: boolean;

	@SubsonicObjectField()
	count?: number;
}

@SubsonicResultType()
export class SubsonicUsers {
	@SubsonicObjectField(() => [SubsonicUser])
	user?: Array<SubsonicUser>;
}

@SubsonicResultType()
export class SubsonicUser {
	@SubsonicObjectField(() => [String])
	folder?: Array<SubsonicID>; //  Added in 1.12.0

	@SubsonicObjectField()
	username!: string;

	@SubsonicObjectField()
	email?: string; //  Added in 1.6.0

	@SubsonicObjectField()
	scrobblingEnabled!: boolean; //  Added in 1.7.0

	@SubsonicObjectField()
	maxBitRate?: number; //  In Kbps, added in 1.13.0

	@SubsonicObjectField()
	adminRole!: boolean;

	@SubsonicObjectField()
	settingsRole!: boolean;

	@SubsonicObjectField()
	downloadRole!: boolean;

	@SubsonicObjectField()
	uploadRole!: boolean;

	@SubsonicObjectField()
	playlistRole!: boolean;

	@SubsonicObjectField()
	coverArtRole!: boolean;

	@SubsonicObjectField()
	commentRole!: boolean;

	@SubsonicObjectField()
	podcastRole!: boolean;

	@SubsonicObjectField()
	streamRole!: boolean;

	@SubsonicObjectField()
	jukeboxRole!: boolean;

	@SubsonicObjectField()
	shareRole!: boolean; //  Added in 1.7.0

	@SubsonicObjectField()
	videoConversionRole!: boolean; //  Added in 1.14.0

	@SubsonicObjectField()
	avatarLastChanged?: SubsonicDateTime; //  Added in 1.14.0
}

@SubsonicResultType()
export class SubsonicError {
	@SubsonicObjectField()
	code!: number;

	@SubsonicObjectField()
	message?: string;
}

@SubsonicResultType()
export class SubsonicResponseBookmarks {
	@SubsonicObjectField(() => SubsonicBookmarks)
	bookmarks!: SubsonicBookmarks;
}

@SubsonicResultType()
export class SubsonicResponsePlayQueue {
	@SubsonicObjectField(() => SubsonicPlayQueue)
	playQueue!: SubsonicPlayQueue;
}

@SubsonicResultType()
export class SubsonicResponseArtistWithAlbumsID3 {
	@SubsonicObjectField(() => SubsonicArtistWithAlbumsID3)
	artist!: SubsonicArtistWithAlbumsID3;
}

@SubsonicResultType()
export class SubsonicResponseAlbumWithSongsID3 {
	@SubsonicObjectField(() => SubsonicAlbumWithSongsID3)
	album!: SubsonicAlbumWithSongsID3;
}

@SubsonicResultType()
export class SubsonicResponseArtistInfo {
	@SubsonicObjectField(() => SubsonicArtistInfo)
	artistInfo!: SubsonicArtistInfo;
}

@SubsonicResultType()
export class SubsonicResponseArtistInfo2 {
	@SubsonicObjectField(() => SubsonicArtistInfo2)
	artistInfo2!: SubsonicArtistInfo2;
}

@SubsonicResultType()
export class SubsonicResponseAlbumInfo {
	@SubsonicObjectField(() => SubsonicAlbumInfo)
	albumInfo!: SubsonicAlbumInfo;
}

@SubsonicResultType()
export class SubsonicResponseIndexes {
	@SubsonicObjectField(() => SubsonicIndexes)
	indexes?: SubsonicIndexes;
}

@SubsonicResultType()
export class SubsonicResponseArtistsID3 {
	@SubsonicObjectField(() => SubsonicArtistsID3)
	artists!: SubsonicArtistsID3;
}

@SubsonicResultType()
export class SubsonicResponseDirectory {
	@SubsonicObjectField(() => SubsonicDirectory)
	directory!: SubsonicDirectory;
}

@SubsonicResultType()
export class SubsonicResponseGenres {
	@SubsonicObjectField(() => SubsonicGenres)
	genres!: SubsonicGenres;
}

@SubsonicResultType()
export class SubsonicResponseMusicFolders {
	@SubsonicObjectField(() => SubsonicMusicFolders)
	musicFolders!: SubsonicMusicFolders;
}

@SubsonicResultType()
export class SubsonicResponseSimilarSongs {
	@SubsonicObjectField(() => SubsonicSimilarSongs)
	similarSongs!: SubsonicSimilarSongs;
}

@SubsonicResultType()
export class SubsonicResponseSimilarSongs2 {
	@SubsonicObjectField(() => SubsonicSimilarSongs2)
	similarSongs2!: SubsonicSimilarSongs2;
}

@SubsonicResultType()
export class SubsonicResponseSong {
	@SubsonicObjectField(() => SubsonicChild)
	song!: SubsonicChild;
}

@SubsonicResultType()
export class SubsonicResponseTopSongs {
	@SubsonicObjectField(() => SubsonicTopSongs)
	topSongs!: SubsonicTopSongs;
}

@SubsonicResultType()
export class SubsonicResponseVideos {
	@SubsonicObjectField(() => SubsonicVideos)
	videos!: SubsonicVideos;
}

@SubsonicResultType()
export class SubsonicResponseVideoInfo {
	@SubsonicObjectField(() => SubsonicVideoInfo)
	videoInfo!: SubsonicVideoInfo;
}

@SubsonicResultType()
export class SubsonicResponseChatMessages {
	@SubsonicObjectField(() => SubsonicChatMessages)
	chatMessages!: SubsonicChatMessages;
}

@SubsonicResultType()
export class SubsonicResponseInternetRadioStations {
	@SubsonicObjectField(() => SubsonicInternetRadioStations)
	internetRadioStations!: SubsonicInternetRadioStations;
}

@SubsonicResultType()
export class SubsonicResponseScanStatus {
	@SubsonicObjectField(() => SubsonicScanStatus)
	scanStatus!: SubsonicScanStatus;
}

@SubsonicResultType()
export class SubsonicResponseRandomSongs {
	@SubsonicObjectField(() => SubsonicSongs)
	randomSongs!: SubsonicSongs;
}

@SubsonicResultType()
export class SubsonicResponseNowPlaying {
	@SubsonicObjectField(() => SubsonicNowPlaying)
	nowPlaying!: SubsonicNowPlaying;
}

@SubsonicResultType()
export class SubsonicResponseAlbumList {
	@SubsonicObjectField(() => SubsonicAlbumList)
	albumList!: SubsonicAlbumList;
}

@SubsonicResultType()
export class SubsonicResponseAlbumList2 {
	@SubsonicObjectField(() => SubsonicAlbumList2)
	albumList2!: SubsonicAlbumList2;
}

@SubsonicResultType()
export class SubsonicResponseSongsByGenre {
	@SubsonicObjectField(() => SubsonicSongs)
	songsByGenre!: SubsonicSongs;
}

@SubsonicResultType()
export class SubsonicResponseStarred {
	@SubsonicObjectField(() => SubsonicStarred)
	starred!: SubsonicStarred;
}

@SubsonicResultType()
export class SubsonicResponseStarred2 {
	@SubsonicObjectField(() => SubsonicStarred2)
	starred2!: SubsonicStarred2;
}

@SubsonicResultType()
export class SubsonicResponseLyrics {
	@SubsonicObjectField(() => SubsonicLyrics)
	lyrics!: SubsonicLyrics;
}

@SubsonicResultType()
export class SubsonicStructuredLyricsList {
	@SubsonicObjectField(() => SubsonicStructuredLyrics)
	structuredLyrics!: Array<SubsonicStructuredLyrics>;
}

@SubsonicResultType()
export class SubsonicResponseLyricsList {
	@SubsonicObjectField(() => SubsonicStructuredLyricsList)
	lyricsList!: SubsonicStructuredLyricsList;
}

@SubsonicResultType()
export class SubsonicResponsePlaylistWithSongs {
	@SubsonicObjectField(() => SubsonicPlaylistWithSongs)
	playlist!: SubsonicPlaylistWithSongs;
}

@SubsonicResultType()
export class SubsonicResponsePlaylists {
	@SubsonicObjectField(() => SubsonicPlaylists)
	playlists!: SubsonicPlaylists;
}

@SubsonicResultType()
export class SubsonicResponsePlaylist {
	@SubsonicObjectField(() => SubsonicPlaylist)
	playlist!: SubsonicPlaylist;
}

@SubsonicResultType()
export class SubsonicResponsePodcasts {
	@SubsonicObjectField(() => SubsonicPodcasts)
	podcasts!: SubsonicPodcasts;
}

@SubsonicResultType()
export class SubsonicResponseNewestPodcasts {
	@SubsonicObjectField(() => SubsonicNewestPodcasts)
	newestPodcasts!: SubsonicNewestPodcasts;
}

@SubsonicResultType()
export class SubsonicResponseSearchResult {
	@SubsonicObjectField(() => SubsonicSearchResult)
	searchResult!: SubsonicSearchResult;
}

@SubsonicResultType()
export class SubsonicResponseSearchResult2 {
	@SubsonicObjectField(() => SubsonicSearchResult2)
	searchResult2!: SubsonicSearchResult2;
}

@SubsonicResultType()
export class SubsonicResponseSearchResult3 {
	@SubsonicObjectField(() => SubsonicSearchResult3)
	searchResult3!: SubsonicSearchResult3;
}

@SubsonicResultType()
export class SubsonicResponseShares {
	@SubsonicObjectField(() => SubsonicShares)
	shares!: SubsonicShares;
}

@SubsonicResultType()
export class SubsonicResponseLicense {
	@SubsonicObjectField(() => SubsonicLicense)
	license!: SubsonicLicense;
}

@SubsonicResultType()
export class SubsonicResponseJukeboxStatus {
	@SubsonicObjectField(() => SubsonicJukeboxStatus)
	jukeboxStatus!: SubsonicJukeboxStatus;
}

@SubsonicResultType()
export class SubsonicResponseUsers {
	@SubsonicObjectField(() => SubsonicUsers)
	users!: SubsonicUsers;
}

@SubsonicResultType()
export class SubsonicResponseUser {
	@SubsonicObjectField(() => SubsonicUser)
	user!: SubsonicUser;
}

@SubsonicResultType()
export class SubsonicOKResponse {
}

@SubsonicResultType()
export class SubsonicOpenSubsonicExtension {
	@SubsonicObjectField()
	name!: string;

	@SubsonicObjectField(() => [Number])
	versions!: Array<number>;
}

@SubsonicResultType()
export class SubsonicOpenSubsonicResponse {
	@SubsonicObjectField(() => [SubsonicOpenSubsonicExtension])
	openSubsonicExtensions!: Array<SubsonicOpenSubsonicExtension>;
}
