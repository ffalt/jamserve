export declare namespace Subsonic {

	export interface Response {
		album?: AlbumWithSongsID3;
		albumInfo?: AlbumInfo;
		albumList2?: AlbumList2;
		albumList?: AlbumList;
		artist?: ArtistWithAlbumsID3;
		artistInfo2?: ArtistInfo2;
		artistInfo?: ArtistInfo;
		artists?: ArtistsID3;
		bookmarks?: Bookmarks;
		chatMessages?: ChatMessages;
		directory?: Directory;
		genres?: Genres;
		indexes?: Indexes;
		internetRadioStations?: InternetRadioStations;
		jukeboxPlaylist?: JukeboxPlaylist;
		jukeboxStatus?: JukeboxStatus;
		license?: License;
		lyrics?: Lyrics;
		musicFolders?: MusicFolders;
		newestPodcasts?: NewestPodcasts;
		nowPlaying?: NowPlaying;
		playlist?: PlaylistWithSongs;
		playlists?: Playlists;
		playQueue?: PlayQueue;
		podcasts?: Podcasts;
		randomSongs?: Songs;
		scanStatus?: ScanStatus;
		searchResult2?: SearchResult2;
		searchResult3?: SearchResult3;
		searchResult?: SearchResult;
		shares?: Shares;
		similarSongs2?: SimilarSongs2;
		similarSongs?: SimilarSongs;
		song?: Child;
		songsByGenre?: Songs;
		starred2?: Starred2;
		starred?: Starred;
		topSongs?: TopSongs;
		user?: User;
		users?: Users;
		videoInfo?: VideoInfo;
		videos?: Videos;

		error?: Error;
		status?: ResponseStatus;
		version?: Version;
	}

	export type ResponseStatus = 'ok' | 'failed';

	export type Version = string; // \d+\.\d+\.\d+

	export interface MusicFolders {
		musicFolder?: MusicFolder[];
	}

	export interface MusicFolder {
		id: number;
		name?: string;
	}

	export interface Indexes {
		shortcut?: Artist[];
		index?: Index[];
		child?: Child[]; //  Added in 1.7.0
		lastModified: number;
		ignoredArticles: string; //  Added in 1.10.0
	}

	export interface Index {
		artist?: Artist[];
		name: string;
	}

	export interface Artist {
		id: string;
		name: string;
		starred?: SubsonicDateTime; //  Added in 1.10.1
		userRating?: UserRating; //  Added in 1.13.0
		averageRating?: AverageRating; //  Added in 1.13.0
	}

	export interface Genres {
		genre?: Genre[];
	}

	export interface Genre {
		content: string;
		songCount: number; //  Added in 1.10.2
		albumCount: number; //  Added in 1.10.2
		artistCount: number; //  undocumented?
	}

	export interface ArtistsID3 {
		index?: IndexID3[];
		ignoredArticles: string; //  Added in 1.10.0
	}

	export interface IndexID3 {
		artist?: ArtistID3[];
		name: string;
	}

	export interface ArtistID3 {
		id: string;
		name: string;
		coverArt?: string;
		albumCount: number;
		starred?: SubsonicDateTime;
	}

	export interface ArtistWithAlbumsID3 extends ArtistID3 {
		album?: AlbumID3[];
	}

	export interface AlbumID3 {
		id: string;
		name: string;
		artist?: string;
		artistId?: string;
		coverArt?: string;
		songCount: number;
		duration: number;
		playCount?: number; //  Added in 1.14.0
		created: SubsonicDateTime;
		starred?: SubsonicDateTime;
		year?: number; //  Added in 1.10.1
		genre?: string; //  Added in 1.10.1
	}

	export interface AlbumWithSongsID3 extends AlbumID3 {
		song?: Child[];
	}

	export interface Videos {
		video?: Child[];
	}

	export interface VideoInfo {
		captions?: Captions[];
		audioTrack?: AudioTrack[];
		conversion?: VideoConversion[];
		id: string;
	}

	export interface Captions {
		id: string;
		name?: string;
	}

	export interface AudioTrack {
		id: string;
		name?: string;
		languageCode?: string;
	}

	export interface VideoConversion {
		id: string;
		bitRate?: number; //  In Kbps
		audioTrackId?: number;
	}

	export interface Directory {
		child?: Child[];
		id: string;
		parent?: string;
		name: string;
		starred?: SubsonicDateTime; //  Added in 1.10.1
		userRating?: UserRating; //  Added in 1.13.0
		averageRating?: AverageRating; //  Added in 1.13.0
		playCount?: number; //  Added in 1.14.0
	}

	export interface Child {
		id: string;
		parent?: string;
		isDir: boolean;
		title: string;
		album?: string;
		artist?: string;
		track?: number;
		year?: number;
		genre?: string;
		coverArt?: string;
		size?: number;
		contentType?: string;
		suffix?: string;
		transcodedContentType?: string;
		transcodedSuffix?: string;
		duration?: number;
		bitRate?: number;
		path?: string;
		isVideo?: boolean; //  Added in 1.4.1
		userRating?: UserRating; //  Added in 1.6.0
		averageRating?: AverageRating; //  Added in 1.6.0
		playCount?: number; //  Added in 1.14.0
		discNumber?: number; //  Added in 1.8.0
		created?: SubsonicDateTime; //  Added in 1.8.0
		starred?: SubsonicDateTime; //  Added in 1.8.0
		albumId?: string; //  Added in 1.8.0
		artistId?: string; //  Added in 1.8.0
		type?: MediaType; //  Added in 1.8.0
		bookmarkPosition?: number; //  In millis. Added in 1.10.1
		originalWidth?: number; //  Added in 1.13.0
		originalHeight?: number; //  Added in 1.13.0
	}

	export type MediaType = 'music' | 'podcast' | 'audiobook' | 'video';

	export type UserRating = number; // 1 <= x <= 5

	export type AverageRating = number; // 1.0 <= x <= 5.0

	export interface NowPlaying {
		entry?: NowPlayingEntry[];
	}

	export interface NowPlayingEntry extends Child {
		username: string;
		minutesAgo: number;
		playerId: number;
		playerName?: string;
	}

	// Deprecated
	export interface SearchResult {
		match?: Child[];
		offset: number;
		totalHits: number;
	}

	export interface SearchResult2 {
		artist?: Artist[];
		album?: Child[];
		song?: Child[];
	}

	export interface SearchResult3 {
		artist?: ArtistID3[];
		album?: AlbumID3[];
		song?: Child[];
	}

	export interface Playlists {
		playlist?: Playlist[];
	}

	export interface Playlist {
		allowedUser?: string[]; // Added in 1.8.0
		id: string;
		name: string;
		comment?: string; // Added in 1.8.0
		owner?: string; // Added in 1.8.0
		public?: boolean; // Added in 1.8.0
		songCount: number; // Added in 1.8.0
		duration: number; // Added in 1.8.0
		created: SubsonicDateTime; // Added in 1.8.0
		changed: SubsonicDateTime; // Added in 1.13.0
		coverArt?: string; // Added in 1.11.0
	}

	export interface PlaylistWithSongs extends Playlist {
		entry?: Child[];
	}

	export interface JukeboxStatus {
		currentIndex: number;
		playing: boolean;
		gain: number;
		position?: number; // Added in 1.7.0
	}

	export interface JukeboxPlaylist extends JukeboxStatus {
		entry?: Child[];
	}

	export interface ChatMessages {
		chatMessage?: ChatMessage[];
	}

	export interface ChatMessage {
		username: string;
		time: number;
		message: string;
	}

	export interface AlbumList {
		album?: Child[];
	}

	export interface AlbumList2 {
		album?: AlbumID3[];
	}

	export interface Songs {
		song?: Child[];
	}

	export interface Lyrics {
		content: string;
		artist?: string;
		title?: string;
	}

	export interface Podcasts {
		channel?: PodcastChannel[];
	}

	export interface PodcastChannel {
		episode?: PodcastEpisode[];
		id: string;
		url: string;
		title?: string;
		description?: string;
		coverArt?: string; //  Added in 1.13.0
		originalImageUrl?: string; //  Added in 1.13.0
		status: PodcastStatus;
		errorMessage?: string;
	}

	export interface NewestPodcasts {
		episode?: PodcastEpisode[];
	}

	export interface PodcastEpisode extends Child {
		streamId?: string; //  Use this ID for streaming the podcast.
		channelId: string; //  Added in 1.13.0
		description?: string;
		status: PodcastStatus;
		publishDate?: SubsonicDateTime;
	}

	export type PodcastStatus = 'new' | 'downloading' | 'completed' | 'error' | 'deleted' | 'skipped';

	export interface InternetRadioStations {
		internetRadioStation?: InternetRadioStation[];
	}

	export interface InternetRadioStation {
		id: string;
		name: string;
		streamUrl: string;
		homePageUrl?: string;
	}

	export interface Bookmarks {
		bookmark?: Bookmark[];
	}

	export interface Bookmark {
		entry: Child;
		position: number; //  In milliseconds
		username: string;
		comment?: string;
		created: SubsonicDateTime;
		changed: SubsonicDateTime;
	}

	export interface PlayQueue {
		entry?: Child[];
		current?: number; //  ID of currently playing track
		position?: number; //  Position in milliseconds of currently playing track
		username: string;
		changed: SubsonicDateTime;
		changedBy: string; //  Name of client app
	}

	export interface Shares {
		share?: Share[];
	}

	export interface Share {
		entry?: Child[];
		id: string;
		url: string;
		description?: string;
		username: string;
		created: SubsonicDateTime;
		expires?: SubsonicDateTime;
		lastVisited?: SubsonicDateTime;
		visitCount: number;
	}

	export interface Starred {
		artist?: Artist[];
		album?: Child[];
		song?: Child[];
	}

	export interface AlbumInfo {
		notes?: string;
		musicBrainzId?: string;
		lastFmUrl?: string;
		smallImageUrl?: string;
		mediumImageUrl?: string;
		largeImageUrl?: string;
	}

	export interface ArtistInfoBase {
		biography?: string;
		musicBrainzId?: string;
		lastFmUrl?: string;
		smallImageUrl?: string;
		mediumImageUrl?: string;
		largeImageUrl?: string;
	}

	export interface ArtistInfo extends ArtistInfoBase {
		similarArtist?: Artist[];
	}

	export interface ArtistInfo2 extends ArtistInfoBase {
		similarArtist?: ArtistID3[];
	}

	export interface SimilarSongs {
		song?: Child[];
	}

	export interface SimilarSongs2 {
		song?: Child[];
	}

	export interface TopSongs {
		song?: Child[];
	}

	export interface Starred2 {
		artist?: ArtistID3[];
		album?: AlbumID3[];
		song?: Child[];
	}

	export interface License {
		valid: boolean;
		email?: string;
		licenseExpires?: SubsonicDateTime;
		trialExpires?: SubsonicDateTime;
	}

	export interface ScanStatus {
		scanning: boolean;
		count?: number;
	}

	export interface Users {
		user?: User[];
	}

	export interface User {
		folder?: number[]; //  Added in 1.12.0
		username: string;
		email?: string; //  Added in 1.6.0
		scrobblingEnabled: boolean; //  Added in 1.7.0
		maxBitRate?: number; //  In Kbps, added in 1.13.0
		adminRole: boolean;
		settingsRole: boolean;
		downloadRole: boolean;
		uploadRole: boolean;
		playlistRole: boolean;
		coverArtRole: boolean;
		commentRole: boolean;
		podcastRole: boolean;
		streamRole: boolean;
		jukeboxRole: boolean;
		shareRole: boolean; //  Added in 1.7.0
		videoConversionRole: boolean; //  Added in 1.14.0
		avatarLastChanged?: SubsonicDateTime; //  Added in 1.14.0
	}

	export interface Error {
		code: number;
		message?: string;
	}

	export type SubsonicDateTime = string; // -?([1-9][0-9]{3,}|0[0-9]{3})-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])T(([01][0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9](\.[0-9]+)?|(24:00:00(\.0+)?))(Z|(\+|-)((0[0-9]|1[0-3]):[0-5][0-9]|14:00))?
}
