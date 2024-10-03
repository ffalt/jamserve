import { SubsonicResultType } from '../decorators/SubsonicResultType.js';

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
}

@SubsonicResultType()
export class SubsonicResponseBookmarks {
	bookmarks!: SubsonicBookmarks;
}

@SubsonicResultType()
export class SubsonicResponsePlayQueue {
	playQueue!: SubsonicPlayQueue;
}

@SubsonicResultType()
export class SubsonicResponseArtistWithAlbumsID3 {
	artist!: SubsonicArtistWithAlbumsID3;
}

@SubsonicResultType()
export class SubsonicResponseAlbumWithSongsID3 {
	album!: SubsonicAlbumWithSongsID3;
}

@SubsonicResultType()
export class SubsonicResponseArtistInfo {
	artistInfo!: SubsonicArtistInfo;
}

@SubsonicResultType()
export class SubsonicResponseArtistInfo2 {
	artistInfo2!: SubsonicArtistInfo2;
}

@SubsonicResultType()
export class SubsonicResponseAlbumInfo {
	albumInfo!: SubsonicAlbumInfo;
}

@SubsonicResultType()
export class SubsonicResponseIndexes {
	indexes!: SubsonicIndexes;
}

@SubsonicResultType()
export class SubsonicResponseArtistsID3 {
	artists!: SubsonicArtistsID3;
}

@SubsonicResultType()
export class SubsonicResponseDirectory {
	directory!: SubsonicDirectory;
}

@SubsonicResultType()
export class SubsonicResponseGenres {
	genres!: SubsonicGenres;
}

@SubsonicResultType()
export class SubsonicResponseMusicFolders {
	musicFolders!: SubsonicMusicFolders;
}

@SubsonicResultType()
export class SubsonicResponseSimilarSongs {
	similarSongs!: SubsonicSimilarSongs;
}

@SubsonicResultType()
export class SubsonicResponseSimilarSongs2 {
	similarSongs2!: SubsonicSimilarSongs2;
}

@SubsonicResultType()
export class SubsonicResponseSong {
	song!: SubsonicChild;
}

@SubsonicResultType()
export class SubsonicResponseTopSongs {
	topSongs!: SubsonicTopSongs;
}

@SubsonicResultType()
export class SubsonicResponseVideos {
	videos!: SubsonicVideos;
}

@SubsonicResultType()
export class SubsonicResponseVideoInfo {
	videoInfo!: SubsonicVideoInfo;
}

@SubsonicResultType()
export class SubsonicResponseChatMessages {
	chatMessages!: SubsonicChatMessages;
}

@SubsonicResultType()
export class SubsonicResponseInternetRadioStations {
	internetRadioStations!: SubsonicInternetRadioStations;
}

@SubsonicResultType()
export class SubsonicResponseScanStatus {
	scanStatus!: SubsonicScanStatus;
}

@SubsonicResultType()
export class SubsonicResponseRandomSongs {
	randomSongs!: SubsonicSongs;
}

@SubsonicResultType()
export class SubsonicResponseNowPlaying {
	nowPlaying!: SubsonicNowPlaying;
}

@SubsonicResultType()
export class SubsonicResponseAlbumList {
	albumList!: SubsonicAlbumList;
}

@SubsonicResultType()
export class SubsonicResponseAlbumList2 {
	albumList2!: SubsonicAlbumList2;
}

@SubsonicResultType()
export class SubsonicResponseSongsByGenre {
	songsByGenre!: SubsonicSongs;
}

@SubsonicResultType()
export class SubsonicResponseStarred {
	starred!: SubsonicStarred;
}

@SubsonicResultType()
export class SubsonicResponseStarred2 {
	starred2!: SubsonicStarred2;
}

@SubsonicResultType()
export class SubsonicResponseLyrics {
	lyrics!: SubsonicLyrics;
}

@SubsonicResultType()
export class SubsonicResponsePlaylistWithSongs {
	playlist!: SubsonicPlaylistWithSongs;
}

@SubsonicResultType()
export class SubsonicResponsePlaylists {
	playlists!: SubsonicPlaylists;
}

@SubsonicResultType()
export class SubsonicResponsePlaylist {
	playlist!: SubsonicPlaylist;
}

@SubsonicResultType()
export class SubsonicResponsePodcasts {
	podcasts!: SubsonicPodcasts;
}

@SubsonicResultType()
export class SubsonicResponseNewestPodcasts {
	newestPodcasts!: SubsonicNewestPodcasts;
}

@SubsonicResultType()
export class SubsonicResponseSearchResult {
	searchResult!: SubsonicSearchResult;
}

