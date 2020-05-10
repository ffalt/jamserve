import {Engine} from '../../engine/engine';
import {ApolloServer, AuthenticationError, gql, SchemaDirectiveVisitor} from 'apollo-server-express';
import {Album} from '../../engine/album/album.model';
import {Track} from '../../engine/track/track.model';
import {ListResult} from '../../engine/base/list-result';
import {Artist} from '../../engine/artist/artist.model';
import {Series} from '../../engine/series/series.model';
import {Root, RootStatus} from '../../engine/root/root.model';
import {Folder} from '../../engine/folder/folder.model';
import {Bookmark} from '../../engine/bookmark/bookmark.model';
import {User} from '../../engine/user/user.model';
import {Podcast} from '../../engine/podcast/podcast.model';
import {Episode} from '../../engine/episode/episode.model';
import {Radio} from '../../engine/radio/radio.model';
import {State} from '../../engine/state/state.model';
import {DBObjectType} from '../../db/db.types';
import {SearchQueryTrack} from '../../engine/track/track.store';
import {SearchQueryRadio} from '../../engine/radio/radio.store';
import {SearchQueryArtist} from '../../engine/artist/artist.store';
import {SearchQueryRoot} from '../../engine/root/root.store';
import {SearchQuerySeries} from '../../engine/series/series.store';
import {SearchQueryAlbum} from '../../engine/album/album.store';
import {SearchQueryPodcast} from '../../engine/podcast/podcast.store';
import {SearchQueryEpisode} from '../../engine/episode/episode.store';
import {SearchQueryBookmark} from '../../engine/bookmark/bookmark.store';
import {JamParameters} from '../../model/jam-rest-params';
import {SearchQuery, SearchQuerySort} from '../../engine/base/base.store';
import {SearchQueryFolder} from '../../engine/folder/folder.store';
import {SearchQueryPlaylist} from '../../engine/playlist/playlist.store';
import {Playlist} from '../../engine/playlist/playlist.model';
import {SeriesService} from '../../engine/series/series.service';
import {Jam} from '../../model/jam-rest-data';
import {FolderType} from '../../model/jam-types';
import {AlbumIndex, ArtistIndex, FolderIndex, SeriesIndex} from '../../engine/index/index.model';
import {ChatMessage} from '../../engine/chat/chat.model';
import {NowPlaying} from '../../engine/nowplaying/nowplaying.model';
import moment from 'moment';
import {paginate} from '../../utils/paginate';
import {Genre} from '../../engine/genre/genre.model';
import {Stats} from '../../engine/stats/stats.model';
import {PlayQueue} from '../../engine/playqueue/playqueue.model';
import {GraphQLJSON, GraphQLJSONObject} from 'graphql-type-json';
import {formatSession} from '../../engine/session/session.format';
import {SearchQueryUser} from '../../engine/user/user.store';
import {JAMAPI_VERSION} from './version';

interface Page {
	offset?: number;
	amount?: number;
}

interface Dtime {
	iso: string;
	timestamp: number;
}

interface OrderBy<T> {
	direction: 'asc' | 'desc';
	field: T;
}

interface PageResult<T> {
	offset: number;
	total: number;
	more: boolean;
	amount?: number;
	items: Array<T>;
}

interface QueryContext {
	user: User;
	engine: Engine;
	sessionID: string;
	req: Request;
	res: Response;
}

interface QueryPageArgs<T, Y> {
	page?: Page;
	filter?: T;
	orderBy?: Array<OrderBy<Y>>;
}

interface QueryListPageArgs<T, Y> extends QueryPageArgs<T, Y> {
	page?: Page;
	filter?: T;
	orderBy?: Array<OrderBy<Y>>;
	list: JamParameters.ListType;
}

function packDtime(dtime?: number): Dtime | undefined {
	if (dtime === undefined) {
		return;
	}
	return {
		timestamp: dtime,
		iso: (new Date(dtime)).toISOString()
	}
}

function unpackOrderBy<T>(orderby: OrderBy<T>): SearchQuerySort<T> {
	return {
		field: orderby.field,
		descending: orderby.direction === 'desc'
	}
}

function unpackOrderBys<T>(list?: Array<OrderBy<T>>): Array<SearchQuerySort<T>> | undefined {
	if (!list) {
		return;
	}
	return list.map(orderBy => unpackOrderBy<T>(orderBy));
}

function packPage<T>(list?: ListResult<T>): PageResult<T> {
	console.log(list);
	const items = list?.items || [];
	const amount = (list?.amount === undefined ? list?.amount : list?.total) || items.length;
	return {
		total: list?.total || 0,
		more: ((list?.offset || 0) + (amount || items.length)) < (list?.total || 0),
		offset: list?.offset || 0,
		amount,
		items
	}
}

function buildSearchQuery<T extends SearchQuery, Y>(args: QueryPageArgs<T, Y>, allIfNoAmount: boolean = false): T {
	const {page, filter, orderBy} = args;
	return {amount: page?.amount || (allIfNoAmount ? undefined : 20), offset: page?.offset || 0, ...filter, sorts: unpackOrderBys<Y>(orderBy)} as any;
}

function buildListSearchQuery<T extends SearchQuery, Y>(args: QueryListPageArgs<T, Y>, user: User): { query: T; listQuery: JamParameters.List; user: User } {
	const query = buildSearchQuery<T, Y>(args);
	const amount = query.amount;
	const offset = query.offset;
	query.amount = undefined;
	query.offset = undefined;
	return {
		listQuery: {amount, offset, list: args.list},
		user,
		query
	};
}

