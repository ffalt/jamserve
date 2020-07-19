"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const album_1 = require("../entity/album/album");
const artist_1 = require("../entity/artist/artist");
const artwork_1 = require("../entity/artwork/artwork");
const bookmark_1 = require("../entity/bookmark/bookmark");
const episode_1 = require("../entity/episode/episode");
const folder_1 = require("../entity/folder/folder");
const root_1 = require("../entity/root/root");
const metadata_1 = require("../entity/metadata/metadata");
const playlist_1 = require("../entity/playlist/playlist");
const playlist_entry_1 = require("../entity/playlistentry/playlist-entry");
const podcast_1 = require("../entity/podcast/podcast");
const radio_1 = require("../entity/radio/radio");
const series_1 = require("../entity/series/series");
const session_1 = require("../entity/session/session");
const state_1 = require("../entity/state/state");
const tag_1 = require("../entity/tag/tag");
const track_1 = require("../entity/track/track");
const user_1 = require("../entity/user/user");
const base_1 = require("../entity/base/base");
const playqueue_1 = require("../entity/playqueue/playqueue");
const playqueue_entry_1 = require("../entity/playqueueentry/playqueue-entry");
const settings_1 = require("../entity/settings/settings");
const mikro_orm_1 = require("mikro-orm");
const entities = [
    base_1.Base,
    album_1.Album,
    artist_1.Artist,
    artwork_1.Artwork,
    bookmark_1.Bookmark,
    episode_1.Episode,
    folder_1.Folder,
    root_1.Root,
    metadata_1.MetaData,
    playlist_1.Playlist,
    playlist_entry_1.PlaylistEntry,
    playqueue_1.PlayQueue,
    playqueue_entry_1.PlayQueueEntry,
    podcast_1.Podcast,
    radio_1.Radio,
    series_1.Series,
    session_1.Session,
    settings_1.Settings,
    state_1.State,
    tag_1.Tag,
    track_1.Track,
    user_1.User
];
const empty = entities.findIndex(e => e === undefined);
if (empty >= 0) {
    console.error(entities);
    throw new Error('Entity missing, probably because of a circular reference');
}
const options = {
    entities,
    namingStrategy: mikro_orm_1.EntityCaseNamingStrategy,
    dbName: './data/jam.sqlite',
    type: 'sqlite',
    debug: false
};
exports.default = options;
//# sourceMappingURL=orm.config.js.map