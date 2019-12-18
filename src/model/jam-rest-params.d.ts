// tslint:disable:max-file-line-count
import {Jam} from './jam-rest-data';

export declare namespace JamParameters {

	export type ListType = 'random' | 'highest' | 'avghighest' | 'frequent' | 'faved' | 'recent';
	export type ImageFormatType = 'png' | 'jpeg' | 'jpg' | 'tiff';
	export type WaveformFormatType = 'svg' | 'json' | 'dat';
	export type AudioFormatType = 'mp3' | 'flac' | 'ogg' | 'oga' | 'm4a' | 'mp4' | 'flv' | 'webma' | 'webm' | 'wav';
	export type DownloadFormatType = 'zip' | 'tar';
	export type LastFMLookupType = 'album' | 'album-toptracks' | 'artist' | 'track' | 'track-similar' | 'artist-toptracks';
	export type MusicBrainzLookupType = 'area' | 'artist' | 'collection' | 'event' | 'instrument' | 'label' | 'place' | 'recording' | 'release' | 'release-group' | 'series' | 'work' | 'url';
	export type MusicBrainzSearchType = 'area' | 'artist' | 'label' | 'recording' | 'release' | 'release-group' | 'work';
	export type CoverArtArchiveLookupType = 'release' | 'release-group';

	export type TrackSortField = 'artist' | 'album' | 'albumartist' | 'genre' | 'parent' | 'title' | 'year' | 'created';
	export type FolderSortField = 'artist' | 'album' | 'genre' | 'parent' | 'title' | 'year' | 'created' ;
	export type EpisodeSortField = 'podcast' | 'name' | 'date' | 'created';
	export type BookmarkSortField = 'created' | 'position';
	export type RadioSortField = 'name' | 'created';
	export type PlaylistSortField = 'name' | 'created' ;
	export type PodcastSortField = 'title' | 'created' ;
	export type AlbumSortField = 'name' | 'artist' | 'genre' | 'year' | 'created';
	export type SeriesSortField = 'name' | 'created';
	export type ArtistSortField = 'name' | 'created';
	export type UserSortField = 'name' | 'created';
	export type RootSortField = 'name' | 'created';

	// tslint:disable-next-line:interface-name
	export interface ID {
		/**
		 * the item id
		 */
		id: string;
	}

	// tslint:disable-next-line:interface-name
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

	export interface IncludesRadio {
		/**
		 * include user states (fav,rate) on radio(s)
		 *
		 * @default false
		 */
		radioState: boolean;
	}

	export interface IncludesTrack {
		/**
		 * include media information on track(s)
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
		 * include raw tag on track(s)
		 *
		 * @default false
		 */
		trackRawTag?: boolean;
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
		 * include information about children (trackCount/folderCount) on folder(s)
		 *
		 * @default false
		 */
		folderCounts?: boolean;
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
		 * include similar folders list on folder(s) - only for folders of type artist
		 *
		 * @default false
		 */
		folderSimilar?: boolean;
		/**
		 * include artwork images list on folder(s)
		 *
		 * @default false
		 */
		folderArtworks?: boolean;
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

	export interface PlayQueue extends IncludesPlayQueue {
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

	export interface IncludesEpisode extends IncludesTrack {
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
		playlistTrackIDs?: boolean;
		/**
		 * include user states (fav,rate) on playlist(s)
		 *
		 * @default false
		 */
		playlistState?: boolean;
	}

	export interface IncludesArtist extends IncludesAlbum, IncludesTrack {
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
		artistTrackIDs?: boolean;
		/**
		 * include series on artist(s)
		 *
		 * @default false
		 */
		artistSeries?: boolean;
		/**
		 * include series ids on artist(s)
		 *
		 * @default false
		 */
		artistSeriesIDs?: boolean;
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
		artistSimilar?: boolean;
	}

