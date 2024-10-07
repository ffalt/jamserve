import { DBObjectType, PodcastStatus } from '../../types/enums.js';
import { SubsonicFormatter } from './formatter.js';
export class SubsonicHelper {
    static async loadStates(orm, ids, type, userID) {
        const states = await orm.State.findMany(ids, type, userID);
        const result = {};
        for (const state of states) {
            result[state.destID] = state;
        }
        return result;
    }
    static async prepareList(orm, type, objs, pack, user) {
        const states = await SubsonicHelper.loadStates(orm, objs.map(o => o.id), type, user.id);
        const result = [];
        for (const o of objs) {
            result.push(await pack(o, states[o.id]));
        }
        return result;
    }
    static async prepareObj(orm, type, obj, pack, user) {
        const state = await orm.State.findOrCreate(obj.id, type, user.id);
        return pack(obj, state);
    }
    static async prepareAlbums(orm, albums, user) {
        return this.prepareList(orm, DBObjectType.album, albums, SubsonicFormatter.packAlbum, user);
    }
    static async prepareArtists(orm, artists, user) {
        return this.prepareList(orm, DBObjectType.artist, artists, SubsonicFormatter.packArtist, user);
    }
    static async prepareFolders(orm, folders, user) {
        return this.prepareList(orm, DBObjectType.folder, folders, SubsonicFormatter.packFolder, user);
    }
    static async prepareFolderArtists(orm, folders, user) {
        return this.prepareList(orm, DBObjectType.folder, folders, SubsonicFormatter.packFolderArtist, user);
    }
    static async prepareTrack(orm, track, user) {
        return this.prepareObj(orm, DBObjectType.track, track, SubsonicFormatter.packTrack, user);
    }
    static async prepareTracks(orm, tracks, user) {
        return this.prepareList(orm, DBObjectType.track, tracks, SubsonicFormatter.packTrack, user);
    }
    static async prepareBookmarks(orm, bookmarks, user) {
        const bookmarkDestID = (bookmark) => (bookmark.track.id() || bookmark.episode.id());
        const removeDups = (list) => {
            return list.filter((item, pos) => list.indexOf(item) === pos);
        };
        const trackIDs = removeDups(bookmarks.map(bookmark => bookmarkDestID(bookmark)));
        const userIds = removeDups(bookmarks.map(bookmark => bookmark.user.id()));
        const tracks = await orm.Track.findByIDs(trackIDs);
        const childs = await this.prepareTracks(orm, tracks, user);
        const users = await orm.User.findByIDs(userIds);
        const result = [];
        for (const bookmark of bookmarks) {
            const bookmarkID = bookmarkDestID(bookmark);
            const entry = childs.find(child => child.id === bookmarkID);
            const bookmarkuser = users.find(u => u.id === bookmark.user.id());
            if (entry && bookmarkuser) {
                result.push(SubsonicFormatter.packBookmark(bookmark, bookmarkuser ? bookmarkuser.name : '', entry));
            }
        }
        return result;
    }
    static async preparePlaylist(orm, playlist, user) {
        const entries = await playlist.entries.getItems();
        const trackIDs = entries.map(entry => entry.track.id()).filter(t => t !== undefined);
        const tracks = await orm.Track.findByIDs(trackIDs);
        const states = await SubsonicHelper.loadStates(orm, tracks.map(o => o.id), DBObjectType.track, user.id);
        states[playlist.id] = await orm.State.findOrCreate(playlist.id, DBObjectType.playlist, user.id);
        return SubsonicFormatter.packPlaylistWithSongs(playlist, tracks, states);
    }
    static async prepareEpisodes(engine, orm, episodes, user) {
        const states = await SubsonicHelper.loadStates(orm, episodes.map(o => o.id), DBObjectType.episode, user.id);
        const result = [];
        for (const episode of episodes) {
            result.push(await SubsonicFormatter.packPodcastEpisode(episode, states[episode.id], (engine.episode.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status)));
        }
        return result;
    }
    static async collectStateChangeIds(query) {
        let result = [];
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
//# sourceMappingURL=helper.js.map