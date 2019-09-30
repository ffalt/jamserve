import {Album} from '../../../engine/album/album.model';
import {Folder} from '../../../engine/folder/folder.model';
import {SearchQueryTrack} from '../../../engine/track/track.store';
import {FolderType, FolderTypesAlbum} from '../../../model/jam-types';
import {Subsonic} from '../../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../../model/subsonic-rest-params';
import {paginate} from '../../../utils/paginate';
import {randomItems} from '../../../utils/random';
import {ApiOptions, SubsonicApiBase} from '../base';
import {FORMAT} from '../format';

export class SubsonicListsApi extends SubsonicApiBase {

	/**
	 * Returns what is currently being played by all users. Takes no extra parameters.
	 * Since 1.0.0
	 * http://your-server/rest/getNowPlaying.view
	 * @return  Returns a <subsonic-response> element with a nested <nowPlaying> element on success.
	 */
	async getNowPlaying(req: ApiOptions<{}>): Promise<{ nowPlaying: Subsonic.NowPlaying }> {
		const list = await this.engine.nowPlayingService.getNowPlaying();
		const result: Array<Subsonic.NowPlayingEntry> = [];
		for (const entry of list) {
			const state = await this.engine.stateService.findOrCreate(entry.obj.id, req.user.id, entry.obj.type);
			result.push(FORMAT.packNowPlaying(entry, state));
		}
		return {nowPlaying: {entry: result}};
	}

	/**
	 * Returns random songs matching the given criteria.
	 * Since 1.2.0
	 * http://your-server/rest/getRandomSongs.view
	 * @return Returns a <subsonic-response> element with a nested <randomSongs> element on success.
	 */
	async getRandomSongs(req: ApiOptions<SubsonicParameters.RandomSong>): Promise<{ randomSongs: Subsonic.Songs }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 size 	No 	10 	The maximum number of songs to return. Max 500.
		 genre 	No 		Only returns songs belonging to this genre.
		 fromYear 	No 		Only return songs published after or in this year.
		 toYear 	No 		Only return songs published before or in this year.
		 musicFolderId 	No 		Only return songs in the music folder with the given ID. See getMusicFolders.
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