@SubsonicResultType()
export class SubsonicResponseSearchResult2 {
	searchResult2!: SubsonicSearchResult2;
}

@SubsonicResultType()
export class SubsonicResponseSearchResult3 {
	searchResult3!: SubsonicSearchResult3;
}

@SubsonicResultType()
export class SubsonicResponseShares {
	shares!: SubsonicShares;
}

@SubsonicResultType()
export class SubsonicResponseLicense {
	license!: SubsonicLicense;
}

@SubsonicResultType()
export class SubsonicResponseJukeboxStatus {
	jukeboxStatus!: SubsonicJukeboxStatus;
}

@SubsonicResultType()
export class SubsonicResponseUsers {
	users!: SubsonicUsers;
}

@SubsonicResultType()
export class SubsonicResponseUser {
	user!: SubsonicUser;
}

export type SubsonicResponseStatus = 'ok' | 'failed';

export type SubsonicVersion = string; // \d+\.\d+\.\d+

@SubsonicResultType()
export class SubsonicMusicFolders {
	musicFolder?: Array<SubsonicMusicFolder>;
}

@SubsonicResultType()
export class SubsonicMusicFolder {
	id!: number;
	name?: string;
}

@SubsonicResultType()
export class SubsonicIndexes {
	shortcut?: Array<SubsonicArtist>;
	index?: Array<SubsonicIndex>;
	child?: Array<SubsonicChild>; //  Added in 1.7.0
	lastModified!: number;
	ignoredArticles!: string; //  Added in 1.10.0
}

@SubsonicResultType()
export class SubsonicIndex {
	artist?: Array<SubsonicArtist>;
	name!: string;
}

@SubsonicResultType()
export class SubsonicArtist {
	id!: SubsonicID;
	name!: string;
	starred?: SubsonicDateTime; //  Added in 1.10.1
	userRating?: SubsonicUserRating; //  Added in 1.13.0
	averageRating?: SubsonicAverageRating; //  Added in 1.13.0
}

@SubsonicResultType()
export class SubsonicGenres {
	genre?: Array<SubsonicGenre>;
}

@SubsonicResultType()
export class SubsonicGenre {
	content!: string;
	songCount!: number; //  Added in 1.10.2
	albumCount!: number; //  Added in 1.10.2
	artistCount!: number; //  undocumented?
}

@SubsonicResultType()
export class SubsonicArtistsID3 {
	index?: Array<SubsonicIndexID3>;
	ignoredArticles!: string; //  Added in 1.10.0
}

@SubsonicResultType()
export class SubsonicIndexID3 {
	artist?: Array<SubsonicArtistID3>;
	name!: string;
}

@SubsonicResultType()
export class SubsonicArtistID3 {
	id!: SubsonicID;
	name!: string;
	albumCount!: number;
	coverArt?: number;
	starred?: SubsonicDateTime;
}

@SubsonicResultType()
export class SubsonicArtistWithAlbumsID3 extends SubsonicArtistID3 {
	album?: Array<SubsonicAlbumID3>;
}

@SubsonicResultType()
export class SubsonicAlbumID3 {
	id!: SubsonicID;
	name!: string;
	artist?: string;
	artistId?: number;
	coverArt?: number;
	songCount!: number;
	duration!: number;
	playCount?: number; //  Added in 1.14.0
	created!: SubsonicDateTime;
	starred?: SubsonicDateTime;
	year?: number; //  Added in 1.10.1
	genre?: string; //  Added in 1.10.1
}

