import { SubsonicObjParamsType } from '../decorators/SubsonicObjParamsType.js';
import { SubsonicObjField } from '../decorators/SubsonicObjField.js';
import { SubsonicID } from './subsonic-rest-data.js';

export type AlbumListType = 'random' | 'newest' | 'starred' | 'frequent' | 'recent' | 'highest' | 'alphabeticalByName' | 'alphabeticalByArtist' | 'byYear' | 'byGenre';
export type StreamFormat = 'mp3' | 'flv' | 'raw';
export type MaxBitrates = 0 | 32 | 40 | 48 | 56 | 64 | 80 | 96 | 112 | 128 | 160 | 192 | 224 | 256 | 320;
export type CaptionsFormat = 'srt' | 'vtt';
export type JukeboxAction = 'get' | 'status' | 'set' | 'start' | 'stop' | 'skip' | 'add' | 'clear' | 'remove' | 'shuffle' | 'setGain';

@SubsonicObjParamsType()
export class SubsonicParameterID {
	@SubsonicObjField({ description: 'The item ID', isID: true })
	id!: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterMusicFolderID {
	@SubsonicObjField({ description: 'Only return results from the music folder with the given ID', isID: true, nullable: true })
	musicFolderId?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterIndexes {
	@SubsonicObjField({ nullable: true, isID: true, description: 'Only return results from the music folder with the given ID' })
	musicFolderId?: number;

	@SubsonicObjField({ nullable: true, description: 'If specified, only return a result if the artist collection has changed since the given time (in milliseconds since 1 Jan 1970).', min: 0, example: 1727432363956 })
	ifModifiedSince?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterInternetRadioCreate {
	@SubsonicObjField({ description: 'The stream URL for the station.', example: 'https://stream.example.com/stream.m3u' })
	streamUrl!: string;

	@SubsonicObjField({ description: 'The user-defined name for the station.', example: 'Best songs' })
	name!: string;

	@SubsonicObjField({ nullable: true, description: 'The home page URL for the station.', example: 'https://stream.example.com/index.html' })
	homepageUrl?: string;
}

@SubsonicObjParamsType()
export class SubsonicParameterInternetRadioUpdate {
	@SubsonicObjField({ description: 'The ID for the station.', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({ description: 'The stream URL for the station.', example: 'https://stream.example.com/stream.m3u' })
	streamUrl!: string;

	@SubsonicObjField({ description: 'The user-defined name for the station.', example: 'Best songs' })
	name!: string;

	@SubsonicObjField({ nullable: true, description: 'The home page URL for the station.', example: 'https://stream.example.com/index.html' })
	homepageUrl?: string;
}

@SubsonicObjParamsType()
export class SubsonicParameterAlbumList {
	@SubsonicObjField({ description: 'The list type.' })
	type!: AlbumListType;

	@SubsonicObjField({ nullable: true, description: 'The number of albums to return.', min: 1, max: 500, example: 10, defaultValue: 10 })
	size?: number;

	@SubsonicObjField({ nullable: true, description: 'The list offset. Useful if you for example want to page through the list of newest albums.', min: 0, example: 10, defaultValue: 0 })
	offset?: number;

	@SubsonicObjField({ nullable: true, description: 'The name of the genre, e.g., "Rock"' })
	genre?: string;

	@SubsonicObjField({ nullable: true, description: 'The first year in the range. If fromYear > toYear a reverse chronological list is returned.', min: 0, example: 2000 })
	fromYear?: number;

	@SubsonicObjField({ nullable: true, description: 'The last year in the range.', min: 0, example: 2001 })
	toYear?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterAlbumList2 {
	@SubsonicObjField({ description: 'The list type.' })
	type!: AlbumListType;

	@SubsonicObjField({ nullable: true, description: 'The number of albums to return.', min: 1, max: 500, example: 10, defaultValue: 10 })
	size?: number;

	@SubsonicObjField({ nullable: true, description: 'The list offset. Useful if you for example want to page through the list of newest albums.', min: 0, example: 10, defaultValue: 0 })
	offset?: number;

	@SubsonicObjField({ nullable: true, description: 'The name of the genre, e.g., "Rock"' })
	genre?: string;

	@SubsonicObjField({ nullable: true, description: 'The first year in the range. If fromYear > toYear a reverse chronological list is returned.', min: 0, example: 2000 })
	fromYear?: number;

	@SubsonicObjField({ nullable: true, description: 'The last year in the range.', min: 0, example: 2001 })
	toYear?: number;

	@SubsonicObjField({ nullable: true, isID: true, description: 'Only return results from the music folder with the given ID' })
	musicFolderId?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterCoverArt {
	@SubsonicObjField({ description: 'The ID of a song, album or artist.', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'If specified, scale image to this size.', min: 10, example: 300 })
	size?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterUsername {
	@SubsonicObjField({ description: 'The name of the user to retrieve. You can only retrieve your own user unless you have admin privileges.' })
	username!: string;
}

@SubsonicObjParamsType()
export class SubsonicParameterArtistInfo {
	@SubsonicObjField({ description: 'The ID of a song, album or artist.', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'Max number of similar artists to return.', min: 1, example: 10, defaultValue: 20 })
	count?: number;

	@SubsonicObjField({ nullable: true, description: 'Whether to return artists that are not present in the media library.', defaultValue: false })
	includeNotPresent?: boolean;
}

@SubsonicObjParamsType()
export class SubsonicParameterTopSongs {
	@SubsonicObjField({ description: 'The artist name' })
	artist!: string;

	@SubsonicObjField({ nullable: true, description: 'Max number of songs to return.', min: 1, example: 10, defaultValue: 50 })
	count?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterSimilarSongs {
	@SubsonicObjField({ description: 'The ID of a song, album or artist.', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'Max number of songs to return.', min: 1, example: 10, defaultValue: 50 })
	count?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterDownload {
	@SubsonicObjField({ description: 'A string which uniquely identifies the file to download', isID: true })
	id!: SubsonicID;
}

@SubsonicObjParamsType()
export class SubsonicParameterStream {
	@SubsonicObjField({ description: 'A string which uniquely identifies the file to stream', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If set to zero, no limit is imposed.', min: 0 })
	maxBitRate?: number;

	@SubsonicObjField({ nullable: true, description: 'Only applicable to video streaming. If specified, start streaming at the given offset (in seconds) into the video. Typically used to implement video skipping.', min: 0 })
	timeOffset?: number;

	@SubsonicObjField({ nullable: true, description: 'Only applicable to video streaming. Requested video size specified as WxH, for instance "640x480".' })
	size?: string;

	@SubsonicObjField({
		nullable: true,
		description: 'Only applicable to video streaming. Subsonic can optimize videos for streaming by converting them to MP4. If a conversion exists for the video in question, then setting this parameter to "true" will cause the converted video to be returned instead of the original',
		defaultValue: false
	})
	converted?: boolean;

	@SubsonicObjField({ nullable: true, description: 'if true, the Content-Length HTTP header will be set to an estimated value for transcoded or downsampled media.', defaultValue: false })
	estimateContentLength?: boolean;

	@SubsonicObjField({
		nullable: true,
		description: 'Specifies the preferred target format (e.g., "mp3" or "flv") in case there are multiple applicable transcodings. Starting with 1.9.0 you can use the special value "raw" to disable transcoding.'
	})
	format?: StreamFormat;
}

@SubsonicObjParamsType()
export class SubsonicParameterRate {
	@SubsonicObjField({ description: 'A string which uniquely identifies the file (song) or folder (album/artist) to rate', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'The rating between 1 and 5 (inclusive), or 0 to remove the rating.', min: 0, max: 5 })
	rating!: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterChangePassword {
	@SubsonicObjField({ description: 'The name of the user which should change its password.' })
	username!: string;

	@SubsonicObjField({ description: 'The new password of the new user, either in clear text of hex-encoded.' })
	password!: string;
}

@SubsonicObjParamsType()
export class SubsonicParameterChatMessages {
	@SubsonicObjField({ nullable: true, description: 'Only return messages newer than this time (in millis since Jan 1 1970).', min: 0, example: 1727432363956 })
	since?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterChatMessage {
	@SubsonicObjField({ description: 'The chat message.' })
	message!: string;
}

@SubsonicObjParamsType()
export class SubsonicParameterState {
	@SubsonicObjField(() => [Number], {
		nullable: true, description: 'The ID of the file (song) or folder (album/artist) to star. Multiple parameters allowed.',
		isID: true
	})
	id?: SubsonicID | Array<SubsonicID>;

	@SubsonicObjField(() => [Number], {
		nullable: true,
		description: 'The ID of an album to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.',
		isID: true
	})
	albumId?: SubsonicID | Array<SubsonicID>;

	@SubsonicObjField(() => [Number], {
		nullable: true,
		description: 'The ID of an artist to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.',
		isID: true
	})
	artistId?: SubsonicID | Array<SubsonicID>;
}

@SubsonicObjParamsType()
export class SubsonicParameterPlaylists {
	@SubsonicObjField({ nullable: true, description: 'If specified, return playlists for this user rather than for the authenticated user. The authenticated user must have admin role if this parameter is used.' })
	username?: string;
}

@SubsonicObjParamsType()
export class SubsonicParameterPlaylistCreate {
	@SubsonicObjField({ nullable: true, description: 'The playlist ID. (if updating)', isID: true })
	playlistId?: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'The human-readable name of the playlist.' })
	name?: string;

	@SubsonicObjField(() => [Number], {
		description: 'ID of a song in the playlist. Use one songId parameter for each song in the playlist.',
		nullable: true,
		isID: true
	})
	songId?: SubsonicID | Array<SubsonicID>;
}

@SubsonicObjParamsType()
export class SubsonicParameterPlaylistUpdate {
	@SubsonicObjField({ description: 'The playlist ID.', isID: true })
	playlistId!: string;

	@SubsonicObjField({ nullable: true, description: 'The human-readable name of the playlist.' })
	name?: string;

	@SubsonicObjField({ nullable: true, description: 'The playlist comment.' })
	comment?: string;

	@SubsonicObjField({ nullable: true, description: 'true if the playlist should be visible to all users, false otherwise.', defaultValue: false })
	public?: boolean;

	@SubsonicObjField(() => [Number], {
		description: 'Add this song with this ID to the playlist. Multiple parameters allowed.',
		isID: true
	})
	songIdToAdd?: SubsonicID | Array<SubsonicID>;

	@SubsonicObjField(() => [Number], {
		description: 'Remove the song at this position in the playlist. Multiple parameters allowed.'
	})
	songIndexToRemove?: number | Array<number>;
}

@SubsonicObjParamsType()
export class SubsonicParameterPodcastChannel {
	/**
	 * The URL of the Podcast to add.
	 */
	url!: string;
}

@SubsonicObjParamsType()
export class SubsonicParameterPodcastChannels {
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

@SubsonicObjParamsType()
export class SubsonicParameterPodcastEpisodesNewest {
	@SubsonicObjField({ nullable: true, description: 'The maximum number of episodes to return.', min: 1, example: 10, defaultValue: 20 })
	count?: number;

	@SubsonicObjField({ nullable: true, description: 'Search result offset. Used for paging.', min: 0, example: 10, defaultValue: 0 })
	offset?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterCreateUser {
	@SubsonicObjField({ description: 'The name of the new user.' })
	username!: string;

	@SubsonicObjField({ nullable: true, description: 'The password of the new user, either in clear text of hex-encoded.' })
	password?: string;

	@SubsonicObjField({ nullable: true, description: 'The email address of the new user.' })
	email?: string;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is authenicated in LDAP.', defaultValue: false })
	ldapAuthenticated?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is administrator.', defaultValue: false })
	adminRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to change personal settings and password.', defaultValue: false })
	settingsRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to play files.', defaultValue: false })
	streamRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to play files in jukebox mode.', defaultValue: false })
	jukeboxRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to download files.', defaultValue: false })
	downloadRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to upload files.', defaultValue: false })
	uploadRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to change cover art and tags.', defaultValue: false })
	coverArtRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to create and edit comments and ratings.', defaultValue: false })
	commentRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to administrate Podcasts.', defaultValue: false })
	podcastRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to create and delete playlists.', defaultValue: false })
	playlistRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to share files with anyone.', defaultValue: false })
	shareRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to start video conversions.', defaultValue: false })
	videoConversionRole?: boolean;

	@SubsonicObjField(() => [Number], {
		nullable: true,
		isID: true,
		description: 'IDs of the music folders the user is allowed access to. Include the parameter once for each folder.'
	})
	musicFolderId?: SubsonicID | Array<SubsonicID>;
}

@SubsonicObjParamsType()
export class SubsonicParameterUpdateUser {
	@SubsonicObjField({ description: 'The name of the user.' })
	username!: string;

	@SubsonicObjField({ nullable: true, description: 'The password of the user, either in clear text of hex-encoded.' })
	password?: string;

	@SubsonicObjField({ nullable: true, description: 'The email address of the user.' })
	email?: string;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is authenicated in LDAP.', defaultValue: false })
	ldapAuthenticated?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is administrator.', defaultValue: false })
	adminRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to change personal settings and password.', defaultValue: false })
	settingsRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to play files.', defaultValue: false })
	streamRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to play files in jukebox mode.', defaultValue: false })
	jukeboxRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to download files.', defaultValue: false })
	downloadRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to upload files.', defaultValue: false })
	uploadRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to change cover art and tags.', defaultValue: false })
	coverArtRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to create and edit comments and ratings.', defaultValue: false })
	commentRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to administrate Podcasts.', defaultValue: false })
	podcastRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to create and delete playlists.', defaultValue: false })
	playlistRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to share files with anyone.', defaultValue: false })
	shareRole?: boolean;

	@SubsonicObjField({ nullable: true, description: 'Whether the user is allowed to start video conversions.', defaultValue: false })
	videoConversionRole?: boolean;

	@SubsonicObjField(() => [Number], {
		nullable: true, isID: true,
		description: 'IDs of the music folders the user is allowed access to. Include the parameter once for each folder.'
	})
	musicFolderId?: SubsonicID | Array<SubsonicID>;

	@SubsonicObjField({
		nullable: true,
		description: 'The maximum bit rate (in Kbps) for the user. Audio streams of higher bit rates are automatically downsampled to this bit rate. Legal values: 0 (no limit), 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320.'
	})
	maxBitRate?: MaxBitrates;
}

@SubsonicObjParamsType()
export class SubsonicParameterBookmark {
	@SubsonicObjField({ description: 'ID of the media file to bookmark. If a bookmark already exists for this file it will be overwritten.', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({ description: 'The position (in milliseconds) within the media file.', min: 0 })
	position!: number;

	@SubsonicObjField({ nullable: true, description: 'A user-defined comment.' })
	comment?: string;
}

@SubsonicObjParamsType()
export class SubsonicParameterRandomSong {
	@SubsonicObjField({ nullable: true, description: 'The number of songs to return.', min: 1, max: 500, example: 10, defaultValue: 10 })
	size?: number;

	@SubsonicObjField({ nullable: true, isID: true, description: 'Only return songs in the music folder with the given ID.' })
	musicFolderId?: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'Only returns songs belonging to this genre. e.g., "Rock"' })
	genre?: string;

	@SubsonicObjField({ nullable: true, description: 'Only return songs published after or in this year.', min: 0, example: 2000 })
	fromYear?: number;

	@SubsonicObjField({ nullable: true, description: 'Only return songs published before or in this year.', min: 0, example: 2001 })
	toYear?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterSearch {
	@SubsonicObjField({ nullable: true, description: 'Searches all fields.' })
	any?: string;

	@SubsonicObjField({ nullable: true, description: 'Artist to search for.' })
	artist?: string;

	@SubsonicObjField({ nullable: true, description: 'Album to search for.' })
	album?: string;

	@SubsonicObjField({ nullable: true, description: 'Song title to search for.' })
	title?: string;

	@SubsonicObjField({ nullable: true, description: 'Maximum number of results to return.', min: 1, example: 10, defaultValue: 20 })
	count?: number;

	@SubsonicObjField({ nullable: true, description: 'Search result offset. Used for paging.', min: 0, example: 10, defaultValue: 0 })
	offset?: number;

	/**
	 * Only return matches that are newer than this. Given as milliseconds since 1970.
	 */
	newerThan?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterSearch2 {
	@SubsonicObjField({ nullable: true, description: 'Search query.' })
	query?: string;

	@SubsonicObjField({ nullable: true, description: 'Maximum number of artists to return.', min: 1, example: 10, defaultValue: 20 })
	artistCount?: number;

	@SubsonicObjField({ nullable: true, description: 'Search result offset for artists. Used for paging.', min: 0, example: 10, defaultValue: 0 })
	artistOffset?: number;

	@SubsonicObjField({ nullable: true, description: 'Maximum number of albums to return.', min: 1, example: 10, defaultValue: 20 })
	albumCount?: number;

	@SubsonicObjField({ nullable: true, description: 'Search result offset for albums. Used for paging.', min: 0, example: 10, defaultValue: 0 })
	albumOffset?: number;

	@SubsonicObjField({ nullable: true, description: 'Maximum number of songs to return.', min: 1, example: 10, defaultValue: 20 })
	songCount?: number;

	@SubsonicObjField({ nullable: true, description: 'Search result offset for songs. Used for paging.', min: 0, example: 10, defaultValue: 0 })
	songOffset?: number;

	@SubsonicObjField({ nullable: true, isID: true, description: 'Only return songs in the music folder with the given ID.' })
	musicFolderId?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterLyrics {
	/**
	 * The artist name.
	 */
	artist?: string;
	/**
	 * The song title.
	 */
	title?: string;
}

@SubsonicObjParamsType()
export class SubsonicParameterPlayQueue {
	@SubsonicObjField(() => [Number], {
		description: 'ID of a song in the play queue. Use one id parameter for each song in the play queue.',
		isID: true
	})
	id!: SubsonicID | Array<SubsonicID>;

	@SubsonicObjField({ nullable: true, description: 'The ID of the current playing song.', isID: true })
	current?: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'The position in milliseconds within the currently playing song.', min: 0 })
	position?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterSongsByGenre {
	@SubsonicObjField({ description: 'The genre.' })
	genre!: string;

	@SubsonicObjField({ nullable: true, description: 'The maximum number of songs to return.', min: 1, max: 500, example: 10, defaultValue: 10 })
	count?: number;

	@SubsonicObjField({ nullable: true, description: 'The offset. Useful if you want to page through the songs in a genre.', min: 0, example: 10, defaultValue: 0 })
	offset?: number;

	@SubsonicObjField({ nullable: true, description: 'Only return albums in the music folder with the given ID.', isID: true })
	musicFolderId?: SubsonicID;
}

@SubsonicObjParamsType()
export class SubsonicParameterScrobble {
	@SubsonicObjField({ description: 'A string which uniquely identifies the file to scrobble.', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'The time (in milliseconds since 1 Jan 1970) at which the song was listened to.', min: 0 })
	time?: number;

	@SubsonicObjField({ nullable: true, description: 'Whether this is a "submission" or a "now playing" notification.', defaultValue: false })
	submission?: boolean;
}

@SubsonicObjParamsType()
export class SubsonicParameterCaptions {
	@SubsonicObjField({ description: 'The ID of the video.', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'Preferred captions format ("srt" or "vtt").' })
	format?: CaptionsFormat;
}

@SubsonicObjParamsType()
export class SubsonicParameterShare {
	@SubsonicObjField({ description: 'ID of a song, album or video to share. Use one id parameter for each entry to share.', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({ nullable: true, description: 'A user-defined description that will be displayed to people visiting the shared media..' })
	description?: string;

	@SubsonicObjField({ nullable: true, description: 'The time at which the share expires. Given as milliseconds since 1970.', min: 0 })
	expires?: number;
}

@SubsonicObjParamsType()
export class SubsonicParameterHLS {
	@SubsonicObjField({ description: 'A string which uniquely identifies the media file to stream.', isID: true })
	id!: SubsonicID;

	@SubsonicObjField({
		nullable: true,
		description: 'If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If this parameter is specified more than once, ' +
			'the server will create a variant playlist, suitable for adaptive bitrate streaming. ' +
			'The playlist will support streaming at all the specified bitrates. The server will automatically choose video dimensions that are suitable for the given bitrates. ' +
			'You may explicitly request a certain width (480) and height (360) like so: bitRate=1000@480x360'
	})
	bitRate?: string;

	@SubsonicObjField({ nullable: true, description: 'The ID of the audio track to use. See getVideoInfo for how to get the list of available audio tracks for a video.', isID: true })
	audioTrack?: string;
}

@SubsonicObjParamsType()
export class SubsonicParameterJukebox {
	@SubsonicObjField({ description: 'The operation to perform.' })
	action!: JukeboxAction;

	@SubsonicObjField({ nullable: true, description: 'Used by skip and remove. Zero-based index of the song to skip to or remove.', min: 0 })
	index?: number;

	@SubsonicObjField({ nullable: true, description: 'Used by skip. Start playing this many seconds into the track.', min: 0, example: 10 })
	offset?: number;

	@SubsonicObjField({
		isID: true,
		description: 'Used by add and set. ID of song to add to the jukebox playlist. Use multiple id parameters to add many songs in the same request. ' +
			'(set is similar to a clear followed by a add, but will not change the currently playing track.)'
	})
	id?: SubsonicID;

	@SubsonicObjField(() => Number, { nullable: true, description: ' Used by setGain to control the playback volume. A float value between 0.0 and 1.0.', min: 0.0, max: 1.0 })
	gain?: number;
}
