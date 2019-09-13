import {DBObjectType} from '../../db/db.types';
import {Album} from '../../engine/album/album.model';
import {Artist} from '../../engine/artist/artist.model';
import {DBObject} from '../../engine/base/base.model';
import {BaseStore, SearchQuery} from '../../engine/base/base.store';
import {Bookmark} from '../../engine/bookmark/bookmark.model';
import {Engine} from '../../engine/engine';
import {Episode} from '../../engine/episode/episode.model';
import {Folder} from '../../engine/folder/folder.model';
import {Playlist} from '../../engine/playlist/playlist.model';
import {State} from '../../engine/state/state.model';
import {Track} from '../../engine/track/track.model';
import {User} from '../../engine/user/user.model';
import {PodcastStatus} from '../../model/jam-types';
import {Subsonic} from '../../model/subsonic-rest-data';
import {SubsonicParameters} from '../../model/subsonic-rest-params';
import {FORMAT} from './format';

export interface ApiOptions<T> {
	query: T;
	user: User;
	client?: string;
}

export class SubsonicApiBase {

	constructor(public engine: Engine) {
	}

	/* helper functions */

	protected async byID<T extends DBObject>(id: string, objstore: BaseStore<T, SearchQuery>): Promise<T> {
		const item = await objstore.byId(id);
		if (!item) {
			return Promise.reject({fail: FORMAT.FAIL.NOTFOUND});
		}
		return item;
	}

	protected async prepareList<T extends DBObject, R>(type: DBObjectType, objs: Array<T>, pack: (o: T, state: State) => R, user: User): Promise<Array<R>> {
		const states = await this.engine.stateService.findOrCreateMany(objs.map(o => o.id), user.id, type);
		return objs.map(o => {
			return pack(o, states[o.id]);
		});
	}

	protected async prepareObj<T extends DBObject, R>(type: DBObjectType, obj: T, pack: (o: T, state: State) => R, user: User): Promise<R> {
		const state = await this.engine.stateService.findOrCreate(obj.id, user.id, type);
		return pack(obj, state);
	}

	protected async prepareAlbums(albums: Array<Album>, user: User): Promise<Array<Subsonic.AlbumID3>> {
		return this.prepareList<Album, Subsonic.AlbumID3>(DBObjectType.album, albums, FORMAT.packAlbum, user);
	}

	protected async prepareArtists(artists: Array<Artist>, user: User): Promise<Array<Subsonic.ArtistID3>> {
		return this.prepareList<Artist, Subsonic.ArtistID3>(DBObjectType.artist, artists, FORMAT.packArtist, user);
	}

	protected async prepareFolders(folders: Array<Folder>, user: User): Promise<Array<Subsonic.Child>> {
		return this.prepareList<Folder, Subsonic.Child>(DBObjectType.folder, folders, FORMAT.packFolder, user);
	}

	protected async prepareFolderArtists(folders: Array<Folder>, user: User): Promise<Array<Subsonic.Artist>> {
		return this.prepareList<Folder, Subsonic.Artist>(DBObjectType.folder, folders, FORMAT.packFolderArtist, user);
	}

	protected async prepareTrack(track: Track, user: User): Promise<Subsonic.Child> {
		return this.prepareObj<Track, Subsonic.Child>(DBObjectType.track, track, FORMAT.packTrack, user);
	}

	protected async prepareTracks(tracks: Array<Track>, user: User): Promise<Array<Subsonic.Child>> {
		return this.prepareList<Track, Subsonic.Child>(DBObjectType.track, tracks, FORMAT.packTrack, user);
	}

	protected async prepareBookmarks(bookmarks: Array<Bookmark>, user: User): Promise<Array<Subsonic.Bookmark>> {

		const removeDups = (list: Array<string>): Array<string> => {
			return list.filter((item, pos) => list.indexOf(item) === pos);
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

	protected async preparePlaylist(playlist: Playlist, user: User): Promise<Subsonic.PlaylistWithSongs> {
		const tracks = await this.engine.store.trackStore.byIds(playlist.trackIDs);
		const states = await this.engine.stateService.findOrCreateMany(playlist.trackIDs || [], user.id, DBObjectType.track);
		return FORMAT.packPlaylistWithSongs(playlist, tracks, states);
	}

	protected async prepareEpisodes(episodes: Array<Episode>, user: User): Promise<Array<Subsonic.PodcastEpisode>> {
		const states = await this.engine.stateService.findOrCreateMany(episodes.map(episode => episode.id), user.id, DBObjectType.episode);
		return episodes.map(episode => {
			return FORMAT.packPodcastEpisode(episode, states[episode.id], (this.engine.episodeService.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status));
		});
	}

	protected async collectStateChangeObjects(req: ApiOptions<SubsonicParameters.State>): Promise<{ [type: string]: Array<DBObject> }> {
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

}