	export interface IncludesSeries extends IncludesAlbum, IncludesTrack {
		/**
		 * include albums on series
		 *
		 * @default false
		 */
		seriesAlbums?: boolean;
		/**
		 * include album ids on artist(s)
		 *
		 * @default false
		 */
		seriesAlbumIDs?: boolean;
		/**
		 * include user states (fav,rate) on artist(s)
		 *
		 * @default false
		 */
		seriesState?: boolean;
		/**
		 * include tracks on artist(s)
		 *
		 * @default false
		 */
		seriesTracks?: boolean;
		/**
		 * include track ids on artist(s)
		 *
		 * @default false
		 */
		seriesTrackIDs?: boolean;
		/**
		 * include extended meta data on artist(s)
		 *
		 * @default false
		 */
		seriesInfo?: boolean;
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
		 * search by id
		 */
		id?: string;
		/**
		 * search by ids
		 */
		ids?: Array<string>;
		/**
		 * search query
		 */
		query?: string;
		/**
		 * sort field name
		 */
		sortField?: string; // stronger typed by extending interfaces
		/**
		 * sort direction
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

	export interface BookmarkDelete extends ID {
		/**
		 * a bookmark id
		 */
		id: string;
	}

	export interface BookmarkTrackDelete {
		/**
		 * a track id
		 */
		trackID: string;
	}

	export interface BookmarkCreate {
		/**
		 * a track id
		 */
		trackID?: string;
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

	export interface BookmarkList extends IncludesBookmark, Paginate {
	}

	export interface BookmarkListByTrack extends Paginate {
		/**
		 * a track id
		 */
		trackID: string;
	}

	export interface Bookmark extends ID, IncludesBookmark {
	}

	export interface Bookmarks extends IDs, IncludesBookmark, Paginate {
	}

	export interface Image extends ID {
		/**
		 * format of the image
		 */
		format?: ImageFormatType;
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
		format?: ImageFormatType;
	}

	export interface Track extends ID, IncludesTrack {
	}

	export interface Tracks extends IDs, IncludesTrack {
	}

	export interface ArtistTracks extends IDs, IncludesTrack, Paginate {
	}

	export interface ArtistSeries extends IDs, IncludesSeries, Paginate {
	}

	export interface ArtistAlbums extends IDs, IncludesAlbum, Paginate {
	}

	export interface SeriesTracks extends IDs, IncludesTrack, Paginate {
	}

	export interface SeriesAlbums extends IDs, IncludesSeries, Paginate {
	}

	export interface AlbumTracks extends IDs, IncludesTrack, Paginate {
	}

	export interface PlaylistTracks extends IDs, IncludesTrack, Paginate {
	}

	export interface TrackFix extends ID {
		/**
		 * which issue to fix with the track
		 */
		fixID: string;
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
		 * filter by album artist id
		 */
		albumArtistID?: string;
		/**
		 * filter by parent folder id
		 */
		parentID?: string;
		/**
		 * filter by parent folder ids
		 */
		parentIDs?: Array<string>;
		/**
		 * filter if track is in folder id (or its subfolders)
		 */
		childOfID?: string;
		/**
		 * filter by root id
		 */
		rootID?: string;
		/**
		 * filter by root ids
		 */
		rootIDs?: Array<string>;
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
		 * sort the result by
		 */
		sortField?: TrackSortField;
	}

	export interface TrackList extends TrackSearchQuery, IncludesTrack, List {
	}

	export interface TrackSearch extends Paginate, TrackSearchQuery, IncludesTrack {
	}

	export interface Download extends ID {
		/**
		 * format of download stream
		 *
		 * @default zip
		 */
		format?: DownloadFormatType;
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
		 * @default mp3
		 */
		format?: AudioFormatType;
	}

	export interface PathStream extends ID {
		/**
		 * format of audio stream
		 *
		 * @default mp3
		 */
		format?: AudioFormatType;
	}

	export interface Waveform extends ID {
		/**
		 * format of waveform data
		 *
		 * @default svg
		 */
		format?: WaveformFormatType;
	}

	export interface WaveformSVG extends ID {
		/**
		 * width
		 *
		 * @minimum 1
		 * @maximum 6000
		 * @TJS-type integer
		 */
		width: number;
	}

	export interface SimilarTracks extends ID, IncludesTrack, Paginate {
	}

	export interface SimilarArtists extends ID, IncludesArtist, Paginate {
	}

	export interface SimilarFolders extends ID, IncludesFolder, IncludesFolderChildren, Paginate {
	}

	export interface Folder extends ID, IncludesFolder, IncludesFolderChildren {
	}

	export interface Folders extends IDs, IncludesFolder, IncludesFolderChildren {
	}

