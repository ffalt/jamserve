import {AlbumType, DatabaseQuerySortType, DBObjectType, FolderType} from '../types';
import {MusicBrainz} from './musicbrainz-rest-data-2.0';
import {Subsonic} from './subsonic-rest-data-1.16.0';

export namespace JamServe {

	/* db */

	export interface DBObject {
		id: string;
		type: DBObjectType;
	}

	export interface Database {
		open(): Promise<void>;

		close(): Promise<void>;

		check(): Promise<void>;

		reset(): Promise<void>;

		getDBIndex<T extends DBObject>(type?: DBObjectType): DatabaseIndex<T>;
	}

	export interface DatabaseIndex<T extends DBObject> {
		type: DBObjectType;

		add(body: T): Promise<string>;

		replace(id: string, body: T): Promise<void>;

		remove(id: string | Array<string>): Promise<void>;

		removeByQuery(query: DatabaseQuery): Promise<number>;

		upsert(id: string, body: T): Promise<void>;

		byId(id: string): Promise<T | undefined>;

		byIds(ids: Array<string>): Promise<Array<T>>;

		query(query: DatabaseQuery): Promise<Array<T>>;

		queryOne(query: DatabaseQuery): Promise<T | undefined>;

		queryIds(query: DatabaseQuery): Promise<Array<string>>;

		iterate(query: DatabaseQuery, onItems: (items: Array<T>) => Promise<void>): Promise<void>;

		count(query: DatabaseQuery): Promise<number>;

		aggregate(query: DatabaseQuery, field: string): Promise<number>;

		distinct(fieldname: string): Promise<Array<string>>;

	}

	export interface DatabaseQuery {
		all?: boolean;
		term?: {
			[name: string]: string | number | boolean;
		};
		match?: {
			[name: string]: string;
		};
		terms?: {
			[name: string]: Array<string | number | boolean>;
		};
		startsWith?: {
			[name: string]: string;
		};
		startsWiths?: {
			[name: string]: Array<string>;
		};
		range?: {
			[name: string]: { lte?: number; gte?: number; };
		};
		notNull?: Array<string>;
		sort?: DatabaseQuerySort;
		amount?: number;
		offset?: number;
	}

	export interface DatabaseQuerySort {
		[name: string]: DatabaseQuerySortType;
	}

	/* user */

	export interface User extends DBObject {
		name: string;
		pass: string;
		email: string;
		created: number;
		ldapAuthenticated: boolean;
		scrobblingEnabled: boolean;
		avatarLastChanged?: number;
		avatar?: string;
		maxBitRate?: number;
		allowedfolder?: Array<string>;
		roles: UserRoles;
	}

	export interface UserRoles {
		// coverArtRole: boolean;
		streamRole: boolean;
		uploadRole: boolean;
		adminRole: boolean;
		podcastRole: boolean;
		// settingsRole: boolean;
		// downloadRole: boolean;
		// playlistRole: boolean;
		// commentRole: boolean;
		// jukeboxRole: boolean;
		// shareRole: boolean;
		// videoConversionRole: boolean;
	}

	/* root */

	export interface Root extends DBObject {
		name: string;
		path: string;
		created: number;
	}

	export interface RootStatus {
		lastScan: number;
		scanning?: boolean;
		error?: string;
	}

	/* meta */

	export interface MetaInfo {
		album: MetaInfoAlbum;
		artist: MetaInfoArtist;
		topSongs: Array<MetaInfoTopSong>;
	}

	export interface MetaInfoSimilarArtist {
		name?: string;
		url?: string;
		mbid?: string;
		image?: MetaInfoImage;
	}

	export interface MetaInfoImage {
		small?: string;
		medium?: string;
		large?: string;
	}

	export interface MetaInfoArtist {
		name?: string;
		mbid?: string;
		url?: string;
		image?: MetaInfoImage;
		tags?: Array<{ name: string; url: string; }>;
		description?: string;
		similar?: Array<MetaInfoSimilarArtist>;
	}

	export interface MetaInfoTopSong {
		name: string;
		artist: { name: string; mbid: string; url: string; };
		mbid?: string;
		url?: string;
		rank?: string;
		image?: MetaInfoImage;
	}

	export interface MetaInfoAlbum {
		name?: string;
		artist?: string;
		mbid?: string;
		url?: string;
		image?: {
			small?: string;
			medium?: string;
			large?: string;
		};
		tags?: Array<{
			name: string;
			url: string;
		}>;
		description?: string;
		releases?: Array<MusicBrainz.Release>;
	}

	export interface MetaInfoTrack {
		similar: Array<MetaInfoTrackSimilarSong>;
	}

	export interface MetaInfoTrackSimilarSong {
		name: string;
		mbid?: string;
		url?: string;
		duration?: number;
		artist: { name: string; mbid: string; url: string; };
		image?: MetaInfoImage;
	}

