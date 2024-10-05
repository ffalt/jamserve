import { Album } from '../../entity/album/album.js';
import { Artist } from '../../entity/artist/artist.js';
import { Episode } from '../../entity/episode/episode.js';
import { Folder } from '../../entity/folder/folder.js';
import { Playlist } from '../../entity/playlist/playlist.js';
import { State } from '../../entity/state/state.js';
import { Track } from '../../entity/track/track.js';
import { User } from '../../entity/user/user.js';
import { DBObjectType, PodcastStatus } from '../../types/enums.js';
import { Base } from '../../entity/base/base.js';
import { Bookmark } from '../../entity/bookmark/bookmark.js';
import { Orm } from '../engine/services/orm.service.js';
import { EngineService } from '../engine/services/engine.service.js';
import { SubsonicParameterState } from './model/subsonic-rest-params.js';
import { SubsonicAlbumID3, SubsonicArtist, SubsonicArtistID3, SubsonicBookmark, SubsonicChild, SubsonicPlaylistWithSongs, SubsonicPodcastEpisode } from './model/subsonic-rest-data.js';
import { StateMap, SubsonicFormatter } from './formatter.js';

export class SubsonicHelper {

	static async loadStates(orm: Orm, ids: Array<string>, type: DBObjectType, userID: string): Promise<StateMap> {
		const states = await orm.State.findMany(ids, type, userID);
		const result: StateMap = {};
		for (const state of states) {
			result[state.destID] = state;
		}
		return result;
	}


	static async prepareList<T extends Base, R>(orm: Orm, type: DBObjectType, objs: Array<T>, pack: (orm: Orm, o: T, state?: State) => Promise<R>, user: User): Promise<Array<R>> {
		const states = await SubsonicHelper.loadStates(orm, objs.map(o => o.id), type, user.id);
		const result: Array<R> = [];
		for (const o of objs) {
			result.push(await pack(orm, o, states[o.id]));
		}
		return result;
	}

	static async prepareObj<T extends Base, R>(orm: Orm, type: DBObjectType, obj: T, pack: (orm: Orm, o: T, state: State) => Promise<R>, user: User): Promise<R> {
		const state = await orm.State.findOrCreate(obj.id, type, user.id);
		return pack(orm, obj, state);
	}

	static async prepareAlbums(orm: Orm, albums: Array<Album>, user: User): Promise<Array<SubsonicAlbumID3>> {
		return this.prepareList<Album, SubsonicAlbumID3>(orm, DBObjectType.album, albums, SubsonicFormatter.packAlbum, user);
	}

	static async prepareArtists(orm: Orm, artists: Array<Artist>, user: User): Promise<Array<SubsonicArtistID3>> {
		return this.prepareList<Artist, SubsonicArtistID3>(orm, DBObjectType.artist, artists, SubsonicFormatter.packArtist, user);
	}

	static async prepareFolders(orm: Orm, folders: Array<Folder>, user: User): Promise<Array<SubsonicChild>> {
		return this.prepareList<Folder, SubsonicChild>(orm, DBObjectType.folder, folders, SubsonicFormatter.packFolder, user);
	}

	static async prepareFolderArtists(orm: Orm, folders: Array<Folder>, user: User): Promise<Array<SubsonicArtist>> {
		return this.prepareList<Folder, SubsonicArtist>(orm, DBObjectType.folder, folders, SubsonicFormatter.packFolderArtist, user);
	}

	static async prepareTrack(orm: Orm, track: Track, user: User): Promise<SubsonicChild> {
		return this.prepareObj<Track, SubsonicChild>(orm, DBObjectType.track, track, SubsonicFormatter.packTrack, user);
	}

	static async prepareTracks(orm: Orm, tracks: Array<Track>, user: User): Promise<Array<SubsonicChild>> {
		return this.prepareList<Track, SubsonicChild>(orm, DBObjectType.track, tracks, SubsonicFormatter.packTrack, user);
	}

	static async prepareBookmarks(orm: Orm, bookmarks: Array<Bookmark>, user: User): Promise<Array<SubsonicBookmark>> {
		const bookmarkDestID = (bookmark: Bookmark) => (bookmark.track.id() || bookmark.episode.id() as string);

		const removeDups = (list: Array<string>): Array<string> => {
			return list.filter((item, pos) => list.indexOf(item) === pos);
		};

		const trackIDs = removeDups(bookmarks.map(bookmark => bookmarkDestID(bookmark)));
		const userIds = removeDups(bookmarks.map(bookmark => bookmark.user.id() as string));
		const tracks = await orm.Track.findByIDs(trackIDs);
		const childs = await this.prepareTracks(orm, tracks, user);
		const users = await orm.User.findByIDs(userIds);
		const result: Array<SubsonicBookmark> = [];
		for (const bookmark of bookmarks) {
			const bookmarkID = await orm.Subsonic.subsonicID(bookmarkDestID(bookmark));
			const entry = childs.find(child => child.id === bookmarkID);
			const bookmarkuser = users.find(u => u.id === bookmark.user.id());
			if (entry && bookmarkuser) {
				result.push(SubsonicFormatter.packBookmark(bookmark, bookmarkuser ? bookmarkuser.name : '', entry));
			}
		}
		return result;
	}

	static async preparePlaylist(orm: Orm, playlist: Playlist, user: User): Promise<SubsonicPlaylistWithSongs> {
		const entries = await playlist.entries.getItems();
		const trackIDs = entries.map(entry => entry.track.id()).filter(t => t !== undefined);
		const tracks = await orm.Track.findByIDs(trackIDs);
		const states = await SubsonicHelper.loadStates(orm, tracks.map(o => o.id), DBObjectType.track, user.id);
		return SubsonicFormatter.packPlaylistWithSongs(orm, playlist, tracks, states);
	}

	static async prepareEpisodes(engine: EngineService, orm: Orm, episodes: Array<Episode>, user: User): Promise<Array<SubsonicPodcastEpisode>> {
		const states = await SubsonicHelper.loadStates(orm, episodes.map(o => o.id), DBObjectType.episode, user.id);
		const result: Array<SubsonicPodcastEpisode> = [];
		for (const episode of episodes) {
			result.push(await SubsonicFormatter.packPodcastEpisode(orm, episode, states[episode.id],
				(engine.episode.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status)));
		}
		return result;
	}

	static async collectStateChangeIds(orm: Orm, query: SubsonicParameterState): Promise<Array<string>> {
		let result: Array<number> = [];
		if (query.id) {
			const ids = Array.isArray(query.id) ? query.id : [query.id];
			result = result.concat(ids);
		}
		if (query.albumId) {
			const ids = Array.isArray(query.albumId) ? query.albumId : [query.albumId];
			result = result.concat(ids);
		}
		if (query.artistId) {
			const ids = Array.isArray(query.artistId) ? query.artistId : [query.artistId];
			result = result.concat(ids);
		}
		return await orm.Subsonic.jamIDs(result);
	}
}
