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
exports.OrmService = exports.Orm = void 0;
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
const path_1 = __importDefault(require("path"));
const orm_1 = require("../../orm");
const entities_1 = require("../orm/entities");
const repositories_1 = require("../orm/repositories");
const enum_registration_1 = require("../orm/enum-registration");
enum_registration_1.registerORMEnums();
class Orm {
    constructor(em) {
        this.em = em;
        this.State = em.getRepository(state_1.State);
        this.Album = em.getRepository(album_1.Album);
        this.Artist = em.getRepository(artist_1.Artist);
        this.Artwork = em.getRepository(artwork_1.Artwork);
        this.Bookmark = em.getRepository(bookmark_1.Bookmark);
        this.Episode = em.getRepository(episode_1.Episode);
        this.Folder = em.getRepository(folder_1.Folder);
        this.Root = em.getRepository(root_1.Root);
        this.MetaData = em.getRepository(metadata_1.MetaData);
        this.PlayQueue = em.getRepository(playqueue_1.PlayQueue);
        this.PlayQueueEntry = em.getRepository(playqueue_entry_1.PlayQueueEntry);
        this.Playlist = em.getRepository(playlist_1.Playlist);
        this.PlaylistEntry = em.getRepository(playlist_entry_1.PlaylistEntry);
        this.Podcast = em.getRepository(podcast_1.Podcast);
        this.Radio = em.getRepository(radio_1.Radio);
        this.Series = em.getRepository(series_1.Series);
        this.Session = em.getRepository(session_1.Session);
        this.Settings = em.getRepository(settings_1.Settings);
        this.Tag = em.getRepository(tag_1.Tag);
        this.Track = em.getRepository(track_1.Track);
        this.User = em.getRepository(user_1.User);
    }
    async findInReposTypes(id, repos) {
        for (const repo of repos) {
            const obj = await repo.findOneByID(id);
            if (obj) {
                return { obj: obj, objType: repo.objType };
            }
        }
    }
    async findInStreamTypes(id) {
        return this.findInReposTypes(id, [this.Track, this.Episode]);
    }
    async findInImageTypes(id) {
        return this.findInReposTypes(id, [
            this.Album,
            this.Artist,
            this.Artwork,
            this.Episode,
            this.Folder,
            this.Root,
            this.Playlist,
            this.Podcast,
            this.Radio,
            this.Series,
            this.Track,
            this.User
        ]);
    }
    async findInDownloadTypes(id) {
        return this.findInReposTypes(id, [
            this.Album,
            this.Artist,
            this.Artwork,
            this.Episode,
            this.Folder,
            this.Playlist,
            this.Podcast,
            this.Series,
            this.Track
        ]);
    }
    async findInStateTypes(id) {
        return this.findInReposTypes(id, [
            this.Album,
            this.Artist,
            this.Artwork,
            this.Episode,
            this.Folder,
            this.Root,
            this.Playlist,
            this.Podcast,
            this.Series,
            this.Radio,
            this.Track
        ]);
    }
    async findInWaveformTypes(id) {
        return this.findInReposTypes(id, [this.Track, this.Episode]);
    }
}
exports.Orm = Orm;
let OrmService = class OrmService {
    async init(config) {
        const db = config.env.db.dialect === 'sqlite' ? {
            dialect: 'sqlite',
            storage: path_1.default.resolve(config.env.paths.data, 'jam.sqlite')
        } :
            {
                dialect: config.env.db.dialect,
                username: config.env.db.user,
                password: config.env.db.password,
                database: config.env.db.name,
                host: config.env.db.host,
                dialectOptions: {
                    socketPath: config.env.db.socket ? config.env.db.socket : undefined,
                },
                port: config.env.db.port ? Number(config.env.db.port) : undefined
            };
        this.orm = await orm_1.ORM.init({
            entities: entities_1.ORMEntities,
            repositories: repositories_1.ORMRepositories,
            options: {
                ...db,
                logging: false,
                logQueryParameters: true,
                retry: { max: 0 }
            }
        });
    }
    async start() {
        await this.orm.ensureSchema();
    }
    async stop() {
        await this.orm.close();
    }
    fork(noCache) {
        return new Orm(this.orm.manager(!noCache));
    }
    clearCache() {
        this.orm.clearCache();
    }
    async drop() {
        await this.orm.dropSchema();
    }
};
OrmService = __decorate([
    typescript_ioc_1.InRequestScope
], OrmService);
exports.OrmService = OrmService;
//# sourceMappingURL=orm.service.js.map