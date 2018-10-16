import path from 'path';
import {JamServe} from '../model/jamserve';
import {IO} from '../io/io';
import {BaseStore, Store} from '../store/store';
import {Audio} from '../audio/audio';
import {Images} from '../io/images';
import {DBObjectType, FolderType, FolderTypeImageName} from '../types';
import Logger from '../utils/logger';
import {dirExist, dirRename, fileCopy, fileDeleteIfExists, fileSuffix, makePath, replaceFileSystemChars} from '../utils/fs-utils';
import {IndexTree} from './components/indextree';
import {Metainfo} from './components/metainfo';
import {Users} from './components/users';
import {Chat} from './components/chat';
import {Genres} from './components/genres';
import {Podcasts} from './components/podcasts';
import {NowPlaying} from './components/nowplaying';
import {Jam} from '../model/jam-rest-data-0.1.0';
import {CompressListStream, CompressStream} from '../utils/compress-stream';
import {Transcoder} from '../audio/transcoder';
import {Roots} from './components/roots';
import {Playlists} from './components/playlists';
import {PlayQueues} from './components/playqueues';
import {IApiBinaryResult} from '../typings';
import {Config} from '../config';
import DBObject = JamServe.DBObject;

const log = Logger('Engine');

export class Engine {
	public config: Config;
	public store: Store;
	public audio: Audio;
	public images: Images;
	public io: IO;
	public meta: Metainfo;
	public index: IndexTree;
	public users: Users;
	public roots: Roots;
	public chat: Chat;
	public genres: Genres;
	public playqueues: PlayQueues;
	public podcasts: Podcasts;
	public playlists: Playlists;
	public nowPlaying: NowPlaying;

	constructor(config: Config) {
		this.config = config;
		this.store = new Store(config);
		this.audio = new Audio(config);
		this.images = new Images(config);
		this.chat = new Chat(config);
		this.genres = new Genres(this.store);
		this.nowPlaying = new NowPlaying(this.store);
		this.playlists = new Playlists(this.store);
		this.playqueues = new PlayQueues(this.store);
		this.podcasts = new Podcasts(this.config, this.store, this.audio);
		this.index = new IndexTree(config, this.store);
		this.users = new Users(this.config, this.store, this.images);
		this.meta = new Metainfo(this.store, this.audio);
		this.io = new IO(this.store, this.audio, this.images);
		this.roots = new Roots(this.store, this.io);
	}

	async refresh(): Promise<void> {
		await this.io.refresh();
		await this.refreshIndexes();
	}

	async refreshIndexes(): Promise<void> {
		await this.genres.buildGenres();
		await this.index.buildIndexes();
	}

	async refreshRoot(root: JamServe.Root): Promise<void> {
		await this.io.rescanRoot(root);
		await this.refreshIndexes();
	}

	async getListAvgHighest(type: DBObjectType): Promise<Array<string>> {
		const states = await this.store.state.search({type});
		const ratings: { [id: string]: Array<number> } = {};
		states.forEach(state => {
			if (state.rated !== undefined) {
				ratings[state.destID] = ratings[state.destID] || [];
				ratings[state.destID].push(state.rated);
			}
		});
		const list = Object.keys(ratings).map(key => {
			return {
				id: key,
				avg: ratings[key].reduce((b, c) => (b + c), 0) / ratings[key].length
			};
		}).sort((a, b) => (b.avg - a.avg));
		return list.map(a => a.id);
	}

