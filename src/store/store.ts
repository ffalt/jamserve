import {JamServe} from '../model/jamserve';
import {DatabaseQuerySortType, DBObjectType} from '../types';
import {DBElastic} from './elasticsearch/db-elastic';
import {DBNedb} from './nedb/db-nedb';
import {Md5} from 'md5-typescript';
import {hexDecode} from '../utils/hex';
import {Config} from '../config';
import DatabaseQuery = JamServe.DatabaseQuery;

export abstract class BaseStore<T extends JamServe.DBObject, X extends JamServe.SearchQuery> {
	protected group: JamServe.DatabaseIndex<T>;
	type: DBObjectType | undefined;

	protected constructor(type: DBObjectType | undefined, db: JamServe.Database) {
		this.group = db.getDBIndex<T>(type);
		this.type = type;
	}

	protected abstract transformQuery(query: X): JamServe.DatabaseQuery;

	async add(item: T): Promise<string> {
		return await this.group.add(item);
	}

	async replace(item: T): Promise<void> {
		return await this.group.replace(item.id, item);
	}

	async remove(idOrIds: string | Array<string>): Promise<void> {
		return await this.group.remove(idOrIds);
	}

	async replaceMany(items: Array<T>): Promise<void> {
		for (const item of items) {
			await this.group.replace(item.id, item);
		}
	}

	async byId(id: string): Promise<T | undefined> {
		return await this.group.byId(id);
	}

	async byIds(ids: Array<string>): Promise<Array<T>> {
		return await this.group.byIds(ids);
	}

	async all(): Promise<Array<T>> {
		return await this.group.query({all: true});
	}

	async async(): Promise<Array<string>> {
		return await this.group.queryIds({all: true});
	}

	async count(): Promise<number> {
		return await this.group.count({all: true});
	}

	async iterate(onItems: (items: Array<T>) => Promise<void>): Promise<void> {
		await this.group.iterate({all: true}, onItems);
	}

	async upsert(items: Array<T>): Promise<void> {
		for (const item of items) {
			await this.group.upsert(item.id, item);
		}
	}

	async removeByQuery(query: X): Promise<number> {
		return await this.group.removeByQuery(this.transformQuery(query));
	}

	async searchIDs(query: X): Promise<Array<string>> {
		return await this.group.queryIds(this.transformQuery(query));
	}

	async search(query: X): Promise<Array<T>> {
		return await this.group.query(this.transformQuery(query));
	}

	async searchOne(query: X): Promise<T | undefined> {
		return await this.group.queryOne(this.transformQuery(query));
	}

	async searchCount(query: X): Promise<number> {
		return await this.group.count(this.transformQuery(query));
	}

}

class QueryHelper {
	private q: DatabaseQuery = {};

	term(field: string, value: string | number | boolean | undefined) {
		if (value !== undefined && value !== null) {
			this.q.term = this.q.term || {};
			this.q.term[field] = value;
		}
	}

	match(field: string, value: string | undefined) {
		if (value !== undefined && value !== null) {
			this.q.match = this.q.match || {};
			this.q.match[field] = value;
		}
	}

	startsWith(field: string, value: string | undefined) {
		if (value !== undefined && value !== null) {
			this.q.startsWith = this.q.startsWith || {};
			this.q.startsWith[field] = value;
		}
	}

	startsWiths(field: string, value: Array<string> | undefined) {
		if (value !== undefined && value !== null) {
			this.q.startsWiths = this.q.startsWiths || {};
			this.q.startsWiths[field] = value;
		}
	}

	terms(field: string, value: Array<string | number | boolean> | undefined) {
		if (value !== undefined && value !== null) {
			this.q.terms = this.q.terms || {};
			this.q.terms[field] = value;
		}
	}

	true(field: string, value: boolean | undefined) {
		if (value !== undefined && value !== null) {
			this.q.term = this.q.term || {};
			this.q.term[field] = true;
		}
	}

