export declare namespace SubsonicParameters {

	export interface ID {
		/**
		 * The item ID
		 */
		id: string;
	}

	export interface MusicFolderID {
		/**
		 * Only return results from the music folder with the given ID. See getMusicFolders
		 */
		musicFolderId?: number;
	}

	export interface Indexes {
		/**
		 * Only return results from the music folder with the given ID. See getMusicFolders
		 */
		musicFolderId?: number;
		/**
		 * If specified, only return a result if the artist collection has changed since the given time (in milliseconds since 1 Jan 1970).
		 * @TJS-type integer
		 * @minimum 0
		 */
		ifModifiedSince?: number;
	}

	export interface InternetRadioCreate {
		/**
		 * The stream URL for the station.
		 */
		streamUrl: string;
		/**
		 * The user-defined name for the station.
		 */
		name: string;
		/**
		 * The home page URL for the station.
		 */
		homepageUrl?: string;
	}

	export interface InternetRadioUpdate {
		/**
		 * The ID for the station.
		 */
		id: string;
		/**
		 * The stream URL for the station.
		 */
		streamUrl: string;
		/**
		 * The user-defined name for the station.
		 */
		name: string;
		/**
		 * The home page URL for the station.
		 */
		homepageUrl?: string;
	}

	export type AlbumListType = 'random' | 'newest' | 'starred' | 'frequent' | 'recent' | 'highest' | 'alphabeticalByName' | 'alphabeticalByArtist' | 'byYear' | 'byGenre';

	export interface AlbumList {
		/**
		 * The list type. Must be one of the following: random, newest, frequent, recent, starred, alphabeticalByName or alphabeticalByArtist. Since 1.10.1 you can use byYear and byGenre to list albums in a given year range or genre.
		 */
		type: AlbumListType;
		/**
		 * The number of albums to return. Max 500.
		 *
		 * @TJS-type integer
		 * @maximum 500
		 * @default 10
		 */
		size?: number;
		/**
		 * The list offset. Useful if you for example want to page through the list of newest albums.
		 * @TJS-type integer
		 * @default 0
		 */
		offset?: number;
		/**
		 * The name of the genre, e.g., "Rock".
		 */
		genre?: string;
		/**
		 * The first year in the range. If fromYear > toYear a reverse chronological list is returned.
		 */
		fromYear?: number;
		/**
		 * The last year in the range.
		 * @TJS-type integer
		 * @minimum 0
		 */
		toYear?: number;
	}

	export interface AlbumList2 {
		/**
		 * The list type. Must be one of the following: random, newest, frequent, recent, starred, alphabeticalByName or alphabeticalByArtist. Since 1.10.1 you can use byYear and byGenre to list albums in a given year range or genre.
		 */
		type: AlbumListType;
		/**
		 * The number of albums to return. Max 500.
		 *
		 * @TJS-type integer
		 * @maximum 500
		 * @default 10
		 */
		size?: number;
		/**
		 * The list offset. Useful if you for example want to page through the list of newest albums.
		 * @TJS-type integer
		 * @default 0
		 */
		offset?: number;
		/**
		 * The name of the genre, e.g., "Rock".
		 */
		genre?: string;
		/**
		 * The first year in the range. If fromYear > toYear a reverse chronological list is returned.
		 */
		fromYear?: number;
		/**
		 * The last year in the range.
		 * @TJS-type integer
		 * @minimum 0
		 */
		toYear?: number;
		/**
		 * Only return albums in the music folder with the given ID. See getMusicFolders.
		 */
		musicFolderId?: number;
	}

	export interface CoverArt {
		/**
		 * The ID of a song, album or artist.
		 */
		id: string;
		/**
		 * If specified, scale image to this size.
		 */
		size?: number;
	}

	export interface Username {
		/**
		 * The name of the user to retrieve. You can only retrieve your own user unless you have admin privileges.
		 */
		username: string;
	}

	export interface ArtistInfo {
		/**
		 * The artist, album or song ID.
		 */
		id: string;
		/**
		 * Max number of similar artists to return.
		 * @TJS-type integer
		 * @default 20
		 * @minimum 1
		 */
		count?: number;
		/**
		 * Whether to return artists that are not present in the media library.
		 * @default false
		 */
		includeNotPresent?: boolean;
	}

