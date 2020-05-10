import {Engine} from '../../engine/engine';
import {ApolloServer, AuthenticationError, gql} from 'apollo-server-express';
import {Album} from '../../engine/album/album.model';
import {Track} from '../../engine/track/track.model';
import {ListResult} from '../../engine/base/list-result';
import {Artist} from '../../engine/artist/artist.model';
import {Series} from '../../engine/series/series.model';
import {Root} from '../../engine/root/root.model';
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

interface Page {
	offset?: number;
	amount?: number;
}

interface Dtime {
	iso: string;
	timestamp: number;
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

interface PageResult<T> {
	offset: number;
	total: number;
	more: boolean;
	amount?: number;
	items: Array<T>;
}

const typeDefs = gql`

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

	enum FolderType {
		unknown
		artist
		collection
		album
		multialbum
		extras
	}

	enum RootScanStrategy {
		auto
		artistalbum
		compilation
		audiobook
	}

	enum PodcastStatus {
		new
		downloading
		completed
		error
		deleted
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

	type Root {
		id: String!
		name: String!
		path: String!
		created: Datetime!
		strategy: RootScanStrategy!
	}

	type FolderStat {
		created: Datetime!
		modified: Datetime!
	}

	type FileStats {
		created: Datetime!
		modified: Datetime!
		size: Float!
	}

	type ArtworkImage {
		width: Int
		height: Int
		format: String
	}

	type Artwork {
		id: String!
		name: String!
		types: [String!]!
		image: ArtworkImage
		stat: FileStats
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
		artworks: [Artwork!]
	}

	type Folder {
		path: String!
		stat: FolderStat!
		tag: FolderTag!

		rootID: String!
		parentID: String

		root: Root!
		parent: Folder
		folders(page: Page): FolderListPage!
		tracks(page: Page): TrackListPage!
		state: State
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
		id: String!
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
		bookmarks: [Bookmark]
		state: State
	}

	type Album {
		id: String!
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

		seriesName: String
		series: Series
		artistName: String
		artist: Artist!
		tracks(page: Page): TrackListPage!
		folders(page: Page): FolderListPage!
		roots(page: Page): RootListPage!
		state: State
	}

	type Artist {
		id: String!
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

		tracks(page: Page): TrackListPage!
		folders(page: Page): FolderListPage!
		albums(page: Page): AlbumListPage!
		series(page: Page): SeriesListPage!
		roots(page: Page): RootListPage!
		state: State
	}

	type Series {
		id: String!
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
		folders(page: Page): FolderListPage!
		tracks(page: Page): TrackListPage!
		albums(page: Page): AlbumListPage!
		roots(page: Page): RootListPage!
		state: State
	}

	type State {
		played: Int
		lastPlayed: Datetime
		faved: Datetime
		rated: Int
	}

	type Bookmark {
		destID: String!
		comment: String
		created: Datetime!
		changed: Datetime!
		position: Float!
		track: Track
	}

	type PodcastEpisodeChapter {
		start: Float!
		title: String!
	}

	type PodcastEpisodeEnclosure {
		url: String
		type: String
		length: Float
	}

	type Episode  {
		id: String!
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
		chapters: [PodcastEpisodeChapter!]
		enclosures: [PodcastEpisodeEnclosure!]
		stat: FileStats
		tag: TrackTag
		media: TrackMedia
		podcast: Podcast
		state: State
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
		id: String!
		name: String
		url: String!
		created: Datetime!
		lastCheck: Datetime!
		status: PodcastStatus
		image: String
		errorMessage: String
		tag: PodcastTag
		episodes(page: Page): EpisodeListPage!
		state: State
	}

	type Radio  {
		name: String!
		url:String!
		homepage: String
		disabled: Boolean
		created: Datetime!
		changed: Datetime
		state: State
	}

	type RootListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Root!]!
	}

	type EpisodeListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Episode!]!
	}

	type AlbumListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Album!]!
	}

	type TrackListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Track!]!
	}

	type SeriesListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Series!]!
	}

	type ArtistListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Artist!]!
	}

	type FolderListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Folder!]!
	}

	type BookmarkListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Bookmark!]!
	}

	type PodcastListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Podcast!]!
	}

	type RadioListPage {
		total: Int!
		offset: Int!
		amount: Int!
		more: Boolean!
		items: [Radio!]!
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

	input RadioFilter {
		id: String
		ids: [String!]
		query: String
		name: String
		url: String
		homepage: String
	}

	input BookmarkFilter {
		id: String
		ids: [String!]
		query: String
		position: Float
		destID: String
		destIDs: [String!]
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

	input RootFilter {
		id: String
		ids: [String!]
		query: String
		name: String
		path: String
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

	input PodcastFilter {
		id: String
		ids: [String!]
		query: String
		url: String
		title: String
		status: String
		newerThan: Float
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

	enum RootOrderByField {
		name
		created
	}
	input RootOrderBy {
		field: RootOrderByField
		direction: SortDirection
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

	enum ArtistOrderByField {
		name
		created
	}
	input ArtistOrderBy {
		field: ArtistOrderByField
		direction: SortDirection
	}

	enum SeriesOrderByField {
		name
		created
	}
	input SeriesOrderBy {
		field: SeriesOrderByField
		direction: SortDirection
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

	enum PodcastOrderByField {
		title
		created
	}
	input PodcastOrderBy {
		field: PodcastOrderByField
		direction: SortDirection
	}

	enum RadioOrderByField {
		name
		created
	}
	input RadioOrderBy {
		field: RadioOrderByField
		direction: SortDirection
	}

	enum BookmarkOrderByField {
		position
		created
	}
	input BookmarkOrderBy {
		field: BookmarkOrderByField
		direction: SortDirection
	}

	type Query {
		hello: String
		roots(page: Page, filter: RootFilter, orderBy: [RootOrderBy!]): RootListPage!
		root(id: String): Root
		tracks(page: Page, filter: TrackFilter, orderBy: [TrackOrderBy!]): TrackListPage!
		track(id: String): Track
		artists(page: Page, filter: ArtistFilter, orderBy: [ArtistOrderBy!]): ArtistListPage!
		artist(id: String): Artist!
		series(page: Page, filter: SeriesFilter, orderBy: [SeriesOrderBy!]): SeriesListPage!
		serie(id: String): Series
		albums(page: Page, filter: AlbumFilter, orderBy: [AlbumOrderBy!]): AlbumListPage!
		album(id: String): Album
		episodes(page: Page, filter: EpisodeFilter, orderBy: [EpisodeOrderBy!]): EpisodeListPage!
		episode(id: String): Album
		podcasts(page: Page, filter: PodcastFilter, orderBy: [PodcastOrderBy!]): PodcastListPage!
		podcast(id: String): Podcast
		radios(page: Page, filter: RadioFilter, orderBy: [RadioOrderBy!]): RadioListPage!
		radio(id: String): Radio
		bookmarks(page: Page, filter: BookmarkFilter, orderBy: [BookmarkOrderBy!]): BookmarkListPage!
	}

`;

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

function emptyPackage(): PageResult<any> {
	return {
		amount: 0,
		total: 0,
		more: false,
		offset: 0,
		items: []
	};
}

export function initJamGraphQLRouter(engine: Engine): ApolloServer {

// Provide resolver functions for your schema fields
	const resolvers = {
		Query: {
			hello: (): any => 'Hello world!',
			roots: async (obj: any, args: { page?: Page; filter?: SearchQueryRoot }): Promise<PageResult<Root>> => {
				const {page, filter} = args;
				return packPage(await engine.rootService.rootStore.search(
					{amount: page?.amount || 20, offset: page?.offset || 0, ...filter}
				));
			},
			root: async (obj: any, args: { id?: string }): Promise<Root | undefined> => {
				return args.id ? await engine.rootService.rootStore.byId(args.id) : undefined;
			},

			tracks: async (obj: any, args: { page?: Page; filter?: SearchQueryTrack }): Promise<PageResult<Track>> => {
				const {page, filter} = args;
				return packPage(await engine.trackService.trackStore.search(
					{amount: page?.amount || 20, offset: page?.offset || 0, ...filter}
				));
			},
			track: async (obj: any, args: { id?: string }): Promise<Track | undefined> => {
				return args.id ? await engine.trackService.trackStore.byId(args.id) : undefined;
			},

			radios: async (obj: any, args: { page?: Page; filter?: SearchQueryRadio }): Promise<PageResult<Radio>> => {
				const {page, filter} = args;
				return packPage(await engine.radioService.radioStore.search(
					{amount: page?.amount || 20, offset: page?.offset || 0, ...filter}
				));
			},
			radio: async (obj: any, args: { id?: string }): Promise<Radio | undefined> => {
				return args.id ? await engine.radioService.radioStore.byId(args.id) : undefined;
			},

			artists: async (obj: any, args: { page?: Page; filter?: SearchQueryArtist }): Promise<PageResult<Artist>> => {
				const {page, filter} = args;
				return packPage(await engine.artistService.artistStore.search(
					{amount: page?.amount || 20, offset: page?.offset || 0, ...filter}
				));
			},
			artist: async (obj: any, args: { id?: string }): Promise<Artist | undefined> => {
				return args.id ? await engine.artistService.artistStore.byId(args.id) : undefined;
			},

			series: async (obj: any, args: { page?: Page; filter?: SearchQuerySeries }): Promise<PageResult<Series>> => {
				const {page, filter} = args;
				return packPage(await engine.seriesService.seriesStore.search(
					{amount: page?.amount || 20, offset: page?.offset || 0, ...filter}
				));
			},
			serie: async (obj: any, args: { id?: string }): Promise<Series | undefined> => {
				return args.id ? await engine.seriesService.seriesStore.byId(args.id) : undefined;
			},

			albums: async (obj: any, args: { page?: Page; filter?: SearchQueryAlbum }): Promise<PageResult<Album>> => {
				const {page, filter} = args;
				return packPage(await engine.albumService.albumStore.search(
					{amount: page?.amount || 20, offset: page?.offset || 0, ...filter}
				));
			},
			album: async (obj: any, args: { id?: string }): Promise<Album | undefined> => {
				return args.id ? await engine.albumService.albumStore.byId(args.id) : undefined;
			},

			podcasts: async (obj: any, args: { page?: Page; filter?: SearchQueryPodcast }): Promise<PageResult<Podcast>> => {
				const {page, filter} = args;
				return packPage(await engine.podcastService.podcastStore.search(
					{amount: page?.amount || 20, offset: page?.offset || 0, ...filter}
				));
			},
			podcast: async (obj: any, args: { id?: string }): Promise<Podcast | undefined> => {
				return args.id ? await engine.podcastService.podcastStore.byId(args.id) : undefined;
			},

			episodes: async (obj: any, args: { page?: Page; filter?: SearchQueryEpisode }): Promise<PageResult<Episode>> => {
				const {page, filter} = args;
				return packPage(await engine.episodeService.episodeStore.search(
					{amount: page?.amount || 20, offset: page?.offset || 0, ...filter}
				));
			},
			episode: async (obj: any, args: { id?: string }): Promise<Episode | undefined> => {
				return args.id ? await engine.episodeService.episodeStore.byId(args.id) : undefined;
			},

			bookmarks: async (obj: any, args: { page?: Page; filter?: SearchQueryBookmark }, context: { user: User }): Promise<PageResult<Bookmark>> => {
				const {page, filter} = args;
				const {user} = context;
				if (!user) {
					return emptyPackage();
				}
				return packPage(await engine.bookmarkService.bookmarkStore.search(
					{userID: user.id, amount: page?.amount || 20, offset: page?.offset || 0, ...filter}
				));
			}
		},
		Podcast: {
			created: async (obj: Podcast): Promise<Dtime | undefined> => packDtime(obj.created),
			lastCheck: async (obj: Podcast): Promise<Dtime | undefined> => packDtime(obj.lastCheck),
			name: async (obj: Podcast): Promise<string> => {
				return obj.tag ? obj.tag.title : obj.url;
			},
			episodes: async (obj: Podcast, args: { page?: Page }): Promise<PageResult<Episode>> => {
				const {page} = args;
				return packPage(await engine.episodeService.episodeStore.search(
					{podcastID: obj.id, amount: page?.amount || 20, offset: page?.offset || 0}
				));
			},
			state: async (obj: Podcast, args: any, context: { user: User }): Promise<State> => {
				const {user} = context;
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
			state: async (obj: Episode, args: any, context: { user: User }): Promise<State> => {
				const {user} = context;
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.episode);
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
			bookmarks: async (obj: Track, args: any, context: { user: User }): Promise<PageResult<Bookmark>> => {
				const {user} = context;
				if (!user) {
					return emptyPackage();
				}
				return packPage(await engine.bookmarkService.bookmarkStore.search(
					{userID: user.id, destID: obj.id}
				));
			},
			state: async (obj: Track, args: any, context: { user: User }): Promise<State> => {
				const {user} = context;
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.track);
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
			folders: async (obj: Folder, args: { page?: Page }): Promise<PageResult<Folder>> => {
				const {page} = args;
				return packPage(await engine.folderService.folderStore.search(
					{parentID: obj.id, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			tracks: async (obj: Folder, args: { page?: Page }): Promise<PageResult<Track>> => {
				const {page} = args;
				return packPage(await engine.trackService.trackStore.search(
					{parentID: obj.id, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			state: async (obj: Folder, args: any, context: { user: User }): Promise<State> => {
				const {user} = context;
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.folder);
			}
		},
		Artist: {
			created: async (obj: Artist): Promise<Dtime | undefined> => packDtime(obj.created),
			roots: async (obj: Artist, args: { page?: Page }): Promise<PageResult<Root>> => {
				const {page} = args;
				return packPage(await engine.rootService.rootStore.search(
					{ids: obj.rootIDs, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			tracks: async (obj: Artist, args: { page?: Page }): Promise<PageResult<Track>> => {
				const {page} = args;
				return packPage(await engine.trackService.trackStore.search(
					{artistID: obj.id, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			folders: async (obj: Artist, args: { page?: Page }): Promise<PageResult<Folder>> => {
				const {page} = args;
				return packPage(await engine.folderService.folderStore.search(
					{ids: obj.folderIDs, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			albums: async (obj: Artist, args: { page?: Page }): Promise<PageResult<Album>> => {
				const {page} = args;
				return packPage(await engine.albumService.albumStore.search(
					{artistID: obj.id, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			series: async (obj: Artist, args: { page?: Page }): Promise<PageResult<Series>> => {
				const {page} = args;
				return packPage(await engine.seriesService.seriesStore.search(
					{artistID: obj.id, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			state: async (obj: Artist, args: any, context: { user: User }): Promise<State> => {
				const {user} = context;
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.artist);
			}
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
			roots: async (obj: Album, args: { page?: Page }): Promise<PageResult<Root>> => {
				const {page} = args;
				return packPage(await engine.rootService.rootStore.search(
					{ids: obj.rootIDs, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			series: async (obj: Album): Promise<Series | undefined> => {
				return obj.seriesID ? await engine.seriesService.seriesStore.byId(obj.seriesID) : undefined;
			},
			folders: async (obj: Album, args: { page?: Page }): Promise<PageResult<Folder>> => {
				const {page} = args;
				return packPage(await engine.folderService.folderStore.search(
					{ids: obj.folderIDs, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			tracks: async (obj: Album, args: { page?: Page }): Promise<any> => {
				const {page} = args;
				return packPage(await engine.trackService.trackStore.search(
					{albumID: obj.id, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			state: async (obj: Album, args: any, context: { user: User }): Promise<State> => {
				const {user} = context;
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.album);
			}
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
			roots: async (obj: Series, args: { page?: Page }): Promise<PageResult<Root>> => {
				const {page} = args;
				return packPage(await engine.rootService.rootStore.search(
					{ids: obj.rootIDs, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			albums: async (obj: Series, args: { page?: Page }): Promise<PageResult<Album>> => {
				const {page} = args;
				return packPage(await engine.albumService.albumStore.search(
					{artistID: obj.id, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			folders: async (obj: Series, args: { page?: Page }): Promise<PageResult<Folder>> => {
				const {page} = args;
				return packPage(await engine.folderService.folderStore.search(
					{ids: obj.folderIDs, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			tracks: async (obj: Series, args: { page?: Page }): Promise<any> => {
				const {page} = args;
				return packPage(await engine.trackService.trackStore.search(
					{albumID: obj.id, amount: page?.amount, offset: page?.offset || 0}
				));
			},
			state: async (obj: Series, args: any, context: { user: User }): Promise<State> => {
				const {user} = context;
				return await engine.stateService.findOrCreate(obj.id, user.id, DBObjectType.series);
			}
		}
	};

	const server = new ApolloServer({
		typeDefs,
		resolvers,
		playground: {
			settings: {
				// 'request.credentials': 'same-origin'
				'request.credentials': 'include',
			}
		},
		context: async ({req, res}): Promise<any> => {
			if (!req.user) throw new AuthenticationError('you must be logged in');
			return {
				req, res,
				user: req.user
			};
		},

	});
	return server;
}
