import { Album } from '../../../entity/album/album.js';
import { Artist } from '../../../entity/artist/artist.js';
import { Folder } from '../../../entity/folder/folder.js';
import { Track } from '../../../entity/track/track.js';
import { SubsonicApiBase, SubsonicFormatter } from './api.base.js';
import { AlbumOrderFields, DBObjectType, LastFMLookupType, TrackOrderFields } from '../../../types/enums.js';
import { PageResult } from '../../../entity/base/base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterArtistInfo, SubsonicParameterID, SubsonicParameterIndexes, SubsonicParameterMusicFolderID, SubsonicParameterSimilarSongs, SubsonicParameterTopSongs } from '../model/subsonic-rest-params.js';
import {
	SubsonicAlbumWithSongsID3,
	SubsonicArtistWithAlbumsID3,
	SubsonicChild,
	SubsonicGenre,
	SubsonicResponseAlbumInfo,
	SubsonicResponseAlbumWithSongsID3,
	SubsonicResponseArtistInfo,
	SubsonicResponseArtistInfo2,
	SubsonicResponseArtistsID3,
	SubsonicResponseArtistWithAlbumsID3,
	SubsonicResponseDirectory,
	SubsonicResponseGenres,
	SubsonicResponseIndexes,
	SubsonicResponseMusicFolders,
	SubsonicResponseSimilarSongs,
	SubsonicResponseSimilarSongs2,
	SubsonicResponseSong,
	SubsonicResponseTopSongs, SubsonicResponseVideoInfo, SubsonicResponseVideos
} from '../model/subsonic-rest-data.js';