	export interface TopSongs {
		/**
		 * The artist name.
		 */
		artist: string;
		/**
		 * Max number of songs to return.
		 * @TJS-type integer
		 * @default 50
		 * @minimum 1
		 */
		count?: number;
	}

	export interface SimilarSongs {
		/**
		 * The artist, album or song ID.
		 */
		id: string;
		/**
		 * Max number of songs to return.
		 * @TJS-type integer
		 * @default 50
		 * @minimum 1
		 */
		count?: number;
	}

	export interface Download {
		/**
		 * A string which uniquely identifies the file to download. Obtained by calls to getMusicDirectory.
		 */
		id: string;
	}

	export type StreamFormat = 'mp3' | 'flv' | 'raw';

	export interface Stream {
		/**
		 * A string which uniquely identifies the file to stream. Obtained by calls to getMusicDirectory.
		 */
		id: string;
		/**
		 * If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If set to zero, no limit is imposed.
		 * @TJS-type integer
		 * @minimum 0
		 */
		maxBitRate?: number;
		/**
		 * Only applicable to video streaming. If specified, start streaming at the given offset (in seconds) into the video. Typically used to implement video skipping.
		 * @TJS-type integer
		 * @minimum 0
		 */
		timeOffset?: number;
		/**
		 * Only applicable to video streaming. Requested video size specified as WxH, for instance "640x480".
		 */
		size?: string;
		/**
		 * Only applicable to video streaming. Subsonic can optimize videos for streaming by converting them to MP4. If a conversion exists for the video in question, then setting this parameter to "true" will cause the converted video to be returned instead of the original.
		 *
		 * @default false
		 */
		converted?: boolean;
		/**
		 * if set to "true", the Content-Length HTTP header will be set to an estimated value for transcoded or downsampled media.
		 *
		 * @default false
		 */
		estimateContentLength?: boolean;
		/**
		 * Specifies the preferred target format (e.g., "mp3" or "flv") in case there are multiple applicable transcodings. Starting with 1.9.0 you can use the special value "raw" to disable transcoding.
		 */
		format?: StreamFormat;
	}

	export interface Rate {
		/**
		 * A string which uniquely identifies the file (song) or folder (album/artist) to rate.
		 */
		id: string;
		/**
		 * The rating between 1 and 5 (inclusive), or 0 to remove the rating.
		 *
		 * @TJS-type integer
		 * @minimum 0
		 * @maximum 5
		 */
		rating: number;
	}

	export interface ChangePassword {
		/**
		 * The name of the user which should change its password.
		 */
		username: string;
		/**
		 * The new password of the new user, either in clear text of hex-encoded.
		 */
		password: string;
	}

	export interface ChatMessages {
		/**
		 * Only return messages newer than this time (in millis since Jan 1 1970).
		 */
		since?: number;
	}

	export interface ChatMessage {
		/**
		 * The chat message.
		 */
		message: string;
	}

	export interface State {
		/**
		 * The ID of the file (song) or folder (album/artist) to star. Multiple parameters allowed.
		 */
		id?: string | Array<string>;
		/**
		 * The ID of an album to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 */
		albumId?: string | Array<string>;
		/**
		 * The ID of an artist to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 */
		artistId?: string | Array<string>;
	}

	export interface Playlists {
		/**
		 * If specified, return playlists for this user rather than for the authenticated user. The authenticated user must have admin role if this parameter is used.
		 */
		username?: string;
	}

	export interface PlaylistCreate {
		/**
		 * The playlist ID. (if updating)
		 */
		playlistId?: string;
		/**
		 * The human-readable name of the playlist.
		 */
		name?: string;
		/**
		 * ID of a song in the playlist. Use one songId parameter for each song in the playlist.
		 */
		songId?: string | Array<string>;
	}

