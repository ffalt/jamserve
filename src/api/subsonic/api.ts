import {IApiBinaryResult} from '../../typings';
import {Engine} from '../../engine/engine';
import {DBObjectType, FolderType, FolderTypesAlbum} from '../../types';
import {PodcastStatus} from '../../utils/feed';
import {randomItems} from '../../utils/random';
import {paginate} from '../../utils/paginate';
import {FORMAT} from './format';
import {Subsonic} from '../../model/subsonic-rest-data-1.16.0';
import {SubsonicParameters} from '../../model/subsonic-rest-params-1.16.0';
import {BaseStore, SearchQuery} from '../../objects/base/base.store';
import {User} from '../../objects/user/user.model';
import {DBObject} from '../../objects/base/base.model';
import {Album} from '../../objects/album/album.model';
import {Artist} from '../../objects/artist/artist.model';
import {Folder} from '../../objects/folder/folder.model';
import {Track} from '../../objects/track/track.model';
import {Playlist} from '../../objects/playlist/playlist.model';
import {Episode} from '../../objects/episode/episode.model';
import {State} from '../../objects/state/state.model';
import {Podcast} from '../../objects/podcast/podcast.model';
import {Bookmark} from '../../objects/bookmark/bookmark.model';
import {SearchQueryFolder} from '../../objects/folder/folder.store';
import {SearchQueryAlbum} from '../../objects/album/album.store';
import {SearchQueryTrack} from '../../objects/track/track.store';
import {SearchQueryArtist} from '../../objects/artist/artist.store';

/*
	http://www.subsonic.org/pages/api.jsp
 */

export interface ApiOptions<T> {
	query: T;
	user: User;
	client?: string;
}

export class SubsonicApi {
	public engine: Engine;

	constructor(engine: Engine) {
		this.engine = engine;
	}

	/* helper functions */

	private async prepareList<T extends DBObject, R>(type: DBObjectType, objs: Array<T>, pack: (o: T, state: State) => R, user: User): Promise<Array<R>> {
		const states = await this.engine.stateService.findOrCreateMulti(objs.map(o => o.id), user.id, type);
		return objs.map(o => {
			return pack(o, states[o.id]);
		});
	}

	private async prepareObj<T extends DBObject, R>(type: DBObjectType, obj: T, pack: (o: T, state: State) => R, user: User): Promise<R> {
		const state = await this.engine.stateService.findOrCreate(obj.id, user.id, type);
		return pack(obj, state);
	}

	private async prepareAlbums(albums: Array<Album>, user: User): Promise<Array<Subsonic.AlbumID3>> {
		return this.prepareList<Album, Subsonic.AlbumID3>(DBObjectType.album, albums, FORMAT.packAlbum, user);
	}

	private async prepareArtists(artists: Array<Artist>, user: User): Promise<Array<Subsonic.ArtistID3>> {
		return this.prepareList<Artist, Subsonic.ArtistID3>(DBObjectType.artist, artists, FORMAT.packArtist, user);
	}

	private async prepareFolders(folders: Array<Folder>, user: User): Promise<Array<Subsonic.Child>> {
		return this.prepareList<Folder, Subsonic.Child>(DBObjectType.folder, folders, FORMAT.packFolder, user);
	}

	private async prepareFolderArtists(folders: Array<Folder>, user: User): Promise<Array<Subsonic.Artist>> {
		return this.prepareList<Folder, Subsonic.Artist>(DBObjectType.folder, folders, FORMAT.packFolderArtist, user);
	}

	private async prepareTrack(track: Track, user: User): Promise<Subsonic.Child> {
		return this.prepareObj<Track, Subsonic.Child>(DBObjectType.track, track, FORMAT.packTrack, user);
	}

	private async prepareTracks(tracks: Array<Track>, user: User): Promise<Array<Subsonic.Child>> {
		return this.prepareList<Track, Subsonic.Child>(DBObjectType.track, tracks, FORMAT.packTrack, user);
	}

	private async prepareBookmarks(bookmarks: Array<Bookmark>, user: User): Promise<Array<Subsonic.Bookmark>> {

		const removeDups = (list: Array<string>): Array<string> => {
			return list.filter(function(item, pos) {
				return list.indexOf(item) === pos;
			});
		};

		const trackIDs = removeDups(bookmarks.map(bookmark => bookmark.destID));
		const userIds = removeDups(bookmarks.map(bookmark => bookmark.userID));
		const tracks = await this.engine.store.trackStore.byIds(trackIDs);
		const childs = await this.prepareTracks(tracks, user);
		const users = await this.engine.store.userStore.byIds(userIds);
		const result: Array<Subsonic.Bookmark> = [];
		bookmarks.forEach(bookmark => {
			const entry = childs.find(child => child.id === bookmark.destID);
			const bookmarkuser = users.find(u => u.id === bookmark.userID);
			if (entry && bookmarkuser) {
				result.push(FORMAT.packBookmark(bookmark, bookmarkuser ? bookmarkuser.name : '', entry));
			}
		});
		return result;
	}

	private async preparePlaylist(playlist: Playlist, user: User): Promise<Subsonic.PlaylistWithSongs> {
		const tracks = await this.engine.store.trackStore.byIds(playlist.trackIDs);
		const states = await this.engine.stateService.findOrCreateMulti(playlist.trackIDs || [], user.id, DBObjectType.track);
		return FORMAT.packPlaylistWithSongs(playlist, tracks, states);
	}

	private async prepareEpisodes(episodes: Array<Episode>, user: User): Promise<Array<Subsonic.PodcastEpisode>> {
		const states = await this.engine.stateService.findOrCreateMulti(episodes.map(episode => episode.id), user.id, DBObjectType.episode);
		return episodes.map(episode => {
			return FORMAT.packPodcastEpisode(episode, states[episode.id], (this.engine.podcastService.isDownloadingPodcastEpisode(episode.id) ? PodcastStatus.downloading : episode.status));
		});
	}

	private async collectStateChangeObjects(req: ApiOptions<SubsonicParameters.State>): Promise<{ [type: string]: Array<DBObject> }> {
		const typesObjs: { [type: string]: Array<DBObject> } = {};
		if (req.query.id) {
			const ids = Array.isArray(req.query.id) ? req.query.id : [req.query.id];
			const list = await this.engine.store.findMultiInAll(ids);
			list.forEach(item => {
				typesObjs[item.type] = typesObjs[item.type] || [];
				typesObjs[item.type].push(item);
			});
		}
		if (req.query.albumId) {
			const ids = Array.isArray(req.query.albumId) ? req.query.albumId : [req.query.albumId];
			const list = await this.engine.store.albumStore.byIds(ids);
			typesObjs[DBObjectType.album] = (typesObjs[DBObjectType.album] || []).concat(list);
		}
		if (req.query.artistId) {
			const ids = Array.isArray(req.query.artistId) ? req.query.artistId : [req.query.artistId];
			const list = await this.engine.store.artistStore.byIds(ids);
			typesObjs[DBObjectType.artist] = (typesObjs[DBObjectType.artist] || []).concat(list);
		}
		return typesObjs;
	}

	/* api functions */

	async ping(req: ApiOptions<{}>): Promise<void> {
		/*
		 ping

		 http://your-server/rest/ping.view
		 Since 1.0.0

		 Used to test connectivity with the server. Takes no extra parameters.

		 Returns an empty <subsonic-response> element on success.
		 */
		return;
	}

	async getLicense(req: ApiOptions<{}>): Promise<{ license: Subsonic.License }> {
		/*
		 getLicense

		 http://your-server/rest/getLicense.view
		 Since 1.0.0

		 Get details about the software license. Takes no extra parameters. Please note that access to the REST API requires that the server has a valid license (after a 30-day trial period). To get a license key you must upgrade to Subsonic Premium.

		 Returns a <subsonic-response> element with a nested <license> element on success.
		 */
		return {license: {valid: true, email: 'dummy', licenseExpires: '', trialExpires: ''}};
	}

	async getMusicDirectory(req: ApiOptions<SubsonicParameters.ID>): Promise<{ directory: Subsonic.Directory }> {
		/*
		 getMusicDirectory

		 http://your-server/rest/getMusicDirectory.view
		 Since 1.0.0

		 Returns a listing of all files in a music directory. Typically used to get list of albums for an artist, or list of songs for an album.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the music folder. Obtained by calls to getIndexes or getMusicDirectory.

		 Returns a <subsonic-response> element with a nested <directory> element on success.
		 */
		const folder = await this.byID<Folder>(req.query.id, this.engine.store.folderStore);
		const tracks = await this.engine.store.trackStore.search({path: folder.path});
		tracks.sort((a, b) => {
			const a1 = (a.tag ? a.tag.track : '') || '';
			const b1 = (b.tag ? b.tag.track : '') || '';
			if (a1 < b1) {
				return -1;
			}
			if (a1 > b1) {
				return 1;
			}
			return 0;
		});
		const folders = await this.engine.store.folderStore.search({parentID: folder.id});
		folders.sort((a, b) => {
			const a1 = (a.tag ? a.tag.album : '') || '';
			const b1 = (b.tag ? b.tag.album : '') || '';
			if (a1 < b1) {
				return -1;
			}
			if (a1 > b1) {
				return 1;
			}
			return 0;
		});

		let childs: Array<Subsonic.Child> = [];
		let list = await this.prepareFolders(folders, req.user);
		childs = childs.concat(list);
		list = await this.prepareTracks(tracks, req.user);
		childs = childs.concat(list);
		const state = await this.engine.stateService.findOrCreate(folder.id, req.user.id, DBObjectType.folder);
		const directory = FORMAT.packDirectory(folder, state);
		directory.child = childs;
		return {directory};
	}

	async getIndexes(req: ApiOptions<SubsonicParameters.Indexes>): Promise<{ indexes: Subsonic.Indexes }> {
		/*
		 getIndexes

		 http://your-server/rest/getIndexes.view
		 Since 1.0.0

		 Returns an indexed structure of all artists.
		 Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		If specified, only return artists in the music folder with the given ID. See getMusicFolders.
		 ifModifiedSince 	No 		If specified, only return a result if the artist collection has changed since the given time (in milliseconds since 1 Jan 1970).

		 Returns a <subsonic-response> element with a nested <indexes> element on success.
		 */

		const folderIndex = await this.engine.indexService.getFolderIndex();
		if (req.query.ifModifiedSince && req.query.ifModifiedSince > 0 && (folderIndex.lastModified <= req.query.ifModifiedSince)) {
			const empty: any = {};
			return empty;
		} else {
			const index = this.engine.indexService.filterFolderIndex(req.query.musicFolderId ? req.query.musicFolderId.toString() : undefined, folderIndex);
			let ids: Array<string> = [];
			index.groups.forEach(entry => {
				ids = ids.concat(entry.entries.map(e => e.folder.id));
			});
			const states = await this.engine.stateService.findOrCreateMulti(ids, req.user.id, DBObjectType.folder);
			return {
				indexes: {
					lastModified: index.lastModified,
					ignoredArticles: (this.engine.store.config.app.index.ignore || []).join(' '),
					index: FORMAT.packFolderIndex(index, states),
					// shortcut?: Artist[]; use unknown, there is no api to add/remove shortcuts
					// child?: Child[]; use unknown
				}
			};
		}
	}