	export interface MetaInfoFolderSimilarArtist {
		name: string;
		folder?: Folder;
	}

	export interface MetaInfoArtistSimilarArtist {
		name: string;
		artist?: Artist;
	}


	/* track */

	export interface Track extends DBObject {
		rootID: string;
		parentID: string;
		name: string;
		path: string;
		stat: {
			created: number;
			modified: number;
			size: number;
		};
		albumID: string;
		artistID: string;
		tag: TrackTag;
		media: TrackMedia;
		info?: MetaInfoTrack;
	}

	export interface TrackTag {
		album?: string;
		albumSort?: string;
		albumArtist?: string;
		albumArtistSort?: string;
		artist?: string;
		artistSort?: string;
		genre?: string;
		disc?: number;
		title?: string;
		titleSort?: string;
		track?: number;
		year?: number;
		mbTrackID?: string;
		mbAlbumType?: string;
		mbAlbumArtistID?: string;
		mbArtistID?: string;
		mbAlbumID?: string;
		mbReleaseTrackID?: string;
		mbReleaseGroupID?: string;
		mbRecordingID?: string;
		mbAlbumStatus?: string;
		mbReleaseCountry?: string;
	}

	export interface TrackMedia {
		duration?: number;
		bitRate?: number;
		format?: string;
		sampleRate?: number;
		channels?: number;
		encoded?: string; // VBR || CBR || ''
		mode?: string; // 'joint', 'dual', 'single'
		version?: string;
	}

	/* artist */

	export interface Artist extends DBObject {
		name: string;
		nameSort?: string;
		rootIDs: Array<string>;
		trackIDs: Array<string>;
		albumIDs: Array<string>;
		mbArtistID?: string;
		info?: MetaInfo;
		created: number;
	}

	/* album */

	export interface Album extends DBObject {
		name: string;
		rootIDs: Array<string>;
		trackIDs: Array<string>;
		artistID: string;
		artist?: string;
		genre?: string;
		year?: number;
		duration: number;
		created: number;
		mbArtistID?: string;
		mbAlbumID?: string;
		info?: MetaInfo;
	}

	/* folder */

	export interface Folder extends DBObject {
		rootID: string;
		path: string;
		parentID?: string;
		stat: {
			created: number;
			modified: number;
		};
		tag: FolderTag;
		info?: MetaInfo;
	}

	export interface FolderTag {
		tracks: number;
		level: number;
		type: FolderType;
		genre?: string;
		album?: string;
		artist?: string;
		artistSort?: string;
		albumType?: AlbumType;
		title?: string;
		image?: string;
		year?: number;
		mbAlbumID?: string;
		mbArtistID?: string;
	}

	/* radio */

	export interface Radio extends DBObject {
		name: string;
		url: string;
		homepage?: string;
		disabled?: boolean;
	}

	/* state */

	export interface State extends DBObject {
		userID: string;
		destID: string;
		destType: DBObjectType;
		played: number;
		lastplayed: number;
		faved?: number;
		rated?: number;
	}

	export interface States {
		[id: string]: State;
	}

	/* playlist */

	export interface Playlist extends DBObject {
		name: string;
		userID: string;
		comment?: string;
		coverArt?: string;
		changed: number;
		created: number;
		allowedUser?: Array<string>;
		isPublic: boolean;
		duration: number;
		trackIDs: Array<string>;
	}

	/* podcast */

	export interface Podcast extends DBObject {
		url: string;
		created: number;
		lastCheck: number;
		status: Subsonic.PodcastStatus;
		errorMessage?: string;
		tag?: PodcastTag;
	}

	export interface PodcastTag {
		title: string;
		status: Subsonic.PodcastStatus;
		link: string;
		author: string;
		description: string;
		generator: string;
		image: string;
		categories: Array<string>;
	}

	/* queue */

	export interface PlayQueue extends DBObject {
		userID: string;
		trackIDs: Array<string>; // id of tracks
		currentID?: string; // id of current tracks
		position?: number; // position in track
		changed: number; // Datetime of change
		changedBy: string; //  Name of client app
	}

	/* podcast episode */

	export interface Episode extends DBObject {
		podcastID: string;
		status: Subsonic.PodcastStatus;
		error?: string;
		path?: string;
		link?: string;
		summary: string;
		date: number;
		title: string;
		guid?: string;
		author?: string;
		chapters?: Array<PodcastEpisodeChapter>;
		enclosures: Array<PodcastEpisodeEnclosure>;
		stat?: {
			created: number;
			modified: number;
			size: number;
		};
		tag?: TrackTag;
		media?: TrackMedia;
	}

	export interface PodcastEpisodeChapter {
		start: number;
		title: string;
	}