	export interface FolderSearchQuery extends SearchQuery {
		/**
		 * filter by root id
		 */
		rootID?: string;
		/**
		 * filter by root ids
		 */
		rootIDs?: Array<string>;
		/**
		 * filter by parent folder id
		 */
		parentID?: string;
		/**
		 * filter if folder is in folder id (or its subfolders)
		 */
		childOfID?: string;
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
		 * filter by level
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		level?: number;
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
		/**
		 * sort the result by
		 */
		sortField?: FolderSortField;
	}

	export interface FolderList extends FolderSearchQuery, IncludesFolder, List {
	}

	export interface FolderSubFolders extends ID, IncludesFolder, Paginate {
	}

	export interface FolderChildren extends ID, IncludesTrack, IncludesFolder {
	}

	export interface FolderTracks extends IDs, IncludesTrack, Paginate {
		/**
		 * include tracks of sub folders
		 *
		 * @default false
		 */
		recursive?: boolean;
	}

	/**
	 * Add an artwork to a folder by url
	 */
	export interface FolderArtworkNew extends ID {
		/**
		 * url of an image
		 */
		url: string;
		/**
		 * types of the image
		 */
		types: Array<Jam.ArtworkImageType>;
	}

	/**
	 * Add an artwork to a folder by upload
	 */
	export interface FolderArtworkUpload extends ID {
		/**
		 * id of folder
		 */
		id: string;
		/**
		 * types of the image
		 */
		types: Array<Jam.ArtworkImageType>;
	}

	/**
	 * Rename an artwork in a folder
	 */
	export interface FolderArtworkEditName extends ID {
		/**
		 * name of an image
		 */
		name: string;
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

	/**
	 * Create a subfolder
	 */
	export interface FolderCreate extends ID {
		/**
		 * the new subfolder name
		 */
		name: string;
	}

	/**
	 * Rename a track file
	 */
	export interface TrackEditName extends ID {
		/**
		 * the new track file name
		 */
		name: string;
	}

	/**
	 * Move track file(s) to new folder parent
	 */
	export interface TrackMoveParent extends IDs {
		/**
		 * the id of another folder
		 */
		folderID: string;
	}

	/**
	 * Check track file(s) for tag/media hints
	 */
	export interface TrackHealth extends TrackSearchQuery, IncludesTrack {
		/**
		 * check the file media for errors
		 */
		media?: boolean;
	}

	/**
	 * Move track folders(s) to new folder parent
	 */
	export interface FolderMoveParent extends IDs {
		/**
		 * the id of another folder
		 */
		folderID: string;
	}

	export interface FolderSearch extends Paginate, FolderSearchQuery, IncludesFolderChildren {
	}

	export interface FolderIndex extends FolderSearchQuery {
	}

	export interface FolderHealth extends FolderSearchQuery, IncludesFolder {
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
		name?: string;
		/**
		 * filter by status
		 */
		status?: string;
		/**
		 * sort the result by
		 */
		sortField?: EpisodeSortField;
	}

	export interface PodcastEpisodes extends ID, IncludesEpisode, Paginate {
	}

	export interface PodcastEpisodeList extends EpisodeSearchQuery, IncludesEpisode, List {
	}

	export interface EpisodeSearch extends Paginate, EpisodeSearchQuery, IncludesEpisode {
	}

	export interface BookmarkSearchQuery extends SearchQuery {
		/**
		 * filter by track id
		 */
		trackID?: string;
		/**
		 * filter by user id
		 */
		userID?: string;
		/**
		 * sort the result by
		 */
		sortField?: BookmarkSortField;
	}

	export interface BookmarkSearch extends Paginate, BookmarkSearchQuery, IncludesBookmark {
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
		/**
		 * sort the result by
		 */
		sortField?: PodcastSortField;
	}

	export interface PodcastList extends PodcastSearchQuery, IncludesPodcast, List {
	}

	export interface Radio extends ID, IncludesRadio {
	}

	export interface Radios extends IDs, IncludesRadio {
	}

	export interface RadioNew {
		/**
		 * radio name
		 */
		name: string;
		/**
		 * radio stream url
		 */
		url: string;
		/**
		 * radio homepage url
		 */
		homepage?: string;
	}

