import {Jam} from './jam-rest-data-0.1.0';

export declare namespace JamParameters {

	export type ListType = 'random' | 'highest' | 'avghighest' | 'frequent' | 'faved' | 'recent';

	export interface ID {
		/**
		 * the item id
		 */
		id: string;
	}

	export interface IDs {
		/**
		 * array of item ids
		 */
		ids: Array<string>;
	}

	export interface Paginate {
		/**
		 * get back items from position
		 *
		 * @default 0
		 * @minimum 0
		 * @TJS-type integer
		 */
		offset?: number;
		/**
		 * get back number of items
		 *
		 * @minimum 1
		 * @TJS-type integer
		 */
		amount?: number;
	}

	export interface Index {
		/**
		 * filter by root id
		 */
		rootID?: string;
	}

	export interface IncludesTrack {
		/**
		 * include media informations on track(s)
		 *
		 * @default false
		 */
		trackMedia?: boolean;
		/**
		 * include tag on track(s)
		 *
		 * @default false
		 */
		trackTag?: boolean;
		/**
		 * include id3 tag on track(s)
		 *
		 * @default false
		 */
		trackID3?: boolean;
		/**
		 * include user states (fav,rate) on track(s)
		 *
		 * @default false
		 */
		trackState?: boolean;
	}

	export interface IncludesFolder {
		/**
		 * include tag on folder(s)
		 *
		 * @default false
		 */
		folderTag?: boolean;
		/**
		 * include user states (fav,rate) on folder(s)
		 *
		 * @default false
		 */
		folderState?: boolean;
		/**
		 * include information about the meta data quality on folder(s)
		 *
		 * @default false
		 */
		folderHealth?: boolean;
		/**
		 * include a list of all parent folder ids on folder(s)
		 *
		 * @default false
		 */
		folderParents?: boolean;
		/**
		 * include extended meta data on folder(s)
		 *
		 * @default false
		 */
		folderInfo?: boolean;
		/**
		 * include similar folders list  on folder(s)
		 *
		 * @default false
		 */
		folderInfoSimilar?: boolean;
	}

	export interface IncludesBookmark extends IncludesTrack {
		/**
		 * include the track of the bookmark
		 *
		 * @default false
		 */
		bookmarkTrack?: boolean;
	}

	export interface IncludesAlbum extends IncludesTrack {
		/**
		 * include tracks on album(s)
		 *
		 * @default false
		 */
		albumTracks?: boolean;
		/**
		 * include track ids on album(s)
		 *
		 * @default false
		 */
		albumTrackIDs?: boolean;
		/**
		 * include user states (fav,rate) on album(s)
		 *
		 * @default false
		 */
		albumState?: boolean;
		/**
		 * include extended meta data on album(s)
		 *
		 * @default false
		 */
		albumInfo?: boolean;
	}

	export interface IncludesPlayQueue extends IncludesTrack {
		/**
		 * include tracks on playqueue
		 *
		 * @default false
		 */
		playQueueTracks?: boolean;
		/**
		 * include track ids on playqueue
		 *
		 * @default false
		 */
		playQueueTrackIDs?: boolean;
	}

	export interface PlayQueueSet {
		/**
		 * the track ids of the playqueue
		 */
		trackIDs: Array<string>;
		/**
		 * the track id of the current playing track
		 */
		currentID?: string;
		/**
		 * the position in the current playing track
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		position?: number;
	}

	export interface IncludesPodcast extends IncludesEpisode {
		/**
		 * include user states (fav,rate) on podcast(s)
		 *
		 * @default false
		 */
		podcastState?: boolean;
		/**
		 * include episodes on podcast(s)
		 *
		 * @default false
		 */
		podcastEpisodes?: boolean;
	}

	export interface IncludesEpisode extends IncludesTrack {
	}

	export interface IncludesPlaylist extends IncludesTrack {
		/**
		 * include tracks on playlist(s)
		 *
		 * @default false
		 */
		playlistTracks?: boolean;
		/**
		 * include track ids on playlist(s)
		 *
		 * @default false
		 */
		playlistTracksIDs?: boolean;
		/**
		 * include user states (fav,rate) on playlist(s)
		 *
		 * @default false
		 */
		playlistState?: boolean;
	}

