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
import { SubsonicParameterState } from './model/subsonic-rest-parameters.js';
import { SubsonicAlbumID3, SubsonicArtist, SubsonicArtistID3, SubsonicBookmark, SubsonicChild, SubsonicPlaylistWithSongs, SubsonicPodcastEpisode } from './model/subsonic-rest-data.js';
import { StateMap, SubsonicFormatter } from './formatter.js';

export const SubsonicHelper = {
	async loadStates(orm: Orm, ids: Array<string>, type: DBObjectType, userID: string): Promise<StateMap> {
		const states = await orm.State.findMany(ids, type, userID);
		return Object.fromEntries(
			states.map(state => [state.destID, state] as const)
		) as StateMap;
	},

	async prepareList<T extends Base, R>(orm: Orm, type: DBObjectType, objs: Array<T>, pack: (o: T, state?: State) => Promise<R>, user: User): Promise<Array<R>> {
		const states = await SubsonicHelper.loadStates(orm, objs.map(o => o.id), type, user.id);
		const result: Array<R> = [];
		for (const o of objs) {
			result.push(await pack(o, states[o.id]));
		}
		return result;
	},

	async prepareObj<T extends Base, R>(orm: Orm, type: DBObjectType, obj: T, pack: (o: T, state: State) => Promise<R>, user: User): Promise<R> {
		const state = await orm.State.findOrCreate(obj.id, type, user.id);
		return pack(obj, state);
	},

	async prepareAlbums(orm: Orm, albums: Array<Album>, user: User): Promise<Array<SubsonicAlbumID3>> {
		return this.prepareList<Album, SubsonicAlbumID3>(orm, DBObjectType.album, albums,
			(o, state) => SubsonicFormatter.packAlbum(o, state), user);
	},

	async prepareArtists(orm: Orm, artists: Array<Artist>, user: User): Promise<Array<SubsonicArtistID3>> {
		return this.prepareList<Artist, SubsonicArtistID3>(orm, DBObjectType.artist, artists,
			(o, state) => SubsonicFormatter.packArtist(o, state), user);
	},

	async prepareFolders(orm: Orm, folders: Array<Folder>, user: User): Promise<Array<SubsonicChild>> {
		return this.prepareList<Folder, SubsonicChild>(orm, DBObjectType.folder, folders,
			(o, state) => SubsonicFormatter.packFolder(o, state), user);
	},

	async prepareFolderArtists(orm: Orm, folders: Array<Folder>, user: User): Promise<Array<SubsonicArtist>> {
		return this.prepareList<Folder, SubsonicArtist>(orm, DBObjectType.folder, folders,
			(o, state) => SubsonicFormatter.packFolderArtist(o, state), user);
	},

	async prepareTrack(orm: Orm, track: Track, user: User): Promise<SubsonicChild> {
		return this.prepareObj<Track, SubsonicChild>(orm, DBObjectType.track, track,
			(o, state) => SubsonicFormatter.packTrack(o, state), user);
	},

	async prepareTracks(orm: Orm, tracks: Array<Track>, user: User): Promise<Array<SubsonicChild>> {
		return this.prepareList<Track, SubsonicChild>(orm, DBObjectType.track, tracks,
			(o, state) => SubsonicFormatter.packTrack(o, state), user);
	},

	async prepareBookmarks(orm: Orm, bookmarks: Array<Bookmark>, user: User): Promise<Array<SubsonicBookmark>> {
		const bookmarkDestinationID = (bookmark: Bookmark) => ((bookmark.track.id() ?? bookmark.episode.id()));

		const removeDups = (list: Array<string | undefined>): Array<string> => {
			return list.filter((item, pos) => list.indexOf(item) === pos).filter(s => s !== undefined);
		};

		const trackIDs = removeDups(bookmarks.map(bookmark => bookmarkDestinationID(bookmark)));
		const userIds = removeDups(bookmarks.map(bookmark => bookmark.user.id()));
		const tracks = await orm.Track.findByIDs(trackIDs);
		const childs = await this.prepareTracks(orm, tracks, user);
		const users = await orm.User.findByIDs(userIds);
		const result: Array<SubsonicBookmark> = [];
		for (const bookmark of bookmarks) {
			const bookmarkID = bookmarkDestinationID(bookmark);
			const entry = childs.find(child => child.id === bookmarkID);
			const bookmarkuser = users.find(u => u.id === bookmark.user.id());
			if (entry && bookmarkuser) {
				result.push(SubsonicFormatter.packBookmark(bookmark, bookmarkuser.name, entry));
			}
		}
		return result;
	},

	async preparePlaylist(orm: Orm, playlist: Playlist, user: User): Promise<SubsonicPlaylistWithSongs> {
		const entries = await playlist.entries.getItems();
		const trackIDs = entries.map(entry => entry.track.id()).filter(t => t !== undefined);
		const tracks = await orm.Track.findByIDs(trackIDs);
		const states = await SubsonicHelper.loadStates(orm, tracks.map(o => o.id), DBObjectType.track, user.id);
		states[playlist.id] = await orm.State.findOrCreate(playlist.id, DBObjectType.playlist, user.id);
		return SubsonicFormatter.packPlaylistWithSongs(playlist, tracks, states);
	},

	async prepareEpisodes(engine: EngineService, orm: Orm, episodes: Array<Episode>, user: User): Promise<Array<SubsonicPodcastEpisode>> {
		const states = await SubsonicHelper.loadStates(orm, episodes.map(o => o.id), DBObjectType.episode, user.id);
		const result: Array<SubsonicPodcastEpisode> = [];
		for (const episode of episodes) {
			result.push(await SubsonicFormatter.packPodcastEpisode(episode, states[episode.id],
				(engine.episode.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status)));
		}
		return result;
	},

	async collectStateChangeIds(query: SubsonicParameterState): Promise<Array<string>> {
		let result: Array<string> = [];
		if (query.id) {
			const ids = Array.isArray(query.id) ? query.id : [query.id];
			result = [...result, ...ids];
		}
		if (query.albumId) {
			const ids = Array.isArray(query.albumId) ? query.albumId : [query.albumId];
			result = [...result, ...ids];
		}
		if (query.artistId) {
			const ids = Array.isArray(query.artistId) ? query.artistId : [query.artistId];
			result = [...result, ...ids];
		}
		return result;
	}
};