@SubsonicResultType()
export class SubsonicAlbumWithSongsID3 extends SubsonicAlbumID3 {
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicVideos {
	video?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicVideoInfo {
	captions?: Array<SubsonicCaptions>;
	audioTrack?: Array<SubsonicAudioTrack>;
	conversion?: Array<SubsonicVideoConversion>;
	id!: SubsonicID;
}

@SubsonicResultType()
export class SubsonicCaptions {
	id!: SubsonicID;
	name?: string;
}

@SubsonicResultType()
export class SubsonicAudioTrack {
	id!: SubsonicID;
	name?: string;
	languageCode?: string;
}

@SubsonicResultType()
export class SubsonicVideoConversion {
	id!: SubsonicID;
	bitRate?: number; //  In Kbps
	audioTrackId?: number;
}

@SubsonicResultType()
export class SubsonicDirectory {
	child?: Array<SubsonicChild>;
	id!: SubsonicID;
	parent?: SubsonicID;
	name!: string;
	starred?: SubsonicDateTime; //  Added in 1.10.1
	userRating?: SubsonicUserRating; //  Added in 1.13.0
	averageRating?: SubsonicAverageRating; //  Added in 1.13.0
	playCount?: number; //  Added in 1.14.0
}

@SubsonicResultType()
export class SubsonicChild {
	id!: SubsonicID;
	parent?: SubsonicID;
	isDir!: boolean;
	title!: string;
	album?: string;
	artist?: string;
	track?: number;
	year?: number;
	genre?: string;
	coverArt?: number;
	size?: number;
	contentType?: string;
	suffix?: string;
	transcodedContentType?: string;
	transcodedSuffix?: string;
	duration?: number;
	bitRate?: number;
	path?: string;
	isVideo?: boolean; //  Added in 1.4.1
	userRating?: SubsonicUserRating; //  Added in 1.6.0
	averageRating?: SubsonicAverageRating; //  Added in 1.6.0
	playCount?: number; //  Added in 1.14.0
	discNumber?: number; //  Added in 1.8.0
	created?: SubsonicDateTime; //  Added in 1.8.0
	starred?: SubsonicDateTime; //  Added in 1.8.0
	albumId?: SubsonicID; //  Added in 1.8.0
	artistId?: SubsonicID; //  Added in 1.8.0
	type?: SubsonicMediaType; //  Added in 1.8.0
	bookmarkPosition?: number; //  In millis. Added in 1.10.1
	originalWidth?: number; //  Added in 1.13.0
	originalHeight?: number; //  Added in 1.13.0
}

export type SubsonicMediaType = 'music' | 'podcast' | 'audiobook' | 'video';

export type SubsonicUserRating = number; // 1 <= x <= 5

export type SubsonicAverageRating = number; // 1.0 <= x <= 5.0

@SubsonicResultType()
export class SubsonicNowPlaying {
	entry?: Array<SubsonicNowPlayingEntry>;
}

@SubsonicResultType()
export class SubsonicNowPlayingEntry extends SubsonicChild {
	username!: string;
	minutesAgo!: number;
	playerId!: number;
	playerName?: string;
}

@SubsonicResultType()
export class SubsonicSearchResult {
	match?: Array<SubsonicChild>;
	offset!: number;
	totalHits!: number;
}

@SubsonicResultType()
export class SubsonicSearchResult2 {
	artist?: Array<SubsonicArtist>;
	album?: Array<SubsonicChild>;
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicSearchResult3 {
	artist?: Array<SubsonicArtistID3>;
	album?: Array<SubsonicAlbumID3>;
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicPlaylists {
	playlist?: Array<SubsonicPlaylist>;
}

@SubsonicResultType()
export class SubsonicPlaylist {
	allowedUser?: Array<string>; // Added in 1.8.0
	id!: SubsonicID;
	name!: string;
	comment?: string; // Added in 1.8.0
	owner?: number; // Added in 1.8.0
	public?: boolean; // Added in 1.8.0
	songCount!: number; // Added in 1.8.0
	duration!: number; // Added in 1.8.0
	created!: SubsonicDateTime; // Added in 1.8.0
	changed!: SubsonicDateTime; // Added in 1.13.0
	coverArt?: string; // Added in 1.11.0
}

@SubsonicResultType()
export class SubsonicPlaylistWithSongs extends SubsonicPlaylist {
	entry?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicJukeboxStatus {
	currentIndex!: number;
	playing!: boolean;
	gain!: number;
	position?: number; // Added in 1.7.0
}

@SubsonicResultType()
export class SubsonicJukeboxPlaylist extends SubsonicJukeboxStatus {
	entry?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicChatMessages {
	chatMessage?: Array<SubsonicChatMessage>;
}

@SubsonicResultType()
export class SubsonicChatMessage {
	username!: string;
	time!: number;
	message!: string;
}

@SubsonicResultType()
export class SubsonicAlbumList {
	album?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicAlbumList2 {
	album?: Array<SubsonicAlbumID3>;
}

@SubsonicResultType()
export class SubsonicSongs {
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicLyrics {
	content!: string;
	artist?: string;
	title?: string;
}

@SubsonicResultType()
export class SubsonicPodcasts {
	channel?: Array<SubsonicPodcastChannel>;
}

@SubsonicResultType()
export class SubsonicPodcastChannel {
	episode?: Array<SubsonicPodcastEpisode>;
	id!: SubsonicID;
	url!: string;
	title?: string;
	description?: string;
	coverArt?: string; //  Added in 1.13.0
	originalImageUrl?: string; //  Added in 1.13.0
	status!: SubsonicPodcastStatus;
	errorMessage?: string;
}

@SubsonicResultType()
export class SubsonicNewestPodcasts {
	episode?: Array<SubsonicPodcastEpisode>;
}

@SubsonicResultType()
export class SubsonicPodcastEpisode extends SubsonicChild {
	streamId?: SubsonicID; //  Use this ID for streaming the podcast.
	channelId!: SubsonicID; //  Added in 1.13.0
	description?: string;
	status!: SubsonicPodcastStatus;
	publishDate?: SubsonicDateTime;
}

export type SubsonicPodcastStatus = 'new' | 'downloading' | 'completed' | 'error' | 'deleted' | 'skipped';

@SubsonicResultType()
export class SubsonicInternetRadioStations {
	internetRadioStation?: Array<SubsonicInternetRadioStation>;
}

@SubsonicResultType()
export class SubsonicInternetRadioStation {
	id!: SubsonicID;
	name!: string;
	streamUrl!: string;
	homePageUrl?: string;
}

@SubsonicResultType()
export class SubsonicBookmarks {
	bookmark?: Array<SubsonicBookmark>;
}

@SubsonicResultType()
export class SubsonicBookmark {
	entry!: SubsonicChild;
	position!: number; //  In milliseconds
	username!: string;
	comment?: string;
	created!: SubsonicDateTime;
	changed!: SubsonicDateTime;
}

@SubsonicResultType()
export class SubsonicPlayQueue {
	entry?: Array<SubsonicChild>;
	current?: number; //  ID of currently playing track
	position?: number; //  Position in milliseconds of currently playing track
	username!: string;
	changed!: SubsonicDateTime;
	changedBy!: string; //  Name of client app
}

@SubsonicResultType()
export class SubsonicShares {
	share?: Array<SubsonicShare>;
}

@SubsonicResultType()
export class SubsonicShare {
	entry?: Array<SubsonicChild>;
	id!: SubsonicID;
	url!: string;
	description?: string;
	username!: string;
	created!: SubsonicDateTime;
	expires?: SubsonicDateTime;
	lastVisited?: SubsonicDateTime;
	visitCount!: number;
}

@SubsonicResultType()
export class SubsonicStarred {
	artist?: Array<SubsonicArtist>;
	album?: Array<SubsonicChild>;
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicAlbumInfo {
	notes?: string;
	musicBrainzId?: string;
	lastFmUrl?: string;
	smallImageUrl?: string;
	mediumImageUrl?: string;
	largeImageUrl?: string;
}

@SubsonicResultType()
export class SubsonicArtistInfoBase {
	biography?: string;
	musicBrainzId?: string;
	lastFmUrl?: string;
	smallImageUrl?: string;
	mediumImageUrl?: string;
	largeImageUrl?: string;
}

@SubsonicResultType()
export class SubsonicArtistInfo extends SubsonicArtistInfoBase {
	similarArtist?: Array<SubsonicArtist>;
}

@SubsonicResultType()
export class SubsonicArtistInfo2 extends SubsonicArtistInfoBase {
	similarArtist?: Array<SubsonicArtistID3>;
}

@SubsonicResultType()
export class SubsonicSimilarSongs {
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicSimilarSongs2 {
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicTopSongs {
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicStarred2 {
	artist?: Array<SubsonicArtistID3>;
	album?: Array<SubsonicAlbumID3>;
	song?: Array<SubsonicChild>;
}

@SubsonicResultType()
export class SubsonicLicense {
	valid!: boolean;
	email?: string;
	licenseExpires?: SubsonicDateTime;
	trialExpires?: SubsonicDateTime;
}

@SubsonicResultType()
export class SubsonicScanStatus {
	scanning!: boolean;
	count?: number;
}

@SubsonicResultType()
export class SubsonicUsers {
	user?: Array<SubsonicUser>;
}

@SubsonicResultType()
export class SubsonicUser {
	folder?: Array<number>; //  Added in 1.12.0
	username!: string;
	email?: string; //  Added in 1.6.0
	scrobblingEnabled!: boolean; //  Added in 1.7.0
	maxBitRate?: number; //  In Kbps, added in 1.13.0
	adminRole!: boolean;
	settingsRole!: boolean;
	downloadRole!: boolean;
	uploadRole!: boolean;
	playlistRole!: boolean;
	coverArtRole!: boolean;
	commentRole!: boolean;
	podcastRole!: boolean;
	streamRole!: boolean;
	jukeboxRole!: boolean;
	shareRole!: boolean; //  Added in 1.7.0
	videoConversionRole!: boolean; //  Added in 1.14.0
	avatarLastChanged?: SubsonicDateTime; //  Added in 1.14.0
}

@SubsonicResultType()
export class SubsonicError {
	code!: number;
	message?: string;
}

export type SubsonicID = number;
export type SubsonicDateTime = string; // -?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?