	/**
	 * Returns a list of random, newest, highest rated etc. albums. Similar to the album lists on the home page of the Subsonic web interface.
	 * Since 1.2.0
	 * http://your-server/rest/getAlbumList.view
	 * @return  Returns a <subsonic-response> element with a nested <albumList> element on success.
	 */
	async getAlbumList(req: ApiOptions<SubsonicParameters.AlbumList>): Promise<{ albumList: Subsonic.AlbumList }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 type 	Yes 		The list type. Must be one of the following: random, newest, highest, frequent, recent.
		 Since 1.8.0 you can also use alphabeticalByName or alphabeticalByArtist to page through all albums alphabetically, and starred to retrieve starred albums.
		 Since 1.10.1 you can use byYear and byGenre to list albums in a given year range or genre.
		 size 	No 	10 	The number of albums to return. Max 500.
		 offset 	No 	0 	The list offset. Useful if you for example want to page through the list of newest albums.
		 fromYear 	Yes (if type is byYear) 		The first year in the range.
		 toYear 	Yes (if type is byYear) 		The last year in the range.
		 genre 	Yes (if type is byGenre) 		The name of the genre, e.g., "Rock".
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
				folders = (await this.engine.store.folderStore.search({types: FolderTypesAlbum, offset, amount, sorts: [{field: 'created', descending: true}]})).items;
				break;
			case 'alphabeticalByArtist':
				folders = (await this.engine.store.folderStore.search({types: FolderTypesAlbum, offset, amount, sorts: [{field: 'artist', descending: false}]})).items;
				break;
			case 'alphabeticalByName':
				folders = (await this.engine.store.folderStore.search({types: FolderTypesAlbum, offset, amount, sorts: [{field: 'album', descending: false}]})).items;
				break;
			case 'starred':
				ids = await this.engine.folderService.getFavedIDs({types: FolderTypesAlbum}, req.user);
				folders = (await this.engine.store.folderStore.search({ids, amount, offset})).items;
				break;
			case 'frequent':
				ids = await this.engine.folderService.getFrequentlyPlayedIDs({types: FolderTypesAlbum}, req.user);
				folders = (await this.engine.store.folderStore.search({ids, amount, offset})).items;
				break;
			case 'recent':
				ids = await this.engine.folderService.getRecentlyPlayedIDs({types: FolderTypesAlbum}, req.user);
				folders = (await this.engine.store.folderStore.search({ids, amount, offset})).items;
				break;
			case 'highest':
				ids = await this.engine.folderService.getHighestRatedIDs({types: FolderTypesAlbum}, req.user);
				folders = (await this.engine.store.folderStore.search({ids, amount, offset})).items;
				break;
			case 'byGenre':
				folders = (await this.engine.store.folderStore.search({types: FolderTypesAlbum, offset, amount, genre: req.query.genre || ''})).items;
				break;
			case 'byYear':
				folders = (await this.engine.store.folderStore.search({offset, amount, types: FolderTypesAlbum, fromYear: req.query.fromYear, toYear: req.query.toYear})).items;
				break;
			default:
				return Promise.reject({fail: FORMAT.FAIL.PARAMETER, text: 'Unknown Album List Type'});
		}
		const result = await this.prepareFolders(folders, req.user);
		return {albumList: {album: result}};
	}

	/**
	 * Similar to getAlbumList, but organizes music according to ID3 tags.
	 * Since 1.8.0
	 * http://your-server/rest/getAlbumList2.view
	 * @return Returns a <subsonic-response> element with a nested <albumList2> element on success.
	 */
	async getAlbumList2(req: ApiOptions<SubsonicParameters.AlbumList2>): Promise<{ albumList2: Subsonic.AlbumList2 }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 type 	Yes 		The list type. Must be one of the following: random, newest, frequent, recent, starred, alphabeticalByName or alphabeticalByArtist. Since 1.10.1 you can use byYear and byGenre to list albums in a given year range or genre.
		 size 	No 	10 	The number of albums to return. Max 500
		 offset 	No 	0 	The list offset. Useful if you for example want to page through the list of newest albums.
		 fromYear 	Yes (if type is byYear) 		The first year in the range.
		 toYear 	Yes (if type is byYear) 		The last year in the range.
		 genre 	Yes (if type is byGenre) 		The name of the genre, e.g., "Rock".
		 musicFolderId 	No 		(Since 1.12.0) Only return albums in the music folder with the given ID. See getMusicFolders.
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
				albums = (await this.engine.store.albumStore.search({amount, offset, genre: req.query.genre || '', rootID})).items;
				break;
			case 'byYear':
				albums = (await this.engine.store.albumStore.search({amount, offset, fromYear: req.query.fromYear, toYear: req.query.toYear, rootID})).items;
				break;
			case 'newest':
				albums = (await this.engine.store.albumStore.search({rootID, offset, amount, sorts: [{field: 'created', descending: true}]})).items;
				break;
			case 'alphabeticalByArtist':
				albums = (await this.engine.store.albumStore.search({rootID, offset, amount, sorts: [{field: 'artist', descending: false}]})).items;
				break;
			case 'alphabeticalByName':
				albums = (await this.engine.store.albumStore.search({rootID, offset, amount, sorts: [{field: 'name', descending: false}]})).items;
				break;
			case 'starred':
				ids = await this.engine.albumService.getFavedIDs({rootID}, req.user);
				albums = await this.engine.store.albumStore.byIds(paginate(ids, amount, offset).items);
				break;
			case 'frequent':
				ids = await this.engine.albumService.getFrequentlyPlayedIDs({rootID}, req.user);
				albums = await this.engine.store.albumStore.byIds(paginate(ids, amount, offset).items);
				break;
			case 'recent':
				ids = await this.engine.albumService.getRecentlyPlayedIDs({rootID}, req.user);
				albums = await this.engine.store.albumStore.byIds(paginate(ids, amount, offset).items);
				break;
			case 'highest':
				ids = await this.engine.albumService.getHighestRatedIDs({rootID}, req.user);
				albums = await this.engine.store.albumStore.byIds(paginate(ids, amount, offset).items);
				break;
			default:
				return Promise.reject({fail: FORMAT.FAIL.PARAMETER, text: 'Unknown Album List Type'});
		}
		const result = await this.prepareAlbums(albums, req.user);
		return {albumList2: {album: result}};
	}

	/**
	 * Returns songs in a given genre.
	 * Since 1.9.0
	 * http://your-server/rest/getSongsByGenre.view
	 * @return Returns a <subsonic-response> element with a nested <songsByGenre> element on success.
	 */
	async getSongsByGenre(req: ApiOptions<SubsonicParameters.SongsByGenre>): Promise<{ songsByGenre: Subsonic.Songs }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 genre 	Yes 		The genre, as returned by getGenres.
		 count 	No 	10 	The maximum number of songs to return. Max 500.
		 offset 	No 	0 	The offset. Useful if you want to page through the songs in a genre.
		 musicFolderId 	No 		(Since 1.12.0) Only return albums in the music folder with the given ID. See getMusicFolders
		 */
		const songsByGenre: Subsonic.Songs = {};
		const tracklist = await this.engine.store.trackStore.searchIDs({genre: req.query.genre, rootID: req.query.musicFolderId ? req.query.musicFolderId.toString() : undefined});
		const limit = paginate(tracklist, req.query.count || 10, req.query.offset || 0);
		const tracks = await this.engine.store.trackStore.byIds(limit.items);
		songsByGenre.song = await this.prepareTracks(tracks, req.user);
		return {songsByGenre};
	}

	/**
	 * Returns starred songs, albums and artists.
	 * Since 1.8.0
	 * http://your-server/rest/getStarred.view
	 * @return Returns a <subsonic-response> element with a nested <starred> element on success.
	 */
	async getStarred(req: ApiOptions<SubsonicParameters.MusicFolderID>): Promise<{ starred: Subsonic.Starred }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		(Since 1.12.0) Only return results from the music folder with the given ID. See getMusicFolders.
		 */
		const rootID = (req.query.musicFolderId !== undefined ? req.query.musicFolderId.toString() : undefined);
		const starred: Subsonic.Starred = {};
		const trackIDs = await this.engine.trackService.getFavedIDs({rootID}, req.user);
		if (trackIDs.length > 0) {
			const tracks = await this.engine.store.trackStore.byIds(trackIDs);
			starred.song = await this.prepareTracks(tracks, req.user);
		}
		const artistFolderIDs = await this.engine.folderService.getFavedIDs({types: [FolderType.artist], rootID}, req.user);
		if (artistFolderIDs.length > 0) {
			const folders = await this.engine.store.folderStore.byIds(artistFolderIDs);
			starred.artist = await this.prepareFolderArtists(folders, req.user);
		}
		const albumFolderIDs = await this.engine.folderService.getFavedIDs({types: FolderTypesAlbum, rootID}, req.user);
		if (albumFolderIDs.length > 0) {
			const folders = await this.engine.store.folderStore.byIds(albumFolderIDs);
			starred.album = await this.prepareFolders(folders, req.user);
		}
		return {starred};
	}

	/**
	 * Similar to getStarred, but organizes music according to ID3 tags.
	 * Since 1.8.0
	 * http://your-server/rest/getStarred2.view
	 * @return Returns a <subsonic-response> element with a nested <starred2> element on success.
	 */
	async getStarred2(req: ApiOptions<SubsonicParameters.MusicFolderID>): Promise<{ starred2: Subsonic.Starred2 }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		(Since 1.12.0) Only return results from the music folder with the given ID. See getMusicFolders
		 */
		const rootID = (req.query.musicFolderId !== undefined ? req.query.musicFolderId.toString() : undefined);
		const starred2: Subsonic.Starred2 = {};
		const trackIDs = await this.engine.trackService.getFavedIDs({rootID}, req.user);
		if (trackIDs.length > 0) {
			const tracks = await this.engine.store.trackStore.byIds(trackIDs);
			starred2.song = await this.prepareTracks(tracks, req.user);
		}
		const albumIDs = await this.engine.albumService.getFavedIDs({rootID}, req.user);
		if (albumIDs.length > 0) {
			const albums = await this.engine.store.albumStore.byIds(albumIDs);
			starred2.album = await this.prepareAlbums(albums, req.user);
		}
		const artistIDs = await this.engine.artistService.getFavedIDs({rootID}, req.user);
		if (artistIDs.length > 0) {
			const artists = await this.engine.store.artistStore.byIds(artistIDs);
			starred2.artist = await this.prepareArtists(artists, req.user);
		}
		return {starred2};
	}

}