	notNull(field: string, value: boolean | undefined) {
		if (value !== undefined && value !== null) {
			this.q.notNull = this.q.notNull || [];
			this.q.notNull.push(field);
		}
	}

	range(field: string, lte: number | undefined, gte: number | undefined) {
		if (lte !== undefined || gte !== undefined) {
			this.q.range = this.q.range || {};
			this.q.range[field] = {gte, lte};
		}
	}

	get(query: JamServe.SearchQuery, fieldMap?: { [name: string]: string }): JamServe.DatabaseQuery {
		if (Object.keys(this.q).length === 0) {
			this.q.all = true;
		}
		if (query.sorts) {
			const sorts: JamServe.DatabaseQuerySort = {};
			query.sorts.forEach(sort => {
				const field = fieldMap ? fieldMap[sort.field] : sort.field;
				if (field) {
					sorts[field] = sort.descending ? DatabaseQuerySortType.descending : DatabaseQuerySortType.ascending;
				}
			});
			this.q.sort = sorts;
		}
		if (query.amount !== undefined && query.amount > 0) {
			this.q.amount = query.amount;
		}
		if (query.offset !== undefined && query.offset > 0) {
			this.q.offset = query.offset;
		}
		return this.q;
	}
}

class StoreUser extends BaseStore<JamServe.User, JamServe.SearchQueryUser> {

	constructor(db: JamServe.Database) {
		super(DBObjectType.user, db);
	}

	protected transformQuery(query: JamServe.SearchQueryUser): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.terms('id', query.ids);
		q.term('name', query.name);
		q.true('roles.adminRole', query.isAdmin);
		return q.get(query);
	}

	async add(user: JamServe.User): Promise<string> {
		if (user.pass.indexOf('enc:') === 0) {
			user.pass = hexDecode(user.pass);
		}
		return await this.group.add(user);
	}

	async replace(user: JamServe.User): Promise<void> {
		if (user.pass.indexOf('enc:') === 0) {
			user.pass = hexDecode(user.pass);
		}
		return await this.group.replace(user.id, user);
	}

	async authToken(name: string, token: string, salt: string): Promise<JamServe.User> {
		if ((!name) || (!name.length)) {
			return Promise.reject(Error('Invalid Username'));
		}
		if ((!token) || (!token.length)) {
			return Promise.reject(Error('Invalid Token'));
		}
		const user = await this.group.queryOne({term: {'name': name}});
		if (!user) {
			return Promise.reject(Error('Invalid Username'));
		}
		const t = Md5.init(user.pass + salt);
		if (token !== t) {
			return Promise.reject(Error('Invalid Token'));
		}
		return user;
	}

	async auth(name: string, pass: string): Promise<JamServe.User> {
		if ((!name) || (!name.length)) {
			return Promise.reject(Error('Invalid Username'));
		}
		if ((!pass) || (!pass.length)) {
			return Promise.reject(Error('Invalid Password'));
		}
		const user = await this.group.queryOne({term: {'name': name}});
		if (!user) {
			return Promise.reject(Error('Invalid Username'));
		}
		if (pass.indexOf('enc:') === 0) {
			pass = hexDecode(pass.slice(4)).trim();
		}
		if (pass !== user.pass) {
			return Promise.reject(Error('Invalid Password'));
		}
		return user;
	}

	async get(name: string): Promise<JamServe.User | undefined> {
		return await this.group.queryOne({term: {'name': name || ''}});
	}

}

class StoreState extends BaseStore<JamServe.State, JamServe.SearchQueryState> {

	constructor(db: JamServe.Database) {
		super(DBObjectType.state, db);
	}