	export interface IncludesArtist extends IncludesAlbum {
		/**
		 * include albums on artist(s)
		 *
		 * @default false
		 */
		artistAlbums?: boolean;
		/**
		 * include album ids on artist(s)
		 *
		 * @default false
		 */
		artistAlbumIDs?: boolean;
		/**
		 * include user states (fav,rate) on artist(s)
		 *
		 * @default false
		 */
		artistState?: boolean;
		/**
		 * include tracks on artist(s)
		 *
		 * @default false
		 */
		artistTracks?: boolean;
		/**
		 * include track ids on artist(s)
		 *
		 * @default false
		 */
		artistTracksIDs?: boolean;
		/**
		 * include extended meta data on artist(s)
		 *
		 * @default false
		 */
		artistInfo?: boolean;
		/**
		 * include similar artists on artist(s)
		 *
		 * @default false
		 */
		artistInfoSimilar?: boolean;
	}

	export interface IncludesFolderChildren extends IncludesTrack, IncludesFolder {
		/**
		 * include tracks and sub folders on folder(s)
		 *
		 * @default false
		 */
		folderChildren?: boolean;
		/**
		 * include sub folders on folder(s)
		 *
		 * @default false
		 */
		folderSubfolders?: boolean;
		/**
		 * include tracks on folder(s)
		 *
		 * @default false
		 */
		folderTracks?: boolean;
	}

	export interface SearchQuery {
		/**
		 * search query
		 */
		query?: string;
		/**
		 * the obj property name to sort on (e.g. 'artist', 'creation')
		 */
		sortField?: string; // TODO: typescript-type the sort fields for the different items
		/**
		 * the sort direction
		 *
		 * @default false
		 */
		sortDescending?: boolean;
	}

	export interface List extends Paginate {
		/**
		 * the type of the item list
		 */
		list: ListType;
	}

	export interface BookmarkCreate extends ID {
		/**
		 * a comment
		 */
		comment?: string;
		/**
		 * the position of the bookmark (in ms)
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		position: number;
	}

	export interface BookmarkList extends IncludesBookmark {
	}

	export interface ArtistInfo extends ID {
		/**
		 * include similar artists
		 *
		 * @default false
		 */
		similar: boolean;
	}

	export interface AlbumInfo extends ID {
	}

	export interface Image extends ID {
		/**
		 * format of the image
		 */
		format?: string;
		/**
		 * size of the image
		 *
		 * @minimum 16
		 * @maximum 1024
		 * @TJS-type integer
		 */
		size?: number;
	}

	export interface PathImageSize extends ID {
		/**
		 * size of the image
		 *
		 * @minimum 16
		 * @maximum 1024
		 * @TJS-type integer
		 */
		size?: number;
	}

	export interface PathImageFormat extends ID {
		/**
		 * format of the image
		 */
		format?: string;
	}

	export interface Track extends ID, IncludesTrack {
	}

	export interface Tracks extends IDs, IncludesTrack {
	}

	export interface TrackList extends TrackSearchQuery, IncludesTrack, List {
	}

	export interface TrackSearchQuery extends SearchQuery {
		/**
		 * filter by artist name
		 */
		artist?: string;
		/**
		 * filter by artist id
		 */
		artistID?: string;
		/**
		 * filter by parent folder id
		 */
		parentID?: string;
		/**
		 * filter by root id
		 */
		rootID?: string;
		/**
		 * filter by title
		 */
		title?: string;
		/**
		 * filter by album
		 */
		album?: string;
		/**
		 * filter by genre
		 */
		genre?: string;
		/**
		 * filter by creation date
		 *
		 * @TJS-type integer
		 */
		newerThan?: number;
		/**
		 * filter by year
		 *
		 * @TJS-type integer
		 */
		fromYear?: number;
		/**
		 * filter by year
		 *
		 * @TJS-type integer
		 */
		toYear?: number;
	}

	export interface TrackSearch extends Paginate, TrackSearchQuery, IncludesTrack {
	}

	export interface Download extends ID {
		/**
		 * format of download stream
		 *
		 * @default 'zip'
		 */
		format?: string;
	}