	export interface PlaylistUpdate {
		/**
		 * The playlist ID.
		 */
		playlistId: string;
		/**
		 * The human-readable name of the playlist.
		 */
		name?: string;
		/**
		 * The playlist comment.
		 */
		comment?: string;
		/**
		 * true if the playlist should be visible to all users, false otherwise.
		 */
		public?: boolean;
		/**
		 * Add this song with this ID to the playlist. Multiple parameters allowed.
		 */
		songIdToAdd?: string | Array<string>;
		/**
		 * Remove the song at this position in the playlist. Multiple parameters allowed.
		 */
		songIndexToRemove?: number | Array<number>;
	}

	export interface PodcastChannel {
		/**
		 * The URL of the Podcast to add.
		 */
		url: string;
	}

	export interface PodcastChannels {
		/**
		 * If specified, only return the Podcast channel with this ID.
		 */
		id?: string;
		/**
		 * Whether to include Podcast episodes in the returned result.
		 * @default true
		 */
		includeEpisodes?: boolean;
	}

	export interface PodcastEpisodesNewest {
		/**
		 * The maximum number of episodes to return.
		 *
		 * @TJS-type integer
		 * @default 20
		 * @minimum 0
		 */
		count?: number;
	}

	export interface CreateUser {
		/**
		 * The name of the new user.
		 */
		username: string;
		/**
		 * The password of the new user, either in clear text of hex-encoded (see above).
		 */
		password?: string;
		/**
		 * The email address of the new user.
		 */
		email?: string;
		/**
		 * Whether the user is authenicated in LDAP.
		 *
		 * @default false
		 */
		ldapAuthenticated?: boolean;
		/**
		 * Whether the user is administrator.
		 *
		 * @default false
		 */
		adminRole?: boolean;
		/**
		 * Whether the user is allowed to change personal settings and password.
		 *
		 * @default true
		 */
		settingsRole?: boolean;
		/**
		 * Whether the user is allowed to play files.
		 *
		 * @default true
		 */
		streamRole?: boolean;
		/**
		 * Whether the user is allowed to play files in jukebox mode.
		 *
		 * @default false
		 */
		jukeboxRole?: boolean;
		/**
		 * Whether the user is allowed to download files.
		 *
		 * @default false
		 */
		downloadRole?: boolean;
		/**
		 * Whether the user is allowed to upload files.
		 *
		 * @default false
		 */
		uploadRole?: boolean;
		/**
		 * Whether the user is allowed to change cover art and tags.
		 *
		 * @default false
		 */
		coverArtRole?: boolean;
		/**
		 *  Whether the user is allowed to create and edit comments and ratings.
		 *
		 * @default false
		 */
		commentRole?: boolean;
		/**
		 * Whether the user is allowed to administrate Podcasts.
		 *
		 * @default false
		 */
		podcastRole?: boolean;
		/**
		 *  Whether the user is allowed to create and delete playlists.
		 *
		 * @default false
		 */
		playlistRole?: boolean;
		/**
		 * Whether the user is allowed to share files with anyone.
		 *
		 * @default false
		 */
		shareRole?: boolean;
		/**
		 * Whether the user is allowed to start video conversions.
		 *
		 * @default false
		 */
		videoConversionRole?: boolean;
		/**
		 * IDs of the music folders the user is allowed access to. Include the parameter once for each folder.
		 */
		musicFolderId?: Array<number> | number;
	}

	export type MaxBitrates = 0 | 32 | 40 | 48 | 56 | 64 | 80 | 96 | 112 | 128 | 160 | 192 | 224 | 256 | 320;

