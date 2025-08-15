import { SubsonicObjectParametersType } from '../decorators/subsonic-object-parameters-type.js';
import { SubsonicObjectField } from '../decorators/subsonic-object-field.js';
import { SubsonicID } from './subsonic-rest-data.js';

export type AlbumListType = 'random' | 'newest' | 'starred' | 'frequent' | 'recent' | 'highest' | 'alphabeticalByName' | 'alphabeticalByArtist' | 'byYear' | 'byGenre';
export type StreamFormat = 'mp3' | 'flv' | 'raw';
export type MaxBitrates = 0 | 32 | 40 | 48 | 56 | 64 | 80 | 96 | 112 | 128 | 160 | 192 | 224 | 256 | 320;
export type CaptionsFormat = 'srt' | 'vtt';
export type JukeboxAction = 'get' | 'status' | 'set' | 'start' | 'stop' | 'skip' | 'add' | 'clear' | 'remove' | 'shuffle' | 'setGain';

@SubsonicObjectParametersType()
export class SubsonicParameterID {
	@SubsonicObjectField({ description: 'The item ID', isID: true })
	id!: SubsonicID;
}

@SubsonicObjectParametersType()
export class SubsonicParameterMusicFolderID {
	@SubsonicObjectField({ description: 'Only return results from the music folder with the given ID', isID: true, nullable: true })
	musicFolderId?: SubsonicID;
}