const typeDefs = gql`
	scalar JSON
	scalar JSONObject

	directive @hasRole(role: String) on OBJECT | FIELD_DEFINITION

	enum SessionMode {
		browser
		jwt
	}

	enum ListType {
		random
		highest
		avghighest
		frequent
		faved
		recent
	}

	enum SortDirection {
		asc
		desc
	}

	input Page {
		offset: Int
		amount: Int
	}

	type Datetime {
		iso: String!
		timestamp: Float!
	}

	type FileStats {
		created: Datetime!
		modified: Datetime!
		size: Float!
	}

	type State {
		played: Int
		lastPlayed: Datetime
		faved: Datetime
		rated: Int
	}

	type ExtendedInfo {
		description: String!
		source: String!
		license: String!
		url: String!
		licenseUrl: String!
	}

	type ChatMessage {
		username: String!
		time: Datetime!
		message: String!
	}

	type NowPlaying {
		username: String!
		minutesAgo: Datetime!
		time: Datetime!
		type: String!
		track: Track
		episode: Episode
	}

	enum AlbumType {
		unknown
		album
		compilation
		live
		bootleg
		soundtrack
		audiobook
		ep
		single
		series
	}

	type Album {
		id: ID!
		slug: String!
		name: String!
		genres: [String!]
		albumType: AlbumType
		seriesNr: String
		year: Int
		duration: Float
		created: Datetime!
		mbArtistID: ID
		mbReleaseID: ID

		seriesID: ID
		artistID: ID
		trackIDs: [String]
		folderIDs: [String]
		rootIDs: [String]

		trackCount: Int!
		folderCount: Int!
		rootCount: Int!

		seriesName: String
		series: Series
		artistName: String
		artist: Artist!
		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
		folders(page: Page, filter: FolderFilter, orderBy: [FolderOrderBy!]): FolderListPage!
		roots(page: Page, filter: RootFilter, orderBy: [RootOrderBy!]): RootListPage!
		state: State
		info: ExtendedInfo
		similarTracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
	}

	type AlbumListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Album!]!
	}

	input AlbumFilter {
		id: ID
		ids: [ID!]
		query: String
		name: String
		slug: String
		rootID: ID
		rootIDs: [ID!]
		artist: String
		artistID: ID
		trackID: ID
		trackIDs: [ID!]
		seriesID: ID
		seriesIDs: [ID!]
		albumType: AlbumType
		albumTypes: [AlbumType!]
		mbReleaseID: ID
		mbArtistID: ID
		genre: String
		newerThan: Float
		fromYear: Int
		toYear: Int
	}

	enum AlbumOrderByField {
		name
		created
		artist
		genre
		year
	}

	input AlbumOrderBy {
		field: AlbumOrderByField
		direction: SortDirection
	}

	type AlbumIndexGroup {
		name: String!
		entries: [Album!]!
	}

	type AlbumIndex {
		lastModified: Datetime!
		groups: [AlbumIndexGroup!]!
	}


	type PodcastTag {
		title: String
		link: String
		author: String
		description: String
		generator: String
		image: String
		categories: [String!]
	}

	type Podcast {
		id: ID!
		name: String
		url: String!
		created: Datetime!
		lastCheck: Datetime!
		status: PodcastStatus
		image: String
		errorMessage: String
		tag: PodcastTag
		episodes(page: Page, filter: EpisodeFilter, orderBy: [EpisodeOrderBy!]): EpisodeListPage!
		state: State
	}

	type PodcastListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Podcast!]!
	}

	input PodcastFilter {
		id: ID
		ids: [ID!]
		query: String
		url: String
		title: String
		status: String
		newerThan: Float
	}

	enum PodcastOrderByField {
		title
		created
	}

	input PodcastOrderBy {
		field: PodcastOrderByField
		direction: SortDirection
	}

	enum PodcastStatus {
		new
		downloading
		completed
		error
		deleted
	}


	type RootStatus {
		lastScan: Datetime
		error: String
		scanning: Boolean
	}

	type Root {
		id: ID!
		name: String!
		path: String!
		created: Datetime!
		strategy: RootScanStrategy!
		status: RootStatus
	}

	enum RootScanStrategy {
		auto
		artistalbum
		compilation
		audiobook
	}

	input RootFilter {
		id: ID
		ids: [ID!]
		query: String
		name: String
		path: String
	}

	type RootListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Root!]!
	}

	enum RootOrderByField {
		name
		created
	}

	input RootOrderBy {
		field: RootOrderByField
		direction: SortDirection
	}

	type HealthHintDetail {
		reason: String!
		expected: String
		actual: String
	}

	type HealthHint {
		id: ID!
		name: String!
		details: [HealthHintDetail!]
	}


	enum FolderType {
		unknown
		artist
		collection
		album
		multialbum
		extras
	}

	type FolderTag {
		level: Int!
		trackCount: Int!
		folderCount: Int!
		type: FolderType!
		genres: [String]
		album: String
		artist: String
		artistSort: String
		albumType: AlbumType
		albumTrackCount: Int
		title: String
		year: Int
		mbReleaseID: ID
		mbReleaseGroupID: ID
		mbAlbumType: String
		mbArtistID: ID
		artworks: [FolderArtwork!]
	}

	type Folder {
		id: ID!
		path: String!
		stat: FolderStat!
		tag: FolderTag!

		rootID: ID!
		parentID: ID

		root: Root!
		parent: Folder
		folders(page: Page, filter: FolderFilter, orderBy: [FolderOrderBy!]): FolderListPage!
		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
		state: State
		info: ExtendedInfo
		similarArtistFolders(page: Page, filter: FolderFilter, orderBy: [FolderOrderBy!]): FolderListPage!
		similarArtistTracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
		health: [HealthHint!]! @hasRole(role: "admin")
	}

	type FolderStat {
		created: Datetime!
		modified: Datetime!
	}

	type FolderListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Folder!]!
	}

	enum FolderOrderByField {
		artist
		album
		genre
		created
		parent
		title
		year
	}

	input FolderOrderBy {
		field: PodcastOrderByField
		direction: SortDirection
	}

	input FolderFilter {
		id: ID
		ids: [ID!]
		query: String
		rootID: ID
		rootIDs: [ID!]
		parentID: ID
		parentIDs: [ID!]
		path: String
		inPath: String
		inPaths: [String!]
		artist: String
		artists: [String!]
		title: String
		album: String
		genre: String
		level: Int
		newerThan: Float
		fromYear: Int
		toYear: Int
		mbReleaseID: ID
		mbArtistID: ID
		type: FolderType
		types: [FolderType!]
	}

	type FolderArtworkImage {
		width: Int
		height: Int
		format: String
	}

	type FolderArtwork {
		id: ID!
		name: String!
		types: [String!]!
		image: FolderArtworkImage
		stat: FileStats
	}

	type FolderIndexEntry {
		name: String!
		nameSort: String!
		trackCount: Int!
		folder: Folder
	}

	type FolderIndexGroup {
		name: String!
		entries: [FolderIndexEntry!]!
	}

	type FolderIndex {
		lastModified: Datetime!
		groups: [FolderIndexGroup!]!
	}


	type Radio  {
		id: ID!
		name: String!
		url: String!
		homepage: String
		disabled: Boolean
		created: Datetime!
		changed: Datetime
		state: State
	}

	type RadioListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Radio!]!
	}

	enum RadioOrderByField {
		name
		created
	}

	input RadioOrderBy {
		field: RadioOrderByField
		direction: SortDirection
	}

	input RadioFilter {
		id: ID
		ids: [ID!]
		query: String
		name: String
		url: String
		homepage: String
	}


	type EpisodeChapter {
		start: Float!
		title: String!
	}

	type EpisodeEnclosure {
		url: String
		type: String
		length: Float
	}

	type Episode  {
		id: ID!
		podcastID: ID!
		podcastName: String!
		status: PodcastStatus!
		error: String
		path: String
		link: String
		summary: String
		date: Datetime
		duration: Float
		name: String
		guid: ID
		author: String
		chapters: [EpisodeChapter!]
		enclosures: [EpisodeEnclosure!]
		stat: FileStats
		tag: TrackTag
		media: TrackMedia
		podcast: Podcast
		state: State
	}

	type EpisodeListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Episode!]!
	}

	input EpisodeFilter {
		id: ID
		ids: [ID!]
		query: String
		podcastID: ID
		podcastIDs: [ID!]
		name: String
		status: String
		newerThan: Float
	}

	enum EpisodeOrderByField {
		name
		created
		podcast
		date
	}

	input EpisodeOrderBy {
		field: EpisodeOrderByField
		direction: SortDirection
	}


	type TrackTagChapter {
		start: Float!
		end: Float!
		title: String!
	}

	type TrackMedia {
		duration: Float
		bitRate: Int
		format: String
		sampleRate: Int
		channels: Int
		encoded: String
		mode: String
		version: String
	}

	type TrackTag {
		format: String!
		album: String
		albumSort: String
		albumArtist: String
		albumArtistSort: String
		artist: String
		artistSort: String
		genre: String
		disc: Int
		discTotal: Int
		title: String
		titleSort: String
		track: Int
		trackTotal: Int
		year: Int
		nrTagImages: Int
		mbTrackID: ID
		mbAlbumType: String
		mbAlbumArtistID: ID
		mbArtistID: ID
		mbReleaseID: ID
		mbReleaseTrackID: ID
		mbReleaseGroupID: ID
		mbRecordingID: ID
		mbAlbumStatus: String
		mbReleaseCountry: String
		series: String
		seriesNr: String
		lyrics: String
		chapters: [TrackTagChapter!]
	}

	type TrackLyrics {
		lyrics: String
		source: String
	}

	type TrackRawTag {
		version: Int!
		frames: JSONObject
	}

	type Track {
		id: ID!
		name: String!
		path: String!
		stat: FileStats
		albumArtistID: ID
		tag: TrackTag
		media: TrackMedia

		artistID: ID
		albumID: ID!
		parentID: ID!
		seriesID: ID
		rootID: ID!

		artist: Artist
		albumArtist: Artist
		album: Album
		parent: Folder
		series: Series
		root: Root!
		state: State
		bookmarks(page: Page, filter: BookmarkFilter, orderBy: [BookmarkOrderBy!]): BookmarkListPage!
		playlists(page: Page, filter: PlaylistFilter, orderBy: [PlaylistOrderBy!]): PlaylistListPage!
		similar(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
		lyrics: TrackLyrics!
		rawTag: TrackRawTag
		health(media: Boolean): [HealthHint!]! @hasRole(role: "admin")
	}

	type TrackListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Track!]!
	}

	input TrackFilter {
		id: ID
		ids: [ID!]
		query: String
		path: String
		inPath: String
		inPaths: [String!]
		artist: String
		artistID: ID
		artistIDs: [ID!]
		albumArtistID: ID
		albumArtistIDs: [ID!]
		parentID: ID
		parentIDs: [ID!]
		mbTrackID: ID
		mbTrackIDs: [ID!]
		rootID: ID
		rootIDs: [ID!]
		title: String
		album: String
		albumID: ID
		albumIDs: [ID!]
		seriesID: ID
		seriesIDs: [ID!]
		genre: String
		newerThan: Float
		fromYear: Int
		toYear: Int
	}

	enum TrackOrderByField {
		artist
		album
		albumartist
		genre
		parent
		title
		trackNr
		discNr
		year
		created
	}

	input TrackOrderBy {
		field: TrackOrderByField
		direction: SortDirection
	}


	type Artist {
		id: ID!
		slug: String!
		name: String!
		nameSort: String
		albumTypes: [AlbumType!]
		mbArtistID: ID
		genres: [String!]
		created: Datetime!

		trackIDs: [String]
		folderIDs: [String]
		albumIDs: [String]
		seriesIDs: [String]
		rootIDs: [String]

		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
		folders(page: Page, filter: FolderFilter, orderBy: [FolderOrderBy!]): FolderListPage!
		albums(page: Page, filter: AlbumFilter, orderBy: [AlbumOrderBy!]): AlbumListPage!
		series(page: Page, filter: SeriesFilter, orderBy: [SeriesOrderBy!]): SeriesListPage!
		roots(page: Page, filter: RootFilter, orderBy: [RootOrderBy!]): RootListPage!
		state: State
		info: ExtendedInfo
		similarTracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
		similar(page: Page, filter: ArtistFilter, orderBy: [ArtistOrderBy!]): ArtistListPage!
		trackCount: Int!
		albumCount: Int!
		seriesCount: Int!
		rootCount: Int!
	}

	type ArtistListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Artist!]!
	}

	enum ArtistOrderByField {
		name
		created
	}

	input ArtistOrderBy {
		field: ArtistOrderByField
		direction: SortDirection
	}

	input ArtistFilter {
		id: ID
		ids: [ID!]
		query: String
		name: String

		slug: String
		names: [String!]
		trackID: ID
		trackIDs: [ID!]
		rootID: ID
		rootIDs: [ID!]
		seriesID: ID
		seriesIDs: [ID!]
		mbArtistID: ID
		genre: String
		albumID: ID
		albumType: AlbumType
		albumTypes: [AlbumType!]
		newerThan: Float
	}

	type ArtistIndexGroup {
		name: String!
		entries: [Artist!]!
	}

	type ArtistIndex {
		lastModified: Datetime!
		groups: [ArtistIndexGroup!]!
	}


	type Series {
		id: ID!
		name: String!
		artistName: String!
		albumTypes: [AlbumType!]!
		created: Datetime

		artistID: ID!
		folderIDs: [ID!]
		trackIDs: [ID!]
		albumIDs: [ID!]
		rootIDs: [ID!]

		artist: Artist!
		folders(page: Page, filter: FolderFilter, orderBy: [FolderOrderBy!]): FolderListPage!
		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
		albums(page: Page, filter: AlbumFilter, orderBy: [AlbumOrderBy!]): AlbumListPage!
		roots(page: Page, filter: RootFilter, orderBy: [RootOrderBy!]): RootListPage!
		state: State
		info: ExtendedInfo
	}

	input SeriesFilter {
		id: ID
		ids: [ID!]
		name: String
		rootID: ID
		rootIDs: [ID!]
		artistID: ID
		trackID: ID
		trackIDs: [ID!]
		folderID: ID
		folderIDs: [ID!]
		albumID: ID
		albumIDs: [ID!]
		albumType: AlbumType
		albumTypes: [AlbumType!]
		newerThan: Float
	}

	enum SeriesOrderByField {
		name
		created
	}

	input SeriesOrderBy {
		field: SeriesOrderByField
		direction: SortDirection
	}

	type SeriesListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Series!]!
	}

	type SeriesIndexGroup {
		name: String!
		entries: [Series!]!
	}

	type SeriesIndex {
		lastModified: Datetime!
		groups: [SeriesIndexGroup!]!
	}


	type Bookmark {
		id: ID!
		destID: ID!
		comment: String
		created: Datetime!
		changed: Datetime!
		position: Float!
		track: Track
	}

	type BookmarkListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Bookmark!]!
	}

	input BookmarkFilter {
		id: ID
		ids: [ID!]
		query: String
		position: Float
		destID: ID
		destIDs: [ID!]
	}

	enum BookmarkOrderByField {
		position
		created
	}

	input BookmarkOrderBy {
		field: BookmarkOrderByField
		direction: SortDirection
	}


	type Playlist {
		id: ID!
		name: String!
		userID: ID!
		comment: String
		changed: Datetime!
		created: Datetime!
		isPublic: Boolean!
		duration: Float
		trackIDs: [ID!]!
		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
	}

	type PlaylistListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Playlist!]!
	}

	enum PlaylistOrderByField {
		name
		created
	}

	input PlaylistOrderBy {
		field: PlaylistOrderByField
		direction: SortDirection
	}

	input PlaylistFilter {
		id: ID
		ids: [ID!]
		query: String
		name: String
		userID: ID
		isPublic: Boolean
		trackID: ID
		trackIDs: [ID!]
		newerThan: Float
	}


	type Genre {
		name: String!
		trackCount: Int!
		artistCount: Int!
		albumCount: Int!
	}

	type GenreListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Genre!]!
	}

	type StatsAlbumType {
		album: Int!
		compilation: Int!
		artist_compilation: Int!
		unknown: Int!
		live: Int!
		audiobook: Int!
		soundtrack: Int!
		bootleg: Int!
		ep: Int!
		single: Int!
		series: Int!
	}

	type Stats {
		rootID: ID
		track: Int!
		folder: Int!
		series: Int!
		album: Int!
		albumTypes: StatsAlbumType
		artist: Int!
		artistTypes: StatsAlbumType
		podcasts: Int!
	}

	type PlayQueue {
		trackIDs: [ID!]!
		currentID: ID
		position: Float
		changed: Datetime
		changedBy: String
		trackCount: Int!
		currentTrack: Track
		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
	}

	type Session {
		id: ID!
		client: String!
		expires: Datetime
		mode: SessionMode
		platform: String
		agent: String
		os: String
	}

	type AutoComplete {
		tracks(amount:Int!): [Track]
		artists(amount:Int!): [Artist]
		albums(amount:Int!): [Album]
		folders(amount:Int!): [Folder]
		playlists(amount:Int!): [Playlist]
		podcasts(amount:Int!): [Podcast]
		episodes(amount:Int!): [Episode]
		series(amount:Int!): [Series]
	}

	type User {
		id: ID!
		name: String
		email: String
		created: Datetime
		scrobblingEnabled: Boolean
		maxBitRate: Float
		roles: UserRoles
	}

	type UserListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [User!]!
	}

	enum UserOrderByField {
		name
		created
	}

	input UserOrderBy {
		field: UserOrderByField
		direction: SortDirection
	}

	type UserRoles {
		stream: Boolean!
		upload: Boolean!
		admin: Boolean!
		podcast: Boolean!
	}

	input UserFilter {
		id: ID
		ids: [ID!]
		query: String
		name: String
		isAdmin: Boolean
	}


	type MaxAge {
		value: Int!
		unit: String!
	}

	type AdminSettingsChat {
		maxMessages: Int!
		maxAge: MaxAge!
	}

	type AdminSettingsIndex {
		ignoreArticles: [String!]!
	}

	type AdminSettingsLibrary {
		scanAtStart: Boolean!
	}

	type AdminSettingsExternal {
		enabled: Boolean!
	}

	type AdminSettings {
		chat: AdminSettingsChat!
		index: AdminSettingsIndex!
		library: AdminSettingsLibrary!
		externalServices: AdminSettingsExternal!
	}

	type AdminChangeQueueInfo {
		id: ID!
		pos: Int
		error: String
		done: Datetime
	}

	type Query {
		version: String!
		autocomplete(query: String!): AutoComplete!
		stats(rootID: ID): Stats!
		session: Session
		sessions: [Session!]!
		chat(since: Float): [ChatMessage!]!
		genres(page: Page, rootID: ID): GenreListPage!
		playlists(page: Page, filter: PlaylistFilter, orderBy: [PlaylistOrderBy!], list: ListType): PlaylistListPage!
		playlist(id: ID!): Playlist
		folders(page: Page, filter: FolderFilter, orderBy: [FolderOrderBy!], list: ListType): FolderListPage!
		folderIndex(filter: FolderFilter): FolderIndex!
		folder(id: ID!): Folder
		roots(page: Page, filter: RootFilter, orderBy: [RootOrderBy!]): RootListPage!
		root(id: ID!): Root
		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!], list: ListType): TrackListPage!
		track(id: ID!): Track
		artists(page: Page, filter: ArtistFilter, orderBy: [ArtistOrderBy!], list: ListType): ArtistListPage!
		artistIndex(filter: ArtistFilter): ArtistIndex!
		artist(id: ID!): Artist!
		series(page: Page, filter: SeriesFilter, orderBy: [SeriesOrderBy!], list: ListType): SeriesListPage!
		seriesIndex(filter: SeriesFilter): SeriesIndex!
		serie(id: ID!): Series
		albums(page: Page, filter: AlbumFilter, orderBy: [AlbumOrderBy!], list: ListType): AlbumListPage!
		albumIndex(filter: AlbumFilter): AlbumIndex!
		album(id: ID!): Album
		episodes(page: Page, filter: EpisodeFilter, orderBy: [EpisodeOrderBy!], list: ListType): EpisodeListPage!
		episode(id: ID!): Album
		podcasts(page: Page, filter: PodcastFilter, orderBy: [PodcastOrderBy!], list: ListType): PodcastListPage!
		podcast(id: ID!): Podcast
		radios(page: Page, filter: RadioFilter, orderBy: [RadioOrderBy!], list: ListType): RadioListPage!
		radio(id: ID!): Radio
		bookmarks(page: Page, filter: BookmarkFilter, orderBy: [BookmarkOrderBy!]): BookmarkListPage!
		nowPlaying: [NowPlaying]!
		playQueue: PlayQueue!
		users(page: Page, filter: UserFilter, orderBy: [UserOrderBy!]): UserListPage! @hasRole(role: "admin")
		user(id: ID!): User @hasRole(role: "admin")
		adminSettings: AdminSettings! @hasRole(role: "admin")
		adminQueue(id: ID!): AdminChangeQueueInfo @hasRole(role: "admin")
	}


`;

