import { paginate } from '../../../entity/base/base.utils.js';
import { DBObjectType, FolderType } from '../../../types/enums.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParameterSearch, SubsonicParameterSearch2 } from '../model/subsonic-rest-params.js';
import { SubsonicResponseSearchResult, SubsonicResponseSearchResult2, SubsonicResponseSearchResult3, SubsonicSearchResult, SubsonicSearchResult2, SubsonicSearchResult3 } from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';

@SubsonicController()
export class SubsonicSearchApi {
	/**
	 * Returns a listing of files matching the given search criteria. Supports paging through the result. Deprecated since 1.4.0, use search2 instead.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/search', () => SubsonicResponseSearchResult, {
		summary: 'Search',
		description: 'Returns a listing of files matching the given search criteria.',
		tags: ['Search']
	})
	async search(@SubsonicParams() query: SubsonicParameterSearch, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseSearchResult> {
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
		if (query.any) {
			query.artist = query.any;
			query.album = query.any;
			query.title = query.any;
		}
		let list = await orm.Track.findIDsFilter({
			artist: query.artist,
			album: query.album,
			name: query.title,
			since: query.newerThan
		});
		const searchResult: SubsonicSearchResult = { offset: query.offset || 0, totalHits: list.length };
		list = paginate(list, { take: query.count || 20, skip: query.offset || 0 }).items;
		const tracks = await orm.Track.findByIDs(list);
		searchResult.match = await SubsonicHelper.prepareTracks(orm, tracks, user);
		return { searchResult };
	}

	/**
	 * Returns albums, artists and songs matching the given search criteria. Supports paging through the result.
	 * Since 1.4.0
	 */
	@SubsonicRoute('/search2', () => SubsonicResponseSearchResult2, {
		summary: 'Search 2',
		description: 'Returns albums, artists and songs matching the given search criteria.',
		tags: ['Search']
	})
	async search2(@SubsonicParams() query: SubsonicParameterSearch2, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseSearchResult2> {
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
		const searchResult2: SubsonicSearchResult2 = {};
		const rootIDs = query.musicFolderId ? [query.musicFolderId] : undefined;
		const q = (query.query || '').replace(/\*/g, '');
		const trackList = await orm.Track.findFilter({ query: q, rootIDs }, undefined, { take: query.songCount || 20, skip: query.songOffset || 0 });
		searchResult2.song = await SubsonicHelper.prepareTracks(orm, trackList, user);

		const artistFolderList = await orm.Folder.findFilter({ query: q, rootIDs, folderTypes: [FolderType.artist] }, undefined, { take: query.artistCount || 20, skip: query.artistOffset || 0 });
		const albumFolderList = await orm.Folder.findFilter({ query: q, rootIDs, folderTypes: [FolderType.album] }, undefined, { take: query.artistCount || 20, skip: query.artistOffset || 0 });
		const ids = (albumFolderList.map(f => f.id)).concat(artistFolderList.map(f => f.id));
		const states = await SubsonicHelper.loadStates(orm, ids, DBObjectType.folder, user.id);
		searchResult2.artist = [];
		searchResult2.album = [];
		for (const folder of artistFolderList) {
			searchResult2.artist.push(await SubsonicFormatter.packFolderArtist(folder, states[folder.id]));
		}
		for (const folder of albumFolderList) {
			searchResult2.album.push(await SubsonicFormatter.packFolder(folder, states[folder.id]));
		}
		return { searchResult2 };
	}

	/**
	 * Similar to search2, but organizes music according to ID3 tags.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/search3', () => SubsonicResponseSearchResult3, {
		summary: 'Search 3',
		description: 'Similar to search2, but organizes music according to ID3 tags.',
		tags: ['Search']
	})
	async search3(@SubsonicParams() query: SubsonicParameterSearch2, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseSearchResult3> {
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
		const searchResult3: SubsonicSearchResult3 = {};
		const tracklist = await orm.Track.findIDsFilter({ query: query.query });
		if (tracklist.length > 0) {
			const limit = paginate(tracklist, { take: query.songCount || 20, skip: query.songOffset || 0 });
			const tracks = await orm.Track.findByIDs(limit.items);
			searchResult3.song = await SubsonicHelper.prepareTracks(orm, tracks, user);
		}
		const albumlist = await orm.Album.findIDsFilter({ query: query.query });
		if (albumlist.length > 0) {
			const limit = paginate(albumlist, { take: query.albumCount || 20, skip: query.albumOffset || 0 });
			const albums = await orm.Album.findByIDs(limit.items);
			searchResult3.album = await SubsonicHelper.prepareAlbums(orm, albums, user);
		}
		const artistlist = await orm.Artist.findIDsFilter({ query: query.query });
		if (artistlist.length > 0) {
			const limit = paginate(artistlist, { take: query.artistCount || 20, skip: query.artistOffset || 0 });
			const artists = await orm.Artist.findByIDs(limit.items);
			searchResult3.artist = await SubsonicHelper.prepareArtists(orm, artists, user);
		}
		return { searchResult3 };
	}
}
