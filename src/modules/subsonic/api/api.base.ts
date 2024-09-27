import {Album} from '../../../entity/album/album.js';
import {Artist} from '../../../entity/artist/artist.js';
import {Episode} from '../../../entity/episode/episode.js';
import {Folder} from '../../../entity/folder/folder.js';
import {Playlist} from '../../../entity/playlist/playlist.js';
import {State} from '../../../entity/state/state.js';
import {Track} from '../../../entity/track/track.js';
import {User} from '../../../entity/user/user.js';
import {FORMAT} from '../format.js';
import {DBObjectType, PodcastStatus} from '../../../types/enums.js';
import {Base} from '../../../entity/base/base.js';
import {Bookmark} from '../../../entity/bookmark/bookmark.js';
import {Orm} from '../../engine/services/orm.service.js';
import {EngineService} from '../../engine/services/engine.service.js';
import {SubsonicParameterState} from '../model/subsonic-rest-params.js';
import {SubsonicAlbumID3, SubsonicArtist, SubsonicArtistID3, SubsonicBookmark, SubsonicChild, SubsonicPlaylistWithSongs, SubsonicPodcastEpisode} from '../model/subsonic-rest-data.js';

export class SubsonicApiBase {

	/* helper functions */

	protected async prepareList<T extends Base, R>(orm: Orm, type: DBObjectType, objs: Array<T>, pack: (o: T, state?: State) => Promise<R>, user: User): Promise<Array<R>> {
		const states = await orm.State.findMany(objs.map(o => o.id), type, user.id);
		return Promise.all(objs.map(o => {
			return pack(o, states.find(s => s.id == o.id));
		}));
	}

	protected async prepareObj<T extends Base, R>(orm: Orm, type: DBObjectType, obj: T, pack: (o: T, state: State) => Promise<R>, user: User): Promise<R> {
		const state = await orm.State.findOrCreate(obj.id, type, user.id);
		return pack(obj, state);
	}

	protected async prepareAlbums(orm: Orm, albums: Array<Album>, user: User): Promise<Array<SubsonicAlbumID3>> {
		return this.prepareList<Album, SubsonicAlbumID3>(orm, DBObjectType.album, albums, FORMAT.packAlbum, user);
	}

	//
	protected async prepareArtists(orm: Orm, artists: Array<Artist>, user: User): Promise<Array<SubsonicArtistID3>> {
		return this.prepareList<Artist, SubsonicArtistID3>(orm, DBObjectType.artist, artists, FORMAT.packArtist, user);
	}

	protected async prepareFolders(orm: Orm, folders: Array<Folder>, user: User): Promise<Array<SubsonicChild>> {
		return this.prepareList<Folder, SubsonicChild>(orm, DBObjectType.folder, folders, FORMAT.packFolder, user);
	}

	protected async prepareFolderArtists(orm: Orm, folders: Array<Folder>, user: User): Promise<Array<SubsonicArtist>> {
		return this.prepareList<Folder, SubsonicArtist>(orm, DBObjectType.folder, folders, FORMAT.packFolderArtist, user);
	}

	protected async prepareTrack(orm: Orm, track: Track, user: User): Promise<SubsonicChild> {
		return this.prepareObj<Track, SubsonicChild>(orm, DBObjectType.track, track, FORMAT.packTrack, user);
	}

	protected async prepareTracks(orm: Orm, tracks: Array<Track>, user: User): Promise<Array<SubsonicChild>> {
		return this.prepareList<Track, SubsonicChild>(orm, DBObjectType.track, tracks, FORMAT.packTrack, user);
	}


	protected async prepareBookmarks(orm: Orm, bookmarks: Array<Bookmark>, user: User): Promise<Array<SubsonicBookmark>> {

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
		bookmarks.forEach(bookmark => {
			const entry = childs.find(child => child.id === bookmarkDestID(bookmark));
			const bookmarkuser = users.find(u => u.id === bookmark.user.id());
			if (entry && bookmarkuser) {
				result.push(FORMAT.packBookmark(bookmark, bookmarkuser ? bookmarkuser.name : '', entry));
			}
		});
		return result;
	}

	protected async preparePlaylist(orm: Orm, playlist: Playlist, user: User): Promise<SubsonicPlaylistWithSongs> {
		const entries = await playlist.entries.getItems();
		const trackIDs = entries.map(entry => entry.track.id()).filter(t => t !== undefined);
		const tracks = await orm.Track.findByIDs(trackIDs);
		const states = await orm.State.findMany(tracks.map(a => a.id), DBObjectType.track, user.id);
		return FORMAT.packPlaylistWithSongs(playlist, tracks, states);
	}

	protected async prepareEpisodes(engine: EngineService, orm: Orm, episodes: Array<Episode>, user: User): Promise<Array<SubsonicPodcastEpisode>> {
		const states = await orm.State.findMany(episodes.map(a => a.id), DBObjectType.episode, user.id);
		return Promise.all(episodes.map(episode => {
			return FORMAT.packPodcastEpisode(episode, states.find(s => s.id === episode.id),
				(engine.episode.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status));
		}));
	}

	protected collectStateChangeIds(query: SubsonicParameterState): Array<string> {
		let result: Array<string> = [];
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
		return result;
	}
}
