import {Engine} from '../../engine/engine';
import {ApolloServer, AuthenticationError, gql} from 'apollo-server-express';
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
	const items = list?.items || [];
	return {
		total: list?.total || 0,
		more: ((list?.offset || 0) + (list?.amount || 0)) < (list?.total || 0),
		offset: list?.offset || 0,
		amount: (list?.amount === undefined ? list?.amount : list?.total) || items.length,
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
		mbArtistID: String
		mbReleaseID: String

		seriesID: String
		artistID: String
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
		id: String
		ids: [String!]
		query: String
		name: String
		slug: String
		rootID: String
		rootIDs: [String!]
		artist: String
		artistID: String
		trackID: String
		trackIDs: [String!]
		seriesID: String
		seriesIDs: [String!]
		albumType: String
		albumTypes: [String!]
		mbReleaseID: String
		mbArtistID: String
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
		id: String
		ids: [String!]
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
		id: String
		ids: [String!]
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
		mbReleaseID: String
		mbReleaseGroupID: String
		mbAlbumType: String
		mbArtistID: String
		artworks: [FolderArtwork!]
	}

	type Folder {
		id: ID!
		path: String!
		stat: FolderStat!
		tag: FolderTag!

		rootID: String!
		parentID: String

		root: Root!
		parent: Folder
		folders(page: Page, filter: FolderFilter, orderBy: [FolderOrderBy!]): FolderListPage!
		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
		state: State
		info: ExtendedInfo
		similarArtistFolders(page: Page, filter: FolderFilter, orderBy: [FolderOrderBy!]): FolderListPage!
		similarArtistTracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
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
		id: String
		ids: [String!]
		query: String
		rootID: String
		rootIDs: [String!]
		parentID: String
		parentIDs: [String!]
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
		mbReleaseID: String
		mbArtistID: String
		type: FolderType
		types: [FolderType!]
	}

	type FolderArtworkImage {
		width: Int
		height: Int
		format: String
	}

	type FolderArtwork {
		id: String!
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
		url:String!
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
		id: String
		ids: [String!]
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
		podcastID: String!
		podcastName: String!
		status: PodcastStatus!
		error: String
		path: String
		link: String
		summary: String
		date: Datetime
		duration: Float
		name: String
		guid: String
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
		id: String
		ids: [String!]
		query: String
		podcastID: String
		podcastIDs: [String!]
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
		mbTrackID: String
		mbAlbumType: String
		mbAlbumArtistID: String
		mbArtistID: String
		mbReleaseID: String
		mbReleaseTrackID: String
		mbReleaseGroupID: String
		mbRecordingID: String
		mbAlbumStatus: String
		mbReleaseCountry: String
		series: String
		seriesNr: String
		lyrics: String
		chapters: [TrackTagChapter!]
	}

	type Track {
		id: ID!
		name: String!
		path: String!
		stat: FileStats
		albumArtistID: String
		tag: TrackTag
		media: TrackMedia

		artistID: String
		albumID: String!
		parentID: String!
		seriesID: String
		rootID: String!

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
	}

	type TrackListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Track!]!
	}

	input TrackFilter {
		id: String
		ids: [String!]
		query: String
		path: String
		inPath: String
		inPaths: [String!]
		artist: String
		artistID: String
		artistIDs: [String!]
		albumArtistID: String
		albumArtistIDs: [String!]
		parentID: String
		parentIDs: [String!]
		mbTrackID: String
		mbTrackIDs: [String!]
		rootID: String
		rootIDs: [String!]
		title: String
		album: String
		albumID: String
		albumIDs: [String!]
		seriesID: String
		seriesIDs: [String!]
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
		mbArtistID: String
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
		id: String
		ids: [String!]
		query: String
		name: String

		slug: String
		names: [String!]
		trackID: String
		trackIDs: [String!]
		rootID: String
		rootIDs: [String!]
		seriesID: String
		seriesIDs: [String!]
		mbArtistID: String
		genre: String
		albumID: String
		albumType: String
		albumTypes: [String!]
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

		artistID: String!
		folderIDs: [String!]
		trackIDs: [String!]
		albumIDs: [String!]
		rootIDs: [String!]

		artist: Artist!
		folders(page: Page, filter: FolderFilter, orderBy: [FolderOrderBy!]): FolderListPage!
		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
		albums(page: Page, filter: AlbumFilter, orderBy: [AlbumOrderBy!]): AlbumListPage!
		roots(page: Page, filter: RootFilter, orderBy: [RootOrderBy!]): RootListPage!
		state: State
		info: ExtendedInfo
	}

	input SeriesFilter {
		id: String
		ids: [String!]
		name: String
		rootID: String
		rootIDs: [String!]
		artistID: String
		trackID: String
		trackIDs: [String!]
		folderID: String
		folderIDs: [String!]
		albumID: String
		albumIDs: [String!]
		albumType: String
		albumTypes: [String!]
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
		destID: String!
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
		id: String
		ids: [String!]
		query: String
		position: Float
		destID: String
		destIDs: [String!]
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
		userID: String!
		comment: String
		coverArt: String
		changed: Datetime!
		created: Datetime!
		isPublic: Boolean!
		duration: Float
		trackIDs: [String!]
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
		id: String
		ids: [String!]
		query: String
		name: String
		userID: String
		isPublic: Boolean
		trackID: String
		trackIDs: [String!]
		newerThan: Float
	}

	type Query {
		hello: String
		chat(since: Float): [ChatMessage]!
		playlists(page: Page, filter: PlaylistFilter, orderBy: [PlaylistOrderBy!], list: ListType): PlaylistListPage!
		playlist(id: String): Playlist
		folders(page: Page, filter: FolderFilter, orderBy: [FolderOrderBy!], list: ListType): FolderListPage!
		folderIndex(filter: FolderFilter): FolderIndex!
		folder(id: String): Folder
		roots(page: Page, filter: RootFilter, orderBy: [RootOrderBy!]): RootListPage!
		root(id: String): Root
		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!], list: ListType): TrackListPage!
		track(id: String): Track
		artists(page: Page, filter: ArtistFilter, orderBy: [ArtistOrderBy!], list: ListType): ArtistListPage!
		artistIndex(filter: ArtistFilter): ArtistIndex!
		artist(id: String): Artist!
		series(page: Page, filter: SeriesFilter, orderBy: [SeriesOrderBy!], list: ListType): SeriesListPage!
		seriesIndex(filter: SeriesFilter): SeriesIndex!
		serie(id: String): Series
		albums(page: Page, filter: AlbumFilter, orderBy: [AlbumOrderBy!], list: ListType): AlbumListPage!
		albumIndex(filter: AlbumFilter): AlbumIndex!
		album(id: String): Album
		episodes(page: Page, filter: EpisodeFilter, orderBy: [EpisodeOrderBy!], list: ListType): EpisodeListPage!
		episode(id: String): Album
		podcasts(page: Page, filter: PodcastFilter, orderBy: [PodcastOrderBy!], list: ListType): PodcastListPage!
		podcast(id: String): Podcast
		radios(page: Page, filter: RadioFilter, orderBy: [RadioOrderBy!], list: ListType): RadioListPage!
		radio(id: String): Radio
		bookmarks(page: Page, filter: BookmarkFilter, orderBy: [BookmarkOrderBy!]): BookmarkListPage!
		nowPlaying: [NowPlaying]!
	}

`;

export function initJamGraphQLRouter(engine: Engine): ApolloServer {
	const resolvers = {
		Query: {
			hello: (): any => 'Hello world!',
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
		}
	};

	return new ApolloServer({
		typeDefs,
		resolvers,
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
				user: req.user as User
			} as any;
		},

	});
}