	export interface Stream extends ID {
		/**
		 * maximal bitrate if transcoding (in Kbps)
		 *
		 * @minimum 10
		 * @TJS-type integer
		 */
		maxBitRate?: number;
		/**
		 * format of audio stream
		 *
		 * @default 'mp3'
		 */
		format?: string;
	}

	export interface PathStream extends ID {
		/**
		 * format of audio stream
		 *
		 * @default 'mp3'
		 */
		format?: string;
	}

	export interface SimilarTracks extends ID, IncludesTrack, Paginate {
	}

	export interface Folder extends ID, IncludesFolder, IncludesFolderChildren {
	}

	export interface Folders extends IDs, IncludesFolder, IncludesFolderChildren {
	}

	export interface FolderList extends FolderSearchQuery, IncludesFolder, List {
	}

	export interface FolderSubFolders extends ID, IncludesFolder {
	}

	export interface FolderChildren extends ID, IncludesTrack, IncludesFolder {
	}

	export interface FolderTracks extends Tracks {
		/**
		 * include tracks of a sub folders
		 *
		 * @default false
		 */
		recursive?: boolean;
	}

	/**
	 * Set the image of a folder by url
	 */
	export interface FolderEditImg extends ID {
		/**
		 * url of an image
		 */
		url: string;
	}

	/**
	 * Rename the folder
	 */
	export interface FolderEditName extends ID {
		/**
		 * the new folder name
		 */
		name: string;
	}

	export interface FolderSearchQuery extends SearchQuery {
		/**
		 * filter by root id
		 */
		rootID?: string;
		/**
		 * filter by parent folder id
		 */
		parentID?: string;
		/**
		 * filter by artist name
		 */
		artist?: string;
		/**
		 * filter by title
		 */
		title?: string;
		/**
		 * filter by album name
		 */
		album?: string;
		/**
		 * filter by genre
		 */
		genre?: string;
		/**
		 * filter by creation date (unix time)
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		newerThan?: number;
		/**
		 * filter by year
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		fromYear?: number;
		/**
		 * filter by year
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		toYear?: number;
		/**
		 * filter by folder type
		 */
		type?: Jam.FolderType;
		/**
		 * filter by folder types
		 */
		types?: Array<Jam.FolderType>;
	}

	export interface FolderSearch extends Paginate, FolderSearchQuery, IncludesFolderChildren {
	}

	export interface Episode extends ID, IncludesEpisode {
	}

	export interface Episodes extends IDs, IncludesEpisode {
	}

	export interface EpisodeSearchQuery extends SearchQuery {
		/**
		 * filter by podcast id
		 */
		podcastID?: string;
		/**
		 * filter by title
		 */
		title?: string;
		/**
		 * filter by status
		 */
		status?: string;
	}

	export interface EpisodeSearch extends Paginate, EpisodeSearchQuery, IncludesEpisode {
	}

	export interface Podcast extends ID, IncludesPodcast {
	}

	export interface Podcasts extends IDs, IncludesPodcast {
	}

	export interface PodcastSearchQuery extends SearchQuery {
		/**
		 * filter by podcast url
		 */
		url?: string;
		/**
		 * filter by podcast title
		 */
		title?: string;
		/**
		 * filter by podcast status
		 */
		status?: string;
	}

	export interface PodcastNew {
		/**
		 * podcast feed url
		 */
		url: string;
	}

	export interface PodcastSearch extends Paginate, PodcastSearchQuery, IncludesPodcast {
	}

	export interface Album extends ID, IncludesAlbum {
	}

	export interface Albums extends IDs, IncludesAlbum {
	}

	export interface AlbumList extends Paginate, IncludesAlbum, AlbumSearchQuery, List {
	}