	export interface RadioUpdate extends ID {
		/**
		 * radio name
		 */
		name?: string;
		/**
		 * radio stream url
		 */
		url?: string;
		/**
		 * radio homepage url
		 */
		homepage?: string;
	}

	export interface RadioSearchQuery extends SearchQuery {
		/**
		 * filter by radio url
		 */
		url?: string;
		/**
		 * filter by radio homepage url
		 */
		homepage?: string;
		/**
		 * filter by radio name
		 */
		name?: string;
		/**
		 * sort the result by
		 */
		sortField?: RadioSortField;
	}

	export interface PodcastNew {
		/**
		 * podcast feed url
		 */
		url: string;
	}

	export interface PodcastSearch extends Paginate, PodcastSearchQuery, IncludesPodcast {
	}

	export interface RadioSearch extends Paginate, RadioSearchQuery, IncludesRadio {
	}

	export interface Album extends ID, IncludesAlbum {
	}

	export interface Albums extends IDs, IncludesAlbum {
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
		 * filter by root ids
		 */
		rootIDs?: Array<string>;
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
		 * filter by musicbrainz album id
		 */
		mbReleaseID?: string;
		/**
		 * filter by musicbrainz artist id
		 */
		mbArtistID?: string;
		/**
		 * filter by genre
		 */
		genre?: string;
		/**
		 * filter by album type
		 */
		albumType?: Jam.AlbumType;
		/**
		 * filter by album types
		 */
		albumTypes?: Array<Jam.AlbumType>;
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
		 * sort the result by
		 */
		sortField?: AlbumSortField;
	}

	export interface AlbumList extends List, IncludesAlbum, AlbumSearchQuery {
	}

	export interface AlbumSearch extends Paginate, AlbumSearchQuery, IncludesAlbum {
	}

	export interface AlbumIndex extends AlbumSearchQuery {
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
		/**
		 * sort the result by
		 */
		sortField?: PlaylistSortField;
	}

	export interface PlaylistSearch extends Paginate, PlaylistSearchQuery, IncludesPlaylist {
	}

	export interface PlaylistList extends List, IncludesPlaylist, PlaylistSearchQuery {
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
	}

	export interface Artists extends IDs, IncludesArtist {
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
		 * filter by root ids
		 */
		rootIDs?: Array<string>;
		/**
		 * filter by album id
		 */
		albumID?: string;
		/**
		 * filter by album type
		 */
		albumType?: Jam.AlbumType;
		/**
		 * filter by album types
		 */
		albumTypes?: Array<Jam.AlbumType>;
		/**
		 * filter by genre
		 */
		genre?: string;
		/**
		 * filter by musicbrainz album id
		 */
		mbArtistID?: string;
		/**
		 * filter by creation date (unix time)
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		newerThan?: number;
		/**
		 * sort the result by
		 */
		sortField?: ArtistSortField;
	}

	export interface ArtistList extends ArtistSearchQuery, IncludesArtist, List {
	}

	export interface ArtistSearch extends Paginate, ArtistSearchQuery, IncludesArtist {
	}

	export interface ArtistIndex extends ArtistSearchQuery {
	}

	export interface Series extends ID, IncludesSeries {
		/**
		 * filter by root id
		 */
		rootID?: string;
	}

	export interface Serieses extends IDs, IncludesSeries {
	}

	export interface SeriesList extends SeriesSearchQuery, IncludesSeries, List {
	}

	export interface SeriesIndex extends SeriesSearchQuery {
	}

	export interface SeriesSearch extends Paginate, SeriesSearchQuery, IncludesSeries {
	}

	export interface SeriesSearchQuery extends SearchQuery {
		/**
		 * filter by name
		 */
		name?: string;
		/**
		 * filter by root id
		 */
		rootID?: string;
		/**
		 * filter by root ids
		 */
		rootIDs?: Array<string>;
		/**
		 * filter by album id
		 */
		albumID?: string;
		/**
		 * filter by album type
		 */
		albumType?: Jam.AlbumType;
		/**
		 * filter by album types
		 */
		albumTypes?: Array<Jam.AlbumType>;
		/**
		 * filter by creation date (unix time)
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		newerThan?: number;
		/**
		 * sort the result by
		 */
		sortField?: SeriesSortField;
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
		/**
		 * the scan strategy for the root
		 */
		strategy: Jam.RootScanStrategy;
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
		/**
		 * the scan strategy for the root
		 */
		strategy: Jam.RootScanStrategy;
	}