	protected transformQuery(query: JamServe.SearchQueryState): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.term('userID', query.userID);
		q.term('destID', query.destID);
		q.terms('destID', query.destIDs);
		q.term('destType', query.type);
		q.notNull('faved', query.isFaved);
		q.range('played', undefined, query.isPlayed ? 1 : undefined);
		return q.get(query);
	}

	private emptyState(destID: string, destType: DBObjectType, userID: string): JamServe.State {
		return {
			id: '',
			type: DBObjectType.state,
			destID,
			destType,
			played: 0,
			lastplayed: 0,
			faved: undefined,
			rated: 0,
			userID
		};
	}

	async findOrCreate(destID: string, userID: string, type: DBObjectType): Promise<JamServe.State> {
		const state = await this.searchOne({userID, destID, type});
		return state || this.emptyState(destID, type, userID);
	}

	async findOrCreateMulti(destIDs: Array<string>, userID: string, type: DBObjectType): Promise<JamServe.States> {
		if (!destIDs || destIDs.length === 0) {
			return {};
		}
		const list = await this.search({userID, type, destIDs});
		const result: { [id: string]: JamServe.State } = {};
		list.forEach((state) => {
			result[state.destID] = state;
		});
		destIDs.forEach((id) => {
			if (!result[id]) {
				result[id] = this.emptyState(id, type, userID);
			}
		});
		return result;
	}

}

class StorePlaylist extends BaseStore<JamServe.Playlist, JamServe.SearchQueryPlaylist> {

	constructor(db: JamServe.Database) {
		super(DBObjectType.playlist, db);
	}

	protected transformQuery(query: JamServe.SearchQueryPlaylist): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.term('trackIDs', query.trackID);
		q.terms('trackIDs', query.trackIDs);
		q.term('userID', query.userID);
		q.term('name', query.name);
		q.true('isPublic', query.isPublic);
		return q.get(query);
	}

}

class StorePodcasts extends BaseStore<JamServe.Podcast, JamServe.SearchQueryPodcast> {

	constructor(db: JamServe.Database) {
		super(DBObjectType.podcast, db);
	}

	protected transformQuery(query: JamServe.SearchQueryPodcast): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.term('url', query.url);
		q.term('title', query.title);
		q.term('status', query.status);
		return q.get(query);
	}

}

class StoreEpisodes extends BaseStore<JamServe.Episode, JamServe.SearchQueryPodcastEpisode> {
	fieldMap: { [name: string]: string } = {
		'podcastIDs': 'podcastID',
		'podcastID': 'podcastID',
		'status': 'status',
		'title': 'tag.title',
		'created': 'stat.created'
	};

	constructor(db: JamServe.Database) {
		super(DBObjectType.episode, db);
	}

	protected transformQuery(query: JamServe.SearchQueryPodcastEpisode): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.terms('podcastID', query.podcastIDs);
		q.term('podcastID', query.podcastID);
		q.term('status', query.status);
		q.term('tag.title', query.title);
		return q.get(query, this.fieldMap);
	}

}

class StoreBookmarks extends BaseStore<JamServe.Bookmark, JamServe.SearchQueryBookmark> {

	constructor(db: JamServe.Database) {
		super(DBObjectType.bookmark, db);
	}

	protected transformQuery(query: JamServe.SearchQueryBookmark): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.term('userID', query.userID);
		q.term('destID', query.destID);
		q.terms('destID', query.destIDs);
		return q.get(query);
	}

}

class StoreRoot extends BaseStore<JamServe.Root, JamServe.SearchQueryRoot> {

	constructor(db: JamServe.Database) {
		super(DBObjectType.root, db);
	}

	protected transformQuery(query: JamServe.SearchQueryRoot): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.term('name', query.name);
		q.term('path', query.path);
		return q.get(query);
	}

}

class StorePlayQueue extends BaseStore<JamServe.PlayQueue, JamServe.SearchQueryPlayQueue> {

	constructor(db: JamServe.Database) {
		super(DBObjectType.playqueue, db);
	}

	protected transformQuery(query: JamServe.SearchQueryPlayQueue): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.term('userID', query.userID);
		return q.get(query);
	}

}

