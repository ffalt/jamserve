import { Album } from '../../../entity/album/album.js';
import { State } from '../../../entity/state/state.js';
import { Artist } from '../../../entity/artist/artist.js';
import { Artwork } from '../../../entity/artwork/artwork.js';
import { Bookmark } from '../../../entity/bookmark/bookmark.js';
import { Episode } from '../../../entity/episode/episode.js';
import { Folder } from '../../../entity/folder/folder.js';
import { Root } from '../../../entity/root/root.js';
import { PlayQueue } from '../../../entity/playqueue/playqueue.js';
import { Playlist } from '../../../entity/playlist/playlist.js';
import { Podcast } from '../../../entity/podcast/podcast.js';
import { Series } from '../../../entity/series/series.js';
import { Radio } from '../../../entity/radio/radio.js';
import { Session } from '../../../entity/session/session.js';
import { Settings } from '../../../entity/settings/settings.js';
import { Track } from '../../../entity/track/track.js';
import { User } from '../../../entity/user/user.js';
import { Tag } from '../../../entity/tag/tag.js';
import { InRequestScope } from 'typescript-ioc';
import { MetaData } from '../../../entity/metadata/metadata.js';
import { PlaylistEntry } from '../../../entity/playlistentry/playlist-entry.js';
import { PlayQueueEntry } from '../../../entity/playqueueentry/playqueue-entry.js';
import { Base } from '../../../entity/base/base.js';
import { DBObjectType } from '../../../types/enums.js';
import { BaseRepository } from '../../../entity/base/base.repository.js';
import { AlbumRepository } from '../../../entity/album/album.repository.js';
import { UserRepository } from '../../../entity/user/user.repository.js';
import { TrackRepository } from '../../../entity/track/track.repository.js';
import { TagRepository } from '../../../entity/tag/tag.repository.js';
import { SessionRepository } from '../../../entity/session/session.repository.js';
import { SeriesRepository } from '../../../entity/series/series.repository.js';
import { RadioRepository } from '../../../entity/radio/radio.repository.js';
import { PlaylistEntryRepository } from '../../../entity/playlistentry/playlist-entry.repository.js';
import { PlaylistRepository } from '../../../entity/playlist/playlist.repository.js';
import { RootRepository } from '../../../entity/root/root.repository.js';
import { FolderRepository } from '../../../entity/folder/folder.repository.js';
import { EpisodeRepository } from '../../../entity/episode/episode.repository.js';
import { BookmarkRepository } from '../../../entity/bookmark/bookmark.repository.js';
import { ArtworkRepository } from '../../../entity/artwork/artwork.repository.js';
import { ArtistRepository } from '../../../entity/artist/artist.repository.js';
import { StateRepository } from '../../../entity/state/state.repository.js';
import { MetaDataRepository } from '../../../entity/metadata/metadata.repository.js';
import { PlayQueueRepository } from '../../../entity/playqueue/playqueue.repository.js';
import { PlayQueueEntryRepository } from '../../../entity/playqueueentry/playqueue-entry.repository.js';
import { PodcastRepository } from '../../../entity/podcast/podcast.repository.js';
import { SettingsRepository } from '../../../entity/settings/settings.repository.js';
import path from 'path';
import { EntityManager, ORM } from '../../orm/index.js';
import { ORMEntities } from '../orm/entities.js';
import { ORMRepositories } from '../orm/repositories.js';
import { registerORMEnums } from '../orm/enum-registration.js';
import { ConfigService } from './config.service.js';
import { Options } from 'sequelize';
import { GenreRepository } from '../../../entity/genre/genre.repository.js';
import { Genre } from '../../../entity/genre/genre.js';
import {NotFoundError} from '../../deco/express/express-error.js';

registerORMEnums();

export class Orm {
	public Album!: AlbumRepository;
	public Artist!: ArtistRepository;
	public Artwork!: ArtworkRepository;
	public Bookmark!: BookmarkRepository;
	public Episode!: EpisodeRepository;
	public Folder!: FolderRepository;
	public Playlist!: PlaylistRepository;
	public Podcast!: PodcastRepository;
	public Series!: SeriesRepository;
	public Session!: SessionRepository;
	public Radio!: RadioRepository;
	public Track!: TrackRepository;
	public User!: UserRepository;
	public Tag!: TagRepository;
	public Genre!: GenreRepository;
	public State!: StateRepository;
	public Root!: RootRepository;
	public PlaylistEntry!: PlaylistEntryRepository;
	public PlayQueue!: PlayQueueRepository;
	public PlayQueueEntry!: PlayQueueEntryRepository;
	public Settings!: SettingsRepository;
	public MetaData!: MetaDataRepository;

