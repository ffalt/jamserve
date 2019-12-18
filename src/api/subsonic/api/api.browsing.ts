import {DBObjectType} from '../../../db/db.types';
import {Album} from '../../../engine/album/album.model';
import {Artist} from '../../../engine/artist/artist.model';
import {Folder} from '../../../engine/folder/folder.model';
import {Track} from '../../../engine/track/track.model';
import {LastFMLookupType} from '../../../model/jam-types';
import {Subsonic} from '../../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../../model/subsonic-rest-params';
import {paginate} from '../../../utils/paginate';
import {ApiOptions, SubsonicApiBase} from '../base';
import {FORMAT} from '../format';

export class SubsonicBrowsingApi extends SubsonicApiBase {

	/**
	 * Returns details for an artist, including a list of albums. This method organizes music according to ID3 tags.
	 * Since 1.8.0
	 * http://your-server/rest/getArtist.view
	 * @return  Returns a <subsonic-response> element with a nested <artist> element on success.
	 */
	async getArtist(req: ApiOptions<SubsonicParameters.ID>): Promise<{ artist: Subsonic.ArtistWithAlbumsID3 }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The artist ID.
		 */
		const artist = await this.byID<Artist>(req.query.id, this.engine.store.artistStore);
		const albumlist = await this.engine.store.albumStore.search({artistID: artist.id, sorts: [{field: 'year', descending: true}]});
		const state = await this.engine.stateService.findOrCreate(artist.id, req.user.id, DBObjectType.artist);
		const states = await this.engine.stateService.findOrCreateMany(albumlist.items.map(a => a.id), req.user.id, DBObjectType.album);
		const artistid3 = FORMAT.packArtist(artist, state) as Subsonic.ArtistWithAlbumsID3;
		artistid3.album = albumlist.items.map(a => FORMAT.packAlbum(a, states[a.id]));
		return {artist: artistid3};
	}

	/**
	 * Returns details for an album, including a list of songs. This method organizes music according to ID3 tags.
	 * Since 1.8.0
	 * http://your-server/rest/getAlbum.view
	 * @return Returns a <subsonic-response> element with a nested <album> element on success.
	 */
	async getAlbum(req: ApiOptions<SubsonicParameters.ID>): Promise<{ album: Subsonic.AlbumWithSongsID3 }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The album ID.
		 */
		const album = await this.byID<Album>(req.query.id, this.engine.store.albumStore);
		let tracks = await this.engine.store.trackStore.byIds(album.trackIDs);
		const state = await this.engine.stateService.findOrCreate(album.id, req.user.id, DBObjectType.album);
		tracks = tracks.sort((a, b) => {
			return (a.tag.track || 0) - (b.tag.track || 0);
		});
		const childs = await this.prepareTracks(tracks, req.user);
		const albumid3 = FORMAT.packAlbum(album, state) as Subsonic.AlbumWithSongsID3;
		albumid3.song = childs;
		return {album: albumid3};
	}

	/**
	 * Returns artist info with biography, image URLs and similar artists, using data from last.fm.
	 * Since 1.11.0
	 * http://your-server/rest/getArtistInfo.view
	 * @return Returns a <subsonic-response> element with a nested <artistInfo> element on success.
	 */
	async getArtistInfo(req: ApiOptions<SubsonicParameters.ArtistInfo>): Promise<{ artistInfo: Subsonic.ArtistInfo }> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist, album or song ID.
		count 	No 	20 	Max number of similar artists to return.
		includeNotPresent 	No 	false 	Whether to return artists that are not present in the media library.
		 */
		// TODO: repair subsonic artistinfo similar
		// let includeNotPresent = false;
		// if (req.query.includeNotPresent !== undefined) {
		// 	includeNotPresent = req.query.includeNotPresent;
		// }
		// const limitCount = req.query.count || 20;
		// let similar = artistInfo.similar || [];
		// similar = paginate(similar, limitCount, 0);
		// const folders: Array<Folder> = similar.filter(s => !!s.folder).map(s => <Folder>s.folder);
		// const children = await this.prepareFolders(folders, req.user);
		// const artists: Array<Subsonic.Artist> = similar.map(s => {
		// 	let child: Subsonic.Child | undefined;
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
		const folder = await this.engine.store.folderStore.byId(req.query.id);
		if (folder) {
			if (folder.tag.mbArtistID) {
				const lastfm = await this.engine.metaDataService.lastFMLookup(LastFMLookupType.artist, folder.tag.mbArtistID);
				if (lastfm && lastfm.artist) {
					return {artistInfo: FORMAT.packArtistInfo(lastfm.artist)};
				}
			} else if (folder.tag.artist) {
				const al = await this.engine.metaDataService.lastFMArtistSearch(folder.tag.artist);
				if (al && al.artist) {
					const lastfm = await this.engine.metaDataService.lastFMLookup(LastFMLookupType.artist, al.artist.mbid);
					if (lastfm && lastfm.artist) {
						return {artistInfo: FORMAT.packArtistInfo(lastfm.artist)};
					}
				}
			}
		}
		return {artistInfo: {}};
	}

	/**
	 * Similar to getArtistInfo, but organizes music according to ID3 tags.
	 * Since 1.11.0
	 * http://your-server/rest/getArtistInfo2.view
	 * @return Returns a <subsonic-response> element with a nested <artistInfo2> element on success.
	 */
	async getArtistInfo2(req: ApiOptions<SubsonicParameters.ArtistInfo>): Promise<{ artistInfo2: Subsonic.ArtistInfo2 }> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist ID.
		count 	No 	20 	Max number of similar artists to return.
		includeNotPresent 	No 	false 	Whether to return artists that are not present in the media library.
		*/
		// TODO: repair subsonic artistinfo similar
		// let includeNotPresent = false;
		// if (req.query.includeNotPresent !== undefined) {
		// 	includeNotPresent = req.query.includeNotPresent;
		// }
		// const ids = (infos.similar || []).filter(sim => !!sim.artist).map(sim => (<Artist>sim.artist).id);
		// const states = await this.engine.stateService.findOrCreateMany(ids, req.user.id, DBObjectType.artist);
		// const result: Array<Subsonic.ArtistID3> = [];
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
		const artist = await this.engine.store.artistStore.byId(req.query.id);
		if (artist) {
			if (artist.mbArtistID) {
				const lastfm = await this.engine.metaDataService.lastFMLookup(LastFMLookupType.artist, artist.mbArtistID);
				if (lastfm && lastfm.artist) {
					return {artistInfo2: FORMAT.packArtistInfo2(lastfm.artist)};
				}
			} else if (artist.name) {
				const al = await this.engine.metaDataService.lastFMArtistSearch(artist.name);
				if (al && al.artist) {
					const lastfm = await this.engine.metaDataService.lastFMLookup(LastFMLookupType.artist, al.artist.mbid);
					if (lastfm && lastfm.artist) {
						return {artistInfo2: FORMAT.packArtistInfo2(lastfm.artist)};
					}
				}
			}
		}
		return {artistInfo2: {}};
	}

	/**
	 * Returns album notes, image URLs etc, using data from last.fm.
	 * Since 1.14.0
	 * http://your-server/rest/getAlbumInfo.view
	 * @return  Returns a <subsonic-response> element with a nested <albumInfo> element on success.
	 */
	async getAlbumInfo(req: ApiOptions<SubsonicParameters.ID>): Promise<{ albumInfo: Subsonic.AlbumInfo }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The album or song ID.
		 */
		const folder = await this.engine.store.folderStore.byId(req.query.id);
		if (folder) {
			if (folder.tag.mbReleaseID) {
				const lastfm = await this.engine.metaDataService.lastFMLookup(LastFMLookupType.album, folder.tag.mbReleaseID);
				if (lastfm && lastfm.album) {
					return {albumInfo: FORMAT.packAlbumInfo(lastfm.album)};
				}
			} else if (folder.tag.album && folder.tag.artist) {
				const al = await this.engine.metaDataService.lastFMAlbumSearch(folder.tag.album, folder.tag.artist);
				if (al && al.album) {
					const lastfm = await this.engine.metaDataService.lastFMLookup(LastFMLookupType.album, al.album.mbid);
					if (lastfm && lastfm.album) {
						return {albumInfo: FORMAT.packAlbumInfo(lastfm.album)};
					}
				}
			}
		}
		return {albumInfo: {}};
	}

	/**
	 * Similar to getAlbumInfo, but organizes music according to ID3 tags.
	 * Since 1.14.0
	 * http://your-server/rest/getAlbumInfo2.view
	 * @return Returns a <subsonic-response> element with a nested <albumInfo> element on success.
	 */
	async getAlbumInfo2(req: ApiOptions<SubsonicParameters.ID>): Promise<{ albumInfo: Subsonic.AlbumInfo }> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The album ID.
		 */
		const album = await this.engine.store.albumStore.byId(req.query.id);
		if (album) {
			if (album.mbReleaseID) {
				const lastfm = await this.engine.metaDataService.lastFMLookup(LastFMLookupType.album, album.mbReleaseID);
				if (lastfm && lastfm.album) {
					return {albumInfo: FORMAT.packAlbumInfo(lastfm.album)};
				}
			} else if (album.name && album.artist) {
				const al = await this.engine.metaDataService.lastFMAlbumSearch(album.name, album.artist);
				if (al && al.album) {
					const lastfm = await this.engine.metaDataService.lastFMLookup(LastFMLookupType.album, al.album.mbid);
					if (lastfm && lastfm.album) {
						return {albumInfo: FORMAT.packAlbumInfo(lastfm.album)};
					}
				}
			}
		}
		return {albumInfo: {}};
	}

	/**
	 * Returns all genres.
	 * Since 1.9.0
	 * http://your-server/rest/getGenres.view
	 * @return  Returns a <subsonic-response> element with a nested <genres> element on success.
	 */
	async getGenres(req: ApiOptions<{}>): Promise<{ genres: Subsonic.Genres }> {
		const genres = await this.engine.genreService.getGenres();
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

	/**
	 * Returns an indexed structure of all artists.
	 * Since 1.0.0
	 * http://your-server/rest/getIndexes.view
	 * @return   Returns a <subsonic-response> element with a nested <indexes> element on success.
	 */
	async getIndexes(req: ApiOptions<SubsonicParameters.Indexes>): Promise<{ indexes: Subsonic.Indexes }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		If specified, only return artists in the music folder with the given ID. See getMusicFolders.
		 ifModifiedSince 	No 		If specified, only return a result if the artist collection has changed since the given time (in milliseconds since 1 Jan 1970).
		 */
		const folderIndex = await this.engine.indexService.getFolderIndex({rootID: req.query.musicFolderId ? req.query.musicFolderId.toString() : undefined, level: 1});
		if (req.query.ifModifiedSince && req.query.ifModifiedSince > 0 && (folderIndex.lastModified <= req.query.ifModifiedSince)) {
			const empty: any = {};
			return empty;
		}
		let ids: Array<string> = [];
		folderIndex.groups.forEach(entry => {
			ids = ids.concat(entry.entries.map(e => e.folder.id));
		});
		const states = await this.engine.stateService.findOrCreateMany(ids, req.user.id, DBObjectType.folder);
		return {
			indexes: {
				lastModified: folderIndex.lastModified,
				ignoredArticles: (this.engine.indexService.indexConfig.ignoreArticles || []).join(' '),
				index: FORMAT.packFolderIndex(folderIndex, states)
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
	async getArtists(req: ApiOptions<SubsonicParameters.MusicFolderID>): Promise<{ artists: Subsonic.ArtistsID3 }> {
		/*
         Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		If specified, only return artists in the music folder with the given ID. See getMusicFolders.
		 */
		const artistIndex = await this.engine.indexService.getArtistIndex({rootID: req.query.musicFolderId ? req.query.musicFolderId.toString() : undefined});
		let ids: Array<string> = [];
		artistIndex.groups.forEach(entry => {
			ids = ids.concat(entry.entries.map(e => e.artist.id));
		});
		const states = await this.engine.stateService.findOrCreateMany(ids, req.user.id, DBObjectType.artist);
		return {
			artists: {
				ignoredArticles: (this.engine.indexService.indexConfig.ignoreArticles || []).join(' '),
				index: FORMAT.packArtistIndex(artistIndex, states)
			}
		};
	}

	/**
	 * Returns a listing of all files in a music directory. Typically used to get list of albums for an artist, or list of songs for an album.
	 * Since 1.0.0
	 * http://your-server/rest/getMusicDirectory.view
	 * @return   Returns a <subsonic-response> element with a nested <directory> element on success.
	 */
	async getMusicDirectory(req: ApiOptions<SubsonicParameters.ID>): Promise<{ directory: Subsonic.Directory }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the music folder. Obtained by calls to getIndexes or getMusicDirectory.
		 */
		const folder = await this.byID<Folder>(req.query.id, this.engine.store.folderStore);
		const tracks = this.engine.trackService.defaultSort((await this.engine.store.trackStore.search({path: folder.path})).items);
		const folders = this.engine.folderService.defaultSort((await this.engine.store.folderStore.search({parentID: folder.id})).items);
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

	/**
	 * Returns all configured top-level music folders. Takes no extra parameters.
	 * Since 1.0.0
	 * http://your-server/rest/getMusicFolders.view
	 * @return Returns a <subsonic-response> element with a nested <musicFolders> element on success.
	 */
	async getMusicFolders(req: ApiOptions<{}>): Promise<{ musicFolders: Subsonic.MusicFolders }> {
		const list = await this.engine.store.rootStore.all();
		return {musicFolders: {musicFolder: list.map(FORMAT.packRoot)}};
	}

	/**
	 * Returns a random collection of songs from the given artist and similar artists, using data from last.fm. Typically used for artist radio features.
	 * Since 1.11.0
	 * http://your-server/rest/getSimilarSongs.view
	 * @return Returns a <subsonic-response> element with a nested <similarSongs> element on success.
	 */
	async getSimilarSongs(req: ApiOptions<SubsonicParameters.SimilarSongs>): Promise<{ similarSongs: Subsonic.SimilarSongs }> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist, album or song ID.
		count 	No 	50 	Max number of songs to return.
		 */
		const o = await this.engine.store.findInAll(req.query.id);
		if (!o) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		let tracks: Array<Track> = [];
		switch (o.type) {
			case DBObjectType.track:
				tracks = await this.engine.metaDataService.similarTracks.byTrack(o as Track);
				break;
			case DBObjectType.folder:
				tracks = await this.engine.metaDataService.similarTracks.byFolder(o as Folder);
				break;
			case DBObjectType.artist:
				tracks = await this.engine.metaDataService.similarTracks.byArtist(o as Artist);
				break;
			case DBObjectType.album:
				tracks = await this.engine.metaDataService.similarTracks.byAlbum(o as Album);
				break;
			default:
		}
		const limit = paginate(tracks, req.query.count || 50, 0);
		const childs = await this.prepareTracks(limit.items, req.user);
		return {similarSongs: FORMAT.packSimilarSongs(childs)};
	}

	/**
	 * Similar to getSimilarSongs, but organizes music according to ID3 tags.
	 * Since 1.11.0
	 * http://your-server/rest/getSimilarSongs2.view
	 * @return Returns a <subsonic-response> element with a nested <similarSongs2> element on success.
	 */
	async getSimilarSongs2(req: ApiOptions<SubsonicParameters.SimilarSongs>): Promise<{ similarSongs2: Subsonic.SimilarSongs2 }> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist ID.
		count 	No 	50 	Max number of songs to return.
		 */
		const artist = await this.byID<Artist>(req.query.id, this.engine.store.artistStore);
		const tracks = await this.engine.metaDataService.similarTracks.byArtist(artist);
		const limit = paginate(tracks, req.query.count || 50, 0);
		const childs = await this.prepareTracks(limit.items, req.user);
		return {similarSongs2: FORMAT.packSimilarSongs2(childs)};
	}

	/**
	 * Returns details for a song.
	 * Since 1.8.0
	 * http://your-server/rest/getSong.view
	 * @return Returns a <subsonic-response> element with a nested <song> element on success.
	 */
	async getSong(req: ApiOptions<SubsonicParameters.ID>): Promise<{ song: Subsonic.Child }> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The song ID.
		 */
		const track = await this.byID<Track>(req.query.id, this.engine.store.trackStore);
		const child = await this.prepareTrack(track, req.user);
		return {song: child};
	}

	/**
	 * Returns top songs for the given artist, using data from last.fm.
	 * Since 1.13.0
	 * http://your-server/rest/getTopSongs.view
	 * @return Returns a <subsonic-response> element with a nested <topSongs> element on success.
	 */
	async getTopSongs(req: ApiOptions<SubsonicParameters.TopSongs>): Promise<{ topSongs: Subsonic.TopSongs }> {
		/*
		Parameter 	Required 	Default 	Comment
		artist 	Yes 		The artist name.
		count 	No 	50 	Max number of songs to return.
		*/
		const limitCount = req.query.count || 50;
		let tracks = await this.engine.metaDataService.topTracks.byArtistName(req.query.artist);
		tracks = tracks.slice(0, limitCount);
		const childs = await this.prepareTracks(tracks, req.user);
		return {topSongs: {song: childs}};
	}

	/**
	 * Returns all video files.
	 * Since 1.8.0
	 * http://your-server/rest/getVideos.view
	 * @return  Returns a <subsonic-response> element with a nested <videos> element on success.
	 */
	async getVideos(req: ApiOptions<{}>): Promise<{ videos: Subsonic.Videos }> {
		return {videos: {}};
	}

	/**
	 * Returns details for a video, including information about available audio tracks, subtitles (captions) and conversions.
	 * Since 1.14.0
	 * http://your-server/rest/getVideoInfo.view
	 * @return Returns a <subsonic-response> element with a nested <videoInfo> element on success.
	 */
	async getVideoInfo(req: ApiOptions<SubsonicParameters.ID>): Promise<{ videoInfo: Subsonic.VideoInfo }> {
		/*.
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The video ID.
		 */
		return {videoInfo: {id: ''}};
	}

}