	async getFilteredListAvgHighest<T extends JamServe.SearchQuery>(type: DBObjectType, query: T, user: JamServe.User, store: BaseStore<DBObject, JamServe.SearchQuery>): Promise<Array<string>> {
		const ids = await this.getListAvgHighest(type);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getListHighestRated(type: DBObjectType, user: JamServe.User): Promise<Array<string>> {
		const states = await this.store.state.search({userID: user.id, type});
		const ratings = states.filter(state => state.rated !== undefined).sort((a, b) => <number>b.rated - <number>a.rated);
		return ratings.map(a => a.destID);
	}

	async getFilteredListHighestRated<T extends JamServe.SearchQuery>(type: DBObjectType, query: T, user: JamServe.User, store: BaseStore<DBObject, JamServe.SearchQuery>): Promise<Array<string>> {
		const ids = await this.getListHighestRated(type, user);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getListFrequentlyPlayed(type: DBObjectType, user: JamServe.User): Promise<Array<string>> {
		const states = await this.store.state.search({userID: user.id, type, isPlayed: true});
		states.sort((a, b) => b.played - a.played);
		return states.map(a => a.destID);
	}

	async getFilteredListFrequentlyPlayed<T extends JamServe.SearchQuery>(type: DBObjectType, query: T, user: JamServe.User, store: BaseStore<DBObject, JamServe.SearchQuery>): Promise<Array<string>> {
		const ids = await this.getListFrequentlyPlayed(type, user);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getListFaved(type: DBObjectType, user: JamServe.User): Promise<Array<string>> {
		const states = await this.store.state.search({userID: user.id, type, isFaved: true});
		states.sort((a, b) => b.lastplayed - a.lastplayed);
		return states.map(a => a.destID);
	}

	async getFilteredListFaved<T extends JamServe.SearchQuery>(type: DBObjectType, query: T, user: JamServe.User, store: BaseStore<DBObject, JamServe.SearchQuery>): Promise<Array<string>> {
		const ids = await this.getListFaved(type, user);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getListRecentlyPlayed(type: DBObjectType, user: JamServe.User): Promise<Array<string>> {
		const states = await this.store.state.search({userID: user.id, type, isPlayed: true});
		states.sort((a, b) => b.lastplayed - a.lastplayed);
		return states.map(a => a.destID);
	}

	async getFilteredListRecentlyPlayed<T extends JamServe.SearchQuery>(type: DBObjectType, query: T, user: JamServe.User, store: BaseStore<DBObject, JamServe.SearchQuery>): Promise<Array<string>> {
		const ids = await this.getListRecentlyPlayed(type, user);
		return await this.getFilteredIDs(ids, query, store);
	}

	async getFilteredIDs<T extends DBObject>(ids: Array<string>, query: JamServe.SearchQuery, store: BaseStore<T, JamServe.SearchQuery>): Promise<Array<string>> {
		const list = await store.searchIDs(Object.assign(query, {ids, amount: -1, offset: 0}));
		return list.sort((a, b) => {
			return ids.indexOf(a) - ids.indexOf(b);
		});
	}

	async getFolderParents(folder: JamServe.Folder): Promise<Array<Jam.FolderParent>> {
		const result = await this.collectFolderPath(folder.parentID);
		return result.map(parent => {
			return {
				id: parent.id,
				name: path.basename(parent.path)
			};
		});
	}

	async trackBookmarkRemove(trackID: string, user: JamServe.User): Promise<void> {
		const bookmark = await this.store.bookmark.searchOne({destID: trackID, userID: user.id});
		if (bookmark) {
			await this.store.bookmark.remove(bookmark.id);
		}
	}

	async trackBookmarkCreate(track: JamServe.Track, user: JamServe.User, position: number, comment: string | undefined): Promise<JamServe.Bookmark> {
		let bookmark = await this.store.bookmark.searchOne({destID: track.id, userID: user.id});
		if (!bookmark) {
			bookmark = {
				id: '',
				type: DBObjectType.bookmark,
				destID: track.id,
				userID: user.id,
				position,
				comment,
				created: Date.now(),
				changed: Date.now()
			};
			bookmark.id = await this.store.bookmark.add(bookmark);
		} else {
			bookmark.comment = comment;
			bookmark.position = position;
			bookmark.changed = Date.now();
			await this.store.bookmark.replace(bookmark);
		}
		return bookmark;
	}

	async collectFolderPath(folderId: string | undefined): Promise<Array<JamServe.Folder>> {
		const result: Array<JamServe.Folder> = [];
		const store = this.store.folder;

		async function collect(id?: string): Promise<void> {
			if (!id) {
				return;
			}
			const folder = await store.byId(id);
			if (folder) {
				result.unshift(folder);
				await collect(folder.parentID);
			}
		}

		await collect(folderId);
		return result;
	}

	async downloadFolderImage(folder: JamServe.Folder, imageUrl: string): Promise<void> {
		folder.tag.image = await this.images.storeImage(folder.path, FolderTypeImageName[folder.tag.type], imageUrl);
		await this.store.folder.replace(folder);
	}

	async setFolderImage(folder: JamServe.Folder, filename: string): Promise<void> {
		const destFileName = FolderTypeImageName[folder.tag.type] + path.extname(filename);
		const destName = path.join(folder.path, destFileName);
		await fileDeleteIfExists(destName);
		await fileCopy(filename, destName);
		folder.tag.image = destFileName;
		await this.store.folder.replace(folder);
	}

	async renameFolder(folder: JamServe.Folder, name: string): Promise<void> {
		name = replaceFileSystemChars(name, '').trim();
		if (name.length === 0) {
			return Promise.reject(Error('Invalid Name'));
		}
		const p = path.dirname(folder.path);
		const dest = path.join(p, name);
		const exists = await dirExist(dest);
		if (exists) {
			return Promise.reject(Error('Directory already exists'));
		}
		await dirRename(folder.path, dest);
		await this.io.applyFolderMove(folder, dest);
	}

	async checkFolderInfoImage(folder: JamServe.Folder): Promise<void> {
		if (folder.tag.image) {
			return;
		}
		if (folder.info && folder.info.album.image && folder.info.album.image.large) {
			await this.downloadFolderImage(folder, folder.info.album.image.large);
		} else if (folder.info && folder.info.artist.image && folder.info.artist.image.large) {
			await this.downloadFolderImage(folder, folder.info.artist.image.large);
		}
	}

	async getFolderImage(folder: JamServe.Folder, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		await this.checkFolderInfoImage(folder);
		if (!folder.tag.image) {
			return;
		}
		return await this.images.get(folder.id, path.join(folder.path, folder.tag.image), size, format);
	}

	async getAlbumImage(album: JamServe.Album, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (album.trackIDs.length === 0) {
			return;
		}
		const track = await this.store.track.byId(album.trackIDs[0]);
		if (!track) {
			return;
		}
		const folder = await this.store.folder.byId(track.parentID);
		if (!folder) {
			return;
		}
		return this.getFolderImage(folder, size, format);
	}

	async getArtistImage(artist: JamServe.Artist, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (artist.trackIDs.length === 0) {
			return;
		}
		const track = await this.store.track.byId(artist.trackIDs[0]);
		if (!track) {
			return;
		}
		const folders = await this.collectFolderPath(track.parentID);
		if (folders.length === 0) {
			return;
		}
		let folder = folders.find(f => f.tag.type === FolderType.artist);
		if (!folder) {
			folder = folders[folders.length - 1];
		}
		if (!folder) {
			return;
		}
		return this.getFolderImage(folder, size, format);
	}

	async getTrackImage(track: JamServe.Track, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		const folder = await this.store.folder.byId(track.parentID);
		if (!folder) {
			return;
		}
		return this.getFolderImage(folder, size, format);
	}

	async getUserImage(user: JamServe.User, size?: number, format?: string): Promise<IApiBinaryResult | undefined> {
		if (user.avatar) {
			return this.images.get(user.id, path.join(this.config.getDataPath(['images']), user.avatar), size, format);
		}
	}

	async getObjImage(o: DBObject, size?: number, format?: string): Promise<IApiBinaryResult> {
		let result: IApiBinaryResult | undefined;
		switch (o.type) {
			case DBObjectType.track:
				const track = <JamServe.Track>o;
				result = await this.getTrackImage(track, size, format);
				break;
			case DBObjectType.folder:
				const folder = <JamServe.Folder>o;
				result = await this.getFolderImage(folder, size, format);
				break;
			case DBObjectType.artist:
				const artist = <JamServe.Artist>o;
				result = await this.getArtistImage(artist, size, format);
				break;
			case DBObjectType.album:
				const album = <JamServe.Album>o;
				result = await this.getAlbumImage(album, size, format);
				break;
			case DBObjectType.user:
				const user = <JamServe.User>o;
				result = await this.getUserImage(user, size, format);
				break;
			default:
				break;
		}
		if (!result) {
			return this.paintImage(o, size, format);
		} else {
			return result;
		}
	}

	async paintImage(obj: DBObject, size?: number, format?: string): Promise<IApiBinaryResult> {
		const getCoverArtText = (o: JamServe.DBObject): string => {
			switch (o.type) {
				case DBObjectType.track:
					const track = <JamServe.Track>o;
					return track.tag && track.tag.title ? track.tag.title : path.basename(track.path);
				case DBObjectType.folder:
					const folder = <JamServe.Folder>o;
					let result: string | undefined;
					if (folder.tag) {
						if (folder.tag.type === FolderType.artist) {
							result = folder.tag.artist;
						} else if ([FolderType.multialbum, FolderType.album].indexOf(folder.tag.type) >= 0) {
							result = folder.tag.album;
						}
					}
					if (!result || result.length === 0) {
						result = path.basename(folder.path);
					}
					return result;
				case DBObjectType.episode:
					const episode: JamServe.Episode = <JamServe.Episode>o;
					let text: string | undefined = episode.tag ? episode.tag.title : undefined;
					if (!text && episode.path) {
						text = path.basename(episode.path);
					}
					if (!text) {
						text = 'podcast';
					}
					return text;
				case DBObjectType.album:
					const album: JamServe.Album = <JamServe.Album>o;
					return album.name;
				case DBObjectType.artist:
					const artist: JamServe.Artist = <JamServe.Artist>o;
					return artist.name;
				case DBObjectType.user:
					const user: JamServe.User = <JamServe.User>o;
					return user.name;
				default:
					return DBObjectType[o.type];
			}
		};
		const s = getCoverArtText(obj);
		return this.images.paint(s, size || 128, format);
	}

	async getObjStream(o: DBObject, format: string | undefined, maxBitRate: number | undefined, user: JamServe.User): Promise<IApiBinaryResult> {

		async function stream(filename: string, media: JamServe.TrackMedia): Promise<IApiBinaryResult> {
			const f = format || 'mp3';
			const bitRate = maxBitRate || 0;
			if (f !== 'raw' && Transcoder.needsTranscoding(media.format || fileSuffix(filename), f, bitRate)) {
				if (!Transcoder.validTranscoding(media, f)) {
					return Promise.reject(Error('Unsupported transcoding format'));
				}
				return {pipe: new Transcoder(filename, f, bitRate, media.duration)};
			} else {
				return {file: {filename, name: o.id + '.' + f}};
			}
		}

		switch (o.type) {
			case DBObjectType.track:
				const track: JamServe.Track = <JamServe.Track>o;
				this.nowPlaying.reportTrack(track, user);
				return stream(path.join(track.path, track.name), track.media);
			case DBObjectType.episode:
				const episode: JamServe.Episode = <JamServe.Episode>o;
				if (episode.path && episode.media) {
					this.nowPlaying.reportEpisode(episode, user);
					return stream(episode.path, episode.media);
				}
				break;
		}
		return Promise.reject(Error('Invalid Object Type for Streaming'));
	}

	async getObjDownload(o: DBObject, format: string | undefined, user: JamServe.User): Promise<IApiBinaryResult> {

		const sendTrackList = (name: string, tracks: Array<JamServe.Track>): IApiBinaryResult => {
			const fileList = tracks.map(t => path.join(t.path, t.name));
			return {pipe: new CompressListStream(fileList, replaceFileSystemChars(name, '_'))};
		};

		switch (o.type) {
			case DBObjectType.track:
				const track = <JamServe.Track>o;
				return {pipe: new CompressListStream([path.join(track.path, track.name)], path.basename(track.name))};
			case DBObjectType.folder:
				const folder = <JamServe.Folder>o;
				return {pipe: new CompressStream(folder.path, path.basename(folder.path))};
			case DBObjectType.artist:
				const artist = <JamServe.Artist>o;
				return sendTrackList(artist.name || 'artist', await this.store.track.byIds(artist.trackIDs));
			case DBObjectType.album:
				const album = <JamServe.Album>o;
				return sendTrackList(album.name || 'album', await this.store.track.byIds(album.trackIDs));
			case DBObjectType.playlist:
				const playlist = <JamServe.Playlist>o;
				if (playlist.userID !== user.id) {
					return Promise.reject(Error('Unauthorized'));
				}
				// TODO: add playlist index file m3u/pls
				return sendTrackList(playlist.name || 'playlist', await this.store.track.byIds(playlist.trackIDs));
		}
		return Promise.reject(Error('Invalid Object Type for Download'));
	}

	private async checkFirstStart(): Promise<void> {
		if (!this.config.firstStart) {
			return;
		}
		if (this.config.firstStart.adminUser) {
			const count = await this.store.user.count();
			if (count === 0) {
				const adminUser = this.config.firstStart.adminUser;
				const user: JamServe.User = {
					id: '',
					name: adminUser.name,
					pass: adminUser.pass || '',
					email: adminUser.mail || '',
					type: DBObjectType.user,
					ldapAuthenticated: true,
					scrobblingEnabled: true,
					created: Date.now(),
					roles: {
						streamRole: true,
						uploadRole: true,
						adminRole: true,
						podcastRole: true,
						// coverArtRole: true,
						// settingsRole: true,
						// downloadRole: true,
						// playlistRole: true,
						// commentRole: true,
						// jukeboxRole: true,
						// videoConversionRole: true,
						// shareRole: true
					}
				};
				await this.store.user.add(user);
			}
		}
		if (this.config.firstStart.roots) {
			const count = await this.store.root.count();
			if (count === 0) {
				const firstStartRoots = this.config.firstStart.roots;
				for (const first of firstStartRoots) {
					const root: JamServe.Root = {
						id: '',
						created: Date.now(),
						type: DBObjectType.root,
						name: first.name,
						path: first.path
					};
					await this.store.root.add(root);
				}
			}
		}
	}

	private async checkDataPaths(): Promise<void> {
		await makePath(path.resolve(this.config.paths.data));
		await makePath(path.resolve(this.config.paths.data, 'cache', 'uploads'));
		await makePath(path.resolve(this.config.paths.data, 'cache', 'images'));
		await makePath(path.resolve(this.config.paths.data, 'images'));
		await makePath(path.resolve(this.config.paths.data, 'session'));
		await makePath(path.resolve(this.config.paths.data, 'podcasts'));
	}

	async start(): Promise<void> {
		// check paths
		await this.checkDataPaths();
		// open store
		await this.store.open();
		// first start?
		await this.checkFirstStart();
	}

	async stop(): Promise<void> {
		await this.store.close();
	}

	async fav(id: string, type: DBObjectType, userID: string, remove: boolean): Promise<JamServe.State> {
		const state = await this.store.state.findOrCreate(id, userID, type);
		if (remove) {
			if (state.faved === undefined) {
				return state;
			}
			state.faved = undefined;
		} else {
			if (state.faved !== undefined) {
				return state;
			}
			state.faved = Date.now();
		}
		if (state.id.length === 0) {
			await this.store.state.add(state);
		} else {
			await this.store.state.replace(state);
		}
		return state;
	}

	async rate(id: string, type: DBObjectType, userID: string, rating: number): Promise<JamServe.State> {
		const state = await this.store.state.findOrCreate(id, userID, type);
		if (rating === 0) {
			state.rated = undefined;
		} else {
			state.rated = rating;
		}
		if (state.id.length === 0) {
			await this.store.state.add(state);
		} else {
			await this.store.state.replace(state);
		}
		return state;
	}

}