	async getArtists(req: ApiOptions<SubsonicParameters.MusicFolderID>): Promise<{ artists: Subsonic.ArtistsID3 }> {
		/*
		 getArtists

		 http://your-server/rest/getArtists.view
		 Since 1.8.0

		 Similar to getIndexes, but organizes music according to ID3 tags.

         Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		If specified, only return artists in the music folder with the given ID. See getMusicFolders.

		 Returns a <subsonic-response> element with a nested <artists> element on success.
		 */
		const artistIndex = await this.engine.indexService.getArtistIndex();
		const index = this.engine.indexService.filterArtistIndex(req.query.musicFolderId ? req.query.musicFolderId.toString() : undefined, artistIndex);
		let ids: Array<string> = [];
		index.groups.forEach(entry => {
			ids = ids.concat(entry.entries.map(e => e.artist.id));
		});
		const states = await this.engine.stateService.findOrCreateMulti(ids, req.user.id, DBObjectType.artist);
		return {
			artists: {
				ignoredArticles: (this.engine.store.config.app.index.ignore || []).join(' '),
				index: FORMAT.packArtistIndex(index, states)
			}
		};
	}

	async getAlbumList(req: ApiOptions<SubsonicParameters.AlbumList>): Promise<{ albumList: Subsonic.AlbumList }> {
		/*
		 getAlbumList

		 http://your-server/rest/getAlbumList.view
		 Since 1.2.0

		 Returns a list of random, newest, highest rated etc. albums. Similar to the album lists on the home page of the Subsonic web interface.
		 Parameter 	Required 	Default 	Comment
		 type 	Yes 		The list type. Must be one of the following: random, newest, highest, frequent, recent.
		 Since 1.8.0 you can also use alphabeticalByName or alphabeticalByArtist to page through all albums alphabetically, and starred to retrieve starred albums.
		 Since 1.10.1 you can use byYear and byGenre to list albums in a given year range or genre.
		 size 	No 	10 	The number of albums to return. Max 500.
		 offset 	No 	0 	The list offset. Useful if you for example want to page through the list of newest albums.
		 fromYear 	Yes (if type is byYear) 		The first year in the range.
		 toYear 	Yes (if type is byYear) 		The last year in the range.
		 genre 	Yes (if type is byGenre) 		The name of the genre, e.g., "Rock".

		 Returns a <subsonic-response> element with a nested <albumList> element on success.
		 */
		const amount = req.query.size || 20;
		const offset = req.query.offset || 0;
		let ids: Array<string> = [];
		let folders: Array<Folder> = [];
		switch (req.query.type) {
			case 'random':
				ids = await this.engine.store.folderStore.searchIDs({types: FolderTypesAlbum});
				folders = await this.engine.store.folderStore.byIds(randomItems<string>(ids, amount));
				break;
			case 'newest':
				folders = await this.engine.store.folderStore.search({types: FolderTypesAlbum, offset, amount, sorts: [{field: 'created', descending: true}]});
				break;
			case 'alphabeticalByArtist':
				folders = await this.engine.store.folderStore.search({types: FolderTypesAlbum, offset, amount, sorts: [{field: 'artist', descending: false}]});
				break;
			case 'alphabeticalByName':
				folders = await this.engine.store.folderStore.search({types: FolderTypesAlbum, offset, amount, sorts: [{field: 'album', descending: false}]});
				break;
			case 'starred':
				ids = await this.engine.listService.getFilteredListFaved<SearchQueryFolder>(DBObjectType.folder, {types: FolderTypesAlbum}, req.user, this.engine.store.folderStore);
				folders = await this.engine.store.folderStore.byIds(paginate(ids, amount, offset));
				break;
			case 'frequent':
				ids = await this.engine.listService.getFilteredListFrequentlyPlayed<SearchQueryFolder>(DBObjectType.folder, {types: FolderTypesAlbum}, req.user, this.engine.store.folderStore);
				folders = await this.engine.store.folderStore.byIds(paginate(ids, amount, offset));
				break;
			case 'recent':
				ids = await this.engine.listService.getFilteredListRecentlyPlayed<SearchQueryFolder>(DBObjectType.folder, {types: FolderTypesAlbum}, req.user, this.engine.store.folderStore);
				folders = await this.engine.store.folderStore.byIds(paginate(ids, amount, offset));
				break;
			case 'highest':
				ids = await this.engine.listService.getFilteredListHighestRated<SearchQueryFolder>(DBObjectType.folder, {types: FolderTypesAlbum}, req.user, this.engine.store.folderStore);
				folders = await this.engine.store.folderStore.byIds(paginate(ids, amount, offset));
				break;
			case 'byGenre':
				folders = await this.engine.store.folderStore.search({types: FolderTypesAlbum, offset, amount, genre: req.query.genre || ''});
				break;
			case 'byYear':
				folders = await this.engine.store.folderStore.search({offset, amount, types: FolderTypesAlbum, fromYear: req.query.fromYear, toYear: req.query.toYear});
				break;
			default:
				return Promise.reject({fail: FORMAT.FAIL.PARAMETER, text: 'Unknown Album List Type'});
		}
		const result = await this.prepareFolders(folders, req.user);
		return {albumList: {album: result}};
	}

	async getAlbumList2(req: ApiOptions<SubsonicParameters.AlbumList2>): Promise<{ albumList2: Subsonic.AlbumList2 }> {
		/*	 getAlbumList2

		 http://your-server/rest/getAlbumList2.view
		 Since 1.8.0

		 Similar to getAlbumList, but organizes music according to ID3 tags.
		 Parameter 	Required 	Default 	Comment
		 type 	Yes 		The list type. Must be one of the following: random, newest, frequent, recent, starred, alphabeticalByName or alphabeticalByArtist. Since 1.10.1 you can use byYear and byGenre to list albums in a given year range or genre.
		 size 	No 	10 	The number of albums to return. Max 500
		 offset 	No 	0 	The list offset. Useful if you for example want to page through the list of newest albums.
		 fromYear 	Yes (if type is byYear) 		The first year in the range.
		 toYear 	Yes (if type is byYear) 		The last year in the range.
		 genre 	Yes (if type is byGenre) 		The name of the genre, e.g., "Rock".
		 musicFolderId 	No 		(Since 1.12.0) Only return albums in the music folder with the given ID. See getMusicFolders.

		 Returns a <subsonic-response> element with a nested <albumList2> element on success.
		 */

		const amount = Math.min(req.query.size || 20, 500);
		const offset = req.query.offset || 0;
		const rootID = req.query.musicFolderId ? req.query.musicFolderId.toString() : undefined;
		let albums: Array<Album> = [];
		let ids: Array<string> = [];
		switch (req.query.type) {
			case 'random':
				ids = await this.engine.store.albumStore.searchIDs({rootID});
				albums = await this.engine.store.albumStore.byIds(randomItems<string>(ids, amount));
				break;
			case 'byGenre':
				albums = await this.engine.store.albumStore.search({amount, offset, genre: req.query.genre || '', rootID});
				break;
			case 'byYear':
				albums = await this.engine.store.albumStore.search({amount, offset, fromYear: req.query.fromYear, toYear: req.query.toYear, rootID});
				break;
			case 'newest':
				albums = await this.engine.store.albumStore.search({rootID, offset, amount, sorts: [{field: 'created', descending: true}]});
				break;
			case 'alphabeticalByArtist':
				albums = await this.engine.store.albumStore.search({rootID, offset, amount, sorts: [{field: 'artist', descending: false}]});
				break;
			case 'alphabeticalByName':
				albums = await this.engine.store.albumStore.search({rootID, offset, amount, sorts: [{field: 'name', descending: false}]});
				break;
			case 'starred':
				ids = await this.engine.listService.getFilteredListFaved<SearchQueryAlbum>(DBObjectType.album, {rootID}, req.user, this.engine.store.albumStore);
				albums = await this.engine.store.albumStore.byIds(paginate(ids, amount, offset));
				break;
			case 'frequent':
				ids = await this.engine.listService.getFilteredListFrequentlyPlayed<SearchQueryAlbum>(DBObjectType.album, {rootID}, req.user, this.engine.store.albumStore);
				albums = await this.engine.store.albumStore.byIds(paginate(ids, amount, offset));
				break;
			case 'recent':
				ids = await this.engine.listService.getFilteredListRecentlyPlayed<SearchQueryAlbum>(DBObjectType.album, {rootID}, req.user, this.engine.store.albumStore);
				albums = await this.engine.store.albumStore.byIds(paginate(ids, amount, offset));
				break;
			case 'highest':
				ids = await this.engine.listService.getFilteredListHighestRated<SearchQueryAlbum>(DBObjectType.album, {rootID}, req.user, this.engine.store.albumStore);
				albums = await this.engine.store.albumStore.byIds(paginate(ids, amount, offset));
				break;
			default:
				return Promise.reject({fail: FORMAT.FAIL.PARAMETER, text: 'Unknown Album List Type'});
		}
		const result = await this.prepareAlbums(albums, req.user);
		return {albumList2: {album: result}};
	}

	async getCoverArt(req: ApiOptions<SubsonicParameters.CoverArt>): Promise<IApiBinaryResult> {
		/*
		 getCoverArt

		 http://your-server/rest/getCoverArt.view
		 Since 1.0.0

		 Returns a cover art image.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of a song, album or artist.
		 size 	No 		If specified, scale image to this size.

		 Returns the cover art image in binary form.
		 */
		const o = await this.engine.store.findInAll(req.query.id);
		if (!o) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		return await this.engine.imageService.getObjImage(o, req.query.size, undefined);
	}

	async getAvatar(req: ApiOptions<SubsonicParameters.Username>): Promise<IApiBinaryResult> {
		/*
		 getAvatar

		 http://your-server/rest/getAvatar.view
		 Since 1.8.0

		 Returns the avatar (personal image) for a user.
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The user in question.

		 Returns the avatar image in binary form.
		 */
		const name = req.query.username;
		const user = await this.engine.userService.get(name);
		if (!user) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		return await this.engine.imageService.getObjImage(user, undefined, undefined);
	}

	async getAlbumInfo(req: ApiOptions<SubsonicParameters.ID>): Promise<{ albumInfo: Subsonic.AlbumInfo }> {
		/*
		 http://your-server/rest/getAlbumInfo
		 Since 1.14.0

		 Returns album notes, image URLs etc, using data from last.fm.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The album or song ID.

		 Returns a <subsonic-response> element with a nested <albumInfo> element on success.
		 */
		const folder = await this.engine.store.folderStore.byId(req.query.id);
		if (!folder) {
			return {albumInfo: {}};
		}
		const info = await this.engine.metaDataService.getFolderInfo(folder);
		if (!info) {
			return {albumInfo: {}};
		}
		return {albumInfo: FORMAT.packAlbumInfo(info)};
	}