	export interface UpdateUser {
		/**
		 * The name of the user.
		 */
		username: string;
		/**
		 * The password of the user, either in clear text of hex-encoded.
		 */
		password?: string;
		/**
		 * The email address of the user.
		 */
		email?: string;
		/**
		 * Whether the user is authenicated in LDAP.
		 */
		ldapAuthenticated?: boolean;
		/**
		 * Whether the user is administrator.
		 */
		adminRole?: boolean;
		/**
		 * Whether the user is allowed to change personal settings and password.
		 */
		settingsRole?: boolean;
		/**
		 * Whether the user is allowed to play files.
		 */
		streamRole?: boolean;
		/**
		 * Whether the user is allowed to play files in jukebox mode.
		 */
		jukeboxRole?: boolean;
		/**
		 * Whether the user is allowed to download files.
		 */
		downloadRole?: boolean;
		/**
		 * Whether the user is allowed to upload files.
		 */
		uploadRole?: boolean;
		/**
		 * Whether the user is allowed to change cover art and tags.
		 */
		coverArtRole?: boolean;
		/**
		 * Whether the user is allowed to create and edit comments and ratings.
		 */
		commentRole?: boolean;
		/**
		 * Whether the user is allowed to administrate Podcasts.
		 */
		podcastRole?: boolean;
		/**
		 * Whether the user is allowed to create and delete playlists.
		 */
		playlistRole?: boolean;
		/**
		 * Whether the user is allowed to share files with anyone.
		 */
		shareRole?: boolean;
		/**
		 * Whether the user is allowed to start video conversions.
		 */
		videoConversionRole?: boolean;
		/**
		 * IDs of the music folders the user is allowed access to. Include the parameter once for each folder.
		 */
		musicFolderId?: Array<number> | number;
		/**
		 * The maximum bit rate (in Kbps) for the user. Audio streams of higher bit rates are automatically downsampled to this bit rate. Legal values: 0 (no limit), 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320.
		 * @TJS-type integer
		 */
		maxBitRate?: MaxBitrates
	}

	export interface Bookmark {
		/**
		 * ID of the media file to bookmark. If a bookmark already exists for this file it will be overwritten.
		 */
		id: string;
		/**
		 * The position (in milliseconds) within the media file.
		 * @TJS-type integer
		 * @minimum 0
		 */
		position: number;
		/**
		 * A user-defined comment.
		 */
		comment?: string;
	}

	export interface RandomSong {
		/**
		 * The maximum number of songs to return. Max 500.
		 *
		 * @TJS-type integer
		 * @default 10
		 * @minimum 1
		 * @maximum 500
		 */
		size?: number;
		/**
		 * Only return songs in the music folder with the given ID. See getMusicFolders.
		 */
		musicFolderId?: number;
		/**
		 * Only returns songs belonging to this genre.
		 */
		genre?: string;
		/**
		 * Only return songs published after or in this year.
		 * @TJS-type integer
		 */
		fromYear?: number;
		/**
		 * Only return songs published before or in this year.
		 * @TJS-type integer
		 */
		toYear?: number;
	}

	export interface Search {
		/**
		 * Searches all fields.
		 */
		any?: string;
		/**
		 * Artist to search for.
		 */
		artist?: string;
		/**
		 * Album to search for.
		 */
		album?: string;
		/**
		 * Song title to search for.
		 */
		title?: string;
		/**
		 * Maximum number of results to return.
		 *
		 * @TJS-type integer
		 * @default 20
		 * @minimum 1
		 */
		count?: number;
		/**
		 * Search result offset. Used for paging.
		 *
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		offset?: number;
		/**
		 * Only return matches that are newer than this. Given as milliseconds since 1970.
		 */
		newerThan?: number;
	}

	export interface Search2 {
		/**
		 * Search query.
		 */
		query?: string;
		/**
		 * Maximum number of artists to return.
		 *
		 * @TJS-type integer
		 * @minimum 1
		 * @default 20
		 */
		artistCount?: number;
		/**
		 * Search result offset for artists. Used for paging.
		 *
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		artistOffset?: number;
		/**
		 * Maximum number of albums to return.
		 *
		 * @TJS-type integer
		 * @minimum 1
		 * @default 20
		 */
		albumCount?: number;
		/**
		 * Search result offset for albums. Used for paging.
		 *
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		albumOffset?: number;
		/**
		 * Maximum number of songs to return.
		 *
		 * @TJS-type integer
		 * @minimum 1
		 * @default 20
		 */
		songCount?: number;
		/**
		 * Search result offset for songs. Used for paging.
		 *
		 * @TJS-type integer
		 * @minimum 0
		 * @default 0
		 */
		songOffset?: number;
		/**
		 * Only return results from the music folder with the given ID. See getMusicFolders.
		 */
		musicFolderId?: number;
	}