	constructor(public em: EntityManager) {
		this.State = em.getRepository<State, StateRepository>(State);
		this.Album = em.getRepository<Album, AlbumRepository>(Album);
		this.Artist = em.getRepository<Artist, ArtistRepository>(Artist);
		this.Artwork = em.getRepository<Artwork, ArtworkRepository>(Artwork);
		this.Bookmark = em.getRepository<Bookmark, BookmarkRepository>(Bookmark);
		this.Episode = em.getRepository<Episode, EpisodeRepository>(Episode);
		this.Folder = em.getRepository<Folder, FolderRepository>(Folder);
		this.Root = em.getRepository<Root, RootRepository>(Root);
		this.MetaData = em.getRepository<MetaData, MetaDataRepository>(MetaData);
		this.PlayQueue = em.getRepository<PlayQueue, PlayQueueRepository>(PlayQueue);
		this.PlayQueueEntry = em.getRepository<PlayQueueEntry, PlayQueueEntryRepository>(PlayQueueEntry);
		this.Playlist = em.getRepository<Playlist, PlaylistRepository>(Playlist);
		this.PlaylistEntry = em.getRepository<PlaylistEntry, PlaylistEntryRepository>(PlaylistEntry);
		this.Podcast = em.getRepository<Podcast, PodcastRepository>(Podcast);
		this.Radio = em.getRepository<Radio, RadioRepository>(Radio);
		this.Series = em.getRepository<Series, SeriesRepository>(Series);
		this.Session = em.getRepository<Session, SessionRepository>(Session);
		this.Settings = em.getRepository<Settings, SettingsRepository>(Settings);
		this.Tag = em.getRepository<Tag, TagRepository>(Tag);
		this.Track = em.getRepository<Track, TrackRepository>(Track);
		this.User = em.getRepository<User, UserRepository>(User);
		this.Genre = em.getRepository<Genre, GenreRepository>(Genre);
	}

	private static async findInReposTypes(id: string, repos: Array<BaseRepository<any, any, any>>): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		for (const repo of repos) {
			const obj = await repo.findOneByID(id);
			if (obj) {
				return { obj: obj as any, objType: repo.objType };
			}
		}
		return;
	}

	public async findInStreamTypes(id: string): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		return Orm.findInReposTypes(id, [this.Track, this.Episode]);
	}

	public async findListInStreamTypes(ids: Array<string>): Promise<Array<{ obj: Base; objType: DBObjectType }>> {
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

	byType(destType: DBObjectType): BaseRepository<any, any, any> | undefined {
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

	public async findInRepos(id: string, repos: Array<BaseRepository<any, any, any>>): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		return Orm.findInReposTypes(id, repos);
	}

	public async findInImageTypes(id: string): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		return Orm.findInReposTypes(id, [
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

	public async findInDownloadTypes(id: string): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		return Orm.findInReposTypes(id, [
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

	async findInStateTypes(id: string): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		return Orm.findInReposTypes(id, [
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

	async findInWaveformTypes(id: string): Promise<{ obj: Base; objType: DBObjectType } | undefined> {
		return Orm.findInReposTypes(id, [this.Track, this.Episode]);
	}
}

@InRequestScope
export class OrmService {
	private orm!: ORM;

	async init(config: ConfigService): Promise<void> {
		const db: Partial<Options> = config.env.db.dialect === 'sqlite' ?
				{
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
				// logging: (sql: string, timing?: number) => {
				// 	console.log(sql);
				// },
				logging: false,
				logQueryParameters: true,
				retry: { max: 0 }
			}
		});
	}

	async start(): Promise<void> {
		await this.orm.ensureSchema();
	}

	async stop(): Promise<void> {
		await this.orm.close();
	}

	fork(noCache?: boolean): Orm {
		return new Orm(this.orm.manager(!noCache));
	}

	clearCache(): void {
		this.orm.clearCache();
	}

	async drop(): Promise<void> {
		await this.orm.dropSchema();
	}
}