	async getAlbumInfo2(req: ApiOptions<SubsonicParameters.ID>): Promise<{ albumInfo: Subsonic.AlbumInfo }> {
		/*
		 http://your-server/rest/getAlbumInfo2

		 Since 1.14.0

		Similar to getAlbumInfo, but organizes music according to ID3 tags.
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The album ID.

		Returns a <subsonic-response> element with a nested <albumInfo> element on success.
		 */
		const album = await this.engine.store.albumStore.byId(req.query.id);
		if (!album) {
			return {albumInfo: {}};
		} else {
			const info = await this.engine.metaDataService.getAlbumInfo(album);
			return {albumInfo: FORMAT.packAlbumInfo(info)};
		}
	}

	async getArtistInfo(req: ApiOptions<SubsonicParameters.ArtistInfo>): Promise<{ artistInfo: Subsonic.ArtistInfo }> {
		/*
		 http://your-server/rest/getArtistInfo Since 1.11.0

		Returns artist info with biography, image URLs and similar artists, using data from last.fm.
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist, album or song ID.
		count 	No 	20 	Max number of similar artists to return.
		includeNotPresent 	No 	false 	Whether to return artists that are not present in the media library.

		Returns a <subsonic-response> element with a nested <artistInfo> element on success.
		 */

		let includeNotPresent = false;
		if (req.query.includeNotPresent !== undefined) {
			includeNotPresent = req.query.includeNotPresent;
		}
		const limitCount = req.query.count || 20;
		const folder = await this.byID<Folder>(req.query.id, this.engine.store.folderStore);
		const artistInfo = await this.engine.metaDataService.getFolderArtistInfo(folder, includeNotPresent, true);
		if (!artistInfo) {
			return {artistInfo: {}};
		}
		let similar = artistInfo.similar || [];
		similar = paginate(similar, limitCount, 0);
		const folders: Array<Folder> = similar.filter(s => !!s.folder).map(s => <Folder>s.folder);
		const children = await this.prepareFolders(folders, req.user);
		const artists: Array<Subsonic.Artist> = similar.map(s => {
			let child: Subsonic.Child | undefined;
			if (s.folder) {
				const f = s.folder;
				child = children.find(c => c.id === f.id);
			}
			if (child) {
				return {
					id: child.id,
					name: s.name,
					starred: child.starred,
					userRating: child.userRating,
					averageRating: child.averageRating
				};
			}
			return {
				id: '-1', // report an invalid id (as does subsonic/airsonic)
				name: s.name
			};
		});
		return {artistInfo: FORMAT.packArtistInfo(artistInfo.info, artists)};
	}

	async getArtistInfo2(req: ApiOptions<SubsonicParameters.ArtistInfo>): Promise<{ artistInfo2: Subsonic.ArtistInfo2 }> {
		/*
		 http://your-server/rest/getArtistInfo2
		 Since 1.11.0

		Similar to getArtistInfo, but organizes music according to ID3 tags.
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist ID.
		count 	No 	20 	Max number of similar artists to return.
		includeNotPresent 	No 	false 	Whether to return artists that are not present in the media library.

		 Returns a <subsonic-response> element with a nested <artistInfo2> element on success.
		*/

		let includeNotPresent = false;
		if (req.query.includeNotPresent !== undefined) {
			includeNotPresent = req.query.includeNotPresent;
		}
		const artist = await this.engine.store.artistStore.byId(req.query.id);
		if (!artist) {
			return {artistInfo2: {}};
		}
		const infos = await this.engine.metaDataService.getArtistInfos(artist, includeNotPresent, true);
		const ids = (infos.similar || []).filter(sim => !!sim.artist).map(sim => (<Artist>sim.artist).id);
		const states = await this.engine.stateService.findOrCreateMulti(ids, req.user.id, DBObjectType.artist);
		const result: Array<Subsonic.ArtistID3> = [];
		(infos.similar || []).forEach(sim => {
			if (sim.artist) {
				result.push(FORMAT.packArtist(sim.artist, states[sim.artist.id]));
			} else if (includeNotPresent) {
				result.push({
					id: '-1', // report an invalid id (as does subsonic/airsonic)
					name: sim.name,
					albumCount: 0
				});
			}
		});
		return {artistInfo2: FORMAT.packArtistInfo2(infos.info, result)};
	}

	async getTopSongs(req: ApiOptions<SubsonicParameters.TopSongs>): Promise<{ topSongs: Subsonic.TopSongs }> {
		/*
		  http://your-server/rest/getTopSongs Since 1.13.0

		Returns top songs for the given artist, using data from last.fm.
		Parameter 	Required 	Default 	Comment
		artist 	Yes 		The artist name.
		count 	No 	50 	Max number of songs to return.

		Returns a <subsonic-response> element with a nested <topSongs> element on success.
		 */
		const limitCount = req.query.count || 50;
		const tracks = await this.engine.metaDataService.getTopTracks(req.query.artist, limitCount);
		const childs = await this.prepareTracks(tracks, req.user);
		return {topSongs: {song: childs}};
	}