export class HasRoleDirective extends SchemaDirectiveVisitor {
	visitFieldDefinition(field: any): any {
		const expectedRole = this.args.role;
		const next = field.resolve;

		field.resolve = (result: any, args: any, context: any, info: any): any => {
			const {user} = context;
			if (!user) {
				throw new AuthenticationError(
					'You must be signed in to view this resource.'
				);
			}
			const hasRole = (user.roles as any)[expectedRole];

			if (!hasRole) {
				throw new AuthenticationError(
					'Authorization error: Incorrect permissions'
				);
			}

			return next(result, args, context, info);
		};
	}

	visitObject(obj: any): any {
		const fields = obj.getFields();
		const expectedRole = this.args.role;

		Object.keys(fields).forEach(fieldName => {
			const field = fields[fieldName];
			const next = field.resolve;
			field.resolve = function(
				result: any,
				args: any,
				context: any,
				info: any
			): any {
				const {user} = context;
				if (!user) {
					throw new AuthenticationError(
						'You must be signed in to view this resource.'
					);
				}

				const hasRole = (user.roles as any)[expectedRole];

				if (!hasRole) {
					throw new AuthenticationError(
						'Authorization error: Incorrect permissions'
					);
				}

				return next(result, args, context, info);
			};
		});
	}
}