export class SubsonicBrowsingApi extends SubsonicApiBase {
	/**
	 * Returns details for an artist, including a list of albums. This method organizes music according to ID3 tags.
	 * Since 1.8.0
	 * http://your-server/rest/getArtist.view
	 * @return  Returns a <subsonic-response> element with a nested <artist> element on success.
	 */
	@SubsonicRoute('getArtist.view', () => SubsonicResponseArtistWithAlbumsID3)
	async getArtist(@SubsonicParams() query: SubsonicParameterID, { orm, user }: Context): Promise<SubsonicResponseArtistWithAlbumsID3> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The artist ID.
		 */
		const artist = await this.findOneOrFailByID(query.id, orm.Artist);
		const albumlist = await orm.Album.findFilter({ artistIDs: [artist.id] }, [{ orderBy: AlbumOrderFields.year, orderDesc: true }]);
		const state = await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
		const states = await orm.State.findMany(albumlist.map(a => a.id), DBObjectType.album, user.id);
		const artistid3 = await this.format.packArtist(artist, state) as SubsonicArtistWithAlbumsID3;
		artistid3.album = await Promise.all(albumlist.map(a => this.format.packAlbum(a, states.find(s => s.id === a.id))));
		return { artist: artistid3 };
	}

	/**
	 * Returns details for an album, including a list of songs. This method organizes music according to ID3 tags.
	 * Since 1.8.0
	 * http://your-server/rest/getAlbum.view
	 * @return Returns a <subsonic-response> element with a nested <album> element on success.
	 */
	@SubsonicRoute('getAlbum.view', () => SubsonicResponseAlbumWithSongsID3)
	async getAlbum(@SubsonicParams() query: SubsonicParameterID, { orm, user }: Context): Promise<SubsonicResponseAlbumWithSongsID3> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The album ID.
		 */
		const album = await this.findOneOrFailByID(query.id, orm.Album);
		const state = await orm.State.findOrCreate(album.id, DBObjectType.album, user.id);
		const trackIDs = await album.tracks.getIDs();
		const tracks = await orm.Track.findFilter({ ids: trackIDs }, [{ orderBy: TrackOrderFields.trackNr }]);
		const childs = await this.prepareTracks(orm, tracks, user);
		const albumid3 = await this.format.packAlbum(album, state) as SubsonicAlbumWithSongsID3;
		albumid3.song = childs;
		return { album: albumid3 };
	}

	/**
	 * Returns artist info with biography, image URLs and similar artists, using data from last.fm.
	 * Since 1.11.0
	 * http://your-server/rest/getArtistInfo.view
	 * @return Returns a <subsonic-response> element with a nested <artistInfo> element on success.
	 */
	@SubsonicRoute('getArtistInfo.view', () => SubsonicResponseArtistInfo)
	async getArtistInfo(@SubsonicParams() query: SubsonicParameterArtistInfo, { engine, orm }: Context): Promise<SubsonicResponseArtistInfo> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist, album or song ID.
		count 	No 	20 	Max number of similar artists to return.
		includeNotPresent 	No 	false 	Whether to return artists that are not present in the media library.
		 */
		// TODO: repair subsonic artistinfo similar
		// let includeNotPresent = false;
		// if (query.includeNotPresent !== undefined) {
		// 	includeNotPresent = query.includeNotPresent;
		// }
		// const limitCount = query.count || 20;
		// let similar = artistInfo.similar || [];
		// similar = paginate(similar, limitCount, 0);
		// const folders: Array<Folder> = similar.filter(s => !!s.folder).map(s => <Folder>s.folder);
		// const children = await this.prepareFolders(folders, user);
		// const artists: Array<SubsonicArtist> = similar.map(s => {
		// 	let child: SubsonicChild | undefined;
		// 	if (s.folder) {
		// 		const f = s.folder;
		// 		child = children.find(c => c.id === f.id);
		// 	}
		// 	if (child) {
		// 		return {
		// 			id: child.id,
		// 			name: s.name,
		// 			starred: child.starred,
		// 			userRating: child.userRating,
		// 			averageRating: child.averageRating
		// 		};
		// 	}
		// 	return {
		// 		id: '-1', // report an invalid id (as does subsonic/airsonic)
		// 		name: s.name
		// 	};
		// });
		const folder = await orm.Folder.findOneOrFailByID(query.id);
		if (folder) {
			if (folder.mbArtistID) {
				const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, folder.mbArtistID);
				if (lastfm?.artist) {
					return { artistInfo: this.format.packArtistInfo(lastfm.artist) };
				}
			} else if (folder.artist) {
				const al = await engine.metadata.lastFMArtistSearch(orm, folder.artist);
				if (al?.artist) {
					const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, al.artist.mbid);
					if (lastfm?.artist) {
						return { artistInfo: this.format.packArtistInfo(lastfm.artist) };
					}
				}
			}
		}
		return { artistInfo: {} };
	}

	/**
	 * Similar to getArtistInfo, but organizes music according to ID3 tags.
	 * Since 1.11.0
	 * http://your-server/rest/getArtistInfo2.view
	 * @return Returns a <subsonic-response> element with a nested <artistInfo2> element on success.
	 */
	@SubsonicRoute('getArtistInfo2.view', () => SubsonicResponseArtistInfo2)
	async getArtistInfo2(@SubsonicParams() query: SubsonicParameterArtistInfo, { engine, orm }: Context): Promise<SubsonicResponseArtistInfo2> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist ID.
		count 	No 	20 	Max number of similar artists to return.
		includeNotPresent 	No 	false 	Whether to return artists that are not present in the media library.
		*/
		// TODO: repair subsonic artistinfo similar
		// let includeNotPresent = false;
		// if (query.includeNotPresent !== undefined) {
		// 	includeNotPresent = query.includeNotPresent;
		// }
		// const ids = (infos.similar || []).filter(sim => !!sim.artist).map(sim => (<Artist>sim.artist).id);
		// const states = await engine.stateService.findOrCreateMany(ids, user.id, DBObjectType.artist);
		// const result: Array<SubsonicArtistID3> = [];
		// (infos.similar || []).forEach(sim => {
		// 	if (sim.artist) {
		// 		result.push(FORMAT.packArtist(sim.artist, states[sim.artist.id]));
		// 	} else if (includeNotPresent) {
		// 		result.push({
		// 			id: '-1', // report an invalid id (as does subsonic/airsonic)
		// 			name: sim.name,
		// 			albumCount: 0
		// 		});
		// 	}
		// });
		const artist = await orm.Artist.findOneOrFailByID(query.id);
		if (artist) {
			if (artist.mbArtistID) {
				const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, artist.mbArtistID);
				if (lastfm && lastfm.artist) {
					return { artistInfo2: this.format.packArtistInfo2(lastfm.artist) };
				}
			} else if (artist.name) {
				const al = await engine.metadata.lastFMArtistSearch(orm, artist.name);
				if (al && al.artist) {
					const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, al.artist.mbid);
					if (lastfm && lastfm.artist) {
						return { artistInfo2: this.format.packArtistInfo2(lastfm.artist) };
					}
				}
			}
		}
		return { artistInfo2: {} };
	}

	/**
	 * Returns album notes, image URLs etc, using data from last.fm.
	 * Since 1.14.0
	 * http://your-server/rest/getAlbumInfo.view
	 * @return  Returns a <subsonic-response> element with a nested <albumInfo> element on success.
	 */
	@SubsonicRoute('getAlbumInfo.view', () => SubsonicResponseAlbumInfo)
	async getAlbumInfo(@SubsonicParams() query: SubsonicParameterID, { engine, orm }: Context): Promise<SubsonicResponseAlbumInfo> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The album or song ID.
		 */
		const folder = await this.findOneOrFailByID(query.id, orm.Folder);
		if (folder) {
			if (folder.mbReleaseID) {
				const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, folder.mbReleaseID);
				if (lastfm && lastfm.album) {
					return { albumInfo: this.format.packAlbumInfo(lastfm.album) };
				}
			} else if (folder.album && folder.artist) {
				const al = await engine.metadata.lastFMAlbumSearch(orm, folder.album, folder.artist);
				if (al && al.album) {
					const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, al.album.mbid);
					if (lastfm && lastfm.album) {
						return { albumInfo: this.format.packAlbumInfo(lastfm.album) };
					}
				}
			}
		}
		return { albumInfo: {} };
	}

	/**
	 * Similar to getAlbumInfo, but organizes music according to ID3 tags.
	 * Since 1.14.0
	 * http://your-server/rest/getAlbumInfo2.view
	 * @return Returns a <subsonic-response> element with a nested <albumInfo> element on success.
	 */
	@SubsonicRoute('getAlbumInfo2.view', () => SubsonicResponseAlbumInfo)
	async getAlbumInfo2(@SubsonicParams() query: SubsonicParameterID, { engine, orm }: Context): Promise<SubsonicResponseAlbumInfo> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The album ID.
		 */
		const album = await this.findOneOrFailByID(query.id, orm.Album);
		if (album) {
			if (album.mbReleaseID) {
				const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, album.mbReleaseID);
				if (lastfm && lastfm.album) {
					return { albumInfo: this.format.packAlbumInfo(lastfm.album) };
				}
			} else if (album.name && album.artist.id()) {
				const al = await engine.metadata.lastFMAlbumSearch(orm, album.name, (await album.artist.getOrFail()).name);
				if (al && al.album) {
					const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, al.album.mbid);
					if (lastfm && lastfm.album) {
						return { albumInfo: this.format.packAlbumInfo(lastfm.album) };
					}
				}
			}
		}
		return { albumInfo: {} };
	}

	/**
	 * Returns all genres.
	 * Since 1.9.0
	 * http://your-server/rest/getGenres.view
	 * @return  Returns a <subsonic-response> element with a nested <genres> element on success.
	 */
	@SubsonicRoute('getGenres.view', () => SubsonicResponseGenres)
	async getGenres(_query: unknown, { orm }: Context): Promise<SubsonicResponseGenres> {
		const genres = await orm.Genre.all();
		const list: Array<SubsonicGenre> = await Promise.all(
			genres.map(async genre => {
				return this.format.packGenre(genre);
			})
		);
		if (list.length === 0) {
			const dummy: SubsonicGenre = {
				content: '-',
				songCount: 0,
				artistCount: 0,
				albumCount: 0
			};
			list.push(dummy);
		}
		return { genres: { genre: list } };
	}

	/**
	 * Returns an indexed structure of all artists.
	 * Since 1.0.0
	 * http://your-server/rest/getIndexes.view
	 * @return   Returns a <subsonic-response> element with a nested <indexes> element on success.
	 */
	@SubsonicRoute('getIndexes.view', () => SubsonicResponseIndexes)
	async getIndexes(@SubsonicParams() query: SubsonicParameterIndexes, { engine, orm, user }: Context): Promise<SubsonicResponseIndexes> {
		/*
		 Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		If specified, only return artists in the music folder with the given ID. See getMusicFolders.
		 ifModifiedSince 	No 		If specified, only return a result if the artist collection has changed since the given time (in milliseconds since 1 Jan 1970).
		 */
		const folderIndexORM = await orm.Folder.indexFilter({
			rootIDs: query.musicFolderId ? [query.musicFolderId.toString()] : undefined,
			level: 1
		}, user, engine.settings.settings.index.ignoreArticles);
		const folderIndex = await engine.transform.Folder.folderIndex(orm, folderIndexORM);
		if (query.ifModifiedSince && query.ifModifiedSince > 0 && (folderIndex.lastModified <= query.ifModifiedSince)) {
			const empty: any = {};
			return empty;
		}
		let ids: Array<string> = [];
		folderIndex.groups.forEach(group => {
			ids = ids.concat(group.items.map(folder => folder.id));
		});
		const states = await orm.State.findMany(ids, DBObjectType.folder, user.id);
		return {
			indexes: {
				lastModified: folderIndex.lastModified,
				ignoredArticles: (engine.settings.settings.index.ignoreArticles || []).join(' '),
				index: await this.format.packFolderIndex(folderIndex, states)
				// shortcut?: Artist[]; use unknown, there is no api to add/remove shortcuts
				// child?: Child[]; use unknown
			}
		};
	}

	/**
	 * Similar to getIndexes, but organizes music according to ID3 tags.
	 * Since 1.8.0
	 * http://your-server/rest/getArtists.view
	 * @return Returns a <subsonic-response> element with a nested <artists> element on success.
	 */
	@SubsonicRoute('getArtists.view', () => SubsonicResponseArtistsID3)
	async getArtists(@SubsonicParams() query: SubsonicParameterMusicFolderID, { engine, orm, user }: Context): Promise<SubsonicResponseArtistsID3> {
		/*
         Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		If specified, only return artists in the music folder with the given ID. See getMusicFolders.
		 */
		const artistIndex = await orm.Artist.indexFilter({
			rootIDs: query.musicFolderId ? [query.musicFolderId.toString()] : undefined
		}, user, engine.settings.settings.index.ignoreArticles);
		let ids: Array<string> = [];
		artistIndex.groups.forEach(group => {
			ids = ids.concat(group.items.map(artist => artist.id));
		});
		const states = await orm.State.findMany(ids, DBObjectType.artist, user.id);
		return {
			artists: {
				ignoredArticles: (engine.settings.settings.index.ignoreArticles || []).join(' '),
				index: await this.format.packArtistIndex(artistIndex, states)
			}
		};
	}

	/**
	 * Returns a listing of all files in a music directory. Typically used to get list of albums for an artist, or list of songs for an album.
	 * Since 1.0.0
	 * http://your-server/rest/getMusicDirectory.view
	 * @return   Returns a <subsonic-response> element with a nested <directory> element on success.
	 */
	@SubsonicRoute('getMusicDirectory.view', () => SubsonicResponseDirectory)
	async getMusicDirectory(@SubsonicParams() query: SubsonicParameterID, { orm, user }: Context): Promise<SubsonicResponseDirectory> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the music folder. Obtained by calls to getIndexes or getMusicDirectory.
		 */
		const folder = await this.findOneOrFailByID(query.id, orm.Folder);
		const tracks = await folder.tracks.getItems();
		const folders = await folder.children.getItems();
		let childs: Array<SubsonicChild> = [];
		let list = await this.prepareFolders(orm, folders, user);
		childs = childs.concat(list);
		list = await this.prepareTracks(orm, tracks, user);
		childs = childs.concat(list);
		const state = await orm.State.findOrCreate(folder.id, DBObjectType.folder, user.id);
		const directory = await this.format.packDirectory(folder, state);
		directory.child = childs;
		return { directory };
	}

	/**
	 * Returns all configured top-level music folders. Takes no extra parameters.
	 * Since 1.0.0
	 * http://your-server/rest/getMusicFolders.view
	 * @return Returns a <subsonic-response> element with a nested <musicFolders> element on success.
	 */
	@SubsonicRoute('getMusicFolders.view', () => SubsonicResponseMusicFolders)
	async getMusicFolders(_query: unknown, { orm }: Context): Promise<SubsonicResponseMusicFolders> {
		const list = await orm.Root.all();
		return { musicFolders: { musicFolder: list.map(this.format.packRoot) } };
	}

	/**
	 * Returns a random collection of songs from the given artist and similar artists, using data from last.fm. Typically used for artist radio features.
	 * Since 1.11.0
	 * http://your-server/rest/getSimilarSongs.view
	 * @return Returns a <subsonic-response> element with a nested <similarSongs> element on success.
	 */
	@SubsonicRoute('getSimilarSongs.view', () => SubsonicResponseSimilarSongs)
	async getSimilarSongs(@SubsonicParams() query: SubsonicParameterSimilarSongs, { engine, orm, user }: Context): Promise<SubsonicResponseSimilarSongs> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist, album or song ID.
		count 	No 	50 	Max number of songs to return.
		 */
		const result = await orm.findInRepos(query.id, [orm.Track, orm.Folder, orm.Artist, orm.Album]);
		if (!result?.obj) {
			return Promise.reject({ fail: SubsonicFormatter.FAIL.NOTFOUND });
		}
		let tracks: PageResult<Track> | undefined;
		const page = { take: query.count || 50, skip: 0 };
		switch (result.objType) {
			case DBObjectType.track:
				tracks = await engine.metadata.similarTracks.byTrack(orm, result.obj as Track, page);
				break;
			case DBObjectType.folder:
				tracks = await engine.metadata.similarTracks.byFolder(orm, result.obj as Folder, page);
				break;
			case DBObjectType.artist:
				tracks = await engine.metadata.similarTracks.byArtist(orm, result.obj as Artist, page);
				break;
			case DBObjectType.album:
				tracks = await engine.metadata.similarTracks.byAlbum(orm, result.obj as Album, page);
				break;
			default:
		}
		const childs = tracks ? await this.prepareTracks(orm, tracks.items, user) : [];
		return { similarSongs: this.format.packSimilarSongs(childs) };
	}

	/**
	 * Similar to getSimilarSongs, but organizes music according to ID3 tags.
	 * Since 1.11.0
	 * http://your-server/rest/getSimilarSongs2.view
	 * @return Returns a <subsonic-response> element with a nested <similarSongs2> element on success.
	 */
	@SubsonicRoute('getSimilarSongs2.view', () => SubsonicResponseSimilarSongs2)
	async getSimilarSongs2(@SubsonicParams() query: SubsonicParameterSimilarSongs, { engine, orm, user }: Context): Promise<SubsonicResponseSimilarSongs2> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist ID.
		count 	No 	50 	Max number of songs to return.
		 */
		const artist = await orm.Artist.findOneOrFailByID(query.id);
		const page = { take: query.count || 50, skip: 0 };
		const tracks = await engine.metadata.similarTracks.byArtist(orm, artist, page);
		const childs = tracks ? await this.prepareTracks(orm, tracks.items, user) : [];
		return { similarSongs2: this.format.packSimilarSongs2(childs) };
	}

	/**
	 * Returns details for a song.
	 * Since 1.8.0
	 * http://your-server/rest/getSong.view
	 * @return Returns a <subsonic-response> element with a nested <song> element on success.
	 */
	@SubsonicRoute('getSong.view', () => SubsonicResponseSong)
	async getSong(@SubsonicParams() query: SubsonicParameterID, { orm, user }: Context): Promise<SubsonicResponseSong> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The song ID.
		 */
		const track = await this.findOneOrFailByID(query.id, orm.Track);
		const child = await this.prepareTrack(orm, track, user);
		return { song: child };
	}

	/**
	 * Returns top songs for the given artist, using data from last.fm.
	 * Since 1.13.0
	 * http://your-server/rest/getTopSongs.view
	 * @return Returns a <subsonic-response> element with a nested <topSongs> element on success.
	 */
	@SubsonicRoute('getTopSongs.view', () => SubsonicResponseTopSongs)
	async getTopSongs(@SubsonicParams() query: SubsonicParameterTopSongs, { engine, orm, user }: Context): Promise<SubsonicResponseTopSongs> {
		/*
		Parameter 	Required 	Default 	Comment
		artist 	Yes 		The artist name.
		count 	No 	50 	Max number of songs to return.
		*/
		const page = { take: query.count || 50, skip: 0 };
		const tracks = await engine.metadata.topTracks.byArtistName(orm, query.artist, page);
		const childs = tracks ? await this.prepareTracks(orm, tracks.items, user) : [];
		return { topSongs: { song: childs } };
	}

	/**
	 * Returns all video files.
	 * Since 1.8.0
	 * http://your-server/rest/getVideos.view
	 * @return  Returns a <subsonic-response> element with a nested <videos> element on success.
	 */
	@SubsonicRoute('getVideos.view', () => SubsonicResponseVideos)
	async getVideos(_query: unknown, _ctx: Context): Promise<SubsonicResponseVideos> {
		return { videos: {} };
	}

	/**
	 * Returns details for a video, including information about available audio tracks, subtitles (captions) and conversions.
	 * Since 1.14.0
	 * http://your-server/rest/getVideoInfo.view
	 * @return Returns a <subsonic-response> element with a nested <videoInfo> element on success.
	 */
	@SubsonicRoute('getVideoInfo.view', () => SubsonicResponseVideoInfo)
	async getVideoInfo(@SubsonicParams() _query: SubsonicParameterID, _ctx: Context): Promise<SubsonicResponseVideoInfo> {
		/* .
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The video ID.
		 */
		return { videoInfo: { id: 0 } };
	}
}