class StoreRadio extends BaseStore<JamServe.Radio, JamServe.SearchQueryRadio> {

	constructor(db: JamServe.Database) {
		super(DBObjectType.radio, db);
	}

	protected transformQuery(query: JamServe.SearchQueryRadio): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.term('url', query.url);
		q.term('name', query.name);
		return q.get(query);
	}
}

class StoreTrack extends BaseStore<JamServe.Track, JamServe.SearchQueryTrack> {
	fieldMap: { [name: string]: string } = {
		'path': 'path',
		'parentID': 'parentID',
		'parentIDs': 'parentID',
		'rootID': 'rootID',
		'artistID': 'artistID',
		'artist': 'tag.artist',
		'mbTrackID': 'tag.mbTrackID',
		'title': 'tag.title',
		'album': 'tag.album',
		'year': 'tag.year',
		'genre': 'tag.genre',
		'created': 'stat.created'
	};

	constructor(db: JamServe.Database) {
		super(DBObjectType.track, db);
	}

	protected transformQuery(query: JamServe.SearchQueryTrack): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.terms('id', query.ids);
		q.terms('parentID', query.parentIDs);
		q.term('path', query.path);
		q.startsWiths('path', query.inPaths);
		q.startsWith('path', query.inPath);
		q.term('tag.genre', query.genre);
		q.term('rootID', query.rootID);
		q.term('parentID', query.parentID);
		q.term('tag.mbTrackID', query.mbTrackID);
		q.terms('tag.mbTrackID', query.mbTrackIDs);
		q.term('tag.artist', query.artist);
		q.term('tag.title', query.title);
		q.match('tag.title', query.query);
		q.term('tag.album', query.album);
		q.term('artistID', query.artistID);
		q.range('tag.year', query.toYear, query.fromYear);
		q.range('stat.created', undefined, query.newerThan);
		return q.get(query, this.fieldMap);
	}

	async genres(): Promise<Array<string>> {
		return await this.group.distinct('tag.genre');
	}

}

class StoreFolder extends BaseStore<JamServe.Folder, JamServe.SearchQueryFolder> {
	fieldMap: { [name: string]: string } = {
		'parentID': 'parent',
		'rootID': 'rootID',
		'artist': 'tag.artist',
		'title': 'tag.title',
		'type': 'tag.type',
		'year': 'tag.year',
		'created': 'stat.created',
		'album': 'tag.album',
		'path': 'path',
		'level': 'tag.level',
		'genre': 'tag.genre'
	};

	constructor(db: JamServe.Database) {
		super(DBObjectType.folder, db);
	}

	protected transformQuery(query: JamServe.SearchQueryFolder): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.term('path', query.path);
		q.terms('id', query.ids);
		q.startsWith('path', query.inPath);
		q.term('tag.mbAlbumID', query.mbAlbumID);
		q.term('tag.mbArtistID', query.mbArtistID);
		q.term('tag.genre', query.genre);
		q.term('tag.title', query.title);
		q.term('tag.album', query.album);
		q.term('rootID', query.rootID);
		q.term('parentID', query.parentID);
		q.term('tag.level', query.level);
		q.term('tag.artist', query.artist);
		q.terms('tag.artist', query.artists);
		q.terms('tag.type', query.types);
		q.range('tag.year', query.toYear, query.fromYear);
		q.range('stat.created', undefined, query.newerThan);
		q.match('tag.title', query.query);
		return q.get(query, this.fieldMap);
	}

}

class StoreArtist extends BaseStore<JamServe.Artist, JamServe.SearchQueryArtist> {

	constructor(db: JamServe.Database) {
		super(DBObjectType.artist, db);
	}

