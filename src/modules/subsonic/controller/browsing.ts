import { Album } from '../../../entity/album/album.js';
import { Artist } from '../../../entity/artist/artist.js';
import { Folder } from '../../../entity/folder/folder.js';
import { Track } from '../../../entity/track/track.js';

import { AlbumOrderFields, DBObjectType, LastFMLookupType, TrackOrderFields } from '../../../types/enums.js';
import { PageResult } from '../../../entity/base/base.js';
import { SubsonicRoute } from '../decorators/SubsonicRoute.js';
import { Context } from '../../engine/rest/context.js';
import { SubsonicParams } from '../decorators/SubsonicParams.js';
import { SubsonicParameterArtistInfo, SubsonicParameterID, SubsonicParameterIndexes, SubsonicParameterMusicFolderID, SubsonicParameterSimilarSongs, SubsonicParameterTopSongs } from '../model/subsonic-rest-params.js';
import {
	SubsonicAlbumWithSongsID3, SubsonicArtist, SubsonicArtistID3,
	SubsonicArtistWithAlbumsID3,
	SubsonicChild,
	SubsonicGenre, SubsonicMusicFolder,
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
import { SubsonicController } from '../decorators/SubsonicController.js';
import { SubsonicCtx } from '../decorators/SubsonicContext.js';
import { SubsonicApiError, SubsonicFormatter } from '../formatter.js';
import { SubsonicHelper } from '../helper.js';
import { LastFM } from '../../audio/clients/lastfm-rest-data.js';

@SubsonicController()
export class SubsonicBrowsingApi {
	/**
	 * Returns details for an artist, including a list of albums. This method organizes music according to ID3 tags.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/getArtist', () => SubsonicResponseArtistWithAlbumsID3, {
		summary: 'Artist',
		description: 'Returns details for an artist, including a list of albums. This method organizes music according to ID3 tags.',
		tags: ['Browsing']
	})
	async getArtist(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseArtistWithAlbumsID3> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The artist ID.
		 */
		const artist = await orm.Artist.findOneOrFailByID(query.id);
		const albumlist = await orm.Album.findFilter({ artistIDs: [artist.id] }, [{ orderBy: AlbumOrderFields.year, orderDesc: true }]);
		const state = await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
		const states = await SubsonicHelper.loadStates(orm, albumlist.map(o => o.id), DBObjectType.album, user.id);
		const artistid3 = await SubsonicFormatter.packArtist(artist, state) as SubsonicArtistWithAlbumsID3;
		const album = [];
		for (const a of albumlist) {
			album.push(await SubsonicFormatter.packAlbum(a, states[a.id]));
		}
		artistid3.album = album;
		return { artist: artistid3 };
	}

	/**
	 * Returns details for an album, including a list of songs. This method organizes music according to ID3 tags.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/getAlbum', () => SubsonicResponseAlbumWithSongsID3, {
		summary: 'Album',
		description: 'Returns details for an album, including a list of songs. This method organizes music according to ID3 tags.',
		tags: ['Browsing']
	})
	async getAlbum(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseAlbumWithSongsID3> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The album ID.
		 */
		const album = await orm.Album.findOneOrFailByID(query.id);
		const state = await orm.State.findOrCreate(album.id, DBObjectType.album, user.id);
		const trackIDs = await album.tracks.getIDs();
		const tracks = await orm.Track.findFilter({ ids: trackIDs }, [{ orderBy: TrackOrderFields.trackNr }]);
		const childs = await SubsonicHelper.prepareTracks(orm, tracks, user);
		const albumid3 = await SubsonicFormatter.packAlbum(album, state) as SubsonicAlbumWithSongsID3;
		albumid3.song = childs;
		return { album: albumid3 };
	}

	/**
	 *
	 * Since 1.11.0
	 */
	@SubsonicRoute('/getArtistInfo', () => SubsonicResponseArtistInfo, {
		summary: 'Artist Info',
		description: 'Returns artist info with biography, image URLs and similar artists, using data from last.fm.',
		tags: ['Browsing']
	})
	async getArtistInfo(@SubsonicParams() query: SubsonicParameterArtistInfo, @SubsonicCtx() { engine, orm, user }: Context): Promise<SubsonicResponseArtistInfo> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist, album or song ID.
		count 	No 	20 	Max number of similar artists to return.
		includeNotPresent 	No 	false 	Whether to return artists that are not present in the media library.
		 */
		const limitCount = query.count || 20;
		const includeNotPresent = query.includeNotPresent ?? false;

		const limitLastFMSimilarArtists = async (info: LastFM.Artist): Promise<Array<SubsonicArtist>> => {
			const similar = info.similar?.artist || [];
			if (similar.length === 0) {
				return [];
			}
			const result: Array<SubsonicArtist> = [];
			for (const sim of similar) {
				if (result.length == limitCount) {
					break;
				}
				const artist = await orm.Artist.findOneFilter({ mbArtistIDs: [sim.mbid] });
				if (artist) {
					const state = await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
					result.push(await SubsonicFormatter.packArtist(artist, state));
				} else if (includeNotPresent) {
					result.push({
						id: '-1', // report an invalid id (as does subsonic/airsonic)
						name: sim.name,
						musicBrainzId: sim.mbid,
						artistImageUrl: sim.image?.length > 0 ? sim.image[0].url : undefined,
						albumCount: 0
					});
				}
			}
			return result;
		};

		const folder = await orm.Folder.findOneOrFailByID(query.id);
		if (folder) {
			if (folder.mbArtistID) {
				const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, folder.mbArtistID);
				if (lastfm?.artist) {
					return { artistInfo: SubsonicFormatter.packArtistInfo(lastfm.artist, await limitLastFMSimilarArtists(lastfm.artist)) };
				}
			} else if (folder.artist) {
				const al = await engine.metadata.lastFMArtistSearch(orm, folder.artist);
				if (al?.artist) {
					const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, al.artist.mbid);
					if (lastfm?.artist) {
						return { artistInfo: SubsonicFormatter.packArtistInfo(lastfm.artist, await limitLastFMSimilarArtists(lastfm.artist)) };
					}
				}
			}
		}
		return { artistInfo: {} };
	}

	/**
	 * Similar to getArtistInfo, but organizes music according to ID3 tags.
	 * Since 1.11.0
	 */
	@SubsonicRoute('/getArtistInfo2', () => SubsonicResponseArtistInfo2, {
		summary: 'Artist Info 2',
		description: 'Similar to getArtistInfo, but organizes music according to ID3 tags.',
		tags: ['Browsing']
	})
	async getArtistInfo2(@SubsonicParams() query: SubsonicParameterArtistInfo, @SubsonicCtx() { engine, orm, user }: Context): Promise<SubsonicResponseArtistInfo2> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist ID.
		count 	No 	20 	Max number of similar artists to return.
		includeNotPresent 	No 	false 	Whether to return artists that are not present in the media library.
		*/
		const includeNotPresent = query.includeNotPresent ?? false;
		const limitCount = query.count || 20;

		const limitLastFMSimilarArtists = async (info: LastFM.Artist): Promise<Array<SubsonicArtistID3>> => {
			const similar = info.similar?.artist || [];
			if (similar.length === 0) {
				return [];
			}
			const result: Array<SubsonicArtistID3> = [];
			for (const sim of similar) {
				if (result.length == limitCount) {
					break;
				}
				const artist = await orm.Artist.findOneFilter({ mbArtistIDs: [sim.mbid] });
				if (artist) {
					const state = await orm.State.findOrCreate(artist.id, DBObjectType.artist, user.id);
					result.push(await SubsonicFormatter.packArtist(artist, state));
				} else if (includeNotPresent) {
					result.push({
						id: '-1', // report an invalid id (as does subsonic/airsonic)
						name: sim.name,
						musicBrainzId: sim.mbid,
						artistImageUrl: sim.image?.length > 0 ? sim.image[0].url : undefined,
						albumCount: 0
					});
				}
			}
			return result;
		};

		const artist = await orm.Artist.findOneOrFailByID(query.id);
		if (artist) {
			if (artist.mbArtistID) {
				const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, artist.mbArtistID);
				if (lastfm?.artist) {
					return { artistInfo2: SubsonicFormatter.packArtistInfo2(lastfm.artist, await limitLastFMSimilarArtists(lastfm.artist)) };
				}
			} else if (artist.name) {
				const al = await engine.metadata.lastFMArtistSearch(orm, artist.name);
				if (al?.artist) {
					const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.artist, al.artist.mbid);
					if (lastfm?.artist) {
						return { artistInfo2: SubsonicFormatter.packArtistInfo2(lastfm.artist, await limitLastFMSimilarArtists(lastfm.artist)) };
					}
				}
			}
		}
		return { artistInfo2: {} };
	}

	/**
	 *
	 * Since 1.14.0
	 */
	@SubsonicRoute('/getAlbumInfo', () => SubsonicResponseAlbumInfo, {
		summary: 'Album Info',
		description: 'Returns album notes, image URLs etc, using data from last.fm.',
		tags: ['Browsing']
	})
	async getAlbumInfo(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { engine, orm }: Context): Promise<SubsonicResponseAlbumInfo> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The album or song ID.
		 */
		const folder = await orm.Folder.findOneOrFailByID(query.id);
		if (folder) {
			if (folder.mbReleaseID) {
				const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, folder.mbReleaseID);
				if (lastfm?.album) {
					return { albumInfo: SubsonicFormatter.packAlbumInfo(lastfm.album) };
				}
			} else if (folder.album && folder.artist) {
				const al = await engine.metadata.lastFMAlbumSearch(orm, folder.album, folder.artist);
				if (al?.album) {
					const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, al.album.mbid);
					if (lastfm?.album) {
						return { albumInfo: SubsonicFormatter.packAlbumInfo(lastfm.album) };
					}
				}
			}
		}
		return { albumInfo: {} };
	}

	/**
	 * Similar to getAlbumInfo, but organizes music according to ID3 tags.
	 * Since 1.14.0
	 */
	@SubsonicRoute('/getAlbumInfo2', () => SubsonicResponseAlbumInfo, {
		summary: 'Album Info 2',
		description: 'Similar to getAlbumInfo, but organizes music according to ID3 tags.',
		tags: ['Browsing']
	})
	async getAlbumInfo2(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { engine, orm }: Context): Promise<SubsonicResponseAlbumInfo> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The album ID.
		 */
		const album = await orm.Album.findOneOrFailByID(query.id);
		if (album) {
			if (album.mbReleaseID) {
				const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, album.mbReleaseID);
				if (lastfm?.album) {
					return { albumInfo: SubsonicFormatter.packAlbumInfo(lastfm.album) };
				}
			} else if (album.name && album.artist.id()) {
				const artist = await album.artist.getOrFail();
				const al = await engine.metadata.lastFMAlbumSearch(orm, album.name, artist.name);
				if (al?.album) {
					const lastfm = await engine.metadata.lastFMLookup(orm, LastFMLookupType.album, al.album.mbid);
					if (lastfm?.album) {
						return { albumInfo: SubsonicFormatter.packAlbumInfo(lastfm.album) };
					}
				}
			}
		}
		return { albumInfo: {} };
	}

	/**
	 * Returns an indexed structure of all artists.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/getIndexes', () => SubsonicResponseIndexes, {
		summary: 'Artist Indexes',
		description: 'Returns an indexed structure of all artists.',
		tags: ['Browsing']
	})
	async getIndexes(@SubsonicParams() query: SubsonicParameterIndexes, @SubsonicCtx() { engine, orm, user }: Context): Promise<SubsonicResponseIndexes> {
		/*
		 Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		If specified, only return artists in the music folder with the given ID. See getMusicFolders.
		 ifModifiedSince 	No 		If specified, only return a result if the artist collection has changed since the given time (in milliseconds since 1 Jan 1970).
		 */
		const folderIndexORM = await orm.Folder.indexFilter({
			rootIDs: query.musicFolderId ? [query.musicFolderId] : undefined,
			level: 1
		}, user, engine.settings.settings.index.ignoreArticles);
		const folderIndex = await engine.transform.Folder.folderIndex(orm, folderIndexORM);
		if (query.ifModifiedSince && query.ifModifiedSince > 0 && (folderIndex.lastModified <= query.ifModifiedSince)) {
			return {};
		}
		let ids: Array<string> = [];
		for (const group of folderIndex.groups) {
			ids = [...ids, ...group.items.map(folder => folder.id)];
		}
		const states = await SubsonicHelper.loadStates(orm, ids, DBObjectType.folder, user.id);
		return {
			indexes: {
				lastModified: folderIndex.lastModified,
				ignoredArticles: (engine.settings.settings.index.ignoreArticles || []).join(' '),
				index: await SubsonicFormatter.packFolderIndex(folderIndex, states)
				// shortcut?: Artist[]; use unknown, there is no api to add/remove shortcuts
				// child?: Child[]; use unknown
			}
		};
	}

	/**
	 * Similar to getIndexes, but organizes music according to ID3 tags.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/getArtists', () => SubsonicResponseArtistsID3, {
		summary: 'Artist Indexes 2',
		description: 'Similar to getIndexes, but organizes music according to ID3 tags.',
		tags: ['Browsing']
	})
	async getArtists(@SubsonicParams() query: SubsonicParameterMusicFolderID, @SubsonicCtx() { engine, orm, user }: Context): Promise<SubsonicResponseArtistsID3> {
		/*
         Parameter 	Required 	Default 	Comment
		 musicFolderId 	No 		If specified, only return artists in the music folder with the given ID. See getMusicFolders.
		 */
		const artistIndex = await orm.Artist.indexFilter(
			{ rootIDs: query.musicFolderId ? [query.musicFolderId] : undefined },
			user, engine.settings.settings.index.ignoreArticles
		);
		let ids: Array<string> = [];
		for (const group of artistIndex.groups) {
			ids = [...ids, ...group.items.map(artist => artist.id)];
		}
		const states = await SubsonicHelper.loadStates(orm, ids, DBObjectType.artist, user.id);
		return {
			artists: {
				ignoredArticles: (engine.settings.settings.index.ignoreArticles || []).join(' '),
				index: await SubsonicFormatter.packArtistIndex(artistIndex, states)
			}
		};
	}

	/**
	 * Returns a listing of all files in a music directory. Typically used to get list of albums for an artist, or list of songs for an album.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/getMusicDirectory', () => SubsonicResponseDirectory, {
		summary: 'Music Directory',
		description: 'Returns a listing of all files in a music directory. Typically used to get list of albums for an artist, or list of songs for an album.',
		tags: ['Browsing']
	})
	async getMusicDirectory(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseDirectory> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		A string which uniquely identifies the music folder. Obtained by calls to getIndexes or getMusicDirectory.
		 */
		const folder = await orm.Folder.findOneOrFailByID(query.id);
		const tracks = await folder.tracks.getItems();
		const folders = await folder.children.getItems();
		let childs: Array<SubsonicChild> = [];
		let list = await SubsonicHelper.prepareFolders(orm, folders, user);
		childs = [...childs, ...list];
		list = await SubsonicHelper.prepareTracks(orm, tracks, user);
		childs = [...childs, ...list];
		const state = await orm.State.findOrCreate(folder.id, DBObjectType.folder, user.id);
		const directory = await SubsonicFormatter.packDirectory(folder, state);
		directory.child = childs;
		return { directory };
	}

	/**
	 * Returns all configured top-level music folders. Takes no extra parameters.
	 * Since 1.0.0
	 */
	@SubsonicRoute('/getMusicFolders', () => SubsonicResponseMusicFolders, {
		summary: 'Music Folders',
		description: 'Returns all configured top-level music folders.',
		tags: ['Browsing']
	})
	async getMusicFolders(@SubsonicCtx() { orm }: Context): Promise<SubsonicResponseMusicFolders> {
		const list = await orm.Root.all();
		const musicFolder: Array<SubsonicMusicFolder> = [];
		for (const r of list) {
			musicFolder.push(await SubsonicFormatter.packRoot(r));
		}
		return { musicFolders: { musicFolder } };
	}

	/**
	 * Returns all genres.
	 * Since 1.9.0
	 */
	@SubsonicRoute('/getGenres', () => SubsonicResponseGenres, {
		summary: 'Genres',
		description: 'Returns all genres.',
		tags: ['Browsing']
	})
	async getGenres(@SubsonicCtx() { orm }: Context): Promise<SubsonicResponseGenres> {
		const genres = await orm.Genre.all();
		const list: Array<SubsonicGenre> = [];
		for (const genre of genres) {
			list.push(await SubsonicFormatter.packGenre(genre));
		}
		if (list.length === 0) {
			const dummy: SubsonicGenre = {
				value: '-',
				songCount: 0,
				artistCount: 0,
				albumCount: 0
			};
			list.push(dummy);
		}
		return { genres: { genre: list } };
	}

	/**
	 * Returns a random collection of songs from the given artist and similar artists, using data from last.fm. Typically used for artist radio features.
	 * Since 1.11.0
	 */
	@SubsonicRoute('/getSimilarSongs', () => SubsonicResponseSimilarSongs, {
		summary: 'Similar Songs',
		description: 'Returns a random collection of songs from the given artist and similar artists, using data from last.fm. Typically used for artist radio features.',
		tags: ['Browsing']
	})
	async getSimilarSongs(@SubsonicParams() query: SubsonicParameterSimilarSongs, @SubsonicCtx() { engine, orm, user }: Context): Promise<SubsonicResponseSimilarSongs> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist, album or song ID.
		count 	No 	50 	Max number of songs to return.
		 */
		const result = await orm.findInRepos(query.id, [orm.Track, orm.Folder, orm.Artist, orm.Album]);
		if (!result?.obj) {
			return Promise.reject(new SubsonicApiError(SubsonicFormatter.ERRORS.NOT_FOUND));
		}
		let tracks: PageResult<Track> | undefined;
		const page = { take: query.count || 50, skip: 0 };
		switch (result.objType) {
			case DBObjectType.track: {
				tracks = await engine.metadata.similarTracks.byTrack(orm, result.obj as Track, page);
				break;
			}
			case DBObjectType.folder: {
				tracks = await engine.metadata.similarTracks.byFolder(orm, result.obj as Folder, page);
				break;
			}
			case DBObjectType.artist: {
				tracks = await engine.metadata.similarTracks.byArtist(orm, result.obj as Artist, page);
				break;
			}
			case DBObjectType.album: {
				tracks = await engine.metadata.similarTracks.byAlbum(orm, result.obj as Album, page);
				break;
			}
			default:
		}
		const childs = tracks ? await SubsonicHelper.prepareTracks(orm, tracks.items, user) : [];
		return { similarSongs: SubsonicFormatter.packSimilarSongs(childs) };
	}

	/**
	 * Similar to getSimilarSongs, but organizes music according to ID3 tags.
	 * Since 1.11.0
	 */
	@SubsonicRoute('/getSimilarSongs2', () => SubsonicResponseSimilarSongs2, {
		summary: 'Similar Songs 2',
		description: 'Similar to getSimilarSongs, but organizes music according to ID3 tags.',
		tags: ['Browsing']
	})
	async getSimilarSongs2(@SubsonicParams() query: SubsonicParameterSimilarSongs, @SubsonicCtx() { engine, orm, user }: Context): Promise<SubsonicResponseSimilarSongs2> {
		/*
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The artist ID.
		count 	No 	50 	Max number of songs to return.
		 */
		const artist = await orm.Artist.findOneOrFailByID(query.id);
		const page = { take: query.count || 50, skip: 0 };
		const tracks = await engine.metadata.similarTracks.byArtist(orm, artist, page);
		const childs = tracks ? await SubsonicHelper.prepareTracks(orm, tracks.items, user) : [];
		return { similarSongs2: SubsonicFormatter.packSimilarSongs(childs) };
	}

	/**
	 * Returns details for a song.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/getSong', () => SubsonicResponseSong, {
		summary: 'Songs',
		description: 'Returns details for a song.',
		tags: ['Browsing']
	})
	async getSong(@SubsonicParams() query: SubsonicParameterID, @SubsonicCtx() { orm, user }: Context): Promise<SubsonicResponseSong> {
		/*
		 Parameter 	Required 	Default 	Comment
		 id 	Yes 		The song ID.
		 */
		const track = await orm.Track.findOneOrFailByID(query.id);
		const child = await SubsonicHelper.prepareTrack(orm, track, user);
		return { song: child };
	}

	/**
	 * Returns top songs for the given artist, using data from last.fm.
	 * Since 1.13.0
	 */
	@SubsonicRoute('/getTopSongs', () => SubsonicResponseTopSongs, {
		summary: 'Top Songs',
		description: 'Returns top songs for the given artist, using data from last.fm.',
		tags: ['Browsing']
	})
	async getTopSongs(@SubsonicParams() query: SubsonicParameterTopSongs, @SubsonicCtx() { engine, orm, user }: Context): Promise<SubsonicResponseTopSongs> {
		/*
		Parameter 	Required 	Default 	Comment
		artist 	Yes 		The artist name.
		count 	No 	50 	Max number of songs to return.
		*/
		const page = { take: query.count || 50, skip: 0 };
		const tracks = await engine.metadata.topTracks.byArtistName(orm, query.artist, page);
		const childs = tracks ? await SubsonicHelper.prepareTracks(orm, tracks.items, user) : [];
		return { topSongs: { song: childs } };
	}

	/**
	 * Returns all video files.
	 * Since 1.8.0
	 */
	@SubsonicRoute('/getVideos', () => SubsonicResponseVideos, {
		summary: 'Videos',
		description: 'Returns all video files.',
		tags: ['Browsing']
	})
	async getVideos(@SubsonicCtx() _ctx: Context): Promise<SubsonicResponseVideos> {
		return { videos: {} };
	}

	/**
	 * Returns details for a video, including information about available audio tracks, subtitles (captions) and conversions.
	 * Since 1.14.0
	 */
	@SubsonicRoute('/getVideoInfo', () => SubsonicResponseVideoInfo, {
		summary: 'Video Infos',
		description: 'Returns details for a video, including information about available audio tracks, subtitles (captions) and conversions.',
		tags: ['Browsing']
	})
	async getVideoInfo(@SubsonicParams() _query: SubsonicParameterID, @SubsonicCtx() _ctx: Context): Promise<SubsonicResponseVideoInfo> {
		/* .
		Parameter 	Required 	Default 	Comment
		id 	Yes 		The video ID.
		 */
		return { videoInfo: { id: '0' } };
	}
}
