var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Album } from '../../../entity/album/album';
import { State } from '../../../entity/state/state';
import { Artist } from '../../../entity/artist/artist';
import { Artwork } from '../../../entity/artwork/artwork';
import { Bookmark } from '../../../entity/bookmark/bookmark';
import { Episode } from '../../../entity/episode/episode';
import { Folder } from '../../../entity/folder/folder';
import { Root } from '../../../entity/root/root';
import { PlayQueue } from '../../../entity/playqueue/playqueue';
import { Playlist } from '../../../entity/playlist/playlist';
import { Podcast } from '../../../entity/podcast/podcast';
import { Series } from '../../../entity/series/series';
import { Radio } from '../../../entity/radio/radio';
import { Session } from '../../../entity/session/session';
import { Settings } from '../../../entity/settings/settings';
import { Track } from '../../../entity/track/track';
import { User } from '../../../entity/user/user';
import { Tag } from '../../../entity/tag/tag';
import { InRequestScope } from 'typescript-ioc';
import { MetaData } from '../../../entity/metadata/metadata';
import { PlaylistEntry } from '../../../entity/playlistentry/playlist-entry';
import { PlayQueueEntry } from '../../../entity/playqueueentry/playqueue-entry';
import path from 'path';
import { ORM } from '../../orm';
import { ORMEntities } from '../orm/entities';
import { ORMRepositories } from '../orm/repositories';
import { registerORMEnums } from '../orm/enum-registration';
import { NotFoundError } from '../../rest/builder';
import { Genre } from '../../../entity/genre/genre';
registerORMEnums();
export class Orm {
    constructor(em) {
        this.em = em;
        this.State = em.getRepository(State);
        this.Album = em.getRepository(Album);
        this.Artist = em.getRepository(Artist);
        this.Artwork = em.getRepository(Artwork);
        this.Bookmark = em.getRepository(Bookmark);
        this.Episode = em.getRepository(Episode);
        this.Folder = em.getRepository(Folder);
        this.Root = em.getRepository(Root);
        this.MetaData = em.getRepository(MetaData);
        this.PlayQueue = em.getRepository(PlayQueue);
        this.PlayQueueEntry = em.getRepository(PlayQueueEntry);
        this.Playlist = em.getRepository(Playlist);
        this.PlaylistEntry = em.getRepository(PlaylistEntry);
        this.Podcast = em.getRepository(Podcast);
        this.Radio = em.getRepository(Radio);
        this.Series = em.getRepository(Series);
        this.Session = em.getRepository(Session);
        this.Settings = em.getRepository(Settings);
        this.Tag = em.getRepository(Tag);
        this.Track = em.getRepository(Track);
        this.User = em.getRepository(User);
        this.Genre = em.getRepository(Genre);
    }
    async findInReposTypes(id, repos) {
        for (const repo of repos) {
            const obj = await repo.findOneByID(id);
            if (obj) {
                return { obj: obj, objType: repo.objType };
            }
        }
        return;
    }
    async findInStreamTypes(id) {
        return this.findInReposTypes(id, [this.Track, this.Episode]);
    }
    async findListInStreamTypes(ids) {
        const list = [];
        for (const id of ids) {
            const media = await this.findInStreamTypes(id);
            if (!media) {
                return Promise.reject(NotFoundError());
            }
            list.push(media);
        }
        return list;
    }
    byType(destType) {
        return [
            this.Album,
            this.Artist,
            this.Artwork,
            this.Bookmark,
            this.Episode,
            this.Folder,
            this.Genre,
            this.Root,
            this.MetaData,
            this.PlayQueue,
            this.PlayQueueEntry,
            this.Playlist,
            this.PlaylistEntry,
            this.Podcast,
            this.Radio,
            this.State,
            this.Series,
            this.Session,
            this.Tag,
            this.Track,
            this.User
        ].find(repo => repo.objType === destType);
    }
    async findInImageTypes(id) {
        return this.findInReposTypes(id, [
            this.Album,
            this.Artist,
            this.Artwork,
            this.Episode,
            this.Folder,
            this.Genre,
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
            this.Genre,
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
let OrmService = class OrmService {
    async init(config) {
        const db = config.env.db.dialect === 'sqlite' ? {
            dialect: 'sqlite',
            storage: path.resolve(config.env.paths.data, 'jam.sqlite')
        } :
            {
                dialect: config.env.db.dialect,
                username: config.env.db.user,
                password: config.env.db.password,
                database: config.env.db.name,
                host: config.env.db.socket ? config.env.db.socket : config.env.db.host,
                port: config.env.db.port ? Number(config.env.db.port) : undefined
            };
        this.orm = await ORM.init({
            entities: ORMEntities,
            repositories: ORMRepositories,
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
    InRequestScope
], OrmService);
export { OrmService };
//# sourceMappingURL=orm.service.js.map