	protected transformQuery(query: JamServe.SearchQueryArtist): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.terms('id', query.ids);
		q.terms('trackIDs', query.trackIDs);
		q.terms('name', query.names);
		q.term('rootIDs', query.rootID);
		q.term('albumIDs', query.albumID);
		q.term('trackIDs', query.trackID);
		q.term('name', query.name);
		q.term('genre', query.genre);
		q.term('mbArtistID', query.mbArtistID);
		q.range('year', query.toYear, query.fromYear);
		q.range('created', undefined, query.newerThan);
		q.match('name', query.query);
		return q.get(query);
	}

}

class StoreAlbum extends BaseStore<JamServe.Album, JamServe.SearchQueryAlbum> {

	constructor(db: JamServe.Database) {
		super(DBObjectType.album, db);
	}

	protected transformQuery(query: JamServe.SearchQueryAlbum): JamServe.DatabaseQuery {
		const q = new QueryHelper();
		q.term('rootIDs', query.rootID);
		q.term('artistID', query.artistID);
		q.term('genre', query.genre);
		q.term('mbAlbumID', query.mbAlbumID);
		q.term('mbArtistID', query.mbArtistID);
		q.term('trackIDs', query.trackID);
		q.terms('trackIDs', query.trackIDs);
		q.term('artist', query.artist);
		q.term('name', query.name);
		q.range('year', query.toYear, query.fromYear);
		q.range('created', undefined, query.newerThan);
		q.terms('id', query.ids);
		q.match('name', query.query);
		return q.get(query);
	}

}

export class Store {
	public config: Config;
	public db: JamServe.Database;
	public track: StoreTrack;
	public folder: StoreFolder;
	public user: StoreUser;
	public state: StoreState;
	public playlist: StorePlaylist;
	public podcast: StorePodcasts;
	public episode: StoreEpisodes;
	public bookmark: StoreBookmarks;
	public root: StoreRoot;
	public artist: StoreArtist;
	public album: StoreAlbum;
	public playqueue: StorePlayQueue;
	public radio: StoreRadio;

	constructor(config: Config) {
		this.config = config;
		if (this.config.database.use === 'elasticsearch') {
			this.db = new DBElastic(config);
		} else {
			this.db = new DBNedb(config);
		}
		this.track = new StoreTrack(this.db);
		this.folder = new StoreFolder(this.db);
		this.user = new StoreUser(this.db);
		this.state = new StoreState(this.db);
		this.playlist = new StorePlaylist(this.db);
		this.podcast = new StorePodcasts(this.db);
		this.episode = new StoreEpisodes(this.db);
		this.bookmark = new StoreBookmarks(this.db);
		this.artist = new StoreArtist(this.db);
		this.album = new StoreAlbum(this.db);
		this.playqueue = new StorePlayQueue(this.db);
		this.radio = new StoreRadio(this.db);
		this.root = new StoreRoot(this.db);
	}

	async reset(): Promise<void> {
		await this.db.reset();
	}

	async check(): Promise<void> {
		await this.db.check();
	}

	async open(): Promise<void> {
		await this.db.open();
	}

	async close(): Promise<void> {
		await this.db.close();
	}

	async findInAll(id: string): Promise<JamServe.DBObject | undefined> {
		const stores: Array<BaseStore<JamServe.DBObject, JamServe.SearchQuery>> =
			[this.folder, this.track, this.album, this.artist, this.podcast, this.episode, this.playlist, this.artist, this.album, this.radio, this.user];
		for (const store of stores) {
			const obj = await store.byId(id);
			if (obj) {
				return obj;
			}
		}
	}

	async findMultiInAll(ids: Array<string>): Promise<Array<JamServe.DBObject>> {
		let result: Array<JamServe.DBObject> = [];
		const stores: Array<BaseStore<JamServe.DBObject, JamServe.SearchQuery>> =
			[this.folder, this.track, this.album, this.artist, this.podcast, this.episode, this.playlist, this.artist, this.album, this.radio, this.user];
		for (const store of stores) {
			const objs = await store.byIds(ids);
			result = result.concat(objs);
		}
		return result;
	}

}