	export interface Lyrics {
		/**
		 * The artist name.
		 */
		artist?: string;
		/**
		 * The song title.
		 */
		title?: string;
	}

	export interface PlayQueue {
		/**
		 * ID of a song in the play queue. Use one id parameter for each song in the play queue.
		 */
		id: string | Array<string>;
		/**
		 * The ID of the current playing song.
		 */
		current?: string;
		/**
		 * The position in milliseconds within the currently playing song.
		 * @TJS-type integer
		 * @minimum 0
		 */
		position?: number;
	}

	export interface SongsByGenre {
		/**
		 * The genre, as returned by getGenres.
		 */
		genre: string;
		/**
		 * The maximum number of songs to return. Max 500.
		 * @TJS-type integer
		 * @default 10
		 * @maximum 500
		 * @minimum 1
		 */
		count?: number;
		/**
		 * The offset. Useful if you want to page through the songs in a genre.
		 *
		 * @TJS-type integer
		 * @default 0
		 * @minimum 0
		 */
		offset?: number;
		/**
		 * Only return albums in the music folder with the given ID. See getMusicFolders
		 */
		musicFolderId?: number;
	}

	export interface Scrobble {
		/**
		 * A string which uniquely identifies the file to scrobble.
		 */
		id: string;
		/**
		 * The time (in milliseconds since 1 Jan 1970) at which the song was listened to.
		 * @TJS-type integer
		 * @minimum 0
		 */
		time?: number;
		/**
		 * Whether this is a "submission" or a "now playing" notification.
		 */
		submission?: boolean;
	}

	export type CaptionsFormat = 'srt' | 'vtt';

	export interface Captions {
		/**
		 * The ID of the video.
		 */
		id: string;
		/**
		 * Preferred captions format ("srt" or "vtt").
		 */
		format?: CaptionsFormat;
	}

	export interface Share {
		/**
		 * ID of a song, album or video to share. Use one id parameter for each entry to share.
		 */
		id: string;
		/**
		 * A user-defined description that will be displayed to people visiting the shared media.
		 */
		description?: string;
		/**
		 * The time at which the share expires. Given as milliseconds since 1970.
		 * @TJS-type integer
		 * @minimum 0
		 */
		expires?: number;
	}

	export interface HLS {
		/**
		 * A string which uniquely identifies the media file to stream.
		 */
		id: string;
		/**
		 * If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If this parameter is specified more than once,
		 * the server will create a variant playlist, suitable for adaptive bitrate streaming.
		 * The playlist will support streaming at all the specified bitrates. The server will automatically choose video dimensions that are suitable for the given bitrates.
		 * Since 1.9.0 you may explicitly request a certain width (480) and height (360) like so: bitRate=1000@480x360
		 */
		bitRate?: string;
		/**
		 * The ID of the audio track to use. See getVideoInfo for how to get the list of available audio tracks for a video.
		 */
		audioTrack?: string;
	}

	export type JukeboxAction = 'get' | 'status' | 'set' | 'start' | 'stop' | 'skip' | 'add' | 'clear' | 'remove' | 'shuffle' | 'setGain';

	export interface Jukebox {
		/**
		 * The operation to perform.
		 */
		action: JukeboxAction;
		/**
		 * Used by skip and remove. Zero-based index of the song to skip to or remove.
		 *
		 * @TJS-type integer
		 * @minimum 0
		 */
		index?: number;
		/**
		 * Used by skip. Start playing this many seconds into the track.
		 *
		 * @TJS-type integer
		 * @default 0
		 * @minimum 0
		 */
		offset?: number;
		/**
		 * Used by add and set. ID of song to add to the jukebox playlist. Use multiple id parameters to add many songs in the same request. (set is similar to a clear followed by a add, but will not change the currently playing track.)
		 */
		id?: string;
		/**
		 * Used by setGain to control the playback volume. A float value between 0.0 and 1.0.
		 * @TJS-type number
		 * @minimum 0.0
		 * @maximum 1.0
		 */
		gain?: number;
	}

}