	export interface AlbumSearchQuery extends SearchQuery {
		/**
		 * filter by name
		 */
		name?: string;
		/**
		 * filter by root id
		 */
		rootID?: string;
		/**
		 * filter by artist name
		 */
		artist?: string;
		/**
		 * filter by artist id
		 */
		artistID?: string;
		/**
		 * filter by track id
		 */
		trackID?: string;
		/**
		 * filter by album id
		 */
		mbAlbumID?: string;
		/**
		 * filter by artist id
		 */
		mbArtistID?: string;
		/**
		 * filter by genre
		 */
		genre?: string;
		/**
		 * filter by creation date (unix time)
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		newerThan?: number;
		/**
		 * filter by year
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		fromYear?: number;
		/**
		 * filter by year
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		toYear?: number;
	}

	export interface AlbumSearch extends Paginate, AlbumSearchQuery, IncludesAlbum {
	}

	export interface Playlist extends ID, IncludesPlaylist {

	}

	export interface Playlists extends IDs, IncludesPlaylist {

	}

	export interface PlaylistSearchQuery extends SearchQuery {
		/**
		 * filter by playlist name
		 */
		name?: string;
		/**
		 * filter by public state
		 */
		isPublic?: boolean;
	}

	export interface PlaylistSearch extends Paginate, PlaylistSearchQuery, IncludesPlaylist {
	}

	export interface PlaylistNew {
		/**
		 * name of playlist
		 */
		name: string;
		/**
		 * a comment
		 */
		comment?: string;
		/**
		 * set the playlist visible for other users or not
		 */
		isPublic?: boolean;
		/**
		 * track ids of the playlist, may include duplicates
		 */
		trackIDs?: Array<string>;
	}

	export interface PlaylistUpdate extends ID {
		/**
		 * name of playlist
		 */
		name?: string;
		/**
		 * a comment
		 */
		comment?: string;
		/**
		 * set the playlist visible for other users or not
		 */
		isPublic?: boolean;
		/**
		 * track ids of the playlist, may include duplicates
		 */
		trackIDs?: Array<string>;
	}

	export interface Artist extends ID, IncludesArtist {
		/**
		 * filter by root id
		 */
		rootID?: string;
	}

	export interface Artists extends IDs, IncludesArtist {
	}

	export interface ArtistList extends ArtistSearchQuery, IncludesArtist, List {
	}

	export interface ArtistSearchQuery extends SearchQuery {
		/**
		 * filter by name
		 */
		name?: string;
		/**
		 * filter by root id
		 */
		rootID?: string;
		/**
		 * filter by album id
		 */
		albumID?: string;
		/**
		 * filter by musicbrainz album id
		 */
		mbArtistID?: string;
		/**
		 * filter by genre
		 */
		genre?: string;
		/**
		 * filter by creation date (unix time)
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		newerThan?: number;
		/**
		 * filter by year
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		fromYear?: number;
		/**
		 * filter by year
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		toYear?: number;
	}

	export interface ArtistSearch extends Paginate, ArtistSearchQuery, IncludesArtist {
	}

	export interface RootNew {
		/**
		 * name of the root
		 */
		name: string;
		/**
		 * absolute path of the root
		 */
		path: string;
	}

	export interface RootUpdate extends ID {
		/**
		 * name of the root
		 */
		name: string;
		/**
		 * absolute path of the root
		 */
		path: string;
	}

	export interface UserNew {
		/**
		 * name of the user
		 */
		name: string;
		/**
		 * email of the user
		 */
		email?: string;
		/**
		 * user has admin rights
		 * @default false
		 * @TJS-type boolean
		 */
		roleAdmin?: boolean;
		/**
		 * user has podcast admin rights
		 * @default false
		 * @TJS-type boolean
		 */
		rolePodcast?: boolean;
		/**
		 * user has streaming/download rights
		 * @default true
		 * @TJS-type boolean
		 */
		roleStream?: boolean;
		/**
		 * user has upload rights
		 * @default false
		 * @TJS-type boolean
		 */
		roleUpload?: boolean;
	}

	export interface UserUpdate extends ID {
		/**
		 * name of the user
		 */
		name?: string;
		/**
		 * email of the user
		 */
		email?: string;
		/**
		 * user has admin rights
		 * @TJS-type boolean
		 */
		roleAdmin?: boolean;
		/**
		 * user has podcast admin rights
		 * @TJS-type boolean
		 */
		rolePodcast?: boolean;
		/**
		 * user has streaming/download rights
		 * @TJS-type boolean
		 */
		roleStream?: boolean;
		/**
		 * user has upload rights
		 * @TJS-type boolean
		 */
		roleUpload?: boolean;
	}