	async getSimilarSongs(req: ApiOptions<SubsonicParameters.SimilarSongs>): Promise<{ similarSongs: Subsonic.SimilarSongs }> {
		/*
		 http://your-server/rest/getSimilarSongs Since 1.11.0

		Returns a random collection of songs from the given artist and similar artists, using data from last.fm. Typically used for artist radio features.
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist, album or song ID.
		count 	No 	50 	Max number of songs to return.

		Returns a <subsonic-response> element with a nested <similarSongs> element on success.
		 */
		const o = await this.engine.store.findInAll(req.query.id);
		if (!o) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		} else {
			let tracks: Array<Track> = [];
			switch (o.type) {
				case DBObjectType.track:
					tracks = await this.engine.metaDataService.getTrackSimilarTracks(<Track>o);
					break;
				case DBObjectType.folder:
					tracks = await this.engine.metaDataService.getFolderSimilarTracks(<Folder>o);
					break;
				case DBObjectType.artist:
					tracks = await this.engine.metaDataService.getArtistSimilarTracks(<Artist>o);
					break;
				case DBObjectType.album:
					tracks = await this.engine.metaDataService.getAlbumSimilarTracks(<Album>o);
					break;
			}
			const limit = paginate(tracks, req.query.count || 50, 0);
			const childs = await this.prepareTracks(limit, req.user);
			return {similarSongs: FORMAT.packSimilarSongs(childs)};
		}
	}

	async getSimilarSongs2(req: ApiOptions<SubsonicParameters.SimilarSongs>): Promise<{ similarSongs2: Subsonic.SimilarSongs2 }> {
		/*
		 http://your-server/rest/getSimilarSongs2
		 Since 1.11.0

		Similar to getSimilarSongs, but organizes music according to ID3 tags.
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist ID.
		count 	No 	50 	Max number of songs to return.

		Returns a <subsonic-response> element with a nested <similarSongs2> element on success.
		 */
		const artist = await this.byID<Artist>(req.query.id, this.engine.store.artistStore);
		const tracks = await this.engine.metaDataService.getArtistSimilarTracks(artist);
		const limit = paginate(tracks, req.query.count || 50, 0);
		const childs = await this.prepareTracks(limit, req.user);
		return {similarSongs2: FORMAT.packSimilarSongs2(childs)};
	}

	async download(req: ApiOptions<SubsonicParameters.ID>): Promise<IApiBinaryResult> {
		/*
		 download

		 http://your-server/rest/download.view
		 Since 1.0.0

		 Downloads a given media file. Similar to stream, but this method returns the original media data without transcoding or downsampling.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file to download. Obtained by calls to getMusicDirectory.

		 Returns binary data on success, or an XML document on error (in which case the HTTP content type will start with "text/xml").
		 */
		const o = await this.engine.store.findInAll(req.query.id);
		if (!o) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		} else {
			const result = await this.engine.downloadService.getObjDownload(o, undefined, req.user);
			if (!result) {
				return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
			}
			return result;
		}
	}

	async stream(req: ApiOptions<SubsonicParameters.Stream>): Promise<IApiBinaryResult> {
		/*
		 stream

		 http://your-server/rest/stream.view
		 Since 1.0.0

		 Streams a given media file.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file to stream. Obtained by calls to getMusicDirectory.
		 maxBitRate 	No 		(Since 1.2.0) If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If set to zero, no limit is imposed.
		 format 	No 		(Since 1.6.0) Specifies the preferred target format (e.g., "mp3" or "flv") in case there are multiple applicable transcodings. Starting with 1.9.0 you can use the special value "raw" to disable transcoding.
		 timeOffset 	No 		Only applicable to video streaming. If specified, start streaming at the given offset (in seconds) into the video. Typically used to implement video skipping.
		 size 	No 		(Since 1.6.0) Only applicable to video streaming. Requested video size specified as WxH, for instance "640x480".
		 estimateContentLength 	No 	false 	(Since 1.8.0). If set to "true", the Content-Length HTTP header will be set to an estimated value for transcoded or downsampled media.
		 converted 	No 	false 	(Since 1.14.0) Only applicable to video streaming. Subsonic can optimize videos for streaming by converting them to MP4. If a conversion exists for the video in question, then setting this parameter to "true" will cause the converted video to be returned instead of the original.

		 Returns binary data on success, or an XML document on error (in which case the HTTP content type will start with "text/xml").
		 */
		const o = await this.engine.store.findInAll(req.query.id);
		if (!o) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		} else {
			const result = await this.engine.streamService.getObjStream(o, req.query.format, req.query.maxBitRate, req.user);
			if (!result) {
				return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
			}
			return result;
		}
	}

	async getSong(req: ApiOptions<SubsonicParameters.ID>): Promise<{ song: Subsonic.Child }> {
		/*
		 getSong

		 http://your-server/rest/getSong.view
		 Since 1.8.0

		 Returns details for a song.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The song ID.

		 Returns a <subsonic-response> element with a nested <song> element on success.
		 */
		const track = await this.byID<Track>(req.query.id, this.engine.store.trackStore);
		const child = await this.prepareTrack(track, req.user);
		return {song: child};
	}

	async getGenres(req: ApiOptions<{}>): Promise<{ genres: Subsonic.Genres }> {
		/*
		 getGenres

		 http://your-server/rest/getGenres.view
		 Since 1.9.0

		 Returns all genres.

		 Returns a <subsonic-response> element with a nested <genres> element on success.
		 */
		const genres = await this.engine.genreService.getGenres(undefined, false);
		const list: Array<Subsonic.Genre> = genres.map(genre => FORMAT.packGenre(genre));
		if (list.length === 0) {
			const dummy: Subsonic.Genre = {
				content: '-',
				songCount: 0,
				artistCount: 0,
				albumCount: 0
			};
			list.push(dummy);
		}
		return {genres: {genre: list}};
	}

	async getMusicFolders(req: ApiOptions<{}>): Promise<{ musicFolders: Subsonic.MusicFolders }> {
		/*
		 getMusicFolders

		 http://your-server/rest/getMusicFolders.view
		 Since 1.0.0

		 Returns all configured top-level music folders. Takes no extra parameters.

		 Returns a <subsonic-response> element with a nested <musicFolders> element on success.
		 */
		const list = await this.engine.store.rootStore.all();
		return {musicFolders: {musicFolder: list.map(FORMAT.packRoot)}};
	}

	async getUser(req: ApiOptions<SubsonicParameters.Username>): Promise<{ user: Subsonic.User }> {

		/*
		 getUser

		 http://your-server/rest/getUser.view
		 Since 1.3.0

		 Get details about a given user, including which authorization roles it has. Can be used to enable/disable certain features in the client, such as jukebox control.
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The name of the user to retrieve. You can only retrieve your own user unless you have admin privileges.

		 Returns a <subsonic-response> element with a nested <user> element on success.
		 */

		if ((!req.query.username) || (req.user.name === req.query.username)) {
			return {user: FORMAT.packUser(req.user)};
		} else if (!req.user.roles.adminRole) {
			return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
		} else {
			const u = await this.engine.userService.get(req.query.username);
			if (!u) {
				return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
			} else {
				return {user: FORMAT.packUser(u)};
			}
		}
	}

	async star(req: ApiOptions<SubsonicParameters.State>): Promise<void> {
		/*
		 http://your-server/rest/star.view
		 Since 1.8.0

		 Attaches a star to a song, album or artist.
		 Parameter 	Required 	Default 	Comment
		 id 	No 		The ID of the file (song) or folder (album/artist) to star. Multiple parameters allowed.
		 albumId 	No 		The ID of an album to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 artistId 	No 		The ID of an artist to star. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.

		 Returns an empty <subsonic-response> element on success.
		 */
		const typesObjs = await this.collectStateChangeObjects(req);
		for (const key of Object.keys(typesObjs)) {
			const type: DBObjectType = parseInt(key, 10);
			for (const item of typesObjs[type]) {
				await this.engine.stateService.fav(item.id, type, req.user.id, false);
			}
		}
	}

	async unstar(req: ApiOptions<SubsonicParameters.State>): Promise<void> {
		/*
		 http://your-server/rest/unstar.view
		 Since 1.8.0

		 Removes the star from a song, album or artist.
		 Parameter 	Required 	Default 	Comment
		 id 	No 		The ID of the file (song) or folder (album/artist) to unstar. Multiple parameters allowed.
		 albumId 	No 		The ID of an album to unstar. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.
		 artistId 	No 		The ID of an artist to unstar. Use this rather than id if the client accesses the media collection according to ID3 tags rather than file structure. Multiple parameters allowed.

		 Returns an empty <subsonic-response> element on success.
		 */
		const typesObjs = await this.collectStateChangeObjects(req);
		for (const key of Object.keys(typesObjs)) {
			const type: DBObjectType = parseInt(key, 10);
			for (const item of typesObjs[type]) {
				await this.engine.stateService.fav(item.id, type, req.user.id, true);
			}
		}
	}

	async setRating(req: ApiOptions<SubsonicParameters.Rate>): Promise<void> {
		/*
		 setRating

		 http://your-server/rest/setRating.view
		 Since 1.6.0

		 Sets the rating for a music file.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file (song) or folder (album/artist) to rate.
		 rating 	Yes 		The rating between 1 and 5 (inclusive), or 0 to remove the rating.

		 Returns an empty <subsonic-response> element on success.
		 */
		if ((req.query.rating < 0) || (req.query.rating > 5)) {
			return Promise.reject({fail: FORMAT.FAIL.PARAMETER});
		}
		const typesObjs = await this.collectStateChangeObjects(req);
		for (const key of Object.keys(typesObjs)) {
			const type: DBObjectType = parseInt(key, 10);
			for (const item of typesObjs[type]) {
				await this.engine.stateService.rate(item.id, type, req.user.id, req.query.rating);
			}
		}
	}

	async getNowPlaying(req: ApiOptions<{}>): Promise<{ nowPlaying: Subsonic.NowPlaying }> {
		/*
		 getNowPlaying

		 http://your-server/rest/getNowPlaying.view
		 Since 1.0.0

		 Returns what is currently being played by all users. Takes no extra parameters.

		 Returns a <subsonic-response> element with a nested <nowPlaying> element on success.
		 */
		const list = await this.engine.nowPlaylingService.getNowPlaying();
		const result: Array<Subsonic.NowPlayingEntry> = [];
		for (const entry of list) {
			const state = await this.engine.stateService.findOrCreate(entry.obj.id, req.user.id, entry.obj.type);
			result.push(FORMAT.packNowPlaying(entry, state));
		}
		return {nowPlaying: {entry: result}};
	}

	async getUsers(req: ApiOptions<{}>): Promise<{ users: Subsonic.Users }> {
		/* getUsers

		 http://your-server/rest/getUsers.view
		 Since 1.8.0

		 Get details about all users, including which authorization roles they have. Only users with admin privileges are allowed to req this method.

		 Returns a <subsonic-response> element with a nested <users> element on success.
		 */
		const users = await this.engine.store.userStore.all();
		return {users: {user: users.map(FORMAT.packUser)}};
	}

	async updateUser(req: ApiOptions<SubsonicParameters.UpdateUser>): Promise<void> {
		/*
		 updateUser

		 http://your-server/rest/updateUser.view
		 Since 1.10.1

		 Modifies an existing Subsonic user, using the following parameters:
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The name of the user.
		 password 	No 		The password of the user, either in clear text of hex-encoded (see above).
		 email 	No 		The email address of the user.
		 ldapAuthenticated 	No 		Whether the user is authenicated in LDAP.
		 adminRole 	No 		Whether the user is administrator.
		 settingsRole 	No 		Whether the user is allowed to change settings and password.
		 streamRole 	No 		Whether the user is allowed to play files.
		 jukeboxRole 	No 		Whether the user is allowed to play files in jukebox mode.
		 downloadRole 	No 		Whether the user is allowed to download files.
		 uploadRole 	No 		Whether the user is allowed to upload files.
		 coverArtRole 	No 		Whether the user is allowed to change cover art and tags.
		 commentRole 	No 		Whether the user is allowed to create and edit comments and ratings.
		 podcastRole 	No 		Whether the user is allowed to administrate Podcasts.
		 shareRole 	No 		Whether the user is allowed to share files with anyone.
		 videoConversionRole 	No 	false 	(Since 1.15.0) Whether the user is allowed to start video conversions.
		 musicFolderId 	No 		(Since 1.12.0) IDs of the music folders the user is allowed access to. Include the parameter once for each folder.
		 maxBitRate 	No 		(Since 1.13.0) The maximum bit rate (in Kbps) for the user. Audio streams of higher bit rates are automatically downsampled to this bit rate. Legal values: 0 (no limit), 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320.
		 Returns an empty <subsonic-response> element on success.
		 */

		const getBool = (b: boolean | undefined, def: boolean): boolean => {
			return b === undefined ? def : b;
		};
		const username = req.query.username;
		const u = await this.engine.userService.get(username);
		if (!u) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		if (req.query.email) {
			u.email = req.query.email;
		}
		if (req.query.password) {
			u.pass = req.query.password;
		}
		if (req.query.musicFolderId) {
			u.allowedfolder = (Array.isArray(req.query.musicFolderId) ? req.query.musicFolderId : [req.query.musicFolderId]).map(id => id.toString());
		}
		if (req.query.maxBitRate !== undefined) {
			u.maxBitRate = req.query.maxBitRate || 0;
		}
		if (req.query.username) {
			u.name = req.query.username;
		}
		// u.ldapAuthenticated = getBool(req.query.ldapAuthenticated, u.ldapAuthenticated);
		// u.scrobblingEnabled = getBool(req.query.scrobblingEnabled, u.scrobblingEnabled);
		u.roles.adminRole = getBool(req.query.adminRole, u.roles.adminRole);
		// u.roles.settingsRole = getBool(req.query.settingsRole, u.roles.settingsRole);
		u.roles.streamRole = getBool(req.query.streamRole, u.roles.streamRole);
		// u.roles.jukeboxRole = getBool(req.query.jukeboxRole, u.roles.jukeboxRole);
		// u.roles.downloadRole = getBool(req.query.downloadRole, u.roles.downloadRole);
		u.roles.uploadRole = getBool(req.query.uploadRole, u.roles.uploadRole);
		// u.roles.coverArtRole = getBool(req.query.coverArtRole, u.roles.coverArtRole);
		// u.roles.commentRole = getBool(req.query.commentRole, u.roles.commentRole);
		u.roles.podcastRole = getBool(req.query.podcastRole, u.roles.podcastRole);
		// u.roles.playlistRole = getBool(req.query.playlistRole, u.roles.playlistRole);
		// u.roles.shareRole = getBool(req.query.shareRole, u.roles.shareRole);
		// u.roles.videoConversionRole = getBool(req.query.videoConversionRole, u.roles.videoConversionRole);
		await this.engine.userService.updateUser(u);
	}

	async createUser(req: ApiOptions<SubsonicParameters.UpdateUser>): Promise<void> {
		/*
		 createUser

		 http://your-server/rest/createUser.view
		 Since 1.1.0

		 Creates a new Subsonic user, using the following parameters:
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The name of the new user.
		 password 	Yes 		The password of the new user, either in clear text of hex-encoded (see above).
		 email 	Yes 		The email address of the new user.
		 ldapAuthenticated 	No 	false 	Whether the user is authenicated in LDAP.
		 adminRole 	No 	false 	Whether the user is administrator.
		 settingsRole 	No 	true 	Whether the user is allowed to change settings and password.
		 streamRole 	No 	true 	Whether the user is allowed to play files.
		 jukeboxRole 	No 	false 	Whether the user is allowed to play files in jukebox mode.
		 downloadRole 	No 	false 	Whether the user is allowed to download files.
		 uploadRole 	No 	false 	Whether the user is allowed to upload files.
		 playlistRole 	No 	false 	Whether the user is allowed to create and delete playlists. Since 1.8.0, changing this role has no effect.
		 coverArtRole 	No 	false 	Whether the user is allowed to change cover art and tags.
		 commentRole 	No 	false 	Whether the user is allowed to create and edit comments and ratings.
		 podcastRole 	No 	false 	Whether the user is allowed to administrate Podcasts.
		 shareRole 	No 	false 	(Since 1.8.0)Whether the user is allowed to share files with anyone.
		 videoConversionRole 	No 	false 	(Since 1.15.0) Whether the user is allowed to start video conversions.
		 musicFolderId 	No 	All folders 	(Since 1.12.0) IDs of the music folders the user is allowed access to. Include the parameter once for each folder.

		 Returns an empty <subsonic-response> element on success.
		 */

		if (
			(!req.query.username) || (req.query.username.length === 0) ||
			(!req.query.password) || (req.query.password.length === 0) ||
			(!req.query.email) || (req.query.email.length === 0)
		) {
			return Promise.reject({fail: FORMAT.FAIL.PARAMETER});
		}
		const getBool = (b: boolean | undefined, def: boolean): boolean => {
			return b === undefined ? def : b;
		};
		const u: User = {
			id: '',
			name: req.query.username || '',
			pass: req.query.password || 'invalid',
			email: req.query.email || 'invalid',
			avatarLastChanged: Date.now(),
			created: Date.now(),
			type: DBObjectType.user,
			// ldapAuthenticated: getBool(req.query.ldapAuthenticated, false),
			scrobblingEnabled: false, // getBool(req.query.scrobblingEnabled, false),
			roles: {
				adminRole: getBool(req.query.adminRole, false),
				// settingsRole: getBool(req.query.settingsRole, true),
				streamRole: getBool(req.query.streamRole, true),
				// jukeboxRole: getBool(req.query.jukeboxRole, false),
				// downloadRole: getBool(req.query.downloadRole, false),
				uploadRole: getBool(req.query.uploadRole, false),
				// playlistRole: getBool(req.query.playlistRole, false),
				// coverArtRole: getBool(req.query.coverArtRole, false),
				// commentRole: getBool(req.query.commentRole, false),
				podcastRole: getBool(req.query.podcastRole, false),
				// shareRole: getBool(req.query.shareRole, false),
				// videoConversionRole: getBool(req.query.videoConversionRole, false)
			}
		};
		await this.engine.userService.createUser(u);
	}

	async deleteUser(req: ApiOptions<SubsonicParameters.Username>): Promise<void> {
		/*
		 deleteUser

		 http://your-server/rest/deleteUser.view
		 Since 1.3.0

		 Deletes an existing Subsonic user, using the following parameters:
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The name of the user to delete.

		 Returns an empty <subsonic-response> element on success.
		 */
		const u = await this.engine.userService.get(req.query.username);
		if (!u) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		await this.engine.userService.deleteUser(u);
	}

	async changePassword(req: ApiOptions<SubsonicParameters.ChangePassword>): Promise<void> {
		/*
		 changePassword

		 http://your-server/rest/changePassword.view
		 Since 1.1.0

		 Changes the password of an existing Subsonic user, using the following parameters. You can only change your own password unless you have admin privileges.
		 Parameter 	Required 	Default 	Comment
		 username 	Yes 		The name of the user which should change its password.
		 password 	Yes 		The new password of the new user, either in clear text of hex-encoded (see above).

		 Returns an empty <subsonic-response> element on success.
		 */
		if (
			(!req.query.username) ||
			(!req.query.password) ||
			(req.query.password.length === 0)
		) {
			return Promise.reject({fail: FORMAT.FAIL.PARAMETER});
		}
		if (req.query.username !== req.user.name) {
			if (!req.user.roles.adminRole) {
				return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
			}
		}
		const u = await this.engine.userService.get(req.query.username);
		if (!u) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		u.pass = req.query.password;
		await this.engine.userService.updateUser(u);
	}

	async getChatMessages(req: ApiOptions<SubsonicParameters.ChatMessages>): Promise<{ chatMessages: Subsonic.ChatMessages }> {
		/*
		 getChatMessages

		 http://your-server/rest/getChatMessages.view
		 Since 1.2.0

		 Returns the current visible (non-expired) chat messages.
		 Parameter 	Required 	Default 	Comment
		 since 	No 		Only return messages newer than this time (in millis since Jan 1 1970).

		 Returns a <subsonic-response> element with a nested <chatMessages> element on success.
		 */
		const messages = await this.engine.chatService.get(req.query.since);
		return {chatMessages: {chatMessage: messages.map(msg => FORMAT.packChatMessage(msg))}};
	}

	async addChatMessage(req: ApiOptions<SubsonicParameters.ChatMessage>): Promise<void> {
		/*
		 addChatMessage

		 http://your-server/rest/addChatMessage.view
		 Since 1.2.0

		 Adds a message to the chat log.
		 Parameter 	Required 	Default 	Comment
		 message 	Yes 		The chat message.

		 Returns an empty <subsonic-response> element on success.
		 */
		await this.engine.chatService.add(req.query.message, req.user);
	}

	async getPlaylists(req: ApiOptions<SubsonicParameters.Playlists>): Promise<{ playlists: Subsonic.Playlists }> {
		/*
		 getPlaylists

		 http://your-server/rest/getPlaylists.view
		 Since 1.0.0

		 Returns all playlists a user is allowed to play.
		 Parameter 	Required 	Default 	Comment
		 username 	no 		(Since 1.8.0) If specified, return playlists for this user rather than for the authenticated user. The authenticated user must have admin role if this parameter is used.

		 Returns a <subsonic-response> element with a nested <playlists> element on success.
		 */
		let userID = req.user.id;
		if ((req.query.username) && (req.query.username !== req.user.name)) {
			if (!req.user.roles.adminRole) {
				return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
			}
			const u = await this.engine.userService.get(req.query.username);
			if (!u) {
				return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
			}
			userID = u.id;
		}
		const list = await this.engine.store.playlistStore.search({userID, isPublic: req.user.id !== userID});
		const playlists: Subsonic.Playlists = {};
		const result: Array<Subsonic.Playlist> = [];
		for (const playlist of list) {
			const plist = await this.preparePlaylist(playlist, req.user);
			result.push(plist);
		}
		playlists.playlist = result;
		return {playlists};
	}

	async getPlaylist(req: ApiOptions<SubsonicParameters.ID>): Promise<{ playlist: Subsonic.Playlist }> {
		/*
		 getPlaylist

		 http://your-server/rest/getPlaylist.view
		 Since 1.0.0

		 Returns a listing of files in a saved playlist.
		 Parameter 	Required 	Default 	Comment
		 id 	yes 		ID of the playlist to return, as obtained by getPlaylists.

		 Returns a <subsonic-response> element with a nested <playlist> element on success.
		 */

		const playlist = await this.byID<Playlist>(req.query.id, this.engine.store.playlistStore);
		if (playlist.userID !== req.user.id) {
			return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
		}
		const result = await this.preparePlaylist(playlist, req.user);
		return {playlist: result};
	}

	async createPlaylist(req: ApiOptions<SubsonicParameters.PlaylistCreate>): Promise<{ playlist: Subsonic.PlaylistWithSongs }> {
		/*
		 createPlaylist

		 http://your-server/rest/createPlaylist.view
		 Since 1.2.0

		 Creates (or updates) a playlist.
		 Parameter 	Required 	Default 	Comment
		 playlistId 	Yes (if updating) 		The playlist ID.
		 name 	Yes (if creating) 		The human-readable name of the playlist.
		 songId 	Yes 		ID of a song in the playlist. Use one songId parameter for each song in the playlist.

		 Since 1.14.0 the newly created/updated playlist is returned. In earlier versions an empty <subsonic-response> element is returned.
		 */
		let playlist: Playlist | undefined;
		if (!req.query.playlistId && !req.query.name) {
			return Promise.reject({fail: FORMAT.FAIL.PARAMETER});
		} else if (req.query.playlistId) {
			const updateQuery: SubsonicParameters.PlaylistUpdate = {
				playlistId: req.query.playlistId,
				name: req.query.name,
				songIdToAdd: req.query.songId
			};
			(<any>req).query = updateQuery;
			await this.updatePlaylist(<ApiOptions<SubsonicParameters.PlaylistUpdate>>req);
			playlist = await this.byID<Playlist>(req.query.playlistId, this.engine.store.playlistStore);
		} else if (req.query.name) {
			playlist = await this.engine.playlistService.createPlaylist(req.query.name, undefined, false, req.user.id, req.query.songId !== undefined ? (Array.isArray(req.query.songId) ? req.query.songId : [req.query.songId]) : []);
		}
		if (!playlist) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		const tracks = await this.engine.store.trackStore.byIds(playlist.trackIDs);
		const states = await this.engine.stateService.findOrCreateMulti(playlist.trackIDs, req.user.id, DBObjectType.track);
		return {playlist: FORMAT.packPlaylistWithSongs(playlist, tracks, states)};
	}

	async updatePlaylist(req: ApiOptions<SubsonicParameters.PlaylistUpdate>): Promise<void> {
		/*
		 updatePlaylist

		 http://your-server/rest/updatePlaylist.view
		 Since 1.8.0

		 Updates a playlist. Only the owner of a playlist is allowed to update it.
		 Parameter 	Required 	Default 	Comment
		 playlistId 	Yes 		The playlist ID.
		 name 	No 		The human-readable name of the playlist.
		 comment 	No 		The playlist comment.
		 public 	No 		true if the playlist should be visible to all users, false otherwise.
		 songIdToAdd 	No 		Add this song with this ID to the playlist. Multiple parameters allowed.
		 songIndexToRemove 	No 		Remove the song at this position in the playlist. Multiple parameters allowed.

		 Returns an empty <subsonic-response> element on success.
		 */
		const playlist = await this.byID<Playlist>(req.query.playlistId, this.engine.store.playlistStore);
		if (req.user.id !== playlist.userID) {
			return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
		}

		const removetracks = req.query.songIndexToRemove !== undefined ? (Array.isArray(req.query.songIndexToRemove) ? req.query.songIndexToRemove : [req.query.songIndexToRemove]) : [];
		playlist.trackIDs = playlist.trackIDs.filter((id, index) => removetracks.indexOf(index) < 0);

		const tracks: Array<string> = playlist.trackIDs;
		if (req.query.songIdToAdd) {
			const songadd = req.query.songIdToAdd !== undefined ? (Array.isArray(req.query.songIdToAdd) ? req.query.songIdToAdd : [req.query.songIdToAdd]) : [];
			playlist.trackIDs = tracks.concat(songadd);
		}
		playlist.name = req.query.name || playlist.name;
		playlist.comment = req.query.comment || playlist.comment;
		playlist.isPublic = req.query.public !== undefined ? req.query.public : playlist.isPublic;
		playlist.changed = Date.now();
		await this.engine.playlistService.updatePlaylist(playlist);
	}

	async deletePlaylist(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 deletePlaylist

		 http://your-server/rest/deletePlaylist.view
		 Since 1.2.0

		 Deletes a saved playlist.
		 Parameter 	Required 	Default 	Comment
		 id 	yes 		ID of the playlist to delete, as obtained by getPlaylists.

		 Returns an empty <subsonic-response> element on success.
		 */
		const playlist = await this.byID<Playlist>(req.query.id, this.engine.store.playlistStore);
		if (playlist.userID !== req.user.id) {
			return Promise.reject({fail: FORMAT.FAIL.UNAUTH});
		}
		await this.engine.playlistService.removePlaylist(playlist);
	}

	async getStarred(req: ApiOptions<SubsonicParameters.MusicFolderID>): Promise<{ starred: Subsonic.Starred }> {
		/*
		 getStarred

		 http://your-server/rest/getStarred.view
		 Since 1.8.0

		 Returns starred songs, albums and artists.

		 Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		(Since 1.12.0) Only return results from the music folder with the given ID. See getMusicFolders.

		 Returns a <subsonic-response> element with a nested <starred> element on success.
		 */
		const rootID = (req.query.musicFolderId !== undefined ? req.query.musicFolderId.toString() : undefined);
		const starred: Subsonic.Starred = {};
		const trackIDs = await this.engine.listService.getFilteredListFaved<SearchQueryTrack>(DBObjectType.track, {rootID}, req.user, this.engine.store.trackStore);
		if (trackIDs.length > 0) {
			const tracks = await this.engine.store.trackStore.byIds(trackIDs);
			starred.song = await this.prepareTracks(tracks, req.user);
		}
		const artistFolderIDs = await this.engine.listService.getFilteredListFaved<SearchQueryFolder>(DBObjectType.folder, {types: [FolderType.artist], rootID}, req.user, this.engine.store.folderStore);
		if (artistFolderIDs.length > 0) {
			const folders = await this.engine.store.folderStore.byIds(artistFolderIDs);
			starred.artist = await this.prepareFolderArtists(folders, req.user);
		}
		const albumFolderIDs = await this.engine.listService.getFilteredListFaved<SearchQueryFolder>(DBObjectType.folder, {types: FolderTypesAlbum, rootID}, req.user, this.engine.store.folderStore);
		if (albumFolderIDs.length > 0) {
			const folders = await this.engine.store.folderStore.byIds(albumFolderIDs);
			starred.album = await this.prepareFolders(folders, req.user);
		}
		return {starred};
	}

	async getStarred2(req: ApiOptions<SubsonicParameters.MusicFolderID>): Promise<{ starred2: Subsonic.Starred2 }> {
		/*
		 getStarred2

		 http://your-server/rest/getStarred2.view
		 Since 1.8.0

		 Similar to getStarred, but organizes music according to ID3 tags.

		 Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		(Since 1.12.0) Only return results from the music folder with the given ID. See getMusicFolders

		 Returns a <subsonic-response> element with a nested <starred2> element on success.

		 */
		const rootID = (req.query.musicFolderId !== undefined ? req.query.musicFolderId.toString() : undefined);
		const starred2: Subsonic.Starred2 = {};
		const trackIDs = await this.engine.listService.getFilteredListFaved<SearchQueryTrack>(DBObjectType.track, {rootID}, req.user, this.engine.store.trackStore);
		if (trackIDs.length > 0) {
			const tracks = await this.engine.store.trackStore.byIds(trackIDs);
			starred2.song = await this.prepareTracks(tracks, req.user);
		}
		const albumIDs = await this.engine.listService.getFilteredListFaved<SearchQueryAlbum>(DBObjectType.album, {rootID}, req.user, this.engine.store.albumStore);
		if (albumIDs.length > 0) {
			const albums = await this.engine.store.albumStore.byIds(albumIDs);
			starred2.album = await this.prepareAlbums(albums, req.user);
		}
		const artistIDs = await this.engine.listService.getFilteredListFaved<SearchQueryArtist>(DBObjectType.artist, {rootID}, req.user, this.engine.store.artistStore);
		if (artistIDs.length > 0) {
			const artists = await this.engine.store.artistStore.byIds(artistIDs);
			starred2.artist = await this.prepareArtists(artists, req.user);
		}
		return {starred2};
	}

	async refreshPodcasts(req: ApiOptions<{}>): Promise<void> {
		/*
		 refreshPodcasts

		 http://your-server/rest/refreshPodcasts.view
		 Since 1.9.0

		 Requests the server to check for new Podcast episodes. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).

		 Returns an empty <subsonic-response> element on success.
		 */
		this.engine.podcastService.refreshPodcasts(); // do not wait
	}

	async createPodcastChannel(req: ApiOptions<SubsonicParameters.PodcastChannel>): Promise<void> {
		/*
		 createPodcastChannel

		 http://your-server/rest/createPodcastChannel.view
		 Since 1.9.0

		 Adds a new Podcast channel. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
		 Parameter 	Required 	Default 	Comment
		 url 	Yes 		The URL of the Podcast to add.

		 Returns an empty <subsonic-response> element on success.
		 */
		await this.engine.podcastService.addPodcast(req.query.url);
	}

	async getPodcasts(req: ApiOptions<SubsonicParameters.PodcastChannels>): Promise<{ podcasts: Subsonic.Podcasts }> {
		/*
		 getPodcasts

		 http://your-server/rest/getPodcasts.view
		 Since 1.6.0

		 Returns all Podcast channels the server subscribes to, and (optionally) their episodes.
		 This method can also be used to return details for only one channel - refer to the id parameter.
		 A typical use case for this method would be to first retrieve all channels without episodes,
		 and then retrieve all episodes for the single channel the user selects.
		 Parameter 	Required 	Default 	Comment
		 includeEpisodes 	No 	true 	(Since 1.9.0) Whether to include Podcast episodes in the returned result.
		 id 	No 		(Since 1.9.0) If specified, only return the Podcast channel with this ID.

		 Returns a <subsonic-response> element with a nested <podcasts> element on success.
		 */

		let includeEpisodes = false;
		if (req.query.includeEpisodes !== undefined) {
			includeEpisodes = req.query.includeEpisodes;
		}
		let podcastList: Array<Podcast> = [];
		if (req.query.id) {
			const podcast = await this.engine.store.podcastStore.byId(req.query.id);
			if (podcast) {
				podcastList.push(podcast);
			} else {
				return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
			}
		} else {
			podcastList = await this.engine.store.podcastStore.all();
		}
		const channel = podcastList.map(podcast => FORMAT.packPodcast(podcast, (this.engine.podcastService.isDownloadingPodcast(podcast.id) ? PodcastStatus.downloading : undefined)));
		const podcasts: Subsonic.Podcasts = {channel};
		if (includeEpisodes) {
			for (const podcast of channel) {
				const episodes = await this.engine.store.episodeStore.search({podcastID: podcast.id});
				podcast.episode = await this.prepareEpisodes(episodes.sort((a, b) => (b.date || 0) - (a.date || 0)), req.user);
			}
		}
		return {podcasts};
	}

	async getNewestPodcasts(req: ApiOptions<SubsonicParameters.PodcastEpisodesNewest>): Promise<{ newestPodcasts: Subsonic.NewestPodcasts }> {
		/*
		 http://your-server/rest/getNewestPodcasts Since 1.13.0

		Returns the most recently published Podcast episodes.
		Parameter 	Required 	Default 	Comment
		count 	No 	20 	The maximum number of episodes to return.

		Returns a <subsonic-response> element with a nested <newestPodcasts> element on success.
		 */
		// TODO: do this with a limit & sort db request
		let episodes = await this.engine.store.episodeStore.all();
		episodes = episodes.sort((a, b) => {
			return (b.date || 0) - (a.date || 0);
		});
		const newestPodcasts: Subsonic.NewestPodcasts = {};
		newestPodcasts.episode = await this.prepareEpisodes(paginate(episodes, req.query.count || 20, 0), req.user);
		return {newestPodcasts};
	}

	async byID<T extends DBObject>(id: string, objstore: BaseStore<T, SearchQuery>): Promise<T> {
		const item = await objstore.byId(id);
		if (!item) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		return item;
	}

	async deletePodcastChannel(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 deletePodcastChannel

		 http://your-server/rest/deletePodcastChannel.view
		 Since 1.9.0

		 Deletes a Podcast channel. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast channel to delete.

		 Returns an empty <subsonic-response> element on success.
		 */
		const podcast = await this.byID<Podcast>(req.query.id, this.engine.store.podcastStore);
		await this.engine.podcastService.removePodcast(podcast);
	}

	async downloadPodcastEpisode(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 downloadPodcastEpisode

		 http://your-server/rest/downloadPodcastEpisode.view
		 Since 1.9.0

		 Request the server to start downloading a given Podcast episode. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast episode to download.

		 Returns an empty <subsonic-response> element on success.
		 */

		const episode = await this.byID<Episode>(req.query.id, this.engine.store.episodeStore);
		if (!episode.path) {
			this.engine.podcastService.downloadPodcastEpisode(episode); // do not wait
		}
	}

	async deletePodcastEpisode(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 deletePodcastEpisode

		 http://your-server/rest/deletePodcastEpisode.view
		 Since 1.9.0

		 Deletes a Podcast episode. Note: The user must be authorized for Podcast administration (see Settings > Users > user is allowed to administrate Podcasts).
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The ID of the Podcast episode to delete.

		 Returns an empty <subsonic-response> element on success.
		 */
		const episode = await this.byID<Episode>(req.query.id, this.engine.store.episodeStore);
		await this.engine.podcastService.deletePodcastEpisode(episode);
	}

	async getBookmarks(req: ApiOptions<{}>): Promise<{ bookmarks: Subsonic.Bookmarks }> {
		/*
		 getBookmarks

		 http://your-server/rest/getBookmarks.view
		 Since 1.9.0

		 Returns all bookmarks for this user. A bookmark is a position within a certain media file.

		 Returns a <subsonic-response> element with a nested <bookmarks> element on success.
		 */
		const bookmarklist = await this.engine.bookmarkService.getAll(req.user.id);
		const bookmarks: Subsonic.Bookmarks = {};
		bookmarks.bookmark = await this.prepareBookmarks(bookmarklist, req.user);
		return {bookmarks};
	}

	async createBookmark(req: ApiOptions<SubsonicParameters.Bookmark>): Promise<void> {
		/*
		 createBookmark

		 http://your-server/rest/createBookmark.view
		 Since 1.9.0

		 Creates or updates a bookmark (a position within a media file). Bookmarks are personal and not visible to other users.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the media file to bookmark. If a bookmark already exists for this file it will be overwritten.
		 position 	Yes 		The position (in milliseconds) within the media file.
		 comment 	No 		A user-defined comment.

		 Returns an empty <subsonic-response> element on success.
		 */
		const track = await this.byID<Track>(req.query.id, this.engine.store.trackStore);
		await this.engine.bookmarkService.create(track.id, req.user.id, req.query.position, req.query.comment);
	}

	async deleteBookmark(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 deleteBookmark

		 http://your-server/rest/deleteBookmark.view
		 Since 1.9.0

		 Deletes the bookmark for a given file.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the media file for which to delete the bookmark. Other users' bookmarks are not affected.

		 Returns an empty <subsonic-response> element on success.
		 */
		await this.engine.bookmarkService.remove(req.query.id, req.user);
	}

	async getRandomSongs(req: ApiOptions<SubsonicParameters.RandomSong>): Promise<{ randomSongs: Subsonic.Songs }> {
		/*
		 getRandomSongs

		 http://your-server/rest/getRandomSongs.view
		 Since 1.2.0

		 Returns random songs matching the given criteria.
		 Parameter 	Required 	Default 	Comment
		 size 	No 	10 	The maximum number of songs to return. Max 500.
		 genre 	No 		Only returns songs belonging to this genre.
		 fromYear 	No 		Only return songs published after or in this year.
		 toYear 	No 		Only return songs published before or in this year.
		 musicFolderId 	No 		Only return songs in the music folder with the given ID. See getMusicFolders.

		 Returns a <subsonic-response> element with a nested <randomSongs> element on success.
		 */

		const amount = Math.min(req.query.size || 10, 500);
		const query: SearchQueryTrack = {
			genre: req.query.genre,
			fromYear: req.query.fromYear,
			toYear: req.query.toYear,
			rootID: req.query.musicFolderId ? req.query.musicFolderId.toString() : undefined
		};
		const randomSongs: Subsonic.Songs = {};
		const trackids = await this.engine.store.trackStore.searchIDs(query);
		if (trackids.length > 0) {
			const limit: Array<string> = randomItems(trackids, amount);
			const tracks = await this.engine.store.trackStore.byIds(limit);
			randomSongs.song = await this.prepareTracks(tracks, req.user);
		}
		return {randomSongs};
	}

	async getSongsByGenre(req: ApiOptions<SubsonicParameters.SongsByGenre>): Promise<{ songsByGenre: Subsonic.Songs }> {
		/*
		 getSongsByGenre

		 http://your-server/rest/getSongsByGenre.view
		 Since 1.9.0

		 Returns songs in a given genre.
		 Parameter 	Required 	Default 	Comment
		 genre 	Yes 		The genre, as returned by getGenres.
		 count 	No 	10 	The maximum number of songs to return. Max 500.
		 offset 	No 	0 	The offset. Useful if you want to page through the songs in a genre.
		 musicFolderId 	No 		(Since 1.12.0) Only return albums in the music folder with the given ID. See getMusicFolders

		 Returns a <subsonic-response> element with a nested <songsByGenre> element on success.
		 */
		const songsByGenre: Subsonic.Songs = {};
		const tracklist = await this.engine.store.trackStore.searchIDs({genre: req.query.genre, rootID: req.query.musicFolderId ? req.query.musicFolderId.toString() : undefined});
		const limit = paginate(tracklist, req.query.count || 10, req.query.offset || 0);
		const tracks = await this.engine.store.trackStore.byIds(limit);
		songsByGenre.song = await this.prepareTracks(tracks, req.user);
		return {songsByGenre};
	}

	async search(req: ApiOptions<SubsonicParameters.Search>): Promise<{ searchResult: Subsonic.SearchResult }> {
		/*
		 search

		 http://your-server/rest/search.view
		 Since 1.0.0
		 Deprecated since 1.4.0, use search2 instead.

		 Returns a listing of files matching the given search criteria. Supports paging through the result.
		 Parameter 	Required 	Default 	Comment
		 artist 	No 		Artist to search for.
		 album 	No 		Album to search for.
		 title 	No 		Song title to search for.
		 any 	No 		Searches all fields.
		 count 	No 	20 	Maximum number of results to return.
		 offset 	No 	0 	Search result offset. Used for paging.
		 newerThan 	No 		Only return matches that are newer than this. Given as milliseconds since 1970.

		 Returns a <subsonic-response> element with a nested <searchResult> element on success.
		 */
		if (req.query.any) {
			req.query.artist = req.query.any;
			req.query.album = req.query.any;
			req.query.title = req.query.any;
		}
		let list = await this.engine.store.trackStore.searchIDs({
			artist: req.query.artist,
			album: req.query.album,
			title: req.query.title,
			newerThan: req.query.newerThan
		});
		const searchResult: Subsonic.SearchResult = {offset: req.query.offset || 0, totalHits: list.length};
		list = paginate(list, req.query.count || 20, req.query.offset || 0);
		const tracks = await this.engine.store.trackStore.byIds(list);
		searchResult.match = await this.prepareTracks(tracks, req.user);
		return {searchResult};
	}

	async search2(req: ApiOptions<SubsonicParameters.Search2>): Promise<{ searchResult2: Subsonic.SearchResult2 }> {
		/*
		 search2

		 http://your-server/rest/search2.view
		 Since 1.4.0

		 Returns albums, artists and songs matching the given search criteria. Supports paging through the result.
		 Parameter 	Required 	Default 	Comment
		 query 	Yes 		Search query.
		 artistCount 	No 	20 	Maximum number of artists to return.
		 artistOffset 	No 	0 	Search result offset for artists. Used for paging.
		 albumCount 	No 	20 	Maximum number of albums to return.
		 albumOffset 	No 	0 	Search result offset for albums. Used for paging.
		 songCount 	No 	20 	Maximum number of songs to return.
		 songOffset 	No 	0 	Search result offset for songs. Used for paging.
		 musicFolderId 	No 		(Since 1.12.0) Only return results from the music folder with the given ID. See getMusicFolders

		 Returns a <subsonic-response> element with a nested <searchResult2> element on success.
		 */

		const searchResult2: Subsonic.SearchResult2 = {};
		const rootID = req.query.musicFolderId ? req.query.musicFolderId.toString() : undefined;
		const tracklist = await this.engine.store.trackStore.searchIDs({query: req.query.query, rootID});
		if (tracklist.length > 0) {
			const limit = paginate(tracklist, req.query.songCount || 20, req.query.songOffset || 0);
			const tracks = await this.engine.store.trackStore.byIds(limit);
			searchResult2.song = await this.prepareTracks(tracks, req.user);
		}
		const folderlist = await this.engine.store.folderStore.search({query: req.query.query, rootID});
		if (folderlist.length > 0) {
			const states = await this.engine.stateService.findOrCreateMulti(folderlist.map(f => f.id), req.user.id, DBObjectType.folder);
			const artists: Array<Subsonic.Artist> = [];
			const albums: Array<Subsonic.Child> = [];
			folderlist.forEach(folder => {
				if (folder.tag.type === FolderType.artist) {
					artists.push(FORMAT.packFolderArtist(folder, states[folder.id]));
				} else {
					albums.push(FORMAT.packFolder(folder, states[folder.id]));
				}
			});
			searchResult2.artist = paginate(artists, req.query.artistCount || 20, req.query.artistOffset || 0);
			searchResult2.album = paginate(albums, req.query.albumCount || 20, req.query.albumOffset || 0);
		}
		return {searchResult2};
	}

	async search3(req: ApiOptions<SubsonicParameters.Search2>): Promise<{ searchResult3: Subsonic.SearchResult3 }> {
		/*
		 search3

		 http://your-server/rest/search3.view
		 Since 1.8.0

		 Similar to search2, but organizes music according to ID3 tags.
		 Parameter 	Required 	Default 	Comment
		 query 	Yes 		Search query.
		 artistCount 	No 	20 	Maximum number of artists to return.
		 artistOffset 	No 	0 	Search result offset for artists. Used for paging.
		 albumCount 	No 	20 	Maximum number of albums to return.
		 albumOffset 	No 	0 	Search result offset for albums. Used for paging.
		 songCount 	No 	20 	Maximum number of songs to return.
		 songOffset 	No 	0 	Search result offset for songs. Used for paging.

		 Returns a <subsonic-response> element with a nested <searchResult3> element on success.
		 */

		const searchResult3: Subsonic.SearchResult3 = {};
		const tracklist = await this.engine.store.trackStore.searchIDs({query: req.query.query});
		if (tracklist.length > 0) {
			const limit = paginate(tracklist, req.query.songCount || 20, req.query.songOffset || 0);
			const tracks = await this.engine.store.trackStore.byIds(limit);
			searchResult3.song = await this.prepareTracks(tracks, req.user);
		}
		const albumlist = await this.engine.store.albumStore.searchIDs({query: req.query.query});
		if (albumlist.length > 0) {
			const limit = paginate(albumlist, req.query.albumCount || 20, req.query.albumOffset || 0);
			const albums = await this.engine.store.albumStore.byIds(limit);
			searchResult3.album = await this.prepareAlbums(albums, req.user);
		}
		const artistlist = await this.engine.store.artistStore.searchIDs({query: req.query.query});
		if (artistlist.length > 0) {
			const limit = paginate(artistlist, req.query.artistCount || 20, req.query.artistOffset || 0);
			const artists = await this.engine.store.artistStore.byIds(limit);
			searchResult3.artist = await this.prepareArtists(artists, req.user);
		}
		return {searchResult3};
	}

	async getScanStatus(req: ApiOptions<{}>): Promise<{ scanStatus: Subsonic.ScanStatus }> {
		/*
		http://your-server/rest/getScanStatus Since 1.15.0

		Returns the current status for media library scanning. Takes no extra parameters.

		Returns a <subsonic-response> element with a nested <scanStatus> element on success.
		 */
		return {scanStatus: this.engine.ioService.getScanStatus()};
	}

	async startScan(req: ApiOptions<{}>): Promise<void> {
		/*
		http://your-server/rest/startScan Since 1.15.0

		Initiates a rescan of the media libraries. Takes no extra parameters.

		Returns a <subsonic-response> element with a nested <scanStatus> element on success.
		 */
		this.engine.rootService.refresh(); // do not wait
	}

	async getArtist(req: ApiOptions<SubsonicParameters.ID>): Promise<{ artist: Subsonic.ArtistWithAlbumsID3 }> {
		/*
		 getArtist

		 http://your-server/rest/getArtist.view
		 Since 1.8.0

		 Returns details for an artist, including a list of albums. This method organizes music according to ID3 tags.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The artist ID.

		 Returns a <subsonic-response> element with a nested <artist> element on success.
		 */
		const artist = await this.byID<Artist>(req.query.id, this.engine.store.artistStore);
		const albumlist = await this.engine.store.albumStore.search({artistID: artist.id});
		albumlist.sort((a, b) => {
			return (a.year || 0) - (b.year || 0);
		});
		const state = await this.engine.stateService.findOrCreate(artist.id, req.user.id, DBObjectType.artist);
		const states = await this.engine.stateService.findOrCreateMulti(albumlist.map(a => a.id), req.user.id, DBObjectType.album);
		const artistid3 = <Subsonic.ArtistWithAlbumsID3>FORMAT.packArtist(artist, state);
		artistid3.album = albumlist.map(a => FORMAT.packAlbum(a, states[a.id]));
		return {artist: artistid3};
	}

	async getAlbum(req: ApiOptions<SubsonicParameters.ID>): Promise<{ album: Subsonic.AlbumWithSongsID3 }> {
		/*
		 getAlbum

		 http://your-server/rest/getAlbum.view
		 Since 1.8.0

		 Returns details for an album, including a list of songs. This method organizes music according to ID3 tags.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The album ID.

		 Returns a <subsonic-response> element with a nested <album> element on success.
		 */
		const album = await this.byID<Album>(req.query.id, this.engine.store.albumStore);
		const tracks = await this.engine.store.trackStore.byIds(album.trackIDs);
		const state = await this.engine.stateService.findOrCreate(album.id, req.user.id, DBObjectType.album);
		tracks.sort((a, b) => {
			return (a.tag.track || 0) - (b.tag.track || 0);
		});
		const childs = await this.prepareTracks(tracks, req.user);
		const albumid3 = <Subsonic.AlbumWithSongsID3>FORMAT.packAlbum(album, state);
		albumid3.song = childs;
		return {album: albumid3};
	}

	async getLyrics(req: ApiOptions<SubsonicParameters.Lyrics>): Promise<{ lyrics: Subsonic.Lyrics }> {
		/*
		 getLyrics

		 http://your-server/rest/getLyrics.view
		 Since 1.2.0

		 Searches for and returns lyrics for a given song.
		 Parameter 	Required 	Default 	Comment
		 artist 	No 		The artist name.
		 title 	No 		The song title.

		 Returns a <subsonic-response> element with a nested <lyrics> element on success. The <lyrics> element is empty if no matching lyrics was found.
		 */
		if (!req.query.artist || !req.query.title) {
			return {lyrics: {content: ''}};
		}
		const lyrics = await this.engine.audioService.getLyrics(req.query.artist, req.query.title);
		if (!lyrics) {
			return {lyrics: {content: ''}};
		}
		return {lyrics: {artist: lyrics.artist, title: lyrics.song, content: lyrics.lyric.replace(/\r\n/g, '\n')}};
	}

	async getPlayQueue(req: ApiOptions<{}>): Promise<{ playQueue: Subsonic.PlayQueue }> {
		/*
		 http://your-server/rest/getPlayQueue Since 1.12.0

		Returns the state of the play queue for this user (as set by savePlayQueue).
		This includes the tracks in the play queue, the currently playing track, and the position within this track.
		 Typically used to allow a user to move between different clients/apps while retaining the same play queue
		 (for instance when listening to an audio book).

		Returns a <subsonic-response> element with a nested <playQueue> element on success,
		or an empty <subsonic-response> if no play queue has been saved.
		 */
		const playqueue = await this.engine.playqueueService.getQueue(req.user.id);
		if (!playqueue) {
			const empty: any = {};
			return empty;
		}
		const tracks = await this.engine.store.trackStore.byIds(playqueue.trackIDs);
		const childs = await this.prepareTracks(tracks, req.user);
		return {playQueue: FORMAT.packPlayQueue(playqueue, req.user, childs)};
	}

	async savePlayQueue(req: ApiOptions<SubsonicParameters.PlayQueue>): Promise<void> {
		/*
		 http://your-server/rest/savePlayQueue Since 1.12.0

		Saves the state of the play queue for this user. This includes the tracks in the play queue,
		the currently playing track, and the position within this track. Typically used to allow a user to move between different clients/apps
		while retaining the same play queue (for instance when listening to an audio book).
		Parameter 	Required 	Default 	Comment
		id 	Yes 		ID of a song in the play queue. Use one id parameter for each song in the play queue.
		current 	No 		The ID of the current playing song.
		position 	No 		The position in milliseconds within the currently playing song.

		Returns an empty <subsonic-response> element on success.
		 */
		const ids: Array<string> = req.query.id ? (Array.isArray(req.query.id) ? req.query.id : [req.query.id]) : [];
		await this.engine.playqueueService.saveQueue(req.user.id, ids, req.query.current, req.query.position, req.client);
	}

	async deleteInternetRadioStation(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		deleteInternetRadioStation

		http://your-server/rest/deleteInternetRadioStation Since 1.16.0

		Deletes an existing internet radio station. Only users with admin privileges are allowed to call this method.
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.

		Returns an empty <subsonic-response> element on success.
		 */
		const radio = await this.byID(req.query.id, await this.engine.store.radioStore);
		await this.engine.store.radioStore.remove(radio.id);
	}

	async createInternetRadioStation(req: ApiOptions<SubsonicParameters.InternetRadioCreate>): Promise<void> {
		/*
		createInternetRadioStation

		http://your-server/rest/createInternetRadioStation Since 1.16.0

		Adds a new internet radio station. Only users with admin privileges are allowed to call this method.
		Parameter 	Required 	Default 	Comment
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.

		Returns an empty <subsonic-response> element on success.
		 */
		await this.engine.radioService.addRadio(req.query.name, req.query.streamUrl, req.query.homepageUrl);
	}

	async updateInternetRadioStation(req: ApiOptions<SubsonicParameters.InternetRadioUpdate>): Promise<void> {
		/*
		updateInternetRadioStation

		http://your-server/rest/updateInternetRadioStation Since 1.16.0

		Updates an existing internet radio station. Only users with admin privileges are allowed to call this method.
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID for the station.
		streamUrl 	Yes 		The stream URL for the station.
		name 	Yes 		The user-defined name for the station.
		homepageUrl 	No 		The home page URL for the station.

		Returns an empty <subsonic-response> element on success.
		 */
		const radio = await this.byID(req.query.id, await this.engine.store.radioStore);
		await this.engine.radioService.updateRadio(radio, req.query.name, req.query.streamUrl, req.query.homepageUrl);
	}

	async getInternetRadioStations(req: ApiOptions<{}>): Promise<{ internetRadioStations: Subsonic.InternetRadioStations }> {
		/*
		 getInternetRadioStations

		 http://your-server/rest/getInternetRadioStations.view
		 Since 1.9.0

		 Returns all internet radio stations. Takes no extra parameters.

		 Returns a <subsonic-response> element with a nested <internetRadioStations> element on success.
		 */
		const radios = await this.engine.store.radioStore.all();
		return {internetRadioStations: {internetRadioStation: radios.filter(radio => !radio.disabled).map(radio => FORMAT.packRadio(radio))}};
	}

	/* Maybe implement someday? */

	async getVideos(req: ApiOptions<{}>): Promise<{ videos: Subsonic.Videos }> {
		/*
		 getVideos

		 http://your-server/rest/getVideos.view
		 Since 1.8.0

		 Returns all video files.

		 Returns a <subsonic-response> element with a nested <videos> element on success.
		 */
		Promise.reject('not implemented');
		return {videos: {}};
	}

	async getVideoInfo(req: ApiOptions<SubsonicParameters.ID>): Promise<{ videoInfo: Subsonic.VideoInfo }> {
		/*.
		 http://your-server/rest/getVideoInfo Since 1.14.0

		Returns details for a video, including information about available audio tracks, subtitles (captions) and conversions.
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The video ID.

		Returns a <subsonic-response> element with a nested <videoInfo> element on success.
		 */
		Promise.reject('not implemented');
		return {videoInfo: {id: ''}};
	}

	async getCaptions(req: ApiOptions<SubsonicParameters.Captions>): Promise<IApiBinaryResult> {
		/*
		 http://your-server/rest/getCaptions Since 1.14.0

		Returns captions (subtitles) for a video. Use getVideoInfo to get a list of available captions.
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The ID of the video.
		format 	No 		Preferred captions format ("srt" or "vtt").

		Returns the raw video captions.
		 */
		Promise.reject('not implemented');
		return {};
	}

	async scrobble(req: ApiOptions<SubsonicParameters.Scrobble>): Promise<void> {
		/*
		 scrobble

		 http://your-server/rest/scrobble.view
		 Since 1.5.0

		 Registers the local playback of one or more media files. Typically used when playing media that is cached on the client. This operation includes the following:

			"Scrobbles" the media files on last.fm if the user has configured his/her last.fm credentials on the Subsonic server (Settings > Personal).
			Updates the play count and last played timestamp for the media files. (Since 1.11.0)
			Makes the media files appear in the "Now playing" page in the web app, and appear in the list of songs returned by getNowPlaying (Since 1.11.0)

		 Since 1.8.0 you may specify multiple id (and optionally time) parameters to scrobble multiple files.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the file to scrobble.
		 time 	No 		(Since 1.8.0) The time (in milliseconds since 1 Jan 1970) at which the song was listened to.
		 submission 	No 	True 	Whether this is a "submission" or a "now playing" notification.

		 Returns an empty <subsonic-response> element on success.
		 */
		Promise.reject('not implemented');
	}

	async getShares(req: ApiOptions<{}>): Promise<{ shares: Subsonic.Shares }> {
		/*
		 getShares

		 http://your-server/rest/getShares.view
		 Since 1.6.0

		 Returns information about shared media this user is allowed to manage. Takes no extra parameters.

		 Returns a <subsonic-response> element with a nested <shares> element on success.
		 */
		Promise.reject('not implemented');
		return {shares: {}};
	}

	async createShare(req: ApiOptions<SubsonicParameters.Share>): Promise<void> {
		/*
		 createShare

		 http://your-server/rest/createShare.view
		 Since 1.6.0

		 Creates a public URL that can be used by anyone to stream music or video from the Subsonic server.
		 The URL is short and suitable for posting on Facebook, Twitter etc. Note: The user must be authorized to share (see Settings > Users > user is allowed to share files with anyone).
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of a song, album or video to share. Use one id parameter for each entry to share.
		 description 	No 		A user-defined description that will be displayed to people visiting the shared media.
		 expires 	No 		The time at which the share expires. Given as milliseconds since 1970.

		 Returns a <subsonic-response> element with a nested <shares> element on success, which in turns contains a single <share> element for the newly created share.
		 */
		Promise.reject('not implemented');
	}

	async updateShare(req: ApiOptions<SubsonicParameters.Share>): Promise<void> {
		/*
		 updateShare

		 http://your-server/rest/updateShare.view
		 Since 1.6.0

		 Updates the description and/or expiration date for an existing share.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the share to update.
		 description 	No 		A user-defined description that will be displayed to people visiting the shared media.
		 expires 	No 		The time at which the share expires. Given as milliseconds since 1970, or zero to remove the expiration.

		 Returns an empty <subsonic-response> element on success.
		 */
		Promise.reject('not implemented');
	}

	async deleteShare(req: ApiOptions<SubsonicParameters.ID>): Promise<void> {
		/*
		 deleteShare

		 http://your-server/rest/deleteShare.view
		 Since 1.6.0

		 Deletes an existing share.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		ID of the share to delete.

		 Returns an empty <subsonic-response> element on success.
		 */
		Promise.reject('not implemented');
	}

	async hls(req: ApiOptions<SubsonicParameters.HLS>): Promise<IApiBinaryResult> {
		/*
		 hls

		 http://your-server/rest/hls.m3u8
		 Since 1.8.0

		 Creates an HLS (HTTP Live Streaming) playlist used for streaming video or audio. HLS is a streaming protocol implemented by Apple and works by breaking the overall stream
		 into a sequence of small HTTP-based file downloads. It's supported by iOS and newer versions of Android.
		 This method also supports adaptive bitrate streaming, see the bitRate parameter.
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the media file to stream.
		 bitRate 	No 		If specified, the server will attempt to limit the bitrate to this value, in kilobits per second. If this parameter is specified more than once,
		 the server will create a variant playlist, suitable for adaptive bitrate streaming. The playlist will support streaming at all the specified bitrates.
		 The server will automatically choose video dimensions that are suitable for the given bitrates. Since 1.9.0 you may explicitly request a certain width (480)
		  and height (360) like so: bitRate=1000@480x360

		 Returns an M3U8 playlist on success (content type "application/vnd.apple.mpegurl"), or an XML document on error (in which case the HTTP content type will start with "text/xml").
		 */
		Promise.reject('not implemented');
		return {};
	}

	async jukeboxControl(req: ApiOptions<SubsonicParameters.Jukebox>): Promise<{ jukeboxStatus: Subsonic.JukeboxStatus }> {
		/*
		 jukeboxControl

		 http://your-server/rest/jukeboxControl.view
		 Since 1.2.0

		 Controls the jukebox, i.e., playback directly on the server's audio hardware. Note: The user must be authorized to control the jukebox (see Settings > Users > user is allowed to play files in jukebox mode).
		 Parameter 	Required 	Default 	Comment
		 action 	Yes 		The operation to perform. Must be one of: get, status (since 1.7.0), set (since 1.7.0), start, stop, skip, add, clear, remove, shuffle, setGain
		 index 	No 		Used by skip and remove. Zero-based index of the song to skip to or remove.
		 offset 	No 		(Since 1.7.0) Used by skip. Start playing this many seconds into the track.
		 id 	No 		Used by add and set. ID of song to add to the jukebox playlist. Use multiple id parameters to add many songs in the same request. (set is similar to a clear followed by a add, but will not change the currently playing track.)
		 gain 	No 		Used by setGain to control the playback volume. A float value between 0.0 and 1.0.

		 Returns a <jukeboxStatus> element on success, unless the get action is used, in which case a nested <jukeboxPlaylist> element is returned.
		 */
		Promise.reject('not implemented');
		return {jukeboxStatus: {currentIndex: 0, playing: false, gain: 0}};
	}

}