	export interface RootRefreshAll {
		/**
		 * the scan strategy for the root
		 */
		refreshMeta?: boolean;
	}

	export interface RootRefresh extends ID, RootRefreshAll {
	}

	export interface UserNew {
		/**
		 * current password of calling user (or admin) is required to create the user. this is NOT the user password
		 */
		password: string;
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

	export interface UserPasswordUpdate extends ID {
		/**
		 * current password of calling user (or admin) is required to change the password
		 */
		password: string;
		/**
		 * new password of user
		 */
		newPassword: string;
	}

	export interface UserEmailUpdate extends ID {
		/**
		 * password of calling user (or admin) is required to change the email address
		 */
		password: string;
		/**
		 * new email address of user
		 */
		email: string;
	}

	export interface UserImageRandom {
		/**
		 * id of user (only admins can change images of other users)
		 */
		id?: string;
		/**
		 * seed for the randomizer
		 */
		seed?: string;
	}

	export interface UserUpdate extends ID {
		/**
		 * password of calling user (or admin) is required to change user settings
		 */
		password: string;
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
		/**
		 * sort the result by
		 */
		sortField?: UserSortField;
	}

	export interface RootSearchQuery extends SearchQuery {
		/**
		 * sort the result by
		 */
		sortField?: RootSortField;
	}

	export interface RootSearch extends Paginate, RootSearchQuery {

	}

	export interface UserSearch extends Paginate, UserSearchQuery {
	}

	export interface Genres extends Paginate {
		/**
		 * filter by root id
		 */
		rootID?: string;
	}

	export interface NowPlaying extends Paginate {
	}

	export interface Stats {
		/**
		 * filter by root id
		 */
		rootID?: string;
	}

	export interface MusicBrainzSearch {
		/**
		 * search by musicbrainz type
		 */
		type: MusicBrainzSearchType;
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
		 * @minimum 0
		 * @TJS-type integer
		 */
		tracks?: number;
	}

	export interface AcousticBrainzLookup extends ID {
		/**
		 * page parameter if more than one acousticbrainz info is available
		 *
		 * @minimum 0
		 * @TJS-type integer
		 */
		nr?: number;
	}

	export interface CoverArtArchiveLookup extends ID {
		/**
		 * lookup by musicbrainz type
		 */
		type: CoverArtArchiveLookupType;
	}

	export interface LyricsOVHSearch {
		/**
		 * lookup by song title
		 */
		title: string;
		/**
		 * lookup by song artist
		 */
		artist: string;
	}

	export interface WikipediaSummary {
		/**
		 * lookup by page title
		 */
		title: string;
		/**
		 * wikipedia language
		 * @default en
		 */
		lang?: string;
	}

	export interface WikidataSummary {
		/**
		 * lookup by wikidata id
		 */
		id: string;
		/**
		 * get summary of wikipedia language
		 * @default en
		 */
		lang?: string;
	}

	export interface WikidataLookup {
		/**
		 * lookup by wikidata id
		 */
		id: string;
	}

	export interface MusicBrainzLookup extends ID {
		/**
		 * lookup by musicbrainz type
		 */
		type: MusicBrainzLookupType;
		/**
		 * comma-separated musicbrainz includes
		 */
		inc?: string;  // TODO: typescript-type the musicbrainz lookup includes
	}

	export interface LastFMLookup extends ID {
		/**
		 * lookup by lastfm type
		 */
		type: LastFMLookupType;
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
		/**
		 * request a jwt token, if the client is an app or browser from another domain
		 */
		jwt?: boolean;
	}

	export interface RawTagUpdate {
		/**
		 * the id of the track
		 */
		id: string;
		/**
		 * the raw tag to store in the track (e.g. id3v2/vorbis)
		 */
		tag: Jam.RawTag;
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

	export interface SubsonicToken extends ID {
		/**
		 * view subsonic token of user with id
		 */
		id: string;
		/**
		 * current password of calling user (or admin) is view the subsonic token
		 */
		password: string;
	}

}