	export interface UserSearchQuery extends SearchQuery {
		/**
		 * filter by user name
		 */
		name?: string;
		/**
		 * filter by user admin role
		 */
		isAdmin?: boolean;
	}

	export interface RootSearch extends Paginate, SearchQuery {
	}

	export interface UserSearch extends Paginate, UserSearchQuery {
	}

	export interface Genres {
		/**
		 * filter by root id
		 */
		rootID?: string;
	}

	export interface BrainzSearch {
		/**
		 * search by musicbrainz type
		 */
		type: string;  // TODO: typescript-type the musicbrainz search type
		/**
		 * search by recording name
		 */
		recording?: string;
		/**
		 * search by releasegroup name
		 */
		releasegroup?: string;
		/**
		 * search by release name
		 */
		release?: string;
		/**
		 * search by artist name
		 */
		artist?: string;
		/**
		 * search by number of release tracks
		 *
		 * @TJS-type integer
		 */
		tracks?: number;
	}

	export interface BrainzLookup extends ID {
		/**
		 * lookup by musicbrainz type
		 */
		type: string;  // TODO: typescript-type the musicbrainz lookup type
		/**
		 * comma-separated musicbrainz includes
		 */
		inc?: string;  // TODO: typescript-type the musicbrainz lookup includes
	}

	export interface LastFMLookup extends ID {
		/**
		 * lookup by lastfm type
		 */
		type: string; // TODO: typescript-type the lastfm lookup includes
	}

	export interface AcoustidLookup extends ID {
		/**
		 * comma-separated acoustid includes
		 */
		inc?: string;  // TODO: typescript-type the acoustid lookup includes
	}

	/**
	 * Change the fav user state
	 */
	export interface Fav extends ID {
		/**
		 * add or remove the item fav
		 *
		 * @default false
		 * @TJS-type boolean
		 */
		remove?: boolean;
	}

	/**
	 * Change the rating user state
	 */
	export interface Rate extends ID {
		/**
		 * the rating for the item
		 *
		 * @minimum 0
		 * @maximum 5
		 * @TJS-type integer
		 */
		rating: number;
	}

	export interface Chat {
		/**
		 * filter by post time (unix time)
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		since?: number;
	}

	export interface ChatNew {
		/**
		 * the chat message
		 */
		message: string;
	}

	export interface ChatDelete {
		/**
		 * time of the post (unix time)
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		time: number;
	}

	export interface Login {
		/**
		 * user name
		 */
		username: string;
		/**
		 * password
		 */
		password: string;
		/**
		 * client name
		 */
		client: string;
	}

	export interface TagID3Update {
		/**
		 * the id of the track
		 */
		id: string;
		/**
		 * the id3 tag to store in the track
		 */
		tag: Jam.ID3Tag;
	}

	export interface TagID3sUpdate {
		/**
		 * array of id3 tag updates
		 */
		tagID3s: Array<TagID3Update>;
	}

	export interface AutoComplete {
		/**
		 * query to complete
		 */
		query: string;
		/**
		 * amount of track names to complete
		 *
		 * @default 0
		 * @minimum 0
		 * @TJS-type integer
		 */
		track?: number;
		/**
		 * amount of artist names to complete
		 *
		 * @default 0
		 * @minimum 0
		 * @TJS-type integer
		 */
		artist?: number;
		/**
		 * amount of album names to complete
		 *
		 * @default 0
		 * @minimum 0
		 * @TJS-type integer
		 */
		album?: number;
		/**
		 * amount of folder names to complete
		 *
		 * @default 0
		 * @minimum 0
		 * @TJS-type integer
		 */
		folder?: number;
		/**
		 * amount of playlist names to complete
		 *
		 * @default 0
		 * @minimum 0
		 * @TJS-type integer
		 */
		playlist?: number;
		/**
		 * amount of podcast names to complete
		 *
		 * @default 0
		 * @minimum 0
		 * @TJS-type integer
		 */
		podcast?: number;
		/**
		 * amount of episode names to complete
		 *
		 * @default 0
		 * @minimum 0
		 * @TJS-type integer
		 */
		episode?: number;
	}

}

