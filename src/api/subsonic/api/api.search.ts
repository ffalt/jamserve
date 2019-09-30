import {DBObjectType} from '../../../db/db.types';
import {FolderType} from '../../../model/jam-types';
import {Subsonic} from '../../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../../model/subsonic-rest-params';
import {paginate} from '../../../utils/paginate';
import {ApiOptions, SubsonicApiBase} from '../base';
import {FORMAT} from '../format';

export class SubsonicSearchApi extends SubsonicApiBase {

	/**
	 * Returns a listing of files matching the given search criteria. Supports paging through the result. Deprecated since 1.4.0, use search2 instead.
	 * Since 1.0.0
	 * http://your-server/rest/search.view
	 * @return Returns a <subsonic-response> element with a nested <searchResult> element on success.
	 */
	async search(req: ApiOptions<SubsonicParameters.Search>): Promise<{ searchResult: Subsonic.SearchResult }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 artist 	No 		Artist to search for.
		 album 	No 		Album to search for.
		 title 	No 		Song title to search for.
		 any 	No 		Searches all fields.
		 count 	No 	20 	Maximum number of results to return.
		 offset 	No 	0 	Search result offset. Used for paging.
		 newerThan 	No 		Only return matches that are newer than this. Given as milliseconds since 1970.
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
		list = paginate(list, req.query.count || 20, req.query.offset || 0).items;
		const tracks = await this.engine.store.trackStore.byIds(list);
		searchResult.match = await this.prepareTracks(tracks, req.user);
		return {searchResult};
	}

	/**
	 * Returns albums, artists and songs matching the given search criteria. Supports paging through the result.
	 * Since 1.4.0
	 * http://your-server/rest/search2.view
	 * @return Returns a <subsonic-response> element with a nested <searchResult2> element on success.
	 */
	async search2(req: ApiOptions<SubsonicParameters.Search2>): Promise<{ searchResult2: Subsonic.SearchResult2 }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 query 	Yes 		Search query.
		 artistCount 	No 	20 	Maximum number of artists to return.
		 artistOffset 	No 	0 	Search result offset for artists. Used for paging.
		 albumCount 	No 	20 	Maximum number of albums to return.
		 albumOffset 	No 	0 	Search result offset for albums. Used for paging.
		 songCount 	No 	20 	Maximum number of songs to return.
		 songOffset 	No 	0 	Search result offset for songs. Used for paging.
		 musicFolderId 	No 		(Since 1.12.0) Only return results from the music folder with the given ID. See getMusicFolders
		 */
		const searchResult2: Subsonic.SearchResult2 = {};
		const rootID = req.query.musicFolderId ? req.query.musicFolderId.toString() : undefined;
		const query = (req.query.query || '').replace(/\*/g, '');
		const trackList = await this.engine.store.trackStore.search({query, rootID, amount: req.query.songCount || 20, offset: req.query.songOffset || 0});
		searchResult2.song = await this.prepareTracks(trackList.items, req.user);
		const artistFolderList = await this.engine.store.folderStore.search({query, rootID, type: FolderType.artist, amount: req.query.artistCount || 20, offset: req.query.artistOffset || 0});
		const albumFolderList = await this.engine.store.folderStore.search({query, rootID, type: FolderType.album, amount: req.query.artistCount || 20, offset: req.query.artistOffset || 0});
		const ids = (albumFolderList.items.map(f => f.id)).concat(artistFolderList.items.map(f => f.id));
		const states = await this.engine.stateService.findOrCreateMany(ids, req.user.id, DBObjectType.folder);
		searchResult2.artist = [];
		searchResult2.album = [];
		for (const folder of artistFolderList.items) {
			searchResult2.artist.push(FORMAT.packFolderArtist(folder, states[folder.id]));
		}
		for (const folder of albumFolderList.items) {
			searchResult2.album.push(FORMAT.packFolder(folder, states[folder.id]));
		}
		return {searchResult2};
	}

	/**
	 * Similar to search2, but organizes music according to ID3 tags.
	 * Since 1.8.0
	 * http://your-server/rest/search3.view
	 * @return Returns a <subsonic-response> element with a nested <searchResult3> element on success.
	 */
	async search3(req: ApiOptions<SubsonicParameters.Search2>): Promise<{ searchResult3: Subsonic.SearchResult3 }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 query 	Yes 		Search query.
		 artistCount 	No 	20 	Maximum number of artists to return.
		 artistOffset 	No 	0 	Search result offset for artists. Used for paging.
		 albumCount 	No 	20 	Maximum number of albums to return.
		 albumOffset 	No 	0 	Search result offset for albums. Used for paging.
		 songCount 	No 	20 	Maximum number of songs to return.
		 songOffset 	No 	0 	Search result offset for songs. Used for paging.
		 */
		const searchResult3: Subsonic.SearchResult3 = {};
		const tracklist = await this.engine.store.trackStore.searchIDs({query: req.query.query});
		if (tracklist.length > 0) {
			const limit = paginate(tracklist, req.query.songCount || 20, req.query.songOffset || 0);
			const tracks = await this.engine.store.trackStore.byIds(limit.items);
			searchResult3.song = await this.prepareTracks(tracks, req.user);
		}
		const albumlist = await this.engine.store.albumStore.searchIDs({query: req.query.query});
		if (albumlist.length > 0) {
			const limit = paginate(albumlist, req.query.albumCount || 20, req.query.albumOffset || 0);
			const albums = await this.engine.store.albumStore.byIds(limit.items);
			searchResult3.album = await this.prepareAlbums(albums, req.user);
		}
		const artistlist = await this.engine.store.artistStore.searchIDs({query: req.query.query});
		if (artistlist.length > 0) {
			const limit = paginate(artistlist, req.query.artistCount || 20, req.query.artistOffset || 0);
			const artists = await this.engine.store.artistStore.byIds(limit.items);
			searchResult3.artist = await this.prepareArtists(artists, req.user);
		}
		return {searchResult3};
	}

}