@SubsonicObjectParametersType()
export class SubsonicParameterIndexes {
	@SubsonicObjectField({ nullable: true, isID: true, description: 'Only return results from the music folder with the given ID' })
	musicFolderId?: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'If specified, only return a result if the artist collection has changed since the given time (in milliseconds since 1 Jan 1970).', min: 0, example: 1_727_432_363_956 })
	ifModifiedSince?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterInternetRadioCreate {
	@SubsonicObjectField({ description: 'The stream URL for the station.', example: 'https://stream.example.com/stream.m3u' })
	streamUrl!: string;

	@SubsonicObjectField({ description: 'The user-defined name for the station.', example: 'Best songs' })
	name!: string;

	@SubsonicObjectField({ nullable: true, description: 'The home page URL for the station.', example: 'https://stream.example.com/index.html' })
	homepageUrl?: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterInternetRadioUpdate {
	@SubsonicObjectField({ description: 'The ID for the station.', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({ description: 'The stream URL for the station.', example: 'https://stream.example.com/stream.m3u' })
	streamUrl!: string;

	@SubsonicObjectField({ description: 'The user-defined name for the station.', example: 'Best songs' })
	name!: string;

	@SubsonicObjectField({ nullable: true, description: 'The home page URL for the station.', example: 'https://stream.example.com/index.html' })
	homepageUrl?: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterAlbumList {
	@SubsonicObjectField({ description: 'The list type.' })
	type!: AlbumListType;

	@SubsonicObjectField({ nullable: true, description: 'The number of albums to return.', min: 0, max: 500, example: 10, defaultValue: 10 })
	size?: number;

	@SubsonicObjectField({ nullable: true, description: 'The list offset. Useful if you for example want to page through the list of newest albums.', min: 0, example: 10, defaultValue: 0 })
	offset?: number;

	@SubsonicObjectField({ nullable: true, description: 'The name of the genre, e.g., "Rock"' })
	genre?: string;

	@SubsonicObjectField({ nullable: true, description: 'The first year in the range. If fromYear > toYear a reverse chronological list is returned.', min: 0, example: 2000 })
	fromYear?: number;

	@SubsonicObjectField({ nullable: true, description: 'The last year in the range.', min: 0, example: 2001 })
	toYear?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterAlbumList2 {
	@SubsonicObjectField({ description: 'The list type.' })
	type!: AlbumListType;

	@SubsonicObjectField({ nullable: true, description: 'The number of albums to return.', min: 0, max: 500, example: 10, defaultValue: 10 })
	size?: number;

	@SubsonicObjectField({ nullable: true, description: 'The list offset. Useful if you for example want to page through the list of newest albums.', min: 0, example: 10, defaultValue: 0 })
	offset?: number;

	@SubsonicObjectField({ nullable: true, description: 'The name of the genre, e.g., "Rock"' })
	genre?: string;

	@SubsonicObjectField({ nullable: true, description: 'The first year in the range. If fromYear > toYear a reverse chronological list is returned.', min: 0, example: 2000 })
	fromYear?: number;

	@SubsonicObjectField({ nullable: true, description: 'The last year in the range.', min: 0, example: 2001 })
	toYear?: number;

	@SubsonicObjectField({ nullable: true, isID: true, description: 'Only return results from the music folder with the given ID' })
	musicFolderId?: SubsonicID;
}

@SubsonicObjectParametersType()
export class SubsonicParameterCoverArt {
	@SubsonicObjectField({ description: 'The ID of a song, album or artist.', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'If specified, scale image to this size.', min: 10, example: 300 })
	size?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterUsername {
	@SubsonicObjectField({ description: 'The name of the user to retrieve. You can only retrieve your own user unless you have admin privileges.' })
	username!: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterArtistInfo {
	@SubsonicObjectField({ description: 'The ID of a song, album or artist.', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'Max number of similar artists to return.', min: 0, example: 10, defaultValue: 20 })
	count?: number;

	@SubsonicObjectField({ nullable: true, description: 'Whether to return artists that are not present in the media library.', defaultValue: false })
	includeNotPresent?: boolean;
}

@SubsonicObjectParametersType()
export class SubsonicParameterTopSongs {
	@SubsonicObjectField({ description: 'The artist name' })
	artist!: string;

	@SubsonicObjectField({ nullable: true, description: 'Max number of songs to return.', min: 0, example: 10, defaultValue: 50 })
	count?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterSimilarSongs {
	@SubsonicObjectField({ description: 'The ID of a song, album or artist.', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'Max number of songs to return.', min: 0, example: 10, defaultValue: 50 })
	count?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterDownload {
	@SubsonicObjectField({ description: 'A string which uniquely identifies the file to download', isID: true })
	id!: SubsonicID;
}

@SubsonicObjectParametersType()
export class SubsonicParameterStream {
	@SubsonicObjectField({ description: 'A string which uniquely identifies the file to stream', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If set to zero, no limit is imposed.', min: 0 })
	maxBitRate?: number;

	@SubsonicObjectField({ nullable: true, description: 'Only applicable to video streaming. If specified, start streaming at the given offset (in seconds) into the video. Typically used to implement video skipping.', min: 0 })
	timeOffset?: number;

	@SubsonicObjectField({ nullable: true, description: 'Only applicable to video streaming. Requested video size specified as WxH, for instance "640x480".' })
	size?: string;

	@SubsonicObjectField({
		nullable: true,
		description: 'Only applicable to video streaming. Subsonic can optimize videos for streaming by converting them to MP4. If a conversion exists for the video in question, then setting this parameter to "true" will cause the converted video to be returned instead of the original',
		defaultValue: false
	})
	converted?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'if true, the Content-Length HTTP header will be set to an estimated value for transcoded or downsampled media.', defaultValue: false })
	estimateContentLength?: boolean;

	@SubsonicObjectField({
		nullable: true,
		description: 'Specifies the preferred target format (e.g., "mp3" or "flv") in case there are multiple applicable transcodings. Starting with 1.9.0 you can use the special value "raw" to disable transcoding.'
	})
	format?: StreamFormat;
}

@SubsonicObjectParametersType()
export class SubsonicParameterRate {
	@SubsonicObjectField({ description: 'A string which uniquely identifies the file (song) or folder (album/artist) to rate', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'The rating between 1 and 5 (inclusive), or 0 to remove the rating.', min: 0, max: 5 })
	rating!: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterChangePassword {
	@SubsonicObjectField({ description: 'The name of the user which should change its password.' })
	username!: string;

	@SubsonicObjectField({ description: 'The new password of the new user, either in clear text of hex-encoded.' })
	password!: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterChatMessages {
	@SubsonicObjectField({ nullable: true, description: 'Only return messages newer than this time (in millis since Jan 1 1970).', min: 0, example: 1_727_432_363_956 })
	since?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterChatMessage {
	@SubsonicObjectField({ description: 'The chat message.' })
	message!: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterState {
	@SubsonicObjectField(() => [String], {
		nullable: true, description: 'The ID of the file (song) or folder (album/artist) to star. Multiple parameters allowed.',
		isID: true
	})
	id?: SubsonicID | Array<SubsonicID>;

	@SubsonicObjectField(() => [String], {
		nullable: true,
		description: 'The ID of an album to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.',
		isID: true
	})
	albumId?: SubsonicID | Array<SubsonicID>;

	@SubsonicObjectField(() => [String], {
		nullable: true,
		description: 'The ID of an artist to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.',
		isID: true
	})
	artistId?: SubsonicID | Array<SubsonicID>;
}

@SubsonicObjectParametersType()
export class SubsonicParameterPlaylists {
	@SubsonicObjectField({ nullable: true, description: 'If specified, return playlists for this user rather than for the authenticated user. The authenticated user must have admin role if this parameter is used.' })
	username?: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterPlaylistCreate {
	@SubsonicObjectField({ nullable: true, description: 'The playlist ID. (if updating)', isID: true })
	playlistId?: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'The human-readable name of the playlist.' })
	name?: string;

	@SubsonicObjectField(() => [String], {
		description: 'ID of a song in the playlist. Use one songId parameter for each song in the playlist.',
		nullable: true,
		isID: true
	})
	songId?: SubsonicID | Array<SubsonicID>;
}

@SubsonicObjectParametersType()
export class SubsonicParameterPlaylistUpdate {
	@SubsonicObjectField({ description: 'The playlist ID.', isID: true })
	playlistId!: string;

	@SubsonicObjectField({ nullable: true, description: 'The human-readable name of the playlist.' })
	name?: string;

	@SubsonicObjectField({ nullable: true, description: 'The playlist comment.' })
	comment?: string;

	@SubsonicObjectField({ nullable: true, description: 'true if the playlist should be visible to all users, false otherwise.', defaultValue: false })
	public?: boolean;

	@SubsonicObjectField(() => [String], {
		nullable: true,
		description: 'Add this song with this ID to the playlist. Multiple parameters allowed.',
		isID: true
	})
	songIdToAdd?: SubsonicID | Array<SubsonicID>;

	@SubsonicObjectField(() => [Number], {
		nullable: true,
		description: 'Remove the song at this position in the playlist. Multiple parameters allowed.'
	})
	songIndexToRemove?: number | Array<number>;
}

@SubsonicObjectParametersType()
export class SubsonicParameterPodcastChannel {
	@SubsonicObjectField({ description: 'The URL of the Podcast to add.' })
	url!: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterPodcastChannels {
	@SubsonicObjectField({ nullable: true, description: 'If specified, only return the Podcast channel with this ID', isID: true })
	id?: string;

	@SubsonicObjectField({ nullable: true, description: 'Whether to include Podcast episodes in the returned result.', defaultValue: true })
	includeEpisodes?: boolean;
}

@SubsonicObjectParametersType()
export class SubsonicParameterPodcastEpisodesNewest {
	@SubsonicObjectField({ nullable: true, description: 'The maximum number of episodes to return.', min: 0, example: 10, defaultValue: 20 })
	count?: number;

	@SubsonicObjectField({ nullable: true, description: 'Search result offset. Used for paging.', min: 0, example: 10, defaultValue: 0 })
	offset?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterCreateUser {
	@SubsonicObjectField({ description: 'The name of the new user.' })
	username!: string;

	@SubsonicObjectField({ nullable: true, description: 'The password of the new user, either in clear text of hex-encoded.' })
	password?: string;

	@SubsonicObjectField({ nullable: true, description: 'The email address of the new user.' })
	email?: string;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is authenicated in LDAP.', defaultValue: false })
	ldapAuthenticated?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is administrator.', defaultValue: false })
	adminRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to change personal settings and password.', defaultValue: false })
	settingsRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to play files.', defaultValue: false })
	streamRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to play files in jukebox mode.', defaultValue: false })
	jukeboxRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to download files.', defaultValue: false })
	downloadRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to upload files.', defaultValue: false })
	uploadRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to change cover art and tags.', defaultValue: false })
	coverArtRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to create and edit comments and ratings.', defaultValue: false })
	commentRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to administrate Podcasts.', defaultValue: false })
	podcastRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to create and delete playlists.', defaultValue: false })
	playlistRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to share files with anyone.', defaultValue: false })
	shareRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to start video conversions.', defaultValue: false })
	videoConversionRole?: boolean;

	@SubsonicObjectField(() => [String], {
		nullable: true,
		isID: true,
		description: 'IDs of the music folders the user is allowed access to. Include the parameter once for each folder.'
	})
	musicFolderId?: SubsonicID | Array<SubsonicID>;
}

@SubsonicObjectParametersType()
export class SubsonicParameterUpdateUser {
	@SubsonicObjectField({ description: 'The name of the user.' })
	username!: string;

	@SubsonicObjectField({ nullable: true, description: 'The password of the user, either in clear text of hex-encoded.' })
	password?: string;

	@SubsonicObjectField({ nullable: true, description: 'The email address of the user.' })
	email?: string;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is authenicated in LDAP.', defaultValue: false })
	ldapAuthenticated?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is administrator.', defaultValue: false })
	adminRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to change personal settings and password.', defaultValue: false })
	settingsRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to play files.', defaultValue: false })
	streamRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to play files in jukebox mode.', defaultValue: false })
	jukeboxRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to download files.', defaultValue: false })
	downloadRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to upload files.', defaultValue: false })
	uploadRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to change cover art and tags.', defaultValue: false })
	coverArtRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to create and edit comments and ratings.', defaultValue: false })
	commentRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to administrate Podcasts.', defaultValue: false })
	podcastRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to create and delete playlists.', defaultValue: false })
	playlistRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to share files with anyone.', defaultValue: false })
	shareRole?: boolean;

	@SubsonicObjectField({ nullable: true, description: 'Whether the user is allowed to start video conversions.', defaultValue: false })
	videoConversionRole?: boolean;

	@SubsonicObjectField(() => [String], {
		nullable: true, isID: true,
		description: 'IDs of the music folders the user is allowed access to. Include the parameter once for each folder.'
	})
	musicFolderId?: SubsonicID | Array<SubsonicID>;

	@SubsonicObjectField({
		nullable: true,
		description: 'The maximum bit rate (in Kbps) for the user. Audio streams of higher bit rates are automatically downsampled to this bit rate. Legal values: 0 (no limit), 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320.'
	})
	maxBitRate?: MaxBitrates;
}

@SubsonicObjectParametersType()
export class SubsonicParameterBookmark {
	@SubsonicObjectField({ description: 'ID of the media file to bookmark. If a bookmark already exists for this file it will be overwritten.', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({ description: 'The position (in milliseconds) within the media file.', min: 0 })
	position!: number;

	@SubsonicObjectField({ nullable: true, description: 'A user-defined comment.' })
	comment?: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterRandomSong {
	@SubsonicObjectField({ nullable: true, description: 'The number of songs to return.', min: 0, max: 500, example: 10, defaultValue: 10 })
	size?: number;

	@SubsonicObjectField({ nullable: true, isID: true, description: 'Only return songs in the music folder with the given ID.' })
	musicFolderId?: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'Only returns songs belonging to this genre. e.g., "Rock"' })
	genre?: string;

	@SubsonicObjectField({ nullable: true, description: 'Only return songs published after or in this year.', min: 0, example: 2000 })
	fromYear?: number;

	@SubsonicObjectField({ nullable: true, description: 'Only return songs published before or in this year.', min: 0, example: 2001 })
	toYear?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterSearch {
	@SubsonicObjectField({ nullable: true, description: 'Searches all fields.' })
	any?: string;

	@SubsonicObjectField({ nullable: true, description: 'Artist to search for.' })
	artist?: string;

	@SubsonicObjectField({ nullable: true, description: 'Album to search for.' })
	album?: string;

	@SubsonicObjectField({ nullable: true, description: 'Song title to search for.' })
	title?: string;

	@SubsonicObjectField({ nullable: true, description: 'Maximum number of results to return.', min: 0, example: 10, defaultValue: 20 })
	count?: number;

	@SubsonicObjectField({ nullable: true, description: 'Search result offset. Used for paging.', min: 0, example: 10, defaultValue: 0 })
	offset?: number;

	@SubsonicObjectField({ nullable: true, description: 'Only return matches that are newer than this. Given as milliseconds since 1970.', min: 0 })
	newerThan?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterSearch2 {
	@SubsonicObjectField({ nullable: true, description: 'Search query.' })
	query?: string;

	@SubsonicObjectField({ nullable: true, description: 'Maximum number of artists to return.', min: 0, example: 10, defaultValue: 20 })
	artistCount?: number;

	@SubsonicObjectField({ nullable: true, description: 'Search result offset for artists. Used for paging.', min: 0, example: 10, defaultValue: 0 })
	artistOffset?: number;

	@SubsonicObjectField({ nullable: true, description: 'Maximum number of albums to return.', min: 0, example: 10, defaultValue: 20 })
	albumCount?: number;

	@SubsonicObjectField({ nullable: true, description: 'Search result offset for albums. Used for paging.', min: 0, example: 10, defaultValue: 0 })
	albumOffset?: number;

	@SubsonicObjectField({ nullable: true, description: 'Maximum number of songs to return.', min: 0, example: 10, defaultValue: 20 })
	songCount?: number;

	@SubsonicObjectField({ nullable: true, description: 'Search result offset for songs. Used for paging.', min: 0, example: 10, defaultValue: 0 })
	songOffset?: number;

	@SubsonicObjectField({ nullable: true, isID: true, description: 'Only return songs in the music folder with the given ID.' })
	musicFolderId?: SubsonicID;
}

@SubsonicObjectParametersType()
export class SubsonicParameterLyrics {
	@SubsonicObjectField({ nullable: true, description: 'Search lyrics by artist.' })
	artist?: string;

	@SubsonicObjectField({ nullable: true, description: 'Search lyrics by song title.' })
	title?: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterLyricsByID {
	@SubsonicObjectField({ description: 'The ID of the current playing song.', isID: true })
	id!: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterPlayQueue {
	@SubsonicObjectField(() => [String], {
		description: 'ID of a song in the play queue. Use one id parameter for each song in the play queue.',
		isID: true
	})
	id!: SubsonicID | Array<SubsonicID>;

	@SubsonicObjectField({ nullable: true, description: 'The ID of the current playing song.', isID: true })
	current?: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'The position in milliseconds within the currently playing song.', min: 0 })
	position?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterSongsByGenre {
	@SubsonicObjectField({ description: 'The genre.' })
	genre!: string;

	@SubsonicObjectField({ nullable: true, description: 'The maximum number of songs to return.', min: 0, max: 500, example: 10, defaultValue: 10 })
	count?: number;

	@SubsonicObjectField({ nullable: true, description: 'The offset. Useful if you want to page through the songs in a genre.', min: 0, example: 10, defaultValue: 0 })
	offset?: number;

	@SubsonicObjectField({ nullable: true, description: 'Only return albums in the music folder with the given ID.', isID: true })
	musicFolderId?: SubsonicID;
}

@SubsonicObjectParametersType()
export class SubsonicParameterScrobble {
	@SubsonicObjectField({ description: 'A string which uniquely identifies the file to scrobble.', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'The time (in milliseconds since 1 Jan 1970) at which the song was listened to.', min: 0 })
	time?: number;

	@SubsonicObjectField({ nullable: true, description: 'Whether this is a "submission" or a "now playing" notification.', defaultValue: false })
	submission?: boolean;
}

@SubsonicObjectParametersType()
export class SubsonicParameterCaptions {
	@SubsonicObjectField({ description: 'The ID of the video.', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'Preferred captions format ("srt" or "vtt").' })
	format?: CaptionsFormat;
}

@SubsonicObjectParametersType()
export class SubsonicParameterShare {
	@SubsonicObjectField({ description: 'ID of a song, album or video to share. Use one id parameter for each entry to share.', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({ nullable: true, description: 'A user-defined description that will be displayed to people visiting the shared media..' })
	description?: string;

	@SubsonicObjectField({ nullable: true, description: 'The time at which the share expires. Given as milliseconds since 1970.', min: 0 })
	expires?: number;
}

@SubsonicObjectParametersType()
export class SubsonicParameterHLS {
	@SubsonicObjectField({ description: 'A string which uniquely identifies the media file to stream.', isID: true })
	id!: SubsonicID;

	@SubsonicObjectField({
		nullable: true,
		description: 'If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If this parameter is specified more than once, ' +
			'the server will create a variant playlist, suitable for adaptive bitrate streaming. ' +
			'The playlist will support streaming at all the specified bitrates. The server will automatically choose video dimensions that are suitable for the given bitrates. ' +
			'You may explicitly request a certain width (480) and height (360) like so: bitRate=1000@480x360'
	})
	bitRate?: string;

	@SubsonicObjectField({ nullable: true, description: 'The ID of the audio track to use. See getVideoInfo for how to get the list of available audio tracks for a video.', isID: true })
	audioTrack?: string;
}

@SubsonicObjectParametersType()
export class SubsonicParameterJukebox {
	@SubsonicObjectField({ description: 'The operation to perform.' })
	action!: JukeboxAction;

	@SubsonicObjectField({ nullable: true, description: 'Used by skip and remove. Zero-based index of the song to skip to or remove.', min: 0 })
	index?: number;

	@SubsonicObjectField({ nullable: true, description: 'Used by skip. Start playing this many seconds into the track.', min: 0, example: 10 })
	offset?: number;

	@SubsonicObjectField({
		isID: true,
		description: 'Used by add and set. ID of song to add to the jukebox playlist. Use multiple id parameters to add many songs in the same request. ' +
			'(set is similar to a clear followed by a add, but will not change the currently playing track.)'
	})
	id?: SubsonicID;

	@SubsonicObjectField(() => Number, { nullable: true, description: ' Used by setGain to control the playback volume. A float value between 0.0 and 1.0.', min: 0, max: 1 })
	gain?: number;
}
