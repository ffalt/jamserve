import {Subsonic} from './subsonic-rest-data';
import {SubsonicParameters} from './subsonic-rest-params';

export type SubsonicApiImageTypes = ['image/jpeg', 'image/png'];
export type SubsonicApiStreamTypes = ['audio/mpeg', 'audio/flac', 'audio/mp4', 'audio/ogg', 'audio/x-flv'];
export type SubsonicApiTextTypes = ['text/plain'];
export type SubsonicHLSStreamTypes = ['application/vnd.apple.mpegurl'];

export interface SubsonicApi {
	GET: {
		/**
		 * Chat: Adds a message to the chat log.
		 */
		'addChatMessage.view'?: { params: SubsonicParameters.ChatMessage };
		/**
		 * User: Changes the password of an existing Subsonic user, using the following parameters. You can only change your own password unless you have admin privileges.
		 */
		'changePassword.view'?: { params: SubsonicParameters.ChangePassword };
		/**
		 * Bookmarks: Creates or updates a bookmark (a position within a media file). Bookmarks are personal and not visible to other users.
		 */
		'createBookmark.view'?: { params: SubsonicParameters.Bookmark };
		/**
		 * Playlists: Creates (or updates) a playlist.
		 */
		'createPlaylist.view'?: { params: SubsonicParameters.PlaylistCreate, result: { playlist: Subsonic.PlaylistWithSongs } };
		/**
		 * Podcast: Adds a new Podcast channel.
		 */
		'createPodcastChannel.view'?: { params: SubsonicParameters.PodcastChannel, roles: ['podcast'] };
		/**
		 * Sharing: Creates a public URL that can be used by anyone to stream music or video from the Subsonic server. The URL is short and suitable for posting on Facebook, Twitter etc.
		 */
		'createShare.view'?: { params: SubsonicParameters.Share, roles: ['share'] };
		/**
		 * User: Creates a new Subsonic user.
		 */
		'createUser.view'?: { params: SubsonicParameters.CreateUser, roles: ['admin'] };
		/**
		 * Bookmarks: Deletes the bookmark for a given file.
		 */
		'deleteBookmark.view'?: { params: SubsonicParameters.ID };
		/**
		 * InternetRadio: Deletes an existing internet radio station.
		 */
		'deleteInternetRadioStation.view'?: { params: SubsonicParameters.ID, roles: ['admin'] };
		/**
		 * Playlists: Deletes a saved playlist.
		 */
		'deletePlaylist.view'?: { params: SubsonicParameters.ID };
		/**
		 * Podcast: Deletes a Podcast channel.
		 */
		'deletePodcastChannel.view'?: { params: SubsonicParameters.ID, roles: ['podcast'] };
		/**
		 * Podcast: Deletes a Podcast episode.
		 */
		'deletePodcastEpisode.view'?: { params: SubsonicParameters.ID, roles: ['podcast'] };
		/**
		 * Sharing: Deletes an existing share.
		 */
		'deleteShare.view'?: { params: SubsonicParameters.ID };
		/**
		 * User: Deletes an existing Subsonic user.
		 */
		'deleteUser.view'?: { params: SubsonicParameters.Username, roles: ['admin'] };
		/**
		 * Podcast: Request the server to start downloading a given Podcast episode.
		 */
		'downloadPodcastEpisode.view'?: { params: SubsonicParameters.ID, roles: ['podcast'] };
		/**
		 * Browsing: Returns details for an album, including a list of songs. This method organizes music according to ID3 tags.
		 */
		'getAlbum.view'?: { params: SubsonicParameters.ID, result: { album: Subsonic.AlbumWithSongsID3 } };
		/**
		 * Browsing: Returns album notes, image URLs etc, using data from last.fm.
		 */
		'getAlbumInfo.view'?: { params: SubsonicParameters.ID, result: { albumInfo: Subsonic.AlbumInfo } };
		/**
		 * Browsing: Similar to getAlbumInfo, but organizes music according to ID3 tags.
		 */
		'getAlbumInfo2.view'?: { params: SubsonicParameters.ID, result: { albumInfo: Subsonic.AlbumInfo } };
		/**
		 * Lists: Returns a list of random, newest, highest rated etc. albums. Similar to the album lists on the home page of the Subsonic web interface.
		 */
		'getAlbumList.view'?: { params: SubsonicParameters.AlbumList, result: { albumList: Subsonic.AlbumList } };
		/**
		 * Lists: Similar to getAlbumList, but organizes music according to ID3 tags.
		 */
		'getAlbumList2.view'?: { params: SubsonicParameters.AlbumList2, result: { albumList2: Subsonic.AlbumList2 } };
		/**
		 * Browsing: Returns details for an artist, including a list of albums. This method organizes music according to ID3 tags.
		 */
		'getArtist.view'?: { params: SubsonicParameters.ID, result: { artist: Subsonic.ArtistWithAlbumsID3 } };
		/**
		 * Browsing: Returns artist info with biography, image URLs and similar artists, using data from last.fm.
		 */
		'getArtistInfo.view'?: { params: SubsonicParameters.ArtistInfo, result: { artistInfo: Subsonic.ArtistInfo } };
		/**
		 * Browsing: Similar to getArtistInfo, but organizes music according to ID3 tags.
		 */
		'getArtistInfo2.view'?: { params: SubsonicParameters.ArtistInfo, result: { artistInfo2: Subsonic.ArtistInfo2 } };
		/**
		 * Browsing: Similar to getIndexes, but organizes music according to ID3 tags.
		 */
		'getArtists.view'?: { params: SubsonicParameters.MusicFolderID, result: { artists: Subsonic.ArtistsID3 } };
		/**
		 * Bookmarks: Returns all bookmarks for this user. A bookmark is a position within a certain media file.
		 */
		'getBookmarks.view'?: { result: { bookmarks: Subsonic.Bookmarks } };
		/**
		 * Chat: Returns the current visible (non-expired) chat messages.
		 */
		'getChatMessages.view'?: { params: SubsonicParameters.ChatMessages, result: { chatMessages: Subsonic.ChatMessages; } };
		/**
		 * Browsing: Returns all genres.
		 */
		'getGenres.view'?: { result: { genres: Subsonic.Genres } };
		/**
		 * Browsing: Returns an indexed structure of all artists.
		 */
		'getIndexes.view'?: { params: SubsonicParameters.Indexes, result: { indexes: Subsonic.Indexes } };
		/**
		 * InternetRadio: Returns all internet radio stations.
		 */
		'getInternetRadioStations.view'?: { result: { internetRadioStations: Subsonic.InternetRadioStations } };
		/**
		 * InternetRadio: Adds a new internet radio station.
		 */
		'createInternetRadioStation.view'?: { params: SubsonicParameters.InternetRadioCreate, roles: ['admin'] };
		/**
		 * InternetRadio: Updates an existing internet radio station.
		 */
		'updateInternetRadioStation.view'?: { params: SubsonicParameters.InternetRadioUpdate, roles: ['admin'] };
		/**
		 * System: Get details about the software license.
		 */
		'getLicense.view'?: { result: { license: Subsonic.License } };
		/**
		 * MediaRetrieval: Searches for and returns lyrics for a given song.
		 */
		'getLyrics.view'?: { params: SubsonicParameters.Lyrics, result: { lyrics: Subsonic.Lyrics } };
		/**
		 * Browsing: Returns a listing of all files in a music directory. Typically used to get list of albums for an artist, or list of songs for an album.
		 */
		'getMusicDirectory.view'?: { params: SubsonicParameters.ID, result: { directory: Subsonic.Directory } };
		/**
		 * Browsing: Returns all configured top-level music folders.
		 */
		'getMusicFolders.view'?: { result: { musicFolders: Subsonic.MusicFolders } };
		/**
		 * Podcast: Returns the most recently published Podcast episodes.
		 */
		'getNewestPodcasts.view'?: { params: SubsonicParameters.PodcastEpisodesNewest, result: { newestPodcasts: Subsonic.NewestPodcasts } };
		/**
		 * Lists: Returns what is currently being played by all users.
		 */
		'getNowPlaying.view'?: { result: { nowPlaying: Subsonic.NowPlaying } };
		/**
		 * Playlists: Returns a listing of files in a saved playlist.
		 */
		'getPlaylist.view'?: { params: SubsonicParameters.ID, result: { playlist: Subsonic.PlaylistWithSongs } };
		/**
		 * Playlists: Returns all playlists a user is allowed to play.
		 */
		'getPlaylists.view'?: { params: SubsonicParameters.Playlists, result: { playlists: Subsonic.Playlists } };
		/**
		 * Bookmarks: Returns the state of the play queue for this user (as set by savePlayQueue). This includes the tracks in the play queue, the currently playing track, and the position within this track. Typically used to allow a user to move between different clients/apps while retaining the same play queue (for instance when listening to an audio book).
		 */
		'getPlayQueue.view'?: { result: { playQueue: Subsonic.PlayQueue } };
		/**
		 * Podcast: Returns all Podcast channels the server subscribes to, and (optionally) their episodes. This method can also be used to return details for only one channel - refer to the id parameter. A typical use case for this method would be to first retrieve all channels without episodes, and then retrieve all episodes for the single channel the user selects.
		 */
		'getPodcasts.view'?: { params: SubsonicParameters.PodcastChannels, result: { podcasts: Subsonic.Podcasts } };
		/**
		 * Lists: Returns random songs matching the given criteria.
		 */
		'getRandomSongs.view'?: { params: SubsonicParameters.RandomSong, result: { randomSongs: Subsonic.Songs } };
		/**
		 * Library: Returns the current status for media library scanning.
		 */
		'getScanStatus.view'?: { result: { scanStatus: Subsonic.ScanStatus } };
		/**
		 * Library: Initiates a rescan of the media libraries.
		 */
		'startScan.view'?: {};
		/**
		 * Sharing: Returns information about shared media this user is allowed to manage.
		 */
		'getShares.view'?: { result: { shares: Subsonic.Shares } };
		/**
		 * Browsing: Returns a random collection of songs from the given artist and similar artists, using data from last.fm. Typically used for artist radio features.
		 */
		'getSimilarSongs.view'?: { params: SubsonicParameters.SimilarSongs, result: { similarSongs: Subsonic.SimilarSongs } };
		/**
		 * Browsing: Similar to getSimilarSongs, but organizes music according to ID3 tags.
		 */
		'getSimilarSongs2.view'?: { params: SubsonicParameters.SimilarSongs, result: { similarSongs2: Subsonic.SimilarSongs2 } };
		/**
		 * Browsing: Returns details for a song.
		 */
		'getSong.view'?: { params: SubsonicParameters.ID, result: { song: Subsonic.Child } };
		/**
		 * Lists: Returns songs in a given genre.
		 */
		'getSongsByGenre.view'?: { params: SubsonicParameters.SongsByGenre, result: { songsByGenre: Subsonic.Songs } };
		/**
		 * Lists: Returns starred songs, albums and artists.
		 */
		'getStarred.view'?: { params: SubsonicParameters.MusicFolderID, result: { starred: Subsonic.Starred } };
		/**
		 * Lists: Similar to getStarred, but organizes music according to ID3 tags.
		 */
		'getStarred2.view'?: { params: SubsonicParameters.MusicFolderID, result: { starred2: Subsonic.Starred2 } };
		/**
		 * Browsing: Returns top songs for the given artist, using data from last.fm.
		 */
		'getTopSongs.view'?: { params: SubsonicParameters.TopSongs, result: { topSongs: Subsonic.TopSongs } };
		/**
		 * User: Get details about a given user, including which authorization roles and folder access it has. Can be used to enable/disable certain features in the client, such as jukebox control.
		 */
		'getUser.view'?: { params: SubsonicParameters.Username, result: { user: Subsonic.User } };
		/**
		 * User: Get details about all users, including which authorization roles and folder access they have.
		 */
		'getUsers.view'?: { result: { users: Subsonic.Users }, roles: ['admin'] };
		/**
		 * Browsing: Returns details for a video, including information about available audio tracks, subtitles (captions) and conversions.
		 */
		'getVideoInfo.view'?: { params: SubsonicParameters.ID, result: { videoInfo: Subsonic.VideoInfo } };
		/**
		 * Browsing: Returns all video files.
		 */
		'getVideos.view'?: { result: { videos: Subsonic.Videos } };
		/**
		 * System: Controls the jukebox, i.e., playback directly on the server's audio hardware. Note: The user must be authorized to control the jukebox.
		 */
		'jukeboxControl.view'?: { params: SubsonicParameters.Jukebox, result: { jukeboxStatus: Subsonic.JukeboxStatus }, roles: ['jukebox'] };
		/**
		 * System: Used to test connectivity with the server.
		 */
		'ping.view'?: {};
		/**
		 * Podcast: Requests the server to check for new Podcast episodes.
		 */
		'refreshPodcasts.view'?: { roles: ['podcast'] };
		/**
		 * Bookmarks: Saves the state of the play queue for this user. This includes the tracks in the play queue, the currently playing track, and the position within this track. Typically used to allow a user to move between different clients/apps while retaining the same play queue (for instance when listening to an audio book).
		 */
		'savePlayQueue.view'?: { params: SubsonicParameters.PlayQueue };
		/**
		 * Annotation: Registers the local playback of one or more media files. Typically used when playing media that is cached on the client.
		 */
		'scrobble.view'?: { params: SubsonicParameters.Scrobble };
		/**
		 * Searching: Returns a listing of files matching the given search criteria. Supports paging through the result.
		 */
		'search.view'?: { params: SubsonicParameters.Search, result: { searchResult: Subsonic.SearchResult }, deprecated: true };
		/**
		 * Searching: Returns albums, artists and songs matching the given search criteria. Supports paging through the result.
		 */
		'search2.view'?: { params: SubsonicParameters.Search2, result: { searchResult2: Subsonic.SearchResult2 } };
		/**
		 * Searching: Similar to search2, but organizes music according to ID3 tags.
		 */
		'search3.view'?: { params: SubsonicParameters.Search2, result: { searchResult3: Subsonic.SearchResult3 } };
		/**
		 * Annotation: Sets the rating for a music file.
		 */
		'setRating.view'?: { params: SubsonicParameters.Rate };
		/**
		 * Annotation: Attaches a star to a song, album or artist.
		 */
		'star.view'?: { params: SubsonicParameters.State };
		/**
		 * Annotation: Removes the star from a song, album or artist.
		 */
		'unstar.view'?: { params: SubsonicParameters.State };
		/**
		 * Playlists: Updates a playlist. Only the owner of a playlist is allowed to update it.
		 */
		'updatePlaylist.view'?: { params: SubsonicParameters.PlaylistUpdate };
		/**
		 * Sharing: Updates the description and/or expiration date for an existing share.
		 */
		'updateShare.view'?: { params: SubsonicParameters.Share };
		/**
		 * User: Modifies an existing Subsonic user.
		 */
		'updateUser.view'?: { params: SubsonicParameters.UpdateUser, roles: ['admin'] };
		/**
		 * MediaRetrieval: Returns the avatar (personal image) for a user.
		 */
		'getAvatar.view'?: { params: SubsonicParameters.Username, binary: SubsonicApiImageTypes };
		/**
		 * MediaRetrieval: Returns captions (subtitles) for a video. Use getVideoInfo to get a list of available captions.
		 */
		'getCaptions.view'?: { params: SubsonicParameters.Captions, binary: SubsonicApiTextTypes };
		/**
		 * MediaRetrieval: Returns a cover art image.
		 */
		'getCoverArt.view'?: { params: SubsonicParameters.CoverArt, binary: SubsonicApiImageTypes };
		/**
		 * MediaRetrieval: Creates an HLS (HTTP Live Streaming) playlist used for streaming video or audio. HLS is a streaming protocol implemented by Apple and works by breaking the overall stream into a sequence of small HTTP-based file downloads. It's supported by iOS and newer versions of Android. This method also supports adaptive bitrate streaming, see the bitRate parameter.
		 */
		'hls.view'?: { params: SubsonicParameters.HLS, binary: SubsonicHLSStreamTypes };
		/**
		 * MediaRetrieval: Streams a given media file.
		 */
		'stream.view'?: { params: SubsonicParameters.Stream, binary: SubsonicApiStreamTypes };
		/**
		 * MediaRetrieval: Downloads a given media file. Similar to stream, but this method returns the original media data without transcoding or downsampling.
		 */
		'download.view'?: { params: SubsonicParameters.Download, binary: SubsonicApiStreamTypes };
	};

}
