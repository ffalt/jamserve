import { DBObjectType, PodcastStatus } from '../../types/enums.js';
import { SubsonicFormatter } from './formatter.js';
export const SubsonicHelper = {
    async loadStates(orm, ids, type, userID) {
        const states = await orm.State.findMany(ids, type, userID);
        return Object.fromEntries(states.map(state => [state.destID, state]));
    },
    async prepareList(orm, type, objs, pack, user) {
        const states = await SubsonicHelper.loadStates(orm, objs.map(o => o.id), type, user.id);
        const result = [];
        for (const o of objs) {
            result.push(await pack(o, states[o.id]));
        }
        return result;
    },
    async prepareObj(orm, type, obj, pack, user) {
        const state = await orm.State.findOrCreate(obj.id, type, user.id);
        return pack(obj, state);
    },
    async prepareAlbums(orm, albums, user) {
        return this.prepareList(orm, DBObjectType.album, albums, (o, state) => SubsonicFormatter.packAlbum(o, state), user);
    },
    async prepareArtists(orm, artists, user) {
        return this.prepareList(orm, DBObjectType.artist, artists, (o, state) => SubsonicFormatter.packArtist(o, state), user);
    },
    async prepareFolders(orm, folders, user) {
        return this.prepareList(orm, DBObjectType.folder, folders, (o, state) => SubsonicFormatter.packFolder(o, state), user);
    },
    async prepareFolderArtists(orm, folders, user) {
        return this.prepareList(orm, DBObjectType.folder, folders, (o, state) => SubsonicFormatter.packFolderArtist(o, state), user);
    },
    async prepareTrack(orm, track, user) {
        return this.prepareObj(orm, DBObjectType.track, track, (o, state) => SubsonicFormatter.packTrack(o, state), user);
    },
    async prepareTracks(orm, tracks, user) {
        return this.prepareList(orm, DBObjectType.track, tracks, (o, state) => SubsonicFormatter.packTrack(o, state), user);
    },
    async prepareBookmarks(orm, bookmarks, user) {
        const bookmarkDestinationID = (bookmark) => ((bookmark.track.id() ?? bookmark.episode.id()));
        const removeDups = (list) => {
            return list.filter((item, pos) => list.indexOf(item) === pos).filter(s => s !== undefined);
        };
        const trackIDs = removeDups(bookmarks.map(bookmark => bookmarkDestinationID(bookmark)));
        const userIds = removeDups(bookmarks.map(bookmark => bookmark.user.id()));
        const tracks = await orm.Track.findByIDs(trackIDs);
        const childs = await this.prepareTracks(orm, tracks, user);
        const users = await orm.User.findByIDs(userIds);
        const result = [];
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
    async preparePlaylist(orm, playlist, user) {
        const entries = await playlist.entries.getItems();
        const trackIDs = entries.map(entry => entry.track.id()).filter(t => t !== undefined);
        const tracks = await orm.Track.findByIDs(trackIDs);
        const states = await SubsonicHelper.loadStates(orm, tracks.map(o => o.id), DBObjectType.track, user.id);
        states[playlist.id] = await orm.State.findOrCreate(playlist.id, DBObjectType.playlist, user.id);
        return SubsonicFormatter.packPlaylistWithSongs(playlist, tracks, states);
    },
    async prepareEpisodes(engine, orm, episodes, user) {
        const states = await SubsonicHelper.loadStates(orm, episodes.map(o => o.id), DBObjectType.episode, user.id);
        const result = [];
        for (const episode of episodes) {
            result.push(await SubsonicFormatter.packPodcastEpisode(episode, states[episode.id], (engine.episode.isDownloading(episode.id) ? PodcastStatus.downloading : episode.status)));
        }
        return result;
    },
    async collectStateChangeIds(query) {
        let result = [];
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
//# sourceMappingURL=helper.js.map