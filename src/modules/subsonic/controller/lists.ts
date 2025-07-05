import { Album } from '../../../entity/album/album.js';
import { Folder } from '../../../entity/folder/folder.js';
import { randomItems } from '../../../utils/random.js';

import { AlbumOrderFields, DBObjectType, FolderOrderFields, FolderType, FolderTypesAlbum, ListType } from '../../../types/enums.js';
import { TrackFilterArgs } from '../../../entity/track/track.args.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterAlbumList, SubsonicParameterSongsByGenre, SubsonicParameterAlbumList2, SubsonicParameterRandomSong, SubsonicParameterMusicFolderID } from '../model/subsonic-rest-params.js';
import {
	SubsonicNowPlayingEntry, SubsonicResponseAlbumList,
	SubsonicResponseAlbumList2,
	SubsonicResponseNowPlaying,
	SubsonicResponseRandomSongs, SubsonicResponseSongsByGenre, SubsonicResponseStarred, SubsonicResponseStarred2,
	SubsonicSongs,
	SubsonicStarred,
	SubsonicStarred2
} from '../model/subsonic-rest-data.js';
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';

@SubsonicController()
export class SubsonicListsApi {
	/**
	 * Returns what is currently being played by all users. Takes no extra parameters.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/getNowPlaying', () => SubsonicResponseNowPlaying, {
		summary: 'Now Playing',
		description: 'Returns what is currently being played by all users.',
		tags: ['Lists']
	})
	async getNowPlaying(@SubsonicCtx() { engine, orm, user }: Context): Promise<SubsonicResponseNowPlaying> {
		const list = await engine.nowPlaying.getNowPlaying();
		const result: Array<SubsonicNowPlayingEntry> = [];
		for (const entry of list) {
			const state = await orm.State.findOrCreate(entry.episode?.id || entry.track?.id || '',
				entry.episode?.id ? DBObjectType.episode : DBObjectType.track, user.id);
			result.push(await SubsonicFormatter.packNowPlaying(entry, state));
		}
		return { nowPlaying: { entry: result } };
	}

	/**
	 * Returns random songs matching the given criteria.
	 * Since 1.2.0
	 */
	@SubsonicRoute('/getRandomSongs', () => SubsonicResponseRandomSongs, {
		summary: 'Random Songs',
		description: 'Returns random songs matching the given criteria.',
		tags: ['Lists']
	})
	async getRandomSongs(@SubsonicParams() query: SubsonicParameterRandomSong, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseRandomSongs> {
		/*
		 Parameter 	Required 	Default 	Comment
		 size 	No 	10 	The maximum number of songs to return. Max 500.
		 genre 	No 		Only returns songs belonging to this genre.
		 fromYear 	No 		Only return songs published after or in this year.
		 toYear 	No 		Only return songs published before or in this year.
		 musicFolderId 	No 		Only return songs in the music folder with the given ID. See getMusicFolders.
		 */
		const amount = Math.min(query.size || 10, 500);
		const filter: TrackFilterArgs = {
			genres: query.genre ? [query.genre] : undefined,
			fromYear: query.fromYear,
			toYear: query.toYear,
			rootIDs: query.musicFolderId ? [query.musicFolderId] : undefined
		};
		const randomSongs: SubsonicSongs = {};
		const trackids = await orm.Track.findIDsFilter(filter);
		if (trackids.length > 0) {
			const limit: Array<string> = randomItems(trackids, amount);
			const tracks = await orm.Track.findByIDs(limit);
			randomSongs.song = await SubsonicHelper.prepareTracks(orm, tracks, user);
		}
		return { randomSongs };
	}

	/**
	 * Returns a list of random, newest, highest rated etc. albums. Similar to the album lists on the home page of the Subsonic web interface.
	 * Since 1.2.0
	 */
	@SubsonicRoute('/getAlbumList', () => SubsonicResponseAlbumList, {
		summary: 'Album List',
		description: 'Returns a list of random, newest, highest rated etc. albums. Similar to the album lists on the home page of the Subsonic web interface.',
		tags: ['Lists']
	})
	async getAlbumList(@SubsonicParams() query: SubsonicParameterAlbumList, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseAlbumList> {
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
		const take = query.size || 20;
		const skip = query.offset || 0;
		let folders: Array<Folder> = [];
		switch (query.type) {
			case 'random':
				folders = (await orm.Folder.findListFilter(
					ListType.random,
					undefined,
					{ folderTypes: FolderTypesAlbum },
					undefined,
					{ skip, take },
					user
				)).items;
				break;
			case 'starred':
				folders = (await orm.Folder.findListFilter(
					ListType.faved,
					undefined,
					{ folderTypes: FolderTypesAlbum },
					undefined,
					{ skip, take },
					user
				)).items;
				break;
			case 'frequent':
				folders = (await orm.Folder.findListFilter(
					ListType.frequent,
					undefined,
					{ folderTypes: FolderTypesAlbum },
					undefined,
					{ skip, take },
					user
				)).items;
				break;
			case 'recent':
				folders = (await orm.Folder.findListFilter(
					ListType.recent,
					undefined,
					{ folderTypes: FolderTypesAlbum },
					undefined,
					{ skip, take },
					user
				)).items;
				break;
			case 'highest':
				folders = (await orm.Folder.findListFilter(
					ListType.highest,
					undefined,
					{ folderTypes: FolderTypesAlbum },
					undefined,
					{ skip, take },
					user
				)).items;
				break;
			case 'newest':
				folders = await orm.Folder.findFilter(
					{ folderTypes: FolderTypesAlbum },
					[{ orderBy: FolderOrderFields.created, orderDesc: true }],
					{ skip, take }
				);
				break;
			case 'alphabeticalByArtist':
				folders = await orm.Folder.findFilter(
					{ folderTypes: FolderTypesAlbum },
					[{ orderBy: FolderOrderFields.artist, orderDesc: false }],
					{ skip, take }
				);
				break;
			case 'alphabeticalByName':
				folders = await orm.Folder.findFilter(
					{ folderTypes: FolderTypesAlbum },
					[{ orderBy: FolderOrderFields.album, orderDesc: false }],
					{ skip, take }
				);
				break;
			case 'byGenre':
				folders = await orm.Folder.findFilter(
					{ folderTypes: FolderTypesAlbum, genres: query.genre ? [query.genre] : undefined },
					[{ orderBy: FolderOrderFields.album, orderDesc: false }],
					{ skip, take }
				);
				break;
			case 'byYear':
				folders = await orm.Folder.findFilter(
					{
						folderTypes: FolderTypesAlbum,
						fromYear: query.fromYear,
						toYear: query.toYear
					},
					[{ orderBy: FolderOrderFields.album, orderDesc: false }],
					{ skip, take }
				);
				break;
			default:
				return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_INVALID));
		}
		const result = await SubsonicHelper.prepareFolders(orm, folders, user);
		return { albumList: { album: result } };
	}

