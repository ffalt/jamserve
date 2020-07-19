"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrmService = void 0;
const mikro_orm_1 = require("mikro-orm");
const orm_config_1 = __importDefault(require("../../../config/orm.config"));
const album_1 = require("../../../entity/album/album");
const state_1 = require("../../../entity/state/state");
const artist_1 = require("../../../entity/artist/artist");
const artwork_1 = require("../../../entity/artwork/artwork");
const bookmark_1 = require("../../../entity/bookmark/bookmark");
const episode_1 = require("../../../entity/episode/episode");
const folder_1 = require("../../../entity/folder/folder");
const root_1 = require("../../../entity/root/root");
const playqueue_1 = require("../../../entity/playqueue/playqueue");
const playlist_1 = require("../../../entity/playlist/playlist");
const podcast_1 = require("../../../entity/podcast/podcast");
const series_1 = require("../../../entity/series/series");
const radio_1 = require("../../../entity/radio/radio");
const session_1 = require("../../../entity/session/session");
const settings_1 = require("../../../entity/settings/settings");
const track_1 = require("../../../entity/track/track");
const user_1 = require("../../../entity/user/user");
const tag_1 = require("../../../entity/tag/tag");
const typescript_ioc_1 = require("typescript-ioc");
const metadata_1 = require("../../../entity/metadata/metadata");
const playlist_entry_1 = require("../../../entity/playlistentry/playlist-entry");
const playqueue_entry_1 = require("../../../entity/playqueueentry/playqueue-entry");
const album_repository_1 = require("../../../entity/album/album.repository");
const user_repository_1 = require("../../../entity/user/user.repository");
const track_repository_1 = require("../../../entity/track/track.repository");
const tag_repository_1 = require("../../../entity/tag/tag.repository");
const session_repository_1 = require("../../../entity/session/session.repository");
const series_repository_1 = require("../../../entity/series/series.repository");
const radio_repository_1 = require("../../../entity/radio/radio.repository");
const playlist_entry_repository_1 = require("../../../entity/playlistentry/playlist-entry.repository");
const playlist_repository_1 = require("../../../entity/playlist/playlist.repository");
const root_repository_1 = require("../../../entity/root/root.repository");
const folder_repository_1 = require("../../../entity/folder/folder.repository");
const episode_repository_1 = require("../../../entity/episode/episode.repository");
const bookmark_repository_1 = require("../../../entity/bookmark/bookmark.repository");
const artwork_repository_1 = require("../../../entity/artwork/artwork.repository");
const artist_repository_1 = require("../../../entity/artist/artist.repository");
const state_repository_1 = require("../../../entity/state/state.repository");
const metadata_repository_1 = require("../../../entity/metadata/metadata.repository");
const playqueue_repository_1 = require("../../../entity/playqueue/playqueue.repository");
const playqueue_entry_repository_1 = require("../../../entity/playqueueentry/playqueue-entry.repository");
const podcast_repository_1 = require("../../../entity/podcast/podcast.repository");
const settings_repository_1 = require("../../../entity/settings/settings.repository");
const path_1 = __importDefault(require("path"));
let OrmService = class OrmService {
    async start(dataPath) {
        this.orm = await mikro_orm_1.MikroORM.init({
            ...orm_config_1.default,
            dbName: path_1.default.resolve(dataPath, 'jam.sqlite'),
        });
        this.State = new state_repository_1.StateRepository(this.orm.em, state_1.State);
        this.Album = new album_repository_1.AlbumRepository(this.orm.em, album_1.Album);
        this.Artist = new artist_repository_1.ArtistRepository(this.orm.em, artist_1.Artist);
        this.Artwork = new artwork_repository_1.ArtworkRepository(this.orm.em, artwork_1.Artwork);
        this.Bookmark = new bookmark_repository_1.BookmarkRepository(this.orm.em, bookmark_1.Bookmark);
        this.Episode = new episode_repository_1.EpisodeRepository(this.orm.em, episode_1.Episode);
        this.Folder = new folder_repository_1.FolderRepository(this.orm.em, folder_1.Folder);
        this.Root = new root_repository_1.RootRepository(this.orm.em, root_1.Root);
        this.MetaData = new metadata_repository_1.MetaDataRepository(this.orm.em, metadata_1.MetaData);
        this.PlayQueue = new playqueue_repository_1.PlayQueueRepository(this.orm.em, playqueue_1.PlayQueue);
        this.PlayQueueEntry = new playqueue_entry_repository_1.PlayQueueEntryRepository(this.orm.em, playqueue_entry_1.PlayQueueEntry);
        this.Playlist = new playlist_repository_1.PlaylistRepository(this.orm.em, playlist_1.Playlist);
        this.PlaylistEntry = new playlist_entry_repository_1.PlaylistEntryRepository(this.orm.em, playlist_entry_1.PlaylistEntry);
        this.Podcast = new podcast_repository_1.PodcastRepository(this.orm.em, podcast_1.Podcast);
        this.Radio = new radio_repository_1.RadioRepository(this.orm.em, radio_1.Radio);
        this.Series = new series_repository_1.SeriesRepository(this.orm.em, series_1.Series);
        this.Session = new session_repository_1.SessionRepository(this.orm.em, session_1.Session);
        this.Settings = new settings_repository_1.SettingsRepository(this.orm.em, settings_1.Settings);
        this.Tag = new tag_repository_1.TagRepository(this.orm.em, tag_1.Tag);
        this.Track = new track_repository_1.TrackRepository(this.orm.em, track_1.Track);
        this.User = new user_repository_1.UserRepository(this.orm.em, user_1.User);
        const generator = this.orm.getSchemaGenerator();
        await generator.ensureDatabase();
        await generator.updateSchema();
    }
    async stop() {
        await this.orm.close();
    }
    async findInStreamTypes(id) {
        const repos = [
            this.Track,
            this.Episode
        ];
        for (const repo of repos) {
            const obj = await repo.findOne({ id });
            if (obj) {
                return { obj: obj, objType: repo.objType };
            }
        }
    }
};
OrmService = __decorate([
    typescript_ioc_1.Singleton
], OrmService);
exports.OrmService = OrmService;
//# sourceMappingURL=orm.service.js.map