	export interface PodcastEpisodeEnclosure {
		url: string;
		type: string;
		length: number;
	}

	/* bookmark */

	export interface Bookmark extends DBObject {
		destID: string;
		userID: string;
		comment?: string;
		created: number;
		changed: number;
		position: number;
	}

	/* now playing */

	export interface NowPlaying {
		time: number;
		obj: DBObject;
		user: User;
	}

	/* search */

	export interface SearchQuery {
		query?: string;
		offset?: number;
		amount?: number;
		sorts?: Array<SearchQuerySort>;
	}

	export interface SearchQuerySort {
		field: string;
		descending: boolean;
	}

	export interface SearchQueryTrack extends SearchQuery {
		path?: string;
		inPath?: string;
		inPaths?: Array<string>;
		artist?: string;
		artistID?: string;
		parentID?: string;
		parentIDs?: Array<string>;
		mbTrackID?: string;
		ids?: Array<string>;
		mbTrackIDs?: Array<string>;
		rootID?: string;
		title?: string;
		album?: string;
		genre?: string;
		newerThan?: number;
		fromYear?: number;
		toYear?: number;
	}

	export interface SearchQueryFolder extends SearchQuery {
		ids?: Array<string>;
		rootID?: string;
		parentID?: string;
		path?: string;
		inPath?: string;
		artist?: string;
		artists?: Array<string>;
		title?: string;
		album?: string;
		genre?: string;
		level?: number;
		newerThan?: number;
		fromYear?: number;
		toYear?: number;
		mbAlbumID?: string;
		mbArtistID?: string;
		types?: Array<string>;
	}

	export interface SearchQueryUser extends SearchQuery {
		ids?: Array<string>;
		name?: string;
		isAdmin?: boolean;
	}

	export interface SearchQueryPodcast extends SearchQuery {
		url?: string;
		title?: string;
		status?: string;
	}

	export interface SearchQueryRadio extends SearchQuery {
		name?: string;
		url?: string;
	}

	export interface SearchQueryPlayQueue extends SearchQuery {
		userID?: string;
	}

	export interface SearchQueryRoot extends SearchQuery {
		name?: string;
		path?: string;
	}

	export interface SearchQueryBookmark extends SearchQuery {
		userID?: string;
		destID?: string;
		destIDs?: Array<string>;
	}

	export interface SearchQueryPodcastEpisode extends SearchQuery {
		podcastID?: string;
		podcastIDs?: Array<string>;
		title?: string;
		status?: string;
	}

	export interface SearchQueryPlaylist extends SearchQuery {
		name?: string;
		userID?: string;
		isPublic?: boolean;
		trackID?: string;
		trackIDs?: Array<string>;
	}

	export interface SearchQueryState extends SearchQuery {
		destID?: string;
		destIDs?: Array<string>;
		userID?: string;
		type?: DBObjectType;
		isPlayed?: boolean;
		isFaved?: boolean;
		minRating?: number;
		maxRating?: number;
	}

	export interface SearchQueryArtist extends SearchQuery {
		name?: string;
		names?: Array<string>;
		ids?: Array<string>;
		trackID?: string;
		trackIDs?: Array<string>;
		rootID?: string;
		mbArtistID?: string;
		albumID?: string;
		genre?: string;
		newerThan?: number;
		fromYear?: number;
		toYear?: number;
	}

	export interface SearchQueryAlbum extends SearchQuery {
		ids?: Array<string>;
		name?: string;
		rootID?: string;
		artist?: string;
		artistID?: string;
		trackID?: string;
		trackIDs?: Array<string>;
		mbAlbumID?: string;
		mbArtistID?: string;
		genre?: string;
		newerThan?: number;
		fromYear?: number;
		toYear?: number;
	}

	/* genre */

	export interface Genre {
		name: string;
		trackCount: number;
		artistCount: number;
		albumCount: number;
	}

	/* index */

	export interface FolderIndexEntry {
		name: string;
		nameSort: string;
		trackCount: number;
		folder: Folder;
	}

	export interface FolderIndexGroup {
		name: string;
		entries: Array<FolderIndexEntry>;
	}

	export interface FolderIndex {
		lastModified: number;
		groups: Array<FolderIndexGroup>;
	}

	export interface ArtistIndexEntry {
		artist: Artist;
	}

	export interface ArtistIndexGroup {
		name: string;
		entries: Array<ArtistIndexEntry>;
	}

	export interface ArtistIndex {
		lastModified: number;
		groups: Array<ArtistIndexGroup>;
	}

	export interface Indexes {
		folderIndex: FolderIndex;
		artistIndex: ArtistIndex;
	}

	/* chat */

	export interface ChatMessage {
		userID: string;
		username: string;
		time: number;
		message: string;
	}
}