	/**
	 * Similar to getAlbumList, but organizes music according to ID3 tags.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/getAlbumList2', () => SubsonicResponseAlbumList2, {
		summary: 'Album List 2',
		description: 'Similar to getAlbumList, but organizes music according to ID3 tags.',
		tags: ['Lists']
	})
	async getAlbumList2(@SubsonicParams() query: SubsonicParameterAlbumList2, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseAlbumList2> {
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
		const take = Math.min(query.size || 20, 500);
		const skip = query.offset || 0;
		const rootIDs = query.musicFolderId ? [query.musicFolderId] : undefined;
		let albums: Array<Album> = [];
		switch (query.type) {
			case 'random':
				albums = (await orm.Album.findListFilter(
					ListType.random,
					undefined,
					{ rootIDs },
					undefined,
					{ skip, take },
					user
				)).items;
				break;
			case 'starred':
				albums = (await orm.Album.findListFilter(
					ListType.faved,
					undefined,
					{ rootIDs },
					undefined,
					{ skip, take },
					user
				)).items;
				break;
			case 'frequent':
				albums = (await orm.Album.findListFilter(
					ListType.frequent,
					undefined,
					{ rootIDs },
					undefined,
					{ skip, take },
					user
				)).items;
				break;
			case 'recent':
				albums = (await orm.Album.findListFilter(
					ListType.recent,
					undefined,
					{ rootIDs },
					undefined,
					{ skip, take },
					user
				)).items;
				break;
			case 'highest':
				albums = (await orm.Album.findListFilter(
					ListType.highest,
					undefined,
					{ rootIDs },
					undefined,
					{ skip, take },
					user
				)).items;
				break;
			case 'byGenre':
				albums = await orm.Album.findFilter(
					{ genres: query.genre ? [query.genre] : undefined, rootIDs },
					[{ orderBy: AlbumOrderFields.name, orderDesc: false }],
					{ skip, take }
				);
				break;
			case 'byYear':
				albums = await orm.Album.findFilter(
					{ fromYear: query.fromYear, toYear: query.toYear, rootIDs },
					[{ orderBy: AlbumOrderFields.name, orderDesc: false }],
					{ skip, take }
				);
				break;
			case 'newest':
				albums = await orm.Album.findFilter(
					{ rootIDs },
					[{ orderBy: AlbumOrderFields.created, orderDesc: true }],
					{ skip, take }
				);
				break;
			case 'alphabeticalByArtist':
				albums = await orm.Album.findFilter(
					{ rootIDs },
					[{ orderBy: AlbumOrderFields.artist, orderDesc: true }],
					{ skip, take }
				);
				break;
			case 'alphabeticalByName':
				albums = await orm.Album.findFilter(
					{ rootIDs },
					[{ orderBy: AlbumOrderFields.name, orderDesc: true }],
					{ skip, take }
				);
				break;
			default:
				return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.PARAM_INVALID));
		}
		const result = await SubsonicHelper.prepareAlbums(orm, albums, user);
		return { albumList2: { album: result } };
	}

	/**
	 * Returns songs in a given genre.
	 * Since 1.9.0
	 */
	@SubsonicRoute('/getSongsByGenre', () => SubsonicResponseSongsByGenre, {
		summary: 'Songs By Genre',
		description: 'Returns songs in a given genre.',
		tags: ['Lists']
	})
	async getSongsByGenre(@SubsonicParams() query: SubsonicParameterSongsByGenre, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseSongsByGenre> {
		/*
		 Parameter 	Required 	Default 	Comment
		 genre 	Yes 		The genre, as returned by getGenres.
		 count 	No 	10 	The maximum number of songs to return. Max 500.
		 offset 	No 	0 	The offset. Useful if you want to page through the songs in a genre.
		 musicFolderId 	No 		(Since 1.12.0) Only return albums in the music folder with the given ID. See getMusicFolders
		 */
		const take = query.count || 10;
		const skip = query.offset || 0;
		const rootIDs = query.musicFolderId ? [query.musicFolderId] : undefined;
		const genres = query.genre ? [query.genre] : undefined;
		const tracks = await orm.Track.findFilter({ rootIDs, genres }, undefined, { skip, take }, user);
		const songsByGenre: SubsonicSongs = {};
		songsByGenre.song = await SubsonicHelper.prepareTracks(orm, tracks, user);
		return { songsByGenre };
	}

	/**
	 * Returns starred songs, albums and artists.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/getStarred', () => SubsonicResponseStarred, {
		summary: 'Starred',
		description: 'Returns starred songs, albums and artists.',
		tags: ['Lists']
	})
	async getStarred(@SubsonicParams() query: SubsonicParameterMusicFolderID, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseStarred> {
		/*
		 Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		(Since 1.12.0) Only return results from the music folder with the given ID. See getMusicFolders.
		 */
		const starred: SubsonicStarred = {};
		const rootIDs = query.musicFolderId ? [query.musicFolderId] : undefined;
		const tracks = await orm.Track.findListFilter(ListType.faved, undefined, { rootIDs }, undefined, undefined, user);
		if (tracks.items.length > 0) {
			starred.song = await SubsonicHelper.prepareTracks(orm, tracks.items, user);
		}
		const artists = await orm.Folder.findListFilter(ListType.faved, undefined, { folderTypes: [FolderType.artist], rootIDs }, undefined, undefined, user);
		if (artists.items.length > 0) {
			starred.artist = await SubsonicHelper.prepareFolderArtists(orm, artists.items, user);
		}
		const albums = await orm.Folder.findListFilter(ListType.faved, undefined, { folderTypes: FolderTypesAlbum, rootIDs }, undefined, undefined, user);
		if (albums.items.length > 0) {
			starred.album = await SubsonicHelper.prepareFolders(orm, albums.items, user);
		}
		return { starred };
	}