export function initJamGraphQLRouter(engine: Engine): ApolloServer {
	const resolvers = {
		Query: {
			version: (): string => JAMAPI_VERSION,

			adminSettings: async (): Promise<Jam.AdminSettings> => {
				return await engine.settingsService.get();
			},
			adminQueue: async (obj: any, {id}: { id: string }): Promise<Jam.AdminChangeQueueInfo> => {
				return engine.ioService.getAdminChangeQueueInfoStatus(id);
			},

			users: async (obj: any, args: QueryPageArgs<SearchQueryUser, JamParameters.UserSortField>, {user}: QueryContext): Promise<PageResult<User>> => {
				return packPage(await engine.userService.userStore.search(buildSearchQuery(args)));
			},
			user: async (obj: any, args: { id?: string }): Promise<User | undefined> => {
				return args.id ? await engine.userService.userStore.byId(args.id) : undefined;
			},

			autocomplete: (query: string): { query: string } => {
				return {query};
			},
			roots: async (obj: any, args: QueryPageArgs<SearchQueryRoot, JamParameters.RootSortField>): Promise<PageResult<Root>> => {
				return packPage(await engine.rootService.rootStore.search(buildSearchQuery(args)));
			},
			root: async (obj: any, args: { id?: string }): Promise<Root | undefined> => {
				return args.id ? await engine.rootService.rootStore.byId(args.id) : undefined;
			},

			tracks: async (obj: any, args: QueryListPageArgs<SearchQueryTrack, JamParameters.TrackSortField>, {user}: QueryContext): Promise<PageResult<Track>> => {
				if (args.list) {
					return packPage(await engine.trackService.getList(buildListSearchQuery(args, user)));
				}
				return packPage(await engine.trackService.trackStore.search(buildSearchQuery(args)));
			},
			track: async (obj: any, args: { id?: string }): Promise<Track | undefined> => {
				return args.id ? await engine.trackService.trackStore.byId(args.id) : undefined;
			},

			radios: async (obj: any, args: QueryListPageArgs<SearchQueryRadio, JamParameters.RadioSortField>, {user}: QueryContext): Promise<PageResult<Radio>> => {
				if (args.list) {
					return packPage(await engine.radioService.getList(buildListSearchQuery(args, user)));
				}
				return packPage(await engine.radioService.radioStore.search(buildSearchQuery(args)));
			},
			radio: async (obj: any, args: { id?: string }): Promise<Radio | undefined> => {
				return args.id ? await engine.radioService.radioStore.byId(args.id) : undefined;
			},

			artists: async (obj: any, args: QueryListPageArgs<SearchQueryArtist, JamParameters.ArtistSortField>, {user}: QueryContext): Promise<PageResult<Artist>> => {
				if (args.list) {
					return packPage(await engine.artistService.getList(buildListSearchQuery(args, user)));
				}
				return packPage(await engine.artistService.artistStore.search(buildSearchQuery(args)));
			},
			artist: async (obj: any, args: { id?: string }): Promise<Artist | undefined> => {
				return args.id ? await engine.artistService.artistStore.byId(args.id) : undefined;
			},
			artistIndex: async (obj: any, {filter}: { filter: SearchQueryArtist }): Promise<ArtistIndex> => {
				return engine.indexService.getArtistIndex(filter);
			},

			series: async (obj: any, args: QueryListPageArgs<SearchQuerySeries, JamParameters.SeriesSortField>, {user}: QueryContext): Promise<PageResult<Series>> => {
				if (args.list) {
					return packPage(await engine.seriesService.getList(buildListSearchQuery(args, user)));
				}
				return packPage(await engine.seriesService.seriesStore.search(buildSearchQuery(args)));
			},
			serie: async (obj: any, args: { id?: string }): Promise<Series | undefined> => {
				return args.id ? await engine.seriesService.seriesStore.byId(args.id) : undefined;
			},
			seriesIndex: async (obj: any, {filter}: { filter: SearchQuerySeries }): Promise<SeriesIndex> => {
				return engine.indexService.getSeriesIndex(filter)
			},

			albums: async (obj: any, args: QueryListPageArgs<SearchQueryAlbum, JamParameters.AlbumSortField>, {user}: QueryContext): Promise<PageResult<Album>> => {
				if (args.list) {
					return packPage(await engine.albumService.getList(buildListSearchQuery(args, user)));
				}
				return packPage(await engine.albumService.albumStore.search(buildSearchQuery(args)));
			},
			album: async (obj: any, args: { id?: string }): Promise<Album | undefined> => {
				return args.id ? await engine.albumService.albumStore.byId(args.id) : undefined;
			},
			albumIndex: async (obj: any, {filter}: { filter: SearchQueryAlbum }): Promise<AlbumIndex> => {
				return engine.indexService.getAlbumIndex(filter)
			},

			folders: async (obj: any, args: QueryListPageArgs<SearchQueryFolder, JamParameters.FolderSortField>, {user}: QueryContext): Promise<PageResult<Folder>> => {
				if (args.list) {
					return packPage(await engine.folderService.getList(buildListSearchQuery(args, user)));
				}
				return packPage(await engine.folderService.folderStore.search(buildSearchQuery(args)));
			},
			folder: async (obj: any, args: { id?: string }): Promise<Folder | undefined> => {
				return args.id ? await engine.folderService.folderStore.byId(args.id) : undefined;
			},
			folderIndex: async (obj: any, {filter}: { filter: SearchQueryFolder }): Promise<FolderIndex> => {
				return engine.indexService.getFolderIndex(filter)
			},

			podcasts: async (obj: any, args: QueryListPageArgs<SearchQueryPodcast, JamParameters.PodcastSortField>, {user}: QueryContext): Promise<PageResult<Podcast>> => {
				if (args.list) {
					return packPage(await engine.podcastService.getList(buildListSearchQuery(args, user)));
				}
				return packPage(await engine.podcastService.podcastStore.search(buildSearchQuery(args)));
			},
			podcast: async (obj: any, args: { id?: string }): Promise<Podcast | undefined> => {
				return args.id ? await engine.podcastService.podcastStore.byId(args.id) : undefined;
			},

			episodes: async (obj: any, args: QueryListPageArgs<SearchQueryEpisode, JamParameters.EpisodeSortField>, {user}: QueryContext): Promise<PageResult<Episode>> => {
				if (args.list) {
					return packPage(await engine.episodeService.getList(buildListSearchQuery(args, user)));
				}
				const query: SearchQueryEpisode = buildSearchQuery(args);
				query.sorts = query.sorts ? query.sorts : [{field: 'date', descending: true}];
				return packPage(await engine.episodeService.episodeStore.search(query));
			},
			episode: async (obj: any, args: { id?: string }): Promise<Episode | undefined> => {
				return args.id ? await engine.episodeService.episodeStore.byId(args.id) : undefined;
			},

			playlists: async (obj: any, args: QueryListPageArgs<SearchQueryPlaylist, JamParameters.PlaylistSortField>, {user}: QueryContext): Promise<PageResult<Playlist>> => {
				if (args.list) {
					const list = await engine.playlistService.getList(buildListSearchQuery(args, user));
					list.items = list.items.filter(item => item.isPublic || item.userID === user.id);
					return packPage(list);
				}
				const list = await engine.playlistService.playlistStore.search(buildSearchQuery(args));
				list.items = list.items.filter(item => item.isPublic || item.userID === user.id);
				return packPage(list);
			},
			playlist: async (obj: any, {id}: { id?: string }, {user}: QueryContext): Promise<Playlist | undefined> => {
				if (!id) {
					return;
				}
				const result = await engine.playlistService.playlistStore.byId(id);
				if (result && !result.isPublic && result.userID !== user.id) {
					return;
				}
				return result;
			},

			bookmarks: async (obj: any, args: QueryPageArgs<SearchQueryBookmark, JamParameters.BookmarkSortField>, {user}: QueryContext): Promise<PageResult<Bookmark>> => {
				const query = {...buildSearchQuery(args), userID: user.id};
				return packPage(await engine.bookmarkService.bookmarkStore.search(query));
			},
			chat: async (obj: any, {since}: { since?: number }, {user}: QueryContext): Promise<Array<ChatMessage>> => {
				return await engine.chatService.get(since);
			},
			nowPlaying: async (obj: any): Promise<Array<NowPlaying>> => {
				return await engine.nowPlayingService.getNowPlaying();
			},
			stats: async (obj: any, {rootID}: { rootID?: string }): Promise<Stats> => {
				return await engine.statsService.getStats(rootID);
			},
			playQueue: async (obj: any, args: any, {user}: QueryContext): Promise<PlayQueue | undefined> => {
				return await engine.playQueueService.get(user.id);
			},
			sessions: async (obj: any, args: any, {user}: QueryContext): Promise<Array<Jam.UserSession>> => {
				return (await engine.sessionService.byUserID(user.id)).map(session => formatSession(session));
			},
			session: async (obj: any, args: any, {sessionID}: QueryContext): Promise<Jam.UserSession | undefined> => {
				const session = await engine.sessionService.byID(sessionID);
				return session ? formatSession(session) : undefined;
			},
			genres: async (obj: any, {page, rootID}: { page?: Page; rootID?: string }): Promise<PageResult<Genre>> => {
				const genres = await engine.genreService.getGenres(rootID);
				const list = paginate(genres, page?.amount || 100, page?.offset || 0);
				return packPage(list);
			},
		},
		AutoComplete: {
			tracks: async (obj: { query: string }, {amount}: { amount: number }): Promise<Array<Track>> => {
				return (await engine.trackService.trackStore.search({query: obj.query, amount: amount || 5})).items;
			},
			artists: async (obj: { query: string }, {amount}: { amount: number }): Promise<Array<Artist>> => {
				return (await engine.artistService.artistStore.search({query: obj.query, amount: amount || 5})).items;
			},
			albums: async (obj: { query: string }, {amount}: { amount: number }): Promise<Array<Album>> => {
				return (await engine.albumService.albumStore.search({query: obj.query, amount: amount || 5})).items;
			},
			folders: async (obj: { query: string }, {amount}: { amount: number }): Promise<Array<Folder>> => {
				return (await engine.folderService.folderStore.search({query: obj.query, amount: amount || 5})).items;
			},
			playlists: async (obj: { query: string }, {amount}: { amount: number }): Promise<Array<Playlist>> => {
				return (await engine.playlistService.playlistStore.search({query: obj.query, amount: amount || 5})).items;
			},
			podcasts: async (obj: { query: string }, {amount}: { amount: number }): Promise<Array<Podcast>> => {
				return (await engine.podcastService.podcastStore.search({query: obj.query, amount: amount || 5})).items;
			},
			episodes: async (obj: { query: string }, {amount}: { amount: number }): Promise<Array<Episode>> => {
				return (await engine.episodeService.episodeStore.search({query: obj.query, amount: amount || 5})).items;
			},
			series: async (obj: { query: string }, {amount}: { amount: number }): Promise<Array<Series>> => {
				return (await engine.seriesService.seriesStore.search({query: obj.query, amount: amount || 5})).items;
			},
		},
		PlayQueue: {
			changed: async (obj: PlayQueue): Promise<Dtime | undefined> => packDtime(obj.changed),
			trackCount: async (obj: PlayQueue): Promise<number> => obj.trackIDs.length,
			currentTrack: async (obj: PlayQueue): Promise<Track | undefined> => {
				return obj.currentID ? await engine.trackService.trackStore.byId(obj.currentID) : undefined;
			},
			tracks: async (obj: PlayQueue, args: QueryPageArgs<SearchQueryTrack, JamParameters.TrackSortField>): Promise<PageResult<Track>> => {
				const query = {...buildSearchQuery(args, true), trackIDs: obj.trackIDs};
				return packPage(await engine.trackService.trackStore.search(query));
			}
		},
		NowPlaying: {
			username: async (obj: NowPlaying): Promise<string | undefined> => obj.user.name,
			time: async (obj: NowPlaying): Promise<Dtime | undefined> => packDtime(obj.time),
			episode: async (obj: NowPlaying): Promise<Episode | undefined> => obj.obj.type === DBObjectType.episode ? obj.obj as Episode : undefined,
			track: async (obj: NowPlaying): Promise<Track | undefined> => obj.obj.type === DBObjectType.track ? obj.obj as Track : undefined,
			minutesAgo: async (obj: NowPlaying): Promise<Dtime | undefined> => packDtime(Math.round(moment.duration(moment().diff(moment(obj.time))).asMinutes()))
		},
		Podcast: {
			created: async (obj: Podcast): Promise<Dtime | undefined> => packDtime(obj.created),
			lastCheck: async (obj: Podcast): Promise<Dtime | undefined> => packDtime(obj.lastCheck),
			name: async (obj: Podcast): Promise<string> => {
				return obj.tag ? obj.tag.title : obj.url;
			},
			episodes: async (obj: Podcast, args: QueryPageArgs<SearchQueryEpisode, JamParameters.EpisodeSortField>): Promise<PageResult<Episode>> => {
				const query: SearchQueryEpisode = {...buildSearchQuery(args), podcastID: obj.id};
				query.sorts = query.sorts ? query.sorts : [{field: 'date', descending: true}];
				return packPage(await engine.episodeService.episodeStore.search(query));
			},
			state: async (obj: Podcast, args: any, {user}: QueryContext): Promise<State> => {
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.podcast);
			}
		},
		Episode: {
			stat: async (obj: Episode): Promise<{ created: Dtime | undefined; modified: Dtime | undefined; size: number } | undefined> => {
				if (obj.stat) {
					return {
						created: packDtime(obj.stat.created),
						modified: packDtime(obj.stat.modified),
						size: obj.stat.size
					}
				}
			},
			date: async (obj: Episode): Promise<Dtime | undefined> => packDtime(obj.date),
			podcast: async (obj: Episode): Promise<Podcast | undefined> => {
				return await engine.podcastService.podcastStore.byId(obj.podcastID);
			},
			state: async (obj: Episode, args: any, {user}: QueryContext): Promise<State> => {
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.episode);
			}
		},
		RootStatus: {
			lastScan: async (obj: RootStatus): Promise<Dtime | undefined> => packDtime(obj.lastScan),
		},
		Root: {
			status: async (obj: Root): Promise<RootStatus> => {
				return engine.ioService.getRootStatus(obj.id);
			}
		},
		Bookmark: {
			created: async (obj: Bookmark): Promise<Dtime | undefined> => packDtime(obj.created),
			changed: async (obj: Bookmark): Promise<Dtime | undefined> => packDtime(obj.changed),
			track: async (obj: Bookmark): Promise<Track | undefined> => {
				return await engine.trackService.trackStore.byId(obj.destID);
			}
		},
		Track: {
			stat: async (obj: Track): Promise<{ created: Dtime | undefined; modified: Dtime | undefined; size: number } | undefined> => {
				if (obj.stat) {
					return {
						created: packDtime(obj.stat.created),
						modified: packDtime(obj.stat.modified),
						size: obj.stat.size
					}
				}
			},
			root: async (obj: Track): Promise<Root | undefined> => {
				return await engine.rootService.rootStore.byId(obj.rootID);
			},
			parent: async (obj: Track): Promise<Folder | undefined> => {
				return await engine.folderService.folderStore.byId(obj.parentID);
			},
			artist: async (obj: Track): Promise<Artist | undefined> => {
				return await engine.artistService.artistStore.byId(obj.artistID);
			},
			albumArtist: async (obj: Track): Promise<Artist | undefined> => {
				return await engine.artistService.artistStore.byId(obj.albumArtistID);
			},
			album: async (obj: Track): Promise<Album | undefined> => {
				return await engine.albumService.albumStore.byId(obj.albumID);
			},
			series: async (obj: Track): Promise<Series | undefined> => {
				return obj.seriesID ? await engine.seriesService.seriesStore.byId(obj.seriesID) : undefined;
			},
			bookmarks: async (obj: Track, args: QueryPageArgs<SearchQueryBookmark, JamParameters.BookmarkSortField>, {user}: QueryContext): Promise<PageResult<Bookmark>> => {
				const query = {...buildSearchQuery(args, true), userID: user.id, destID: obj.id};
				return packPage(await engine.bookmarkService.bookmarkStore.search(query));
			},
			state: async (obj: Track, args: any, {user}: QueryContext): Promise<State> => {
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.track);
			},
			playlists: async (obj: Track, args: QueryPageArgs<SearchQueryPlaylist, JamParameters.PlaylistSortField>, {user}: QueryContext): Promise<PageResult<Playlist>> => {
				const query: SearchQueryPlaylist = {...buildSearchQuery(args), trackID: obj.id};
				const list = await engine.playlistService.playlistStore.search(query);
				list.items = list.items.filter(item => item.isPublic || item.userID === user.id);
				return packPage(list);
			},
			similar: async (obj: Track, args: QueryPageArgs<SearchQueryTrack, JamParameters.TrackSortField>): Promise<PageResult<Track>> => {
				const result = await engine.metaDataService.similarTracks.byTrack(obj);
				const query = {...buildSearchQuery(args, true), ids: result.map(o => o.id)};
				return packPage(await engine.trackService.trackStore.search(query));
			},
			lyrics: async (obj: Track): Promise<Jam.TrackLyrics> => {
				return await engine.metaDataService.lyricsByTrack(obj);
			},
			rawTag: async (obj: Track): Promise<Jam.RawTag | undefined> => {
				return await engine.trackService.getRawTag(obj);
			},
			health: async (obj: Track, {media}: { media?: boolean }): Promise<Array<Jam.HealthHint>> => {
				const tracksHealth = await engine.trackService.health({id: obj.id, amount: 1}, media);
				if (tracksHealth.length > 0) {
					return tracksHealth[0].health;
				}
				return [];
			}
		},
		Folder: {
			stat: async (obj: Folder): Promise<{ created: Dtime | undefined; modified: Dtime | undefined } | undefined> => {
				if (obj.stat) {
					return {
						created: packDtime(obj.stat.created),
						modified: packDtime(obj.stat.modified),
					}
				}
			},
			root: async (obj: Folder): Promise<Root | undefined> => {
				return await engine.rootService.rootStore.byId(obj.rootID);
			},
			parent: async (obj: Folder): Promise<Folder | undefined> => {
				return obj.parentID ? await engine.folderService.folderStore.byId(obj.parentID) : undefined;
			},
			folders: async (obj: Folder, args: QueryPageArgs<SearchQueryFolder, JamParameters.FolderSortField>): Promise<PageResult<Folder>> => {
				const query = {...buildSearchQuery(args, true), parentID: obj.id};
				return packPage(await engine.folderService.folderStore.search(query));
			},
			tracks: async (obj: Folder, args: QueryPageArgs<SearchQueryTrack, JamParameters.TrackSortField>): Promise<PageResult<Track>> => {
				const query = {...buildSearchQuery(args, true), parentID: obj.id};
				return packPage(await engine.trackService.trackStore.search(query));
			},
			state: async (obj: Folder, args: any, {user}: QueryContext): Promise<State> => {
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.folder);
			},
			info: async (obj: Folder): Promise<Jam.ExtendedInfo | undefined> => {
				switch (obj.tag.type) {
					case FolderType.artist:
						return await engine.metaDataService.extInfo.byFolderArtist(obj);
					case FolderType.collection:
					case FolderType.album:
					case FolderType.multialbum:
						return await engine.metaDataService.extInfo.byFolderAlbum(obj);
				}
			},
			similarArtistFolders: async (obj: Folder, args: QueryPageArgs<SearchQueryFolder, JamParameters.FolderSortField>): Promise<PageResult<Folder> | undefined> => {
				const result = await engine.metaDataService.similarArtists.byFolder(obj);
				const query = {...buildSearchQuery(args, true), ids: result.map(o => o.id)};
				return packPage(await engine.folderService.folderStore.search(query));
			},
			similarArtistTracks: async (obj: Folder, args: QueryPageArgs<SearchQueryTrack, JamParameters.TrackSortField>): Promise<PageResult<Track>> => {
				const result = await engine.metaDataService.similarTracks.byFolder(obj);
				const query = {...buildSearchQuery(args, true), ids: result.map(o => o.id)};
				return packPage(await engine.trackService.trackStore.search(query));
			},
			health: async (obj: Folder): Promise<Array<Jam.HealthHint>> => {
				const folderHealth = await engine.folderService.health({id: obj.id, amount: 1});
				if (folderHealth.length > 0) {
					return folderHealth[0].health;
				}
				return [];
			}
		},
		ChatMessage: {
			time: async (obj: ChatMessage): Promise<Dtime | undefined> => packDtime(obj.time)
		},
		Playlist: {
			tracks: async (obj: Playlist, args: QueryPageArgs<SearchQueryTrack, JamParameters.TrackSortField>): Promise<PageResult<Track>> => {
				const query = {...buildSearchQuery(args, true), ids: obj.trackIDs};
				return packPage(await engine.trackService.trackStore.search(query));
			},

		},
		Artist: {
			created: async (obj: Artist): Promise<Dtime | undefined> => packDtime(obj.created),
			roots: async (obj: Artist, args: QueryPageArgs<SearchQueryRoot, JamParameters.RootSortField>): Promise<PageResult<Root>> => {
				const query = {...buildSearchQuery(args, true), ids: obj.rootIDs};
				return packPage(await engine.rootService.rootStore.search(query));
			},
			tracks: async (obj: Artist, args: QueryPageArgs<SearchQueryTrack, JamParameters.TrackSortField>): Promise<PageResult<Track>> => {
				const query = {...buildSearchQuery(args, true), artistID: obj.id};
				return packPage(await engine.trackService.trackStore.search(query));
			},
			folders: async (obj: Artist, args: QueryPageArgs<SearchQueryFolder, JamParameters.FolderSortField>): Promise<PageResult<Folder>> => {
				const query = {...buildSearchQuery(args, true), ids: obj.folderIDs};
				return packPage(await engine.folderService.folderStore.search(query));
			},
			albums: async (obj: Artist, args: QueryPageArgs<SearchQueryAlbum, JamParameters.AlbumSortField>): Promise<PageResult<Album>> => {
				const query = {...buildSearchQuery(args, true), artistID: obj.id};
				return packPage(await engine.albumService.albumStore.search(query));
			},
			series: async (obj: Artist, args: QueryPageArgs<SearchQuerySeries, JamParameters.SeriesSortField>): Promise<PageResult<Series>> => {
				const query = {...buildSearchQuery(args, true), artistID: obj.id};
				return packPage(await engine.seriesService.seriesStore.search(query));
			},
			state: async (obj: Artist, args: any, {user}: QueryContext): Promise<State> => {
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.artist);
			},
			info: async (obj: Artist): Promise<Jam.ExtendedInfo | undefined> => {
				return await engine.metaDataService.extInfo.byArtist(obj);
			},
			similarTracks: async (obj: Artist, args: QueryPageArgs<SearchQueryTrack, JamParameters.TrackSortField>): Promise<PageResult<Track>> => {
				const result = await engine.metaDataService.similarTracks.byArtist(obj);
				const query = {...buildSearchQuery(args, true), ids: result.map(o => o.id)};
				return packPage(await engine.trackService.trackStore.search(query));
			},
			similar: async (obj: Artist, args: QueryPageArgs<SearchQueryArtist, JamParameters.ArtistSortField>): Promise<PageResult<Artist>> => {
				const result = await engine.metaDataService.similarArtists.byArtist(obj);
				const query = {...buildSearchQuery(args, true), ids: result.map(o => o.id)};
				return packPage(await engine.artistService.artistStore.search(query));
			},
			trackCount: async (obj: Artist): Promise<number> => obj.trackIDs.length,
			albumCount: async (obj: Artist): Promise<number> => obj.albumIDs.length,
			seriesCount: async (obj: Artist): Promise<number> => obj.seriesIDs.length,
			rootCount: async (obj: Artist): Promise<number> => obj.rootIDs.length
		},
		User: {
			created: async (obj: User): Promise<Dtime | undefined> => packDtime(obj.created),
		},
		Album: {
			created: async (obj: Album): Promise<Dtime | undefined> => packDtime(obj.created),
			artistName: async (obj: Album): Promise<string | undefined> => {
				return obj.artist;
			},
			seriesName: async (obj: Album): Promise<string | undefined> => {
				return obj.series;
			},
			artist: async (obj: Album): Promise<Artist | undefined> => {
				return await engine.artistService.artistStore.byId(obj.artistID);
			},
			roots: async (obj: Album, args: QueryPageArgs<SearchQueryRoot, JamParameters.RootSortField>): Promise<PageResult<Root>> => {
				const query = {...buildSearchQuery(args, true), ids: obj.rootIDs};
				return packPage(await engine.rootService.rootStore.search(query));
			},
			series: async (obj: Album): Promise<Series | undefined> => {
				return obj.seriesID ? await engine.seriesService.seriesStore.byId(obj.seriesID) : undefined;
			},
			folders: async (obj: Album, args: QueryPageArgs<SearchQueryFolder, JamParameters.FolderSortField>): Promise<PageResult<Folder>> => {
				const query = {...buildSearchQuery(args, true), ids: obj.folderIDs};
				return packPage(await engine.folderService.folderStore.search(query));
			},
			tracks: async (obj: Album, args: QueryPageArgs<SearchQueryTrack, JamParameters.TrackSortField>): Promise<PageResult<Track>> => {
				const query = {...buildSearchQuery(args, true), albumID: obj.id};
				const list = await engine.trackService.trackStore.search(query);
				if (!query.sorts) {
					list.items = list.items ? list.items.sort((a, b) => engine.albumService.sortAlbumTracks(a, b)) : [];
				}
				return packPage(list);
			},
			similarTracks: async (obj: Album, args: QueryPageArgs<SearchQueryTrack, JamParameters.TrackSortField>): Promise<PageResult<Track>> => {
				const result = await engine.metaDataService.similarTracks.byAlbum(obj);
				const query = {...buildSearchQuery(args, true), ids: result.map(o => o.id)};
				return packPage(await engine.trackService.trackStore.search(query));
			},
			state: async (obj: Album, args: any, {user}: QueryContext): Promise<State> => {
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.album);
			},
			info: async (obj: Album): Promise<Jam.ExtendedInfo | undefined> => {
				return await engine.metaDataService.extInfo.byAlbum(obj);
			},
			trackCount: async (obj: Album): Promise<number> => obj.trackIDs.length,
			folderCount: async (obj: Album): Promise<number> => obj.folderIDs.length,
			rootCount: async (obj: Album): Promise<number> => obj.rootIDs.length
		},
		State: {
			lastPlayed: async (obj: State): Promise<Dtime | undefined> => packDtime(obj.lastplayed),
			faved: async (obj: State): Promise<Dtime | undefined> => packDtime(obj.faved),
		},
		Series: {
			created: async (obj: Series): Promise<Dtime | undefined> => packDtime(obj.created),
			artistName: async (obj: Series): Promise<string | undefined> => {
				return obj.artist;
			},
			artist: async (obj: Series): Promise<Artist | undefined> => {
				return await engine.artistService.artistStore.byId(obj.artistID);
			},
			info: async (obj: Series): Promise<Jam.ExtendedInfo | undefined> => {
				return await engine.metaDataService.extInfo.bySeries(obj);
			},
			roots: async (obj: Series, args: QueryPageArgs<SearchQueryRoot, JamParameters.RootSortField>): Promise<PageResult<Root>> => {
				const query = {...buildSearchQuery(args, true), ids: obj.rootIDs};
				return packPage(await engine.rootService.rootStore.search(query));
			},
			albums: async (obj: Series, args: QueryPageArgs<SearchQueryAlbum, JamParameters.AlbumSortField>): Promise<PageResult<Album>> => {
				const query = {...buildSearchQuery(args, true), artistID: obj.id};
				const list = await engine.albumService.albumStore.search(query);
				if (!query.sorts) {
					list.items = list.items ? list.items.sort(SeriesService.sortSeriesAlbums) : [];
				}
				return packPage(list);
			},
			folders: async (obj: Series, args: QueryPageArgs<SearchQueryFolder, JamParameters.FolderSortField>): Promise<PageResult<Folder>> => {
				const query = {...buildSearchQuery(args, true), ids: obj.folderIDs};
				return packPage(await engine.folderService.folderStore.search(query));
			},
			tracks: async (obj: Series, args: QueryPageArgs<SearchQueryTrack, JamParameters.TrackSortField>): Promise<PageResult<Track>> => {
				const query = {...buildSearchQuery(args, true), albumID: obj.id};
				const list = await engine.trackService.trackStore.search(query);
				if (!query.sorts) {
					list.items = list.items ? list.items.sort(SeriesService.sortSeriesTracks) : [];
				}
				return packPage(list);
			},
			state: async (obj: Series, args: any, {user}: QueryContext): Promise<State> => {
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.series);
			}
		},
		JSON: GraphQLJSON,
		JSONObject: GraphQLJSONObject
	};

	return new ApolloServer({
		typeDefs,
		resolvers,
		schemaDirectives: {
			hasRole: HasRoleDirective
		},
		playground: {
			settings: {
				// 'request.credentials': 'same-origin'
				'request.credentials': 'include',
			}
		},
		context: async ({req, res}): Promise<QueryContext> => {
			if (!req.user) throw new AuthenticationError('you must be logged in');
			return {
				req, res,
				engine,
				sessionID: req.session?.id,
				user: req.user as User
			} as any;
		},

	});
}