	/**
	 * Similar to getStarred, but organizes music according to ID3 tags.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/getStarred2', () => SubsonicResponseStarred2, {
		summary: 'Starred 2',
		description: 'Similar to getStarred, but organizes music according to ID3 tags.',
		tags: ['Lists']
	})
	async getStarred2(@SubsonicParams() query: SubsonicParameterMusicFolderID, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseStarred2> {
		/*
		 Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		(Since 1.12.0) Only return results from the music folder with the given ID. See getMusicFolders
		 */
		const starred2: SubsonicStarred2 = {};
		const rootIDs = query.musicFolderId ? [query.musicFolderId] : undefined;
		const tracks = await orm.Track.findListFilter(ListType.faved, undefined, { rootIDs }, undefined, undefined, user);
		if (tracks.items.length > 0) {
			starred2.song = await SubsonicHelper.prepareTracks(orm, tracks.items, user);
		}
		const artists = await orm.Artist.findListFilter(ListType.faved, undefined, { rootIDs }, undefined, undefined, user);
		if (artists.items.length > 0) {
			starred2.artist = await SubsonicHelper.prepareArtists(orm, artists.items, user);
		}
		const albums = await orm.Album.findListFilter(ListType.faved, undefined, { rootIDs }, undefined, undefined, user);
		if (albums.items.length > 0) {
			starred2.album = await SubsonicHelper.prepareAlbums(orm, albums.items, user);
		}
		return { starred2 };
	}
